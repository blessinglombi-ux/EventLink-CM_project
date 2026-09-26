from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
import uuid
# =========================================================
# ORGANIZER PROFILE
# =========================================================
class OrganizerProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="organizer_profile"
    )
    phone = models.CharField(
        max_length=30,
        blank=True
    )
    organization = models.CharField(
        max_length=150,
        blank=True
    )
    bio = models.TextField(
        blank=True
    )
    profile_image = models.ImageField(
        upload_to="profiles/organizers/",
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        auto_now=True
    )
    def __str__(self):
        return self.user.get_full_name() or self.user.username
# =========================================================
# PARTICIPANT PROFILE
# =========================================================
class ParticipantProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="participant_profile"
    )
    phone = models.CharField(
        max_length=30,
        blank=True
    )
    bio = models.TextField(
        blank=True
    )
    profile_image = models.ImageField(
        upload_to="profiles/participants/",
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        auto_now=True
    )
    def __str__(self):
        return self.user.get_full_name() or self.user.username
# =========================================================
# EVENT
# =========================================================
class Event(models.Model):
    CATEGORY_CHOICES = [
        ("conference", "Conference"),
        ("concert", "Concert"),
        ("workshop", "Workshop"),
        ("seminar", "Seminar"),
        ("sports", "Sports"),
        ("education", "Education"),
        ("community", "Community"),
        ("entertainment", "Entertainment"),
        ("other", "Other"),
    ]
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("launched", "Launched"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    organizer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="events"
    )
    title = models.CharField(
        max_length=200
    )
    slug = models.SlugField(
        max_length=220,
        unique=True
    )
    description = models.TextField()
    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        default="other"
    )
    location = models.CharField(
        max_length=255
    )
    event_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField(
        blank=True,
        null=True
    )
    registration_slots = models.PositiveIntegerField(
        default=50
    )
    poster = models.ImageField(
        upload_to="events/",
        blank=True,
        null=True
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="draft"
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        auto_now=True
    )
    launched_at = models.DateTimeField(
        blank=True,
        null=True
    )
    def __str__(self):
        return self.title
    @property
    def registered_count(self):
        return self.registrations.filter(
            status="registered"
        ).count()
    @property
    def remaining_slots(self):
        remaining = (
            self.registration_slots -
            self.registered_count
        )
        return max(remaining, 0)
    @property
    def progress_percentage(self):
        if self.registration_slots == 0:
            return 0
        percentage = (
            self.registered_count /
            self.registration_slots
        ) * 100
        return min(round(percentage, 2), 100)
# =========================================================
# REGISTRATION
# =========================================================
class Registration(models.Model):
    STATUS_CHOICES = [
        ("registered", "Registered"),
        ("cancelled", "Cancelled"),
        ("attended", "Attended"),
        ("absent", "Absent"),
    ]
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="registrations"
    )
    participant = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="registrations"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="registered"
    )
    registered_at = models.DateTimeField(
        auto_now_add=True
    )
    cancelled_at = models.DateTimeField(
        blank=True,
        null=True
    )
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["event", "participant"],
                name="unique_event_participant"
            )
        ]
        ordering = [
            "-registered_at"
        ]
    def __str__(self):
        return (
            f"{self.participant.username} - "
            f"{self.event.title}"
        )
# =========================================================
# TICKET
# =========================================================
class Ticket(models.Model):
    STATUS_CHOICES = [
        ("valid", "Valid"),
        ("used", "Used"),
        ("cancelled", "Cancelled"),
    ]
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    registration = models.OneToOneField(
        Registration,
        on_delete=models.CASCADE,
        related_name="ticket"
    )
    ticket_number = models.CharField(
        max_length=50,
        unique=True
    )
    qr_code = models.CharField(
        max_length=255,
        unique=True
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="valid"
    )
    issued_at = models.DateTimeField(
        auto_now_add=True
    )
    used_at = models.DateTimeField(
        blank=True,
        null=True
    )
    def __str__(self):
        return self.ticket_number
# =========================================================
# ATTENDANCE
# =========================================================
class Attendance(models.Model):
    registration = models.OneToOneField(
        Registration,
        on_delete=models.CASCADE,
        related_name="attendance"
    )
    scanned_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="attendance_scans"
    )
    scanned_at = models.DateTimeField(
        auto_now_add=True
    )
    attended = models.BooleanField(
        default=True
    )
    def __str__(self):
        return (
            f"{self.registration.participant.username} - "
            f"{self.registration.event.title}"
        )
# =========================================================
# NOTIFICATION
# =========================================================
class Notification(models.Model):
    TYPE_CHOICES = [
        ("account", "Account"),
        ("event", "Event"),
        ("registration", "Registration"),
        ("ticket", "Ticket"),
        ("attendance", "Attendance"),
        ("system", "System"),
    ]
    recipient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notifications"
    )
    title = models.CharField(
        max_length=200
    )
    message = models.TextField()
    notification_type = models.CharField(
        max_length=30,
        choices=TYPE_CHOICES,
        default="system"
    )
    is_read = models.BooleanField(
        default=False
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    class Meta:
        ordering = [
            "-created_at"
        ]
    def __str__(self):
        return self.title
# =========================================================
# EMAIL VERIFICATION
# =========================================================
class EmailVerification(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="email_verification"
    )
    token = models.UUIDField(
        default=uuid.uuid4,
        unique=True
    )
    is_verified = models.BooleanField(
        default=False
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    verified_at = models.DateTimeField(
        blank=True,
        null=True
    )
    def mark_verified(self):
        self.is_verified = True
        self.verified_at = timezone.now()
        self.save(
            update_fields=[
                "is_verified",
                "verified_at"
            ]
        )
    def __str__(self):
        return self.user.username