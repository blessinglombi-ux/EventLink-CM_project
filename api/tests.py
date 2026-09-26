from django.contrib.auth.models import User
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase
from .models import (
    OrganizerProfile,
    ParticipantProfile,
    Event,
    Registration,
    Ticket,
    Attendance,
)
class EventLinkAPITests(APITestCase):
    def setUp(self):
        self.organizer = User.objects.create_user(
            username="organizer_test",
            email="organizer@example.com",
            password="TestPassword123!"
        )
        self.participant = User.objects.create_user(
            username="participant_test",
            email="participant@example.com",
            password="TestPassword123!"
        )
        OrganizerProfile.objects.create(
            user=self.organizer,
            organization="Test Organization"
        )
        ParticipantProfile.objects.create(
            user=self.participant
        )
        self.event = Event.objects.create(
            organizer=self.organizer,
            title="Test Event",
            slug="test-event",
            description="A test event.",
            category="education",
            location="Yaounde",
            event_date=timezone.now().date(),
            start_time="10:00:00",
            registration_slots=50,
            status="launched",
        )
    def test_event_created(self):
        self.assertEqual(
            Event.objects.count(),
            1
        )
    def test_event_remaining_slots(self):
        self.assertEqual(
            self.event.remaining_slots,
            50
        )
    def test_participant_can_register(self):
        self.client.force_authenticate(
            user=self.participant
        )
        url = reverse(
            "registration-list"
        )
        response = self.client.post(
            url,
            {
                "event": str(
                    self.event.id
                )
            },
            format="json"
        )
        self.assertEqual(
            response.status_code,
            201
        )
        self.assertEqual(
            Registration.objects.count(),
            1
        )
        self.assertEqual(
            Ticket.objects.count(),
            1
        )
    def test_ticket_is_created(self):
        registration = Registration.objects.create(
            event=self.event,
            participant=self.participant
        )
        ticket = Ticket.objects.create(
            registration=registration,
            ticket_number="ELCM-TEST123",
            qr_code="EVENTLINK-TEST123"
        )
        self.assertEqual(
            ticket.registration,
            registration
        )
    def test_attendance_can_be_recorded(self):
        registration = Registration.objects.create(
            event=self.event,
            participant=self.participant
        )
        ticket = Ticket.objects.create(
            registration=registration,
            ticket_number="ELCM-ATTENDANCE",
            qr_code="EVENTLINK-ATTENDANCE"
        )
        Attendance.objects.create(
            registration=registration,
            scanned_by=self.organizer,
            attended=True
        )
        ticket.status = "used"
        ticket.used_at = timezone.now()
        ticket.save()
        registration.status = "attended"
        registration.save()
        self.assertTrue(
            Attendance.objects.filter(
                registration=registration
            ).exists()
        )
        self.assertEqual(
            ticket.status,
            "used"
        )
        self.assertEqual(
            registration.status,
            "attended"
        )