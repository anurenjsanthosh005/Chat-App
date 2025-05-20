from django.core.management.base import BaseCommand
from users.models import User
from chat.models import Group

class Command(BaseCommand):
    help = 'Create default users and group'

    def handle(self, *args, **kwargs):
        users_data = [
            {'email': 'admin@gmail.com', 'name': 'Admin', 'password': 'pass123', 'role': 'admin'},
            {'email': 'user1@gmail.com', 'name': 'User One', 'password': 'pass123', 'role': 'user'},
            {'email': 'user2@gmail.com', 'name': 'User Two', 'password': 'pass123', 'role': 'user'},
            {'email': 'user3@gmail.com', 'name': 'User Three', 'password': 'pass123', 'role': 'user'},
            {'email': 'user4@gmail.com', 'name': 'User Four', 'password': 'pass123', 'role': 'user'},
        ]

        created_users = {}
        for udata in users_data:
            user, created = User.objects.get_or_create(
                email=udata['email'],
                defaults={
                    'name': udata['name'],
                    'role': udata['role']
                }
            )
            if created:
                user.set_password(udata['password'])
                user.save()
                self.stdout.write(self.style.SUCCESS(f"Created user {udata['email']}"))
            else:
                self.stdout.write(f"User {udata['email']} already exists")
            created_users[udata['email']] = user

        # Create group chat with user1, user2, user3
        group_name = "group chat"
        group, created = Group.objects.get_or_create(name=group_name)
        group.members.set([
            created_users['user1@gmail.com'],
            created_users['user2@gmail.com'],
            created_users['user3@gmail.com']
        ])
        self.stdout.write(self.style.SUCCESS(f'Group "{group_name}" created with 3 users'))
