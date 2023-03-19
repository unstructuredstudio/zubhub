from django.test import TestCase
from django.utils import timezone
from notifications.models import Notification, Creator

class NotificationsModelTest(TestCase):
    @classmethod
    def setUpTestData(self):
        
        self.first_creator = Creator.objects.create(username="krishna")
        self.second_creator = Creator.objects.create(username="kali")

        self.notifications = Notification.objects.create(
            link="https://zubhub.com/exampleclap",
            type=Notification.Type.CLAP,
            recipient=self.first_creator,
            message="Clap",
            viewed=True
        )
        self.notifications.save()
        self.notifications.sources.add(self.second_creator, self.second_creator)
        self.notifications.save()

    def test_notifications(self):
        notifications = Notification.objects.get(id=self.notifications.id)
        self.assertEqual(notifications.type, Notification.Type.CLAP)
        self.assertEqual(notifications.recipient, self.first_creator)
        self.assertEqual(notifications.sources.all()[0], self.second_creator)
        self.assertEqual(notifications.message, "Clap")
        self.assertEqual(notifications.link, "https://zubhub.com/exampleclap")
        self.assertEqual(notifications.viewed, True)
        self.assertTrue(notifications.date <= timezone.now())