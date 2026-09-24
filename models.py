from django.contrib.auth.models import AbstractUser
from django.db import models
class User(AbstractUser):
    ROLE_CHOICES = (
        ('organizer', 'Event Organizer'),
        ('participant', 'Participant / Attendee'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='participant')
    @property
    def is_organizer(self):
        return self.role == 'organizer'
    @property
    def is_participant(self):
        return self.role == 'participant'
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to='avatars/', default='avatars/default-avatar.png', blank=True)
    bio = models.TextField(blank=True, null=True, help_text="Short bio or about section")
    organization_name = models.CharField(max_length=150, blank=True, null=True, help_text="Company, Club, or Host entity")
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    city = models.CharField(max_length=100, default='Yaoundé')
    badge_level = models.CharField(max_length=50, default='Rising Host', help_text="Achievement badge for organizers")
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Profile of {self.user.username}"
