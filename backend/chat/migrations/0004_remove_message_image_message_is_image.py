# Generated by Django 5.1 on 2025-05-19 08:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0003_message_image'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='message',
            name='image',
        ),
        migrations.AddField(
            model_name='message',
            name='is_image',
            field=models.BooleanField(default=False),
        ),
    ]
