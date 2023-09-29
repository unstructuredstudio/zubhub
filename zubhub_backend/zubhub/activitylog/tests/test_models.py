from django.test import TestCase
from django.utils import timezone
from activitylog.models import Activitylog, Creator

class ActivitylogModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects to be used by all test methods
        cls.creator1 = Creator.objects.create(username="John_doe")
        cls.creator2 = Creator.objects.create(username="Jane_doe")

        cls.activity_log = Activitylog.objects.create(
            type=Activitylog.Type.CLAP,
            target=cls.creator1,
            source=cls.creator2,
            message="A new clap",
            link="https://zubhubexample.com/clap"
        )

    def test_activity_log_creation(self):
        activity_log = Activitylog.objects.get(id=self.activity_log.id)
        self.assertEqual(activity_log.type, Activitylog.Type.CLAP)
        self.assertEqual(activity_log.target, self.creator1)
        self.assertEqual(activity_log.source, self.creator2)
        self.assertEqual(activity_log.message, "A new clap")
        self.assertEqual(activity_log.link, "https://zubhubexample.com/clap")
        self.assertTrue(activity_log.date <= timezone.now())
