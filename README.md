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

### Clone the repo using command
git clone https://github.com/anurenjsanthosh005/Chat-App.git

### Backend Setup

```bash


# Navigate to backend folder

cd chat-app/backend


# Create and activate virtual environment

python -m venv venv

source venv/bin/activate          # On Windows: venv\Scripts\activate


# Install Python dependencies

pip install -r requirements.txt


# Run database migrations

python manage.py migrate


# Create default users and a group chat

python manage.py create_default_users


# Start backend server with Daphne

daphne backend.asgi:application   # Runs on http://127.0.0.1:8000


```

### Frontend Setup

```bash
# Navigate to frontend folder

cd chat-app/frontend

npm install

npm run dev    # Runs frontend at http://localhost:5173 by default

```

### Note on Signup
This app does not include a signup feature because it was not part of the project requirements.
To simplify testing and save time, default users and a group chat are created automatically using the create_default_users command.


## Default User Credentials

- Name: Admin       | Email: admin@gmail.com     | Password: pass123  
- Name: User One    | Email: user1@gmail.com     | Password: pass123  
- Name: User Two    | Email: user2@gmail.com     | Password: pass123  
- Name: User Three  | Email: user3@gmail.com     | Password: pass123  
- Name: User Four   | Email: user4@gmail.com     | Password: pass123  

## URLs

- Frontend: http://localhost:5173  
- Backend API: http://127.0.0.1:8000
- WebSocket: ws://127.0.0.1:8000/ws/chat/?token=YOUR_JWT_TOKEN

