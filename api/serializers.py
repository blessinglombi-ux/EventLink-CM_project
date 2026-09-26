from django.contrib.auth.models import User
from rest_framework import serializers
from .models import (
    OrganizerProfile,
    ParticipantProfile,
    Event,
    Registration,
    Ticket,
    Attendance,
    Notification,
)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
        ]
        read_only_fields = [
            "id"
        ]
class OrganizerProfileSerializer(
    serializers.ModelSerializer
):
    user = UserSerializer(
        read_only=True
    )
    class Meta:
        model = OrganizerProfile
        fields = [
            "id",
            "user",
            "phone",
            "organization",
            "bio",
            "profile_image",
            "created_at",
            "updated_at",
        ]
class ParticipantProfileSerializer(
    serializers.ModelSerializer
):
    user = UserSerializer(
        read_only=True
    )
    class Meta:
        model = ParticipantProfile
        fields = [
            "id",
            "user",
            "phone",
            "bio",
            "profile_image",
            "created_at",
            "updated_at",
        ]
class EventSerializer(
    serializers.ModelSerializer
):
    organizer_name = serializers.CharField(
        source="organizer.username",
        read_only=True
    )
    registered_count = serializers.IntegerField(
        read_only=True
    )
    remaining_slots = serializers.IntegerField(
        read_only=True
    )
    progress_percentage = serializers.FloatField(
        read_only=True
    )
    class Meta:
        model = Event
        fields = [
            "id",
            "organizer",
            "organizer_name",
            "title",
            "slug",
            "description",
            "category",
            "location",
            "event_date",
            "start_time",
            "end_time",
            "registration_slots",
            "registered_count",
            "remaining_slots",
            "progress_percentage",
            "poster",
            "status",
            "created_at",
            "updated_at",
            "launched_at",
        ]
        read_only_fields = [
            "id",
            "organizer",
            "registered_count",
            "remaining_slots",
            "progress_percentage",
            "created_at",
            "updated_at",
            "launched_at",
        ]
class RegistrationSerializer(
    serializers.ModelSerializer
):
    participant_name = serializers.CharField(
        source="participant.username",
        read_only=True
    )
    event_title = serializers.CharField(
        source="event.title",
        read_only=True
    )
    class Meta:
        model = Registration
        fields = [
            "id",
            "event",
            "event_title",
            "participant",
            "participant_name",
            "status",
            "registered_at",
            "cancelled_at",
        ]
        read_only_fields = [
            "id",
            "participant",
            "registered_at",
            "cancelled_at",
        ]
class TicketSerializer(
    serializers.ModelSerializer
):
    event = serializers.CharField(
        source="registration.event.title",
        read_only=True
    )
    participant = serializers.CharField(
        source="registration.participant.username",
        read_only=True
    )
    class Meta:
        model = Ticket
        fields = [
            "id",
            "registration",
            "ticket_number",
            "qr_code",
            "status",
            "issued_at",
            "used_at",
            "event",
            "participant",
        ]
        read_only_fields = [
            "id",
            "ticket_number",
            "qr_code",
            "issued_at",
            "used_at",
        ]
class AttendanceSerializer(
    serializers.ModelSerializer
):
    participant = serializers.CharField(
        source="registration.participant.username",
        read_only=True
    )
    event = serializers.CharField(
        source="registration.event.title",
        read_only=True
    )
    class Meta:
        model = Attendance
        fields = [
            "id",
            "registration",
            "participant",
            "event",
            "scanned_by",
            "scanned_at",
            "attended",
        ]
        read_only_fields = [
            "id",
            "scanned_by",
            "scanned_at",
        ]
class NotificationSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = Notification
        fields = [
            "id",
            "title",
            "message",
            "notification_type",
            "is_read",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
        ]