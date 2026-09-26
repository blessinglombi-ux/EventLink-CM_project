from django.db import transaction
from django.utils import timezone
from rest_framework import (
    status,
    viewsets,
)
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import (
    Event,
    Registration,
    Ticket,
    Attendance,
    Notification,
)
from .permissions import (
    IsOrganizer,
    IsParticipant,
    IsOwnerOrReadOnly,
)
from .serializers import (
    EventSerializer,
    RegistrationSerializer,
    TicketSerializer,
    AttendanceSerializer,
    NotificationSerializer,
)
from .utils import (
    generate_ticket_number,
    generate_qr_value,
    create_notification,
)
# =========================================================
# EVENT VIEWSET
# =========================================================
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.select_related(
        "organizer"
    ).all()
    serializer_class = EventSerializer
    def get_permissions(self):
        if self.action in [
            "create",
            "update",
            "partial_update",
            "destroy",
            "launch",
        ]:
            return [
                IsAuthenticated(),
                IsOrganizer(),
            ]
        return [
            IsAuthenticated()
        ]
    def perform_create(self, serializer):
        serializer.save(
            organizer=self.request.user
        )
    def get_queryset(self):
        queryset = super().get_queryset()
        status_filter =
            self.request.query_params.get(
                "status"
            )
        category =
            self.request.query_params.get(
                "category"
            )
        if status_filter:
            queryset = queryset.filter(
                status=status_filter
            )
        if category:
            queryset = queryset.filter(
                category=category
            )
        return queryset
    @action(
        detail=True,
        methods=["post"],
        permission_classes=[
            IsAuthenticated,
            IsOrganizer,
        ],
    )
    def launch(
        self,
        request,
        pk=None
    ):
        event = self.get_object()
        if event.organizer != request.user:
            return Response(
                {
                    "message":
                    "You can only launch your own events."
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        event.status = "launched"
        event.launched_at = timezone.now()
        event.save(
            update_fields=[
                "status",
                "launched_at",
            ]
        )
        return Response(
            {
                "message":
                "Event launched successfully.",
                "event":
                EventSerializer(event).data,
            }
        )
# =========================================================
# REGISTRATION VIEWSET
# =========================================================
class RegistrationViewSet(
    viewsets.ModelViewSet
):
    serializer_class = RegistrationSerializer
    permission_classes = [
        IsAuthenticated
    ]
    def get_queryset(self):
        user = self.request.user
        if hasattr(
            user,
            "organizer_profile"
        ):
            return Registration.objects.filter(
                event__organizer=user
            ).select_related(
                "event",
                "participant",
            )
        return Registration.objects.filter(
            participant=user
        ).select_related(
            "event",
            "participant",
        )
    def create(
        self,
        request,
        *args,
        **kwargs
    ):
        event_id =
            request.data.get(
                "event"
            )
        if not event_id:
            return Response(
                {
                    "message":
                    "Event is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            event = Event.objects.get(
                id=event_id
            )
        except Event.DoesNotExist:
            return Response(
                {
                    "message":
                    "Event not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        if event.status != "launched":
            return Response(
                {
                    "message":
                    "This event is not available for registration."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        if hasattr(
            request.user,
            "organizer_profile"
        ):
            return Response(
                {
                    "message":
                    "Organizers cannot register for events."
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        existing =
            Registration.objects.filter(
                event=event,
                participant=request.user,
            ).first()
        if existing:
            if existing.status == "cancelled":
                existing.status = "registered"
                existing.cancelled_at = None
                existing.save(
                    update_fields=[
                        "status",
                        "cancelled_at",
                    ]
                )
                return Response(
                    RegistrationSerializer(
                        existing
                    ).data,
                    status=status.HTTP_200_OK,
                )
            return Response(
                {
                    "message":
                    "You are already registered for this event."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        if event.remaining_slots <= 0:
            return Response(
                {
                    "message":
                    "This event is full."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        with transaction.atomic():
            registration =
                Registration.objects.create(
                    event=event,
                    participant=request.user,
                )
            Ticket.objects.create(
                registration=registration,
                ticket_number=
                    generate_ticket_number(),
                qr_code=
                    generate_qr_value(),
            )
            create_notification(
                request.user,
                "Registration confirmed",
                (
                    f"You are registered for "
                    f"{event.title}."
                ),
                "registration",
            )
        return Response(
            RegistrationSerializer(
                registration
            ).data,
            status=status.HTTP_201_CREATED,
        )
    @action(
        detail=True,
        methods=["post"],
    )
    def cancel(
        self,
        request,
        pk=None
    ):
        registration =
            self.get_object()
        if registration.participant != request.user:
            return Response(
                {
                    "message":
                    "You can only cancel your own registration."
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        registration.status = "cancelled"
        registration.cancelled_at =
            timezone.now()
        registration.save(
            update_fields=[
                "status",
                "cancelled_at",
            ]
        )
        registration.ticket.status = "cancelled"
        registration.ticket.save(
            update_fields=[
                "status"
            ]
        )
        create_notification(
            request.user,
            "Registration cancelled",
            (
                f"Your registration for "
                f"{registration.event.title} "
                f"has been cancelled."
            ),
            "registration",
        )
        return Response(
            {
                "message":
                "Registration cancelled successfully."
            }
        )
# =========================================================
# TICKET VIEWSET
# =========================================================
class TicketViewSet(
    viewsets.ReadOnlyModelViewSet
):
    serializer_class = TicketSerializer
    permission_classes = [
        IsAuthenticated
    ]
    queryset = Ticket.objects.select_related(
        "registration",
        "registration__event",
        "registration__participant",
    )
    def get_queryset(self):
        return self.queryset.filter(
            registration__participant=
                self.request.user
        )
# =========================================================
# ATTENDANCE VIEWSET
# =========================================================
class AttendanceViewSet(
    viewsets.ModelViewSet
):
    serializer_class = AttendanceSerializer
    permission_classes = [
        IsAuthenticated,
        IsOrganizer,
    ]
    queryset = Attendance.objects.select_related(
        "registration",
        "registration__event",
        "registration__participant",
    )
    @action(
        detail=False,
        methods=["post"],
    )
    def scan(
        self,
        request
    ):
        qr_code =
            request.data.get(
                "qr_code"
            )
        if not qr_code:
            return Response(
                {
                    "message":
                    "QR code is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            ticket =
                Ticket.objects.select_related(
                    "registration",
                    "registration__event",
                    "registration__participant",
                ).get(
                    qr_code=qr_code
                )
        except Ticket.DoesNotExist:
            return Response(
                {
                    "message":
                    "Ticket not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        registration =
            ticket.registration
        if (
            registration.event.organizer
            != request.user
        ):
            return Response(
                {
                    "message":
                    "You cannot scan tickets for this event."
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        if ticket.status == "cancelled":
            return Response(
                {
                    "message":
                    "This ticket has been cancelled."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        if ticket.status == "used":
            return Response(
                {
                    "message":
                    "This ticket has already been used."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        with transaction.atomic():
            ticket.status = "used"
            ticket.used_at = timezone.now()
            ticket.save(
                update_fields=[
                    "status",
                    "used_at",
                ]
            )
            registration.status = "attended"
            registration.save(
                update_fields=[
                    "status"
                ]
            )
            attendance, created =
                Attendance.objects.update_or_create(
                    registration=registration,
                    defaults={
                        "scanned_by":
                            request.user,
                        "attended":
                            True,
                    },
                )
            create_notification(
                registration.participant,
                "Attendance confirmed",
                (
                    f"Your attendance at "
                    f"{registration.event.title} "
                    f"has been recorded."
                ),
                "attendance",
            )
        return Response(
            {
                "message":
                "Ticket verified and attendance recorded.",
                "participant":
                registration.participant.username,
                "event":
                registration.event.title,
                "attendance":
                AttendanceSerializer(
                    attendance
                ).data,
            },
            status=status.HTTP_200_OK,
        )
# =========================================================
# NOTIFICATION VIEWSET
# =========================================================
class NotificationViewSet(
    viewsets.ModelViewSet
):
    serializer_class = NotificationSerializer
    permission_classes = [
        IsAuthenticated
    ]
    http_method_names = [
        "get",
        "patch",
        "head",
        "options",
    ]
    def get_queryset(self):
        return Notification.objects.filter(
            recipient=self.request.user
        )
    @action(
        detail=True,
        methods=["post"],
    )
    def mark_read(
        self,
        request,
        pk=None
    ):
        notification =
            self.get_object()
        notification.is_read = True
        notification.save(
            update_fields=[
                "is_read"
            ]
        )
        return Response(
            {
                "message":
                "Notification marked as read."
            }
        )