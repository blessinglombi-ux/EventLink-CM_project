from django.contrib import admin
from .models import (
    OrganizerProfile,
    ParticipantProfile,
    Event,
    Registration,
    Ticket,
    Attendance,
    Notification,
    EmailVerification,
)
@admin.register(OrganizerProfile)
class OrganizerProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "organization",
        "phone",
        "created_at",
    )
    search_fields = (
        "user__username",
        "user__email",
        "organization",
    )
@admin.register(ParticipantProfile)
class ParticipantProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "phone",
        "created_at",
    )
    search_fields = (
        "user__username",
        "user__email",
    )
@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "organizer",
        "category",
        "event_date",
        "status",
        "registration_slots",
        "created_at",
    )
    list_filter = (
        "status",
        "category",
        "event_date",
    )
    search_fields = (
        "title",
        "description",
        "location",
        "organizer__username",
    )
    prepopulated_fields = {
        "slug": ("title",)
    }
@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = (
        "event",
        "participant",
        "status",
        "registered_at",
    )
    list_filter = (
        "status",
    )
    search_fields = (
        "event__title",
        "participant__username",
        "participant__email",
    )
@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = (
        "ticket_number",
        "registration",
        "status",
        "issued_at",
        "used_at",
    )
    list_filter = (
        "status",
    )
    search_fields = (
        "ticket_number",
        "qr_code",
        "registration__participant__username",
    )
@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = (
        "registration",
        "scanned_by",
        "scanned_at",
        "attended",
    )
    list_filter = (
        "attended",
    )
    search_fields = (
        "registration__participant__username",
        "registration__event__title",
    )
@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = (
        "recipient",
        "title",
        "notification_type",
        "is_read",
        "created_at",
    )
    list_filter = (
        "notification_type",
        "is_read",
    )
    search_fields = (
        "recipient__username",
        "recipient__email",
        "title",
        "message",
    )
@admin.register(EmailVerification)
class EmailVerificationAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "is_verified",
        "created_at",
        "verified_at",
    )
    list_filter = (
        "is_verified",
    )
    search_fields = (
        "user__username",
        "user__email",
    )