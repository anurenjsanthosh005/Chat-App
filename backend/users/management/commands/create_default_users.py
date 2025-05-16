from django.core.management.base import BaseCommand
from users.models import User

class Command(BaseCommand):
    help = 'Create default users'

    def handle(self, *args, **kwargs):
        users_data = [
            {'email': 'admin@mail.com', 'name': 'Admin', 'password': 'admin123', 'role': 'admin'},
            {'email': 'user1@mail.com', 'name': 'User One', 'password': 'user123', 'role': 'user'},
            {'email': 'user2@mail.com', 'name': 'User Two', 'password': 'user123', 'role': 'user'},
            {'email': 'user3@mail.com', 'name': 'User Three', 'password': 'user123', 'role': 'user'},
            {'email': 'user4@mail.com', 'name': 'User Four', 'password': 'user123', 'role': 'user'},
        ]

        for udata in users_data:
            if not User.objects.filter(email=udata['email']).exists():
                User.objects.create_user(
                    email=udata['email'],
                    name=udata['name'],
                    password=udata['password'],
                    role=udata['role']
                )
                self.stdout.write(self.style.SUCCESS(f"Created user {udata['email']}"))
            else:
                self.stdout.write(f"User {udata['email']} already exists")
