# Chat-App

A real-time chat application with 1-to-1 and group messaging built using **React** and **Django**. It supports JWT authentication, WebSocket-based real-time communication, and basic user management.

---

## Tech Stack

- **Frontend:** React (Vite), Redux Toolkit, Material UI  
- **Backend:** Django, Django REST Framework, Simple JWT  
- **Real-Time:** Django Channels, Daphne  
- **Database:** SQLite (default)

---

## Getting Started

### Backend Setup

```bash
cd Chat-App/backend
python -m venv venv
# On Windows use `venv\Scripts\activate`
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py create_default_users   # Create default users and a group chat
daphne backend.asgi:application          # Runs backend server at http://127.0.0.1:8000
```

### Frontend Setup

```bash

cd chat-app-react
npm install
npm run dev    # Runs frontend at http://localhost:5173 by default

```

### Note on Signup
This app does not include a signup feature because it was not part of the project requirements.
To simplify testing and save time, default users and a group chat are created automatically using the create_default_users command.


## Default User Credentials

Name: Admin, Email: admin@gmail.com, Password: pass123
Name: User One, Email: user1@gmail.com, Password: pass123
Name: User Two, Email: user2@gmail.com, Password: pass123
Name: User Three, Email: user3@gmail.com, Password: pass123
Name: User Four, Email: user4@gmail.com, Password: pass123

---

## URLs

- Frontend: http://localhost:5173  
- Backend API: http://127.0.0.1:8000
- WebSocket: ws://127.0.0.1:8000/ws/chat/?token=YOUR_JWT_TOKEN

