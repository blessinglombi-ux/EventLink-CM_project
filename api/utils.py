import uuid
from django.utils.text import slugify
from .models import (
    Event,
    Ticket,
    Notification,
)
def generate_unique_event_slug(title):
    """
    Creates a unique slug for an event.
    """
    base_slug = slugify(title)
    if not base_slug:
        base_slug = "event"
    slug = base_slug
    counter = 1
    while Event.objects.filter(
        slug=slug
    ).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1
    return slug
def generate_ticket_number():
    """
    Creates a unique ticket number.
    """
    while True:
        number = (
            "ELCM-"
            + uuid.uuid4()
                .hex[:10]
                .upper()
        )
        if not Ticket.objects.filter(
            ticket_number=number
        ).exists():
            return number
def generate_qr_value():
    """
    Creates a unique QR value.
    """
    return (
        "EVENTLINK-"
        + uuid.uuid4().hex
    )
def create_notification(
    user,
    title,
    message,
    notification_type="system"
):
    """
    Creates a notification for a user.
    """
    return Notification.objects.create(
        recipient=user,
        title=title,
        message=message,
        notification_type=notification_type,
    )