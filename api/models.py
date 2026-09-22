from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid


class Organizer(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="organizer_profile"
    )
    organization_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=30)
    location = models.CharField(max_length=150, blank=True)
    profile_image = models.ImageField(
        upload_to="organizers/",
        blank=True,
        null=True
    )
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.organization_name


class Participant(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="participant_profile"
    )
    phone = models.CharField(max_length=30)
    location = models.CharField(max_length=150, blank=True)
    interests = models.TextField(blank=True)
    profile_image = models.ImageField(
        upload_to="participants/",
        blank=True,
        null=True
    )

    def __str__(self):
        return self.user.get_full_name() or self.user.username


class Event(models.Model):

    PAYMENT_FREE = "FREE"
    PAYMENT_MTN = "MTN"
    PAYMENT_ORANGE = "ORANGE"

    PAYMENT_CHOICES = [
        (PAYMENT_FREE, "Free"),
        (PAYMENT_MTN, "MTN Mobile Money"),
        (PAYMENT_ORANGE, "Orange Money"),
    ]

    organizer = models.ForeignKey(
        Organizer,
        on_delete=models.CASCADE,
        related_name="events"
    )

    title = models.CharField(max_length=200)
    description = models.TextField()

    category = models.CharField(max_length=100)

    location = models.CharField(max_length=200)

    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    poster = models.ImageField(
        upload_to="events/",
        blank=True,
        null=True
    )

    registration_limit = models.PositiveIntegerField(
        validators=[MinValueValidator(1)]
    )

    ticket_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_CHOICES,
        default=PAYMENT_FREE
    )

    is_launched = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    @property
    def registered_count(self):
        return self.registrations.filter(
            status=Registration.STATUS_CONFIRMED
        ).count()

    @property
    def remaining_slots(self):
        return max(
            self.registration_limit - self.registered_count,
            0
        )

    @property
    def progress_percentage(self):
        if self.registration_limit == 0:
            return 0

        percentage = (
            self.registered_count / self.registration_limit
        ) * 100

        return min(round(percentage, 2), 100)


class Ticket(models.Model):

    STATUS_ACTIVE = "ACTIVE"
    STATUS_USED = "USED"
    STATUS_CANCELLED = "CANCELLED"

    STATUS_CHOICES = [
        (STATUS_ACTIVE, "Active"),
        (STATUS_USED, "Used"),
        (STATUS_CANCELLED, "Cancelled"),
    ]

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="tickets"
    )

    participant = models.ForeignKey(
        Participant,
        on_delete=models.CASCADE,
        related_name="tickets"
    )

    ticket_number = models.CharField(
        max_length=50,
        unique=True
    )

    qr_code = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_ACTIVE
    )

    issued_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.ticket_number


class Registration(models.Model):

    STATUS_PENDING = "PENDING"
    STATUS_CONFIRMED = "CONFIRMED"
    STATUS_CANCELLED = "CANCELLED"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_CONFIRMED, "Confirmed"),
        (STATUS_CANCELLED, "Cancelled"),
    ]

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="registrations"
    )

    participant = models.ForeignKey(
        Participant,
        on_delete=models.CASCADE,
        related_name="registrations"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING
    )

    registered_at = models.DateTimeField(auto_now_add=True)

    cancelled_at = models.DateTimeField(
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.participant} - {self.event}"


class Payment(models.Model):

    STATUS_PENDING = "PENDING"
    STATUS_SUCCESS = "SUCCESS"
    STATUS_FAILED = "FAILED"
    STATUS_REFUNDED = "REFUNDED"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_SUCCESS, "Successful"),
        (STATUS_FAILED, "Failed"),
        (STATUS_REFUNDED, "Refunded"),
    ]

    registration = models.OneToOneField(
        Registration,
        on_delete=models.CASCADE,
        related_name="payment"
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    payment_method = models.CharField(
        max_length=20,
        choices=Event.PAYMENT_CHOICES
    )

    transaction_reference = models.CharField(
        max_length=150,
        unique=True,
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING
    )

    paid_at = models.DateTimeField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.registration} - {self.amount}"


class Attendance(models.Model):

    STATUS_PRESENT = "PRESENT"
    STATUS_ABSENT = "ABSENT"

    STATUS_CHOICES = [
        (STATUS_PRESENT, "Present"),
        (STATUS_ABSENT, "Absent"),
    ]

    registration = models.OneToOneField(
        Registration,
        on_delete=models.CASCADE,
        related_name="attendance"
    )

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default=STATUS_ABSENT
    )

    scanned_at = models.DateTimeField(
        blank=True,
        null=True
    )

    scanned_by = models.ForeignKey(
        Organizer,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="attendance_scans"
    )

    def __str__(self):
        return f"{self.registration} - {self.status}"


class Review(models.Model):

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="reviews"
    )

    participant = models.ForeignKey(
        Participant,
        on_delete=models.CASCADE,
        related_name="reviews"
    )

    rating = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ]
    )

    comment = models.TextField(blank=True)


    class Meta:
        unique_together = ("event", "participant")

    def __str__(self):
        return f"{self.event} - {self.rating}/5"