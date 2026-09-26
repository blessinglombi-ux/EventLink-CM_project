from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EventViewSet,
    RegistrationViewSet,
    TicketViewSet,
    AttendanceViewSet,
    NotificationViewSet,
)
router = DefaultRouter()
router.register(
    "events",
    EventViewSet,
    basename="event"
)
router.register(
    "registrations",
    RegistrationViewSet,
    basename="registration"
)
router.register(
    "tickets",
    TicketViewSet,
    basename="ticket"
)
router.register(
    "attendance",
    AttendanceViewSet,
    basename="attendance"
)
router.register(
    "notifications",
    NotificationViewSet,
    basename="notification"
)
urlpatterns = [
    path(
        "",
        include(router.urls)
    ),
]