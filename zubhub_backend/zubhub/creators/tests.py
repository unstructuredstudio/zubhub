from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

# Create your tests here.


class SignupPageTests(TestCase):
    username = 'newuser'
    email = 'newuser@email.com'

    def setUp(self):
        url = reverse('account_signup')
        self.response = self.client.get(url)

    def test_signup_template(self):
        self.assertEqual(self.response.status_code, 200)
        self.assertTemplateUsed(self.response, 'account/signup.html')
        self.assertContains(self.response, 'Sign Up')
        self.assertNotContains(
            self.response, 'hi there!, i should not be on this page')

    def test_signup_form(self):
        get_user_model().objects.create_user(self.username, self.email)
        self.assertEqual(get_user_model().objects.all().count(), 1)
        self.assertEqual(get_user_model().objects.all()
                         [0].username, self.username)
        self.assertEqual(get_user_model().objects.all()[0].email, self.email)


class CreatorTests(TestCase):
    def test_create_user(self):
        creator = get_user_model()
        creator = creator.objects.create_user(
            username="will",
            email='will@email',
            password='willpass'
        )

        self.assertEqual(creator.username, 'will')
        self.assertEqual(creator.email, 'will@email')
        self.assertTrue(creator.is_active)
        self.assertFalse(creator.is_staff)
        self.assertFalse(creator.is_superuser)

    def test_create_superuser(self):
        User = get_user_model()
        user = User.objects.create_superuser(
            username="admin",
            email='admin@email',
            password='adminpass'
        )

        self.assertEqual(user.username, 'admin')
        self.assertEqual(user.email, 'admin@email')
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)
