code = '''
@app.route('/process-frame', methods=['POST'])
def process_frame():
    import base64
    import numpy as np
    import cv2
    try:
        data = request.get_json()
        img_data = data.get('frame', '')
        img_data = img_data.split(',')[1] if ',' in img_data else img_data
        img_bytes = base64.b64decode(img_data)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        locations = face_recognition.face_locations(rgb)
        encodings = face_recognition.face_encodings(rgb, locations)
        for enc in encodings:
            distances = face_recognition.face_distance(system.known_encodings, enc)
            if len(distances) and min(distances) < 0.45:
                name = system.known_names[int(np.argmin(distances))]
                return jsonify({'person': name, 'status': 'recognised'})
        return jsonify({'person': None, 'status': 'no_face'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
'''

c = open('app.py', encoding='utf-8').read()
c = c.rstrip() + '\n' + code + '\n'
open('app.py', 'w', encoding='utf-8').write(c)
print('Done:', '/process-frame' in c)