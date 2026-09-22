from django.contrib import admin
from .models import (
    Organizer,
    Participant,
    Event,
    Ticket,
    Registration,
    Payment,
    Attendance,
    Review,
)


@admin.register(Organizer)
class OrganizerAdmin(admin.ModelAdmin):
    list_display = (
        "organization_name",
        "phone",
        "location",
        "is_verified",
    )
    search_fields = (
        "organization_name",
        "phone",
    )
    list_filter = ("is_verified",)


@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "phone",
        "location",
    )
    search_fields = (
        "user__username",
        "user__email",
        "phone",
    )


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "organizer",
        "category",
        "location",
        "start_date",
        "registration_limit",
        "registered_count",
        "is_launched",
    )

    search_fields = (
        "title",
        "category",
        "location",
    )

    list_filter = (
        "category",
        "payment_method",
        "is_launched",
    )


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = (
        "ticket_number",
        "event",
        "participant",
        "status",
        "issued_at",
    )

    search_fields = (
        "ticket_number",
        "participant__user__username",
    )

    list_filter = ("status",)


@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = (
        "event",
        "participant",
        "status",
        "registered_at",
    )

    list_filter = ("status",)


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "registration",
        "amount",
        "payment_method",
        "status",
        "paid_at",
    )

    list_filter = (
        "payment_method",
        "status",
    )


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = (
        "registration",
        "status",
        "scanned_at",
        "scanned_by",
    )

    list_filter = ("status",)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = (
        "event",
        "participant",
        "rating",
        "created_at",
    )

    list_filter = ("rating",)