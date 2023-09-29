from django.urls import reverse
from rest_framework.test import APITestCase
from activitylog.models import Activitylog, Creator
from activitylog.serializers import ActivitylogSerializer

class AllUsersActivitylogAPIViewTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects to be used by all test methods
        cls.creator1 = Creator.objects.create(username="John_doe")
        cls.creator2 = Creator.objects.create(username="Jane_doe")

        Activitylog.objects.create(
            type=Activitylog.Type.CLAP,
            target=cls.creator1,
            source=cls.creator2,
            message="A new clap",
            link="https://zubhubexample.com/clap"
        )

        Activitylog.objects.create(
            type=Activitylog.Type.FOLLOW,
            target=cls.creator2,
            source=cls.creator1,
            message="Jane started following John",
            link="https://zubhubexample.com/follow"
        )

    def test_get_all_activity_logs(self):
        url = reverse('activitylog:all-activitylogs')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 2)


class UserActivitylogAPIViewTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        cls.creator1 = Creator.objects.create(username="John_doe")
        cls.creator2 = Creator.objects.create(username="Jane_doe")

        Activitylog.objects.create(
            type=Activitylog.Type.CLAP,
            target=cls.creator1,
            source=cls.creator2,
            message="A new clap from Jane to John",
            link="https://zubhubexample.com/clap"
        )

        Activitylog.objects.create(
            type=Activitylog.Type.FOLLOW,
            target=cls.creator1,
            source=cls.creator2,
            message="Jane started following John",
            link="https://zubhubexample.com/follow"
        )

    def test_get_user_activity_logs(self):
        url = reverse('activitylog:user-activitylog', kwargs={'username': 'Jane_doe'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 2)

    def test_get_user_activity_logs_with_nonexistent_username(self):
        url = reverse('activitylog:user-activitylog', kwargs={'username': 'nonexistent_user'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 0)
