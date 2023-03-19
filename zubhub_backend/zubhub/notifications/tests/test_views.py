from django.urls import reverse, reverse_lazy
from rest_framework.test import APITestCase, APIClient
from notifications.models import Notification
from creators.models import Creator
from notifications.serializers import NotificationSerializer
from rest_framework import status
from django.utils import timezone
import json
from django.test import Client
from rest_framework.authtoken.models import Token


class MarkNotificationAsViewedAPIViewTest(APITestCase):
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


class DeleteNotificationAPIViewTest(APITestCase):
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

    def test_delete_notification(self):
        res = self.client.delete("/api/notifications/{}/delete".format(self.payload.id), data=self.payload, content_type="application/json", follow=True)
        self.assertEqual(res.status_code, 204)


class UserNotificationsAPIViewTest(APITestCase):

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
        self.x = {
            "username": "test_dummy",
            "email": "test_dummy@gmail.com",
            "password1": "qwertyu12345",
            "password2": "qwertyu12345",
            "phone": "+57778899066",
            "dateOfBirth": "1998-02-20",
            "location": "Nigeria",
            "bio": "ddd",
            "subscribe": True,
        }
        self.payload.save()
        self.payload.sources.add(self.second_creator, self.second_creator)
        self.payload.save()

        self.user = Creator.objects.create(
            username= "test_dummy",
            email= "test_dummy@gmail.com",
            password= "qwertyu12345",
        )
        token, created = Token.objects.get_or_create(user=self.user)
        self.client = Client(HTTP_AUTHORIZATION='Token ' + self.user.key)
        
    def test_get_user_notifications(self):
        res = self.client.get(reverse('notifications:user-notifications'))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['count'], 1)
