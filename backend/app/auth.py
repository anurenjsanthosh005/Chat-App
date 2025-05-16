from flask import Blueprint, request, jsonify

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Dummy check (replace with real logic)
    if email == 'admin@mail.com' and password == 'admin123':
        return jsonify({'token': 'fake-jwt-token', 'role': 'admin', 'name': 'Admin User'})
    else:
        return jsonify({'error': 'Invalid credentials'}), 401
