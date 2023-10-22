from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework import status
from .models import Project
from .views import (
    ProjectCreateAPIView,
    ProjectUpdateAPIView,
    ProjectDeleteAPIView,
    ProjectListAPIView,
    ProjectTagSearchAPIView,
    ProjectTagAutocompleteAPIView,
    ProjectAutocompleteAPIView,
    ProjectSearchAPIView,
    ProjectDetailsAPIView,
)

User = get_user_model()

class ProjectCreateAPITest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_create_project_authenticated_user(self):
        user = User.objects.create(username='testuser')
        data = {
            "title": "Test Project",
            "description": "This is a test project",
            "images": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFNzTqQLNPCOdIgNJIIYyb6ovFd_w0ZJ9eJA&usqp=CAU",
            "video": "https://youtu.be/ol_DAvdpigY?si=dZupzpRGIige8Crp",
            "materials_used": "Tape, Wire",
            "category": "Robotics",
            "publish": {"type": 4, "visible_to": []}
        }
        request = self.factory.post('/projects/create/', data)
        request.user = user

        response = ProjectCreateAPIView.as_view()(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


    def test_create_project_unauthenticated_user(self):
        data = {
            "title": "Test Project",
            "description": "This is a test project",
            "images": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFNzTqQLNPCOdIgNJIIYyb6ovFd_w0ZJ9eJA&usqp=CAU",
            "video": "https://youtu.be/ol_DAvdpigY?si=dZupzpRGIige8Crp",
            "materials_used": "Tape, Wire",
            "category": "Robotics",
            "publish": {"type": 4, "visible_to": []}
        }
        request = self.factory.post('/projects/create/', data)
        request.user = AnonymousUser()

        response = ProjectCreateAPIView.as_view()(request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        # Add more assertions for the response data

    # Add more test cases for other scenarios


class ProjectUpdateAPITest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.project = Project.objects.create(title='Test Project')

    def test_update_project_authenticated_user(self):
        user = User.objects.create(username='testuser')
        data = {
            "title": "Test Project",
            "description": "This is a test project",
            "images": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFNzTqQLNPCOdIgNJIIYyb6ovFd_w0ZJ9eJA&usqp=CAU",
            "video": "https://youtu.be/ol_DAvdpigY?si=dZupzpRGIige8Crp",
            "materials_used": "Tape, Wire",
            "category": "Robotics",
            "publish": {"type": 4, "visible_to": []}
        }
        request = self.factory.patch(f'/projects/{self.project.pk}/', data)
        request.user = user

        response = ProjectUpdateAPIView.as_view()(request, pk=self.project.pk)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_project_unauthenticated_user(self):
        data = {
            "title": "Test Project",
            "description": "This is a test project",
            "images": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFNzTqQLNPCOdIgNJIIYyb6ovFd_w0ZJ9eJA&usqp=CAU",
            "video": "https://youtu.be/ol_DAvdpigY?si=dZupzpRGIige8Crp",
            "materials_used": "Tape, Wire",
            "category": "Robotics",
            "publish": {"type": 4, "visible_to": []}
        }
        request = self.factory.patch(f'/projects/{self.project.pk}/', data)
        request.user = AnonymousUser()

        response = ProjectUpdateAPIView.as_view()(request, pk=self.project.pk)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class ProjectDeleteAPITest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.project = Project.objects.create(title='Test Project')

    def test_delete_project_authenticated_user(self):
        user = User.objects.create(username='testuser')
        request = self.factory.delete(f'/projects/{self.project.pk}/')
        request.user = user

        response = ProjectDeleteAPIView.as_view()(request, pk=self.project.pk)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_project_unauthenticated_user(self):
        request = self.factory.delete(f'/projects/{self.project.pk}/')
        request.user = AnonymousUser()

        response = ProjectDeleteAPIView.as_view()(request, pk=self.project.pk)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ProjectDetailsAPITest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.project = Project.objects.create(title='Test Project')

    def test_get_project_details_authenticated_user(self):
        user = User.objects.create(username='testuser')
        request = self.factory.get(f'/projects/{self.project.pk}/')
        request.user = user

        response = ProjectDetailsAPIView.as_view()(request, pk=self.project.pk)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_project_details_unauthenticated_user(self):
        request = self.factory.get(f'/projects/{self.project.pk}/')
        request.user = AnonymousUser()

        response = ProjectDetailsAPIView.as_view()(request, pk=self.project.pk)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
