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
        self.first_creator = Creator.objects.create_user(username="krishna", password="makhanchor")
        self.second_creator = Creator.objects.create_user(username="kali")
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


    def test_get_user_notifications(self):
        self.client.force_login(self.first_creator)
        res = self.client.get(reverse('notifications:user-notifications'))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['count'], 1)

    def test_get_user_notifications_unauthorized(self):
        res = self.client.get(reverse('notifications:user-notifications'))
        self.assertEqual(res.status_code, 403)


class MarkNotificationAsViewedAPIViewTest(TestCase):
    @classmethod
    def setUpTestData(self):
        self.first_creator = Creator.objects.create(username="krishna", email="testuser@example.com", password="makhanchor")
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

        self.data ={
            "id": "914e841f-8cd2-4db8-b442-55a4cab95c73",
            "recipient": {
                "id": "623813fd-b4c3-420d-a4f6-543793a113d3",
                "username": "abc^@xyz.com",
                "avatar": "https://robohash.org/abc^@xyz.com",
                "comments": [],
                "bio": "",
                "followers": [],
                "following_count": 0,
                "projects_count": 1,
                "tags": [
                    "creator"
                ],
                "badges": [
                    "Hatchling"
                ]
            },
            "sources": [
                {
                    "id": "623813fd-b4c3-420d-a4f6-543793a113d3",
                    "username": "abc^@xyz.com",
                    "avatar": "https://robohash.org/abc^@xyz.com",
                    "comments": [],
                    "bio": "",
                    "followers": [],
                    "following_count": 0,
                    "projects_count": 1,
                    "tags": [
                        "creator"
                    ],
                    "badges": [
                        "Hatchling"
                    ]
                }
            ],
            "date": "2023-03-27T10:34:42.506342Z",
            "viewed": False,
            "type": 2,
            "link": "/projects/40f84b92-c549-4390-a2c3-d242f72a192e",
            "message": "<strong>abc^@xyz.com</strong> clapped for your project \"abc\"\n"
        }

    def test_mark_notification_as_viewed(self):
        self.client.force_login(self.first_creator)
        url=reverse('notifications:update-notification',kwargs={'pk': self.payload.pk})
        res=self.client.put(url, data=self.data, content_type='application/json')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['viewed'], True)

    def test_mark_notification_as_unauthozired(self):
        self.payload= Notification.objects.get(id=self.payload.id)
        url=reverse('notifications:update-notification',kwargs={'pk': self.payload.pk})
        res=self.client.put(url, self.payload)
        self.assertEqual(res.status_code, 403)


class DeleteNotificationAPIViewTest(TestCase):
    @classmethod
    def setUpTestData(self):
        self.first_creator = Creator.objects.create(username="krishna", email='testuser@example.com', password='makhanchor')
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

    def test_delete_notification_(self):
        self.client.force_login(self.first_creator)
        url=reverse('notifications:delete-notification',kwargs={'pk': self.payload.pk})
        res = self.client.delete(url, self.payload)
        self.assertEqual(res.status_code, 204)

    def test_delete_notification_unauthorized(self):
        res = self.client.delete("/api/notifications/{}/delete".format(self.payload.id), data=self.payload, content_type="application/json", follow=True)
        self.assertEqual(res.status_code, 403)
