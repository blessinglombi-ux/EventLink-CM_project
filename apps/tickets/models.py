import uuid
import qrcode
from io import BytesIO
from django.core.files import File
from django.db import models
from django.conf import settings
from apps.events.models import Event

class TicketTier(models.Model):
    TIER_TYPES = (
        ('standard', 'General Admission (Free)'),
        ('vip', 'VIP Guest (Free)'),
        ('early_bird', 'Early Bird (Free)'),
        ('student', 'Student Access (Free)'),
    )
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='ticket_tiers')
    name = models.CharField(max_length=50, choices=TIER_TYPES, default='standard')
    allocated_seats = models.PositiveIntegerField(default=50)

    def __str__(self):
        return f"{self.get_name_display()} - {self.event.title}"

class Ticket(models.Model):
    ticket_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='tickets')
    tier = models.ForeignKey(TicketTier, on_delete=models.SET_NULL, null=True)
    participant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='my_tickets')
    qr_code = models.ImageField(upload_to='qrcodes/', blank=True)
    is_checked_in = models.BooleanField(default=False)
    checked_in_at = models.DateTimeField(null=True, blank=True)
    registered_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.qr_code:
            # Generate QR code containing the unique ticket UUID
            qr_img = qrcode.make(str(self.ticket_id))
            canvas = BytesIO()
            qr_img.save(canvas, format='PNG')
            fname = f"qr_{self.ticket_id}.png"
            self.qr_code.save(fname, File(canvas), save=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Ticket {self.ticket_id} ({self.participant.username})"