from django.db import models
from django.conf import settings

class EventCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

class Event(models.Model):
    organizer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='organized_events')
    category = models.ForeignKey(EventCategory, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    venue = models.CharField(max_length=255)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    capacity = models.PositiveIntegerField(help_text="Maximum total seats available")
    flyer = models.ImageField(upload_to='flyers/')
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    # Ticket Customization settings
    ticket_bg_color = models.CharField(max_length=10, default='#1E293B')
    ticket_accent_color = models.CharField(max_length=10, default='#3B82F6')
    ticket_note = models.CharField(max_length=200, default='Show this QR code at the entrance.')

    def __str__(self):
        return self.title

    @property
    def registered_count(self):
        return self.tickets.count()

    @property
    def remaining_seats(self):
        return max(0, self.capacity - self.registered_count)

class EventReview(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='reviews')
    participant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)