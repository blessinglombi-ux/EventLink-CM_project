from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('organizer', 'Organizer'),
        ('participant', 'Participant'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='participant')

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to='avatars/', default='default-avatar.png')
    bio = models.TextField(blank=True, null=True)
    organization_name = models.CharField(max_length=150, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    city = models.CharField(max_length=100, default='Yaoundé')
    badge_level = models.CharField(max_length=50, default='Rising Host') # Organizer achievement

    def __str__(self):
        return f"{self.user.username} ({self.user.role})"