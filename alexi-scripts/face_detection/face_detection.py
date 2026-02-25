"""
Face Recognition Attendance System
===================================
FIX: Removed threading.Lock from speak_and_wait() — it caused a deadlock
     where the reply after listening would never play.

     The conversation thread is already sequential (one step at a time),
     so no lock is needed. speak_and_wait() simply calls engine.say() +
     engine.runAndWait() directly — that's enough to block until done.

Flow:
  1. Face recognised
  2. speak_and_wait("Hi [Name]! How are you today?")  ← blocks until spoken
  3. mic.listen()                                      ← opens AFTER speech ends
  4. analyze mood
  5. mark attendance
  6. speak_and_wait(mood reply)                        ← blocks until spoken
"""

import cv2
import face_recognition
import os
import numpy as np
import pyttsx3
import logging
from datetime import datetime
import csv
import sys
import time
import threading
import speech_recognition as sr

# ============================================================================
# CONFIGURATION
# ============================================================================

# Make file paths module-relative so the assets moved into the
# `face_detection/` subfolder are picked up regardless of current cwd.
BASE_DIR = os.path.dirname(__file__)
KNOWN_FACES_DIR = os.path.join(BASE_DIR, "known_faces")
ATTENDANCE_FILE = os.path.join(BASE_DIR, "attendance.csv")
LOG_FILE = os.path.join(BASE_DIR, "face_recognition.log")
FACE_DISTANCE_THRESHOLD      = 0.6
PROXIMITY_WARNING_THRESHOLD  = 200
AUTO_EXIT_AFTER_SECONDS      = 60
FRAMES_TO_PROCESS            = 1000

HAPPY_KEYWORDS = ['good', 'great', 'awesome', 'excellent', 'fine', 'happy', 'wonderful',
                  'fantastic', 'amazing', 'perfect', 'nice', 'well', 'better', 'best']
SAD_KEYWORDS   = ['bad', 'sad', 'terrible', 'awful', 'not good', 'upset', 'tired',
                  'exhausted', 'stressed', 'worried', 'anxious', 'sick', 'unwell', 'not well']

# ============================================================================
# LOGGING
# ============================================================================

file_handler    = logging.FileHandler(LOG_FILE, encoding='utf-8')
console_handler = logging.StreamHandler(sys.stdout)

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except AttributeError:
        import codecs
        sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')

fmt = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(fmt)
console_handler.setFormatter(fmt)

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
logger.addHandler(file_handler)
logger.addHandler(console_handler)

# ============================================================================
# ATTENDANCE MANAGER
# ============================================================================

class AttendanceManager:
    def __init__(self, filename=ATTENDANCE_FILE):
        self.filename     = filename
        self.marked_today = set()
        self._init_file()
        self._load_today()
        logger.info("AttendanceManager ready")

    def _init_file(self):
        """Create file with headers if missing. Also fix empty or header-corrupt files."""
        write_header = False

        if not os.path.exists(self.filename):
            write_header = True
        else:
            # File exists — check it actually has the right header
            try:
                with open(self.filename, 'r', encoding='utf-8') as f:
                    first_line = f.readline().strip()
                # If empty or header doesn't contain expected columns, rewrite
                if not first_line or 'Date' not in first_line or 'Name' not in first_line:
                    logger.warning(f"attendance.csv has bad/missing headers — rewriting")
                    write_header = True
            except Exception:
                write_header = True

        if write_header:
            with open(self.filename, 'w', newline='', encoding='utf-8') as f:
                csv.writer(f).writerow(['Name', 'Date', 'Time', 'Mood'])
            logger.info("attendance.csv initialised with headers")

    def _load_today(self):
        today = datetime.now().strftime("%Y-%m-%d")
        try:
            with open(self.filename, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                # Guard: if headers are missing or wrong, skip silently
                if reader.fieldnames is None or 'Date' not in reader.fieldnames:
                    logger.warning("attendance.csv has no valid headers — skipping load")
                    return
                for row in reader:
                    if row.get('Date') == today:
                        self.marked_today.add(row['Name'])
        except Exception as e:
            logger.error(f"Load today error: {e}")
        if self.marked_today:
            logger.info(f"Already marked today: {', '.join(self.marked_today)}")

    def mark(self, name, mood="Neutral"):
        if name in self.marked_today:
            return False
        now = datetime.now()
        with open(self.filename, 'a', newline='', encoding='utf-8') as f:
            csv.writer(f).writerow([
                name,
                now.strftime("%Y-%m-%d"),
                now.strftime("%H:%M:%S"),
                mood
            ])
        self.marked_today.add(name)
        logger.info(f"ATTENDANCE MARKED: {name} | {now.strftime('%H:%M:%S')} | {mood}")
        return True

    def is_marked(self, name):
        return name in self.marked_today


# ============================================================================
# SPEECH MANAGER
# FIX: No threading.Lock — that caused a deadlock inside the conversation
#      thread when it tried to speak the reply after already holding the lock.
#      engine.runAndWait() itself blocks until audio finishes, which is all we need.
# ============================================================================

class SpeechManager:
    """
    Single dedicated TTS worker thread owns the pyttsx3 engine exclusively.
    All callers post to a queue — runAndWait() is NEVER called from two threads.
    This eliminates 'run loop already started' completely.

      speak_and_wait(text)  → blocks caller until that line is fully spoken
      speak_async(text)     → fire-and-forget (warnings, proximity alerts, etc.)
    """

    def __init__(self):
        self._queue    = []               # list of (text, threading.Event | None)
        self._lock     = threading.Lock()
        self._trigger  = threading.Event()
        self._thread   = threading.Thread(target=self._worker, daemon=True)
        self._thread.start()
        logger.info("SpeechManager ready")

    def _worker(self):
        """The ONE thread that ever calls engine.runAndWait()."""
        engine = pyttsx3.init()
        engine.setProperty('rate', 145)
        engine.setProperty('volume', 1.0)

        while True:
            self._trigger.wait()      # sleep until something is queued
            self._trigger.clear()

            while True:
                with self._lock:
                    if not self._queue:
                        break
                    text, done_event = self._queue.pop(0)

                try:
                    logger.info(f"SPEAKING: {text}")
                    engine.say(text)
                    engine.runAndWait()   # safe — only this thread ever calls this
                    logger.info("DONE SPEAKING")
                except Exception as e:
                    logger.error(f"TTS engine error: {e}")
                    try:
                        engine = pyttsx3.init()
                        engine.setProperty('rate', 145)
                        engine.setProperty('volume', 1.0)
                    except Exception:
                        pass
                finally:
                    if done_event:
                        done_event.set()   # unblock speak_and_wait() caller

    def speak_and_wait(self, text):
        """Queue text and block the calling thread until it is fully spoken."""
        done = threading.Event()
        with self._lock:
            self._queue.append((text, done))
        self._trigger.set()
        done.wait()   # caller sleeps here; worker sets event when done

    def speak_async(self, text, only_if_silent=False):
        """Queue text and return immediately — caller does not wait.
        If only_if_silent=True, drops the message if anything is already queued or playing.
        """
        with self._lock:
            if only_if_silent and self._queue:
                return   # don't pile up warnings
            self._queue.append((text, None))
        self._trigger.set()

    def clear_queue(self):
        """Discard all queued-but-not-yet-spoken items (stale warnings)."""
        with self._lock:
            dropped = len(self._queue)
            self._queue.clear()
        if dropped:
            logger.info(f"TTS queue cleared — dropped {dropped} stale item(s)")


# ============================================================================
# SPEECH RECOGNISER
# ============================================================================

class SpeechRecognizer:
    def __init__(self):
        try:
            self.recognizer = sr.Recognizer()
            self.microphone = sr.Microphone()
            with self.microphone as source:
                logger.info("Calibrating microphone…")
                self.recognizer.adjust_for_ambient_noise(source, duration=1)
            # CRITICAL: dynamic_energy_threshold drifts DOWN to noise floor in quiet rooms
            # — this causes it to capture AC hum/fan noise instead of speech → "could not understand"
            self.recognizer.dynamic_energy_threshold = False
            # Set a firm minimum: 400 filters noise, human speech is typically 500–3000
            self.recognizer.energy_threshold = max(self.recognizer.energy_threshold, 400)
            self.recognizer.pause_threshold       = 0.9   # seconds of silence to end phrase
            self.recognizer.non_speaking_duration = 0.5
            logger.info("SpeechRecognizer ready")
        except Exception as e:
            logger.error(f"SpeechRecognizer init failed: {e}")
            self.recognizer = None
            self.microphone = None

    def listen(self, timeout=10):
        if not self.recognizer or not self.microphone:
            return None
        try:
            logger.info(f"LISTENING… (energy threshold: {self.recognizer.energy_threshold:.0f})")
            with self.microphone as source:
                audio = self.recognizer.listen(source, timeout=timeout, phrase_time_limit=10)
            logger.info("Audio captured — sending to Google STT…")
            text = self.recognizer.recognize_google(audio, language="en-IN")  # Indian English accent
            logger.info(f"HEARD: '{text}'")
            return text.lower()
        except sr.WaitTimeoutError:
            logger.warning("LISTEN TIMEOUT — no speech detected within timeout")
        except sr.UnknownValueError:
            logger.warning("COULD NOT UNDERSTAND — audio captured but unclear. Check mic/accent.")
        except sr.RequestError as e:
            logger.error(f"Google STT error: {e}")
        except Exception as e:
            logger.error(f"Listen error: {e}")
        return None


# ============================================================================
# MOOD ANALYSER
# ============================================================================

class MoodAnalyzer:
    @staticmethod
    def analyze(text):
        if not text:
            return "Neutral"
        t = text.lower()
        for kw in HAPPY_KEYWORDS:
            if kw in t:
                logger.info(f"Mood → Happy (matched '{kw}')")
                return "Happy"
        for kw in SAD_KEYWORDS:
            if kw in t:
                logger.info(f"Mood → Sad (matched '{kw}')")
                return "Sad"
        logger.info("Mood → Neutral")
        return "Neutral"


# ============================================================================
# FACE RECOGNITION SYSTEM
# ============================================================================

class FaceRecognitionSystem:
    def __init__(self, known_faces_dir=KNOWN_FACES_DIR):
        self.known_faces_dir = known_faces_dir
        self.known_encodings = []
        self.known_names     = []

        self.attendance  = AttendanceManager()
        self.speech      = SpeechManager()
        self.mic         = SpeechRecognizer()
        self.mood_engine = MoodAnalyzer()

        # Flask /get-status attributes
        self.current_person  = None
        self.current_mood    = None
        self.current_action  = "idle"   # idle | waving | talking
        self.current_warning = None     # too_close | unknown | None
        self.current_message = None     # already_marked | None

        self.is_conversing              = False
        self.processed_this_session     = set()
        self.fully_handled_this_session = set()  # never re-trigger once fully done
        self.last_recognized_person     = None
        self.last_recognition_time      = 0
        self.recognition_cooldown       = 20   # seconds before same person can re-trigger
        self.last_conversation_end      = time.time()  # grace active from startup — suppress first-frame warnings

        # ── ADD THESE TWO LINES ──
        self.wake_word_active = False   # becomes True once run() starts
        self._wake_word_thread = None
        self._session_triggered  = False
        
        logger.info("=" * 60)
        logger.info("FACE RECOGNITION ATTENDANCE SYSTEM")
        logger.info("=" * 60)
        self._load_faces()

    # ── Face loading ────────────────────────────────────────────────────────────

    def _load_faces(self):
        if not os.path.exists(self.known_faces_dir):
            os.makedirs(self.known_faces_dir)
            logger.warning(f"Created {self.known_faces_dir} — add face images!")
            return

        files = [f for f in os.listdir(self.known_faces_dir)
                 if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        if not files:
            logger.warning("No images in known_faces/")
            return

        for fname in files:
            path = os.path.join(self.known_faces_dir, fname)
            try:
                img       = face_recognition.load_image_file(path)
                encodings = face_recognition.face_encodings(img)
                if not encodings:
                    logger.warning(f"No face in {fname}")
                    continue
                self.known_encodings.append(encodings[0])
                self.known_names.append(os.path.splitext(fname)[0])
                logger.info(f"Loaded: {os.path.splitext(fname)[0]}")
            except Exception as e:
                logger.error(f"Error loading {fname}: {e}")

        logger.info(f"Known people ({len(self.known_names)}): {', '.join(self.known_names)}")

    # ── Wake word ────────────────────────────────────────────────────────────────

    def _start_wake_word_listener(self):
        self.wake_word_active = True
        self._wake_word_thread = threading.Thread(
            target=self._wake_word_loop, daemon=True
        )
        self._wake_word_thread.start()
        logger.info("Wake word listener started — say 'Hey Alexi'")

    def _wake_word_loop(self):
        recognizer = sr.Recognizer()
        recognizer.dynamic_energy_threshold = False
        recognizer.energy_threshold = 400

        while self.wake_word_active:
            try:
                with sr.Microphone() as source:
                    recognizer.adjust_for_ambient_noise(source, duration=0.5)
                    logger.info("👂 Waiting for 'Hey Alexi'...")
                    audio = recognizer.listen(source, timeout=5, phrase_time_limit=4)
                text = recognizer.recognize_google(audio, language="en-IN").lower()
                logger.info(f"Wake word heard: '{text}'")
                if any(w in text for w in ["alexi", "alexa", "lexi", "lexa", "alexie"]):
                    logger.info("✅ Wake word detected!")
                    self.wake_word_active = False   # stop looping
                    self.speech.speak_async("Yes! I'm here.")
                    self._session_triggered = True  # signals run() to start camera
                    break   
            except sr.WaitTimeoutError:
                pass
            except sr.UnknownValueError:
                pass
            except Exception as e:
                logger.error(f"Wake word error: {e}")
                time.sleep(1)
                
    # ── Cooldown ─────────────────────────────────────────────────────────────────

    def _should_process(self, name):
        if name != self.last_recognized_person:
            return True
        return (time.time() - self.last_recognition_time) > self.recognition_cooldown

    # ── Conversation ─────────────────────────────────────────────────────────────

    def _start_conversation(self, name, already_marked):
        if self.is_conversing:
            return
        # Clear stale warnings queued before recognition confirmed
        self.speech.clear_queue()
        # If already fully handled this session (not just marked, but full convo done), skip
        if name in self.fully_handled_this_session:
            return
        threading.Thread(
            target=self._conversation,
            args=(name, already_marked),
            daemon=True
        ).start()

    def _conversation(self, name, already_marked):
        """
        Sequential conversation — each speak_and_wait() blocks until done,
        so mic only opens after the question is fully spoken,
        and the reply only plays after listening is complete.
        """
        self.is_conversing   = True
        self.current_person  = name
        self.current_mood    = None
        self.current_warning = None
        self.current_message = None
        self.current_action  = "waving"

        try:
            # ── Already marked ──────────────────────────────────────────────
            if already_marked:
                logger.info(f"{name} — already marked today")
                self.speech.speak_and_wait(
                    f"Hi {name}! Your attendance is already marked for today. Have a great day!"
                )
                self.current_message = "already_marked"
                return

            # ── STEP 1: Greet + ask ─────────────────────────────────────────
            logger.info(f"STEP 1 — Greeting {name}")
            self.speech.speak_and_wait(f"Hi {name}! How are you today?")
            # ↑ Execution pauses here until "Hi Nishika! How are you today?" is fully spoken

            # ── STEP 2: Listen (with one retry if not heard) ────────────────
            self.current_action = "talking"
            logger.info("STEP 2 — Listening")
            time.sleep(0.8)           # wait for TTS audio to fully clear from mic before listening
            response = self.mic.listen(timeout=10)
            logger.info(f"STEP 2 — Got: '{response}'")

            # If nothing heard, prompt once and try again
            if response is None:
                logger.info("STEP 2 — No response, prompting again")
                self.speech.speak_and_wait("I didn't catch that. How are you feeling today?")
                time.sleep(0.5)
                response = self.mic.listen(timeout=10)
                logger.info(f"STEP 2 retry — Got: '{response}'")

            # ── STEP 3: Analyse mood ─────────────────────────────────────────
            mood = self.mood_engine.analyze(response)
            self.current_mood = mood
            logger.info(f"STEP 3 — Mood: {mood}")

            # ── STEP 4: Mark attendance ──────────────────────────────────────
            self.attendance.mark(name, mood)
            logger.info(f"STEP 4 — Attendance saved")

            # ── STEP 5: Reply based on mood ──────────────────────────────────
            if mood == "Happy":
                reply = f"That's great to hear, {name}! You sound happy today. Have a wonderful day ahead!"
            elif mood == "Sad":
                reply = f"Aw, I'm sorry {name}. You sound a bit low today. But don't worry — things will get better. Have a good day!"
            else:
                reply = f"Good to see you, {name}! Hope you have a really good day today!"

            logger.info(f"STEP 5 — Replying: {reply}")
            self.speech.speak_and_wait(reply)
            # ↑ Execution pauses here until reply is fully spoken

        except Exception as e:
            logger.error(f"Conversation error: {e}", exc_info=True)

        finally:
            self.is_conversing         = False
            self.current_action        = "idle"
            self.last_conversation_end = time.time()
            self.fully_handled_this_session.add(name)  # permanently done this session
            # Clear any stale warnings queued during conversation
            self.speech.clear_queue()
            logger.info(f"Conversation done for {name}")

            def _reset():
                self.current_person  = None
                self.current_mood    = None
                self.current_message = None

            threading.Timer(4.0, _reset).start()

    # ── Main camera loop ─────────────────────────────────────────────────────────

    def run(self):
        if not self.known_encodings:
            logger.error(f"No faces loaded. Add images to '{self.known_faces_dir}/'")
            return

        # ── START wake word listener, wait until triggered ───────────────────
        self._start_wake_word_listener()
        logger.info("System standing by — say 'Hey Alexi' to begin")

        while not self._session_triggered:
            time.sleep(0.2)   # idle until wake word heard

        logger.info("Session triggered — opening camera")
        # ── rest of run() continues exactly as before ────────────────────────

        video = cv2.VideoCapture(0, cv2.CAP_DSHOW)
        if not video.isOpened():
            logger.warning("CAP_DSHOW failed, trying default backend...")
            video = cv2.VideoCapture(0)
        if not video.isOpened():
            logger.error("Cannot open camera")
            return

        video.set(cv2.CAP_PROP_FRAME_WIDTH,  640)
        video.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        logger.info("Camera open — press Q to quit")

        frame_count       = 0
        faces_found       = False
        last_face_time    = time.time()
        last_prox_warn      = 0
        last_unknown_warn   = 0
        last_known_face_time = 0   # tracks when a known face was last seen
        WARN_COOLDOWN       = 12   # seconds between repeated voice warnings
        POST_CONV_GRACE     = 8    # seconds after conversation ends before unknown warnings resume
        UNKNOWN_DELAY       = 3    # seconds of unknown before warning (avoids false positives)

        try:
            while True:
                ret, frame = video.read()
                if not ret:
                    # MSMF/camera glitch — try to recover instead of crashing
                    logger.warning("Frame grab failed — attempting camera reconnect...")
                    video.release()
                    time.sleep(1.0)
                    video = cv2.VideoCapture(0, cv2.CAP_DSHOW)  # CAP_DSHOW more stable on Windows
                    if not video.isOpened():
                        video = cv2.VideoCapture(0)  # fallback to default backend
                    video.set(cv2.CAP_PROP_FRAME_WIDTH,  640)
                    video.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
                    # Try reading immediately; if still failing, skip this frame
                    ret, frame = video.read()
                    if not ret:
                        logger.error("Camera reconnect failed — skipping frame")
                        continue
                    logger.info("Camera reconnected successfully")

                frame_count  += 1
                current_time  = time.time()

                if faces_found and (current_time - last_face_time) > AUTO_EXIT_AFTER_SECONDS:
                    logger.info("Idle timeout — exiting")
                    break

                try:
                    small     = cv2.resize(frame, (0, 0), fx=0.5, fy=0.5)
                    rgb       = cv2.cvtColor(small, cv2.COLOR_BGR2RGB)
                    # ── Skip face detection entirely during conversation ──────
                    # Once recognised, no point re-checking — avoids unknown/too-close
                    # warnings interrupting the conversation or confusing the mic.
                    if self.is_conversing:
                        cv2.putText(frame, f"Talking with {self.current_person}...",
                                    (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 128), 2)
                        last_face_time = current_time  # keep idle timer alive during convo
                        locations = []
                        encodings = []
                    else:
                        locations = face_recognition.face_locations(rgb)
                        encodings = face_recognition.face_encodings(rgb, locations)

                    if locations:
                        if not faces_found:
                            logger.info("First face detected")
                            faces_found = True
                        last_face_time = current_time

                    for (top, right, bottom, left), enc in zip(locations, encodings):
                        top *= 2; right *= 2; bottom *= 2; left *= 2
                        face_w = right - left

                        # ── Too close ──────────────────────────────────────
                        if face_w > PROXIMITY_WARNING_THRESHOLD:
                            self.current_warning = "too_close"
                            if not self.is_conversing and current_time - last_prox_warn > WARN_COOLDOWN:
                                self.speech.speak_async("Please step back, you are too close", only_if_silent=True)
                                last_prox_warn = current_time
                            cv2.putText(frame, "TOO CLOSE — step back", (40, 60),
                                        cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)
                            color, label = (0, 0, 255), "TOO CLOSE"

                        # ── Normal distance ────────────────────────────────
                        elif self.known_encodings:
                            if self.current_warning == "too_close":
                                self.current_warning = None

                            distances = face_recognition.face_distance(self.known_encodings, enc)
                            best      = int(np.argmin(distances))
                            dist      = distances[best]

                            if dist < FACE_DISTANCE_THRESHOLD:
                                name = self.known_names[best]
                                last_known_face_time = current_time  # reset unknown delay timer
                                if self.current_warning == "unknown":
                                    self.current_warning = None

                                if self._should_process(name) and not self.is_conversing:
                                    logger.info(f"RECOGNISED: {name} (dist={dist:.3f})")
                                    self.last_recognized_person = name
                                    self.last_recognition_time  = current_time
                                    self.processed_this_session.add(name)
                                    self._start_conversation(name, self.attendance.is_marked(name))

                                color = (0, 255, 0)
                                label = f"{name} ({dist:.2f})"

                            else:
                                self.current_warning = "unknown"
                                # Only warn if:
                                # 1. Not currently conversing
                                # 2. Outside post-conversation grace period
                                # 3. Unknown face persisted for UNKNOWN_DELAY seconds (avoids 1-frame false positives)
                                # 4. Cooldown between warnings
                                time_since_known  = current_time - last_known_face_time
                                in_grace           = (current_time - self.last_conversation_end) < POST_CONV_GRACE
                                recently_saw_known = (current_time - self.last_recognition_time) < 5
                                unknown_persisted  = time_since_known > UNKNOWN_DELAY
                                if (not self.is_conversing and not in_grace
                                        and not recently_saw_known
                                        and unknown_persisted
                                        and current_time - last_unknown_warn > WARN_COOLDOWN):
                                    self.speech.speak_async("Face not recognised. Please register.", only_if_silent=True)
                                    last_unknown_warn = current_time
                                color, label = (255, 165, 0), "Unknown"

                        else:
                            color, label = (128, 128, 128), "No DB"

                        cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
                        cv2.rectangle(frame, (left, bottom - 32), (right, bottom), color, cv2.FILLED)
                        cv2.putText(frame, label, (left + 5, bottom - 8),
                                    cv2.FONT_HERSHEY_DUPLEX, 0.55, (255, 255, 255), 1)
                        cv2.putText(frame, f"W:{face_w}", (left, top - 8),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.45, color, 1)

                    hud = (f"Faces:{len(locations)} Frame:{frame_count} "
                           f"Conversing:{self.is_conversing} Action:{self.current_action}")
                    cv2.putText(frame, hud, (8, 25),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.48, (0, 255, 0), 1)

                except Exception as e:
                    logger.error(f"Frame error: {e}")

                cv2.imshow("Face Recognition Attendance", frame)
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break

                if frame_count > FRAMES_TO_PROCESS and not faces_found:
                    logger.info("No faces found — exiting")
                    break

        finally:
            video.release()
            cv2.destroyAllWindows()
            cv2.waitKey(1)
            logger.info("=" * 60)
            logger.info("SESSION SUMMARY")
            logger.info(f"  Recognised : {', '.join(self.processed_this_session) or 'nobody'}")
            logger.info(f"  Present    : {', '.join(self.attendance.marked_today) or 'nobody'}")
            logger.info("=" * 60)


# ============================================================================
# MAIN
# ============================================================================

def main():
    try:
        FaceRecognitionSystem().run()
    except KeyboardInterrupt:
        logger.info("Interrupted by user")
    except Exception as e:
        logger.critical(f"Fatal: {e}", exc_info=True)
    finally:
        cv2.destroyAllWindows()
        cv2.waitKey(1)

if __name__ == "__main__":
    main()