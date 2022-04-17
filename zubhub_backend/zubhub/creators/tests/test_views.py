from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from creators.models import Creator, Location


creator = get_user_model()


class FetchAuthUserApiTests(TestCase):
    """Test the users API"""

    def setUp(self):
        self.client = APIClient()
        self.location = Location.objects.create(name="Nigeria")
        self.payload = {
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

    def test_create_valid_user_success(self):
        """Test creating user with valid payload is successful"""
        payload_false = {"username": "bean", "password": "boom12345"}
        res = self.client.post(reverse("creators:signup_creator"), self.payload)
        res_false = self.client.post(reverse("creators:signup_creator"), payload_false)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res_false.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(res)

    def test_user_create_unsuccessful(self):
        """Test creating user with invalid payload is unsuccessful"""
        payload_false = {"username": "bean", "password": "boom12345"}
        res_false = self.client.post(reverse("creators:signup_creator"), payload_false)
        self.assertEqual(res_false.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_for_profile_retrieval(self):
        """Test that you can retrieve user profile with given username"""
        res = self.client.post(reverse("creators:signup_creator"), self.payload)
        url = self.client.get(("/api/creators/test_dummy/"))
        self.assertEqual(url.status_code, status.HTTP_200_OK)

    def test_fetch_authenticated_user(self):
        """ Test Fetching of profile of the authenticated user. """
        create_user = self.client.post(reverse("creators:signup_creator"), self.payload)
        url = self.client.get(reverse("creators:auth_user_detail"))
        self.assertEqual(url.status_code, status.HTTP_200_OK)
        new_user_exists = creator.objects.filter(username="test_dummy").exists()
        self.assertTrue(new_user_exists)
