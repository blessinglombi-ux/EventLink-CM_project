from django.contrib import admin

from .models import (
    Profile,
    Event,
    Registration,
    Ticket,
    Payment,
    Attendance,
    Review,
)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "role",
        "is_verified",
        "phone_number",
        "created_at",
    )

    list_filter = (
        "role",
        "is_verified",
    )

    search_fields = (
        "user__username",
        "user__email",
    )


@admin.register(Event)