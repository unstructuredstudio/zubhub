from unicodedata import name
from rest_framework.test import APIClient
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from creators.models import Location
from projects.models import Category, Project
from rest_framework import status
from django.contrib.auth import get_user_model


creator = get_user_model()


class TestProjectCreation(TestCase):
    """Test the projects API"""

    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(name="Animations", depth=1)

        self.data = {
            "title": "This is the title",
            "description": "A brief description of the project",
            "images": [
                {
                    "image_url": "http://localhost:8001/project_images/IWgd_5emt5eJBgXlrRpD3",
                    "public_id": "project_images/IWgd_5emt5eJBgXlrRpD3",
                }
            ],
            "video": "https://www.youtube.com/embed/a-KLU3DOD5M",
            "materials_used": "stp;pring",
            "category": "Animations",
            "publish": {"type": 4, "visible_to": []},
        }

        self.location = Location.objects.create(name="Nigeria")
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

    def test_project_creation_is_successful(self):
        """Test authenticated user can create project with valid data"""

        rgst = self.client.post(
            reverse("creators:signup_creator"), self.auth, format="json"
        )

        res = self.client.post(
            reverse("projects:create_project"), self.data, format="json"
        )

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res)

    def test_project_creation_is_unsuccessful(self):
        """Test unauthenticated can not create project with valid data"""

        res = self.client.post(
            reverse("projects:create_project"), self.data, format="json"
        )
        new_project_exists = Project.objects.filter(title="This is the title").exists()
        self.assertFalse(new_project_exists)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_full_update_project(self):
        """Test updating a project with put"""
        rgst = self.client.post(
            reverse("creators:signup_creator"), self.auth, format="json"
        )
        res = self.client.post(
            reverse("projects:create_project"), self.data, format="json"
        )
        get_id = res.data.get("id")

        data_update = {
            "title": "This is the Updated title",
            "description": "A brief description of the project",
            "images": [
                {
                    "image_url": "http://localhost:8001/project_images/IWgd_5emt5eJBgXlrRpD3",
                    "public_id": "project_images/IWgd_5emt5eJBgXlrRpD3",
                }
            ],
            "video": "https://www.youtube.com/embed/a-KLU3DOD5M",
            "materials_used": "New material",
            "category": "Animations",
            "publish": {"type": 4, "visible_to": []},
        }

        url = self.client.put(
            f"/api/projects/{get_id}/update/", data_update, format="json"
        )

        self.assertEqual(url.data.get("title"), data_update["title"])
        self.assertEqual(url.data.get("materials_used"), data_update["materials_used"])
        self.assertEqual(url.status_code, status.HTTP_200_OK)

    def test_delete_project(self):
        """Test deleting a project"""
        rgst = self.client.post(
            reverse("creators:signup_creator"), self.auth, format="json"
        )
        res = self.client.post(
            reverse("projects:create_project"), self.data, format="json"
        )
        get_id = res.data.get("id")
        url = self.client.delete(f"/api/projects/{get_id}/delete/", format="json")
        self.assertEqual(url.status_code, status.HTTP_204_NO_CONTENT)
