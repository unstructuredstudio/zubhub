from django.test import TestCase
from django.contrib.auth import get_user_model
from projects.models import Category
from activities.models import Image, InspiringArtist, Activity, InspiringExample, ActivityImage, ActivityMakingStep

Creator = get_user_model()

class ImageModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.image = Image.objects.create(file_url="https://www.example.com/image.jpg", public_id="123456")

    def test_str_representation(self):
        self.assertEqual(str(self.image), "Photo <123456:https://www.example.com/image.jpg>")

class InspiringArtistModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.image = Image.objects.create(file_url="https://www.example.com/image.jpg", public_id="123456")
        cls.artist = InspiringArtist.objects.create(name="John Doe", image=cls.image, short_biography="A short biography")

    def test_str_representation(self):
        self.assertEqual(str(self.artist), "John Doe")

class ActivityModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = Creator.objects.create_user(username="test_user", email="test@example.com", password="testpassword")
        cls.category = Category.objects.create(name="Test Category", depth=1)
        cls.image = Image.objects.create(file_url="https://www.example.com/image.jpg", public_id="123456")
        cls.artist = InspiringArtist.objects.create(name="John Doe", image=cls.image, short_biography="A short biography")
        cls.activity = Activity.objects.create(title="Test Activity",learning_goals="example_goal", category=cls.category, materials_used="Materials used", materials_used_image=cls.image, inspiring_artist=cls.artist, slug="test-activity")

    def test_str_representation(self):
        self.assertEqual(str(self.activity), "Test Activity")

    def test_slug_is_created_on_save_if_not_provided(self):
        new_activity = Activity.objects.create(title="New Test Activity",learning_goals="example_goal", category=self.category, materials_used="Materials used", materials_used_image=self.image, inspiring_artist=self.artist)
        self.assertIsNotNone(new_activity.slug)

class InspiringExampleModelTest(TestCase):
    def setUp(self):

        self.user = Creator.objects.create_user(username='user1', password='password1')
        self.activity = Activity.objects.create(title='Activity',learning_goals="example_goal", materials_used="Example")
        self.activity.creators.add(self.user)
        self.image = Image.objects.create(file_url="https://www.example.com/image.jpg", public_id="123456")

    def test_creating_inspiring_example_with_all_fields_succeeds(self):
        inspiring_example = InspiringExample.objects.create(
            activity=self.activity,
            description="This is an example inspiring activity",
            credit="John Doe",
            image=self.image
        )
        self.assertIsNotNone(inspiring_example.id)

    def test_creating_inspiring_example_without_optional_fields_succeeds(self):
        inspiring_example = InspiringExample.objects.create(activity=self.activity)
        self.assertIsNotNone(inspiring_example.id)

    

class ActivityImageModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.category = Category.objects.create(name="Test Category", depth=1) # depth not null
        cls.activity = Activity.objects.create(title="Test Activity",learning_goals="example_goal", category=cls.category, materials_used="Materials used")
        cls.image = Image.objects.create(file_url="https://www.example.com/image.jpg", public_id="123456")
        cls.activity_image = ActivityImage.objects.create(activity=cls.activity, image=cls.image)

    def test_activity_image_creation(self):
       self.assertIsInstance(self.activity_image, ActivityImage)

class ActivityMakingStepModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.category = Category.objects.create(name="Test Category", depth=1) # depth not null
        cls.activity = Activity.objects.create(title="Test Activity",learning_goals="example_goal", category=cls.category, materials_used="Materials used")
        cls.image = Image.objects.create(file_url="https://www.example.com/image.jpg", public_id="123456")
        cls.making_step = ActivityMakingStep.objects.create(
            activity=cls.activity,
            image=cls.image,
            description="Test description",
            step_order=1
        )

    def test_str_representation(self):
        self.assertEqual(str(self.making_step), "Test description")


