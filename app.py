from flask import Flask, jsonify
from flask_cors import CORS
import threading
try:
    # Prefer the face_detection module inside the face_detection/ folder
    from face_detection.face_detection import FaceRecognitionSystem
except Exception:
    # Fallback to legacy module if present
    from face_detection_with_sentiment_analysis import FaceRecognitionSystem
from mimi_llm_session import MimiLLMSession

app = Flask(__name__)
CORS(app) 

# System initialize karein
system = FaceRecognitionSystem()
mimi_system = MimiLLMSession()

@app.route('/start-classroom', methods=['GET'])
def start_classroom():
    try:
        def run_integrated():
            system.run()
            mimi_system.run()

        thread = threading.Thread(target=run_integrated)
        thread.daemon = True
        thread.start()

        return jsonify({
            "status": "success",
            "message": "Mimi is now active and looking for faces!",
            "character_state": "waving"
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/get-status', methods=['GET'])
def get_status():
    """
    Real-time status from Python face recognition system.
    Frontend polls this every 500ms for live updates.
    """
    try:
        # Get current values from the system
        person = getattr(system, 'current_person', None)
        mood = getattr(system, 'current_mood', None)
        action = getattr(system, 'current_action', 'idle')
        
        # Get warning flags (if any)
        warning = getattr(system, 'current_warning', None)
        message = getattr(system, 'current_message', None)
        
        response = {
            "person": person,
            "mood": mood if mood else None,
            "action": action,
            "warning": warning,
            "message": message
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({
            "person": None,
            "mood": None,
            "action": "idle",
            "warning": None,
            "message": f"Error: {str(e)}"
        })


@app.route('/start-mimi-session', methods=['GET'])
def start_mimi_session():
    try:
        thread = threading.Thread(target=mimi_system.start)
        thread.daemon = True
        thread.start()
        return jsonify({"status": "success", "message": "Mimi LLM session started"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/mimi-get', methods=['GET'])
def mimi_get():
    try:
        resp = {
            'text': getattr(mimi_system, 'current_text', None),
            'image_url': getattr(mimi_system, 'current_image', None),
            'yt_video': getattr(mimi_system, 'current_video', None),
            'action': getattr(mimi_system, 'current_action', 'idle')
        }
        return jsonify(resp)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    # debug=False rakhein threading ke waqt, warna camera do baar khul sakta hai
    app.run(debug=False, port=5000, host='0.0.0.0')


@app.route('/activity-check', methods=['POST'])
def activity_check():
    data = request.json
    word = data.get('word', '')
    child_said = data.get('child_said', '')
    activity_name = data.get('activity_name', '')
    student_name = data.get('student_name', '')

    api_key = os.environ.get('OPENAI_API_KEY')
    try:
        import requests as req
        response = req.post(
            'https://api.openai.com/v1/chat/completions',
            headers={'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'},
            json={
                'model': 'gpt-4o-mini',
                'messages': [{'role': 'user', 'content': f'''The correct answer is "{word}". The child said "{child_said}". Is this correct? Consider partial matches, pronunciation variations, and synonyms. Reply ONLY with JSON: {{"correct": true, "feedback": "short encouraging message for a 3-5 year old child"}}'''}],
                'max_tokens': 100,
                'temperature': 0.3
            },
            timeout=10
        )
        result = response.json()
        text = result['choices'][0]['message']['content']
        import json
        start = text.find('{')
        end = text.rfind('}')
        parsed = json.loads(text[start:end+1])
        return jsonify({'result': parsed})
    except Exception as e:
        heard = child_said.lower().strip()
        expected = word.lower().strip()
        ok = heard in expected or expected in heard
        return jsonify({'result': {
            'correct': ok,
            'feedback': f'''Great job! {word} is correct! 🌟''' if ok else f'''Never mind! The answer was {word}! Keep trying! 💪'''
        }})


@app.route('/generate-questions', methods=['POST'])
def generate_questions():
    data = request.json
    activity_id = data.get('activity_id', 9)
    difficulty = data.get('difficulty', 'easy')
    count = data.get('count', 6)
    session_seed = data.get('session_seed', '')

    api_key = os.environ.get('OPENAI_API_KEY')

    prompts = {
        9: f'''Generate {count} picture guess questions for children aged 3-5. Difficulty: {difficulty}. Seed: {session_seed}. Reply ONLY with JSON array: [{{"emoji": "🐶", "answer": "Dog"}}]''',
        10: f'''Generate {count} counting questions for children aged 3-5. Difficulty: {difficulty}. Seed: {session_seed}. Easy: count emojis. Hard: addition. Reply ONLY with JSON array: [{{"display": "🍎🍎🍎", "answer": "3", "count": 3}}]''',
        11: f'''Generate {count} pattern completion questions for children aged 3-5. Difficulty: {difficulty}. Seed: {session_seed}. Reply ONLY with JSON array: [{{"pattern": "🔴 → 🔵 → ?", "answer": "Red", "hint": "Red"}}]''',
        12: f'''Generate {count} mixed quiz questions for children aged 3-5. Difficulty: {difficulty}. Seed: {session_seed}. Reply ONLY with JSON array: [{{"type": "word", "answer": "Dog"}}, {{"type": "picture", "emoji": "🐱", "answer": "Cat"}}]'''
    }

    prompt = prompts.get(activity_id, prompts[9])

    try:
        import requests as req, json
        response = req.post(
            'https://api.openai.com/v1/chat/completions',
            headers={'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'},
            json={
                'model': 'gpt-4o-mini',
                'messages': [{'role': 'user', 'content': prompt}],
                'max_tokens': 500,
                'temperature': 0.8
            },
            timeout=15
        )
        result = response.json()
        text = result['choices'][0]['message']['content']
        start = text.find('[')
        end = text.rfind(']')
        questions = json.loads(text[start:end+1])
        return jsonify({'questions': questions})
    except Exception as e:
        return jsonify({'questions': [], 'error': str(e)})

