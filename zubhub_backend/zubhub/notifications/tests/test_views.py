from django.urls import reverse, reverse_lazy
from rest_framework.test import APIClient
from django.test import TestCase
from notifications.models import Notification
from creators.models import Creator
from notifications.serializers import NotificationSerializer
from rest_framework import status
from django.utils import timezone
import json
from django.test import Client
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.contrib.auth import get_user_model

creator = get_user_model()

class UserNotificationsAPIViewTest(TestCase):

    @classmethod
    def setUpTestData(self):
        self.first_creator = Creator.objects.create(username="krishna")
        self.second_creator = Creator.objects.create(username="kali")
        self.client = APIClient()

        self.payload = Notification.objects.create(
            link="https://zubhub.com/exampleclap",
            type=Notification.Type.CLAP,
            recipient=self.first_creator,
            message="Clap",
            viewed=False
        )
        self.payload.save()
        self.payload.sources.add(self.second_creator, self.second_creator)
        self.payload.save()

        self.auth = {
            "username": "test_dummy2",
            "email": "test_dummy2@gmail.com",
            "password1": "qwertyu12345",
            "password2": "qwertyu12345",
            "phone": "+57778899066",
            "dateOfBirth": "1998-02-20",
            "location": "Nigeria",
            "bio": "ddd",
            "subscribe": True,
        }

    def test_get_user_notifications(self):
        rgst = self.client.post(reverse("creators:signup_creator"), self.auth, format="json")
        res = self.client.get(reverse('notifications:user-notifications'))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['count'], 1)

    def test_get_user_notifications_unauthorized(self):
        res = self.client.get(reverse('notifications:user-notifications'))
        self.assertEqual(res.status_code, 403)


class MarkNotificationAsViewedAPIViewTest(TestCase):
    @classmethod
    def setUpTestData(self):
        self.first_creator = Creator.objects.create(username="krishna")
        self.second_creator = Creator.objects.create(username="kali")
        self.client = APIClient()

        self.payload = Notification.objects.create(
            link="https://zubhub.com/exampleclap",
            type=Notification.Type.CLAP,
            recipient=self.first_creator,
            message="Clap",
            viewed=True
        )
        self.payload.save()
        self.payload.sources.add(self.second_creator, self.second_creator)
        self.payload.save() 

    def test_mark_notification_as_viewed(self):
        self.payload= Notification.objects.get(id=self.payload.id)
        res = self.client.put("/api/notifications/{}/update".format(self.payload.id), data=self.payload, content_type="application/json", follow=True)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['viewed'], True)

    def test_mark_notification_as_unauthozired(self):
        self.payload= Notification.objects.get(id=self.payload.id)
        res = self.client.put("/api/notifications/{}/update".format(self.payload.id), data=self.payload, content_type="application/json", follow=True)
        self.assertEqual(res.status_code, 403)


class DeleteNotificationAPIViewTest(TestCase):
    @classmethod
    def setUpTestData(self):
        self.first_creator = Creator.objects.create(username="krishna")
        self.second_creator = Creator.objects.create(username="kali")
        self.client = APIClient()

        self.payload = Notification.objects.create(
            link="https://zubhub.com/exampleclap",
            type=Notification.Type.CLAP,
            recipient=self.first_creator,
            message="Clap",
            viewed=True
        )
        self.payload.save()
        self.payload.sources.add(self.second_creator, self.second_creator)
        self.payload.save()

        self.auth = {
            "username": "test_dummy2",
            "email": "test_dummy2@gmail.com",
            "password1": "qwertyu12345",
            "password2": "qwertyu12345",
            "phone": "+57778899066",
            "dateOfBirth": "1998-02-20",
            "location": "Nigeria",
            "bio": "ddd",
            "subscribe": True,
        }

    def test_delete_notification(self):
        rgst = self.client.post(reverse("creators:signup_creator"), self.auth, format="json")
        res = self.client.delete(f"/api/notifications/{self.payload.id}/delete", data=self.payload, content_type="application/json", follow=True)
        self.assertEqual(res.status_code, 204)

    def test_delete_notification_unauthorized(self):
        res = self.client.delete("/api/notifications/{}/delete".format(self.payload.id), data=self.payload, content_type="application/json", follow=True)
        self.assertEqual(res.status_code, 403)
