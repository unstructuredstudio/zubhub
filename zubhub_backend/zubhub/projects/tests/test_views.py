from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from projects.models import Project, Tag, Comment, Category
from creators.models import Creator
from django.utils import timezone
from django.core.files.uploadedfile import SimpleUploadedFile

class ProjectViewsTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user  = Creator.objects.create(username="John", password="password")
        self.client.force_authenticate(user=self.user)
        self.category = Category.objects.create(
            name='Test Category'
        )
        self.tag = Tag.objects.create(
            name='Test Tag'
        )
        self.project = Project.objects.create(
            title='Test Project',
            description='This is a test project',
            creator=self.user,
            category=self.category
        )
        self.project.tags.add(self.tag)
        self.comment = Comment.objects.create(
            project=self.project,
            author=self.user,
            content='Test comment',
            created_at=timezone.now()
        )
        self.project_image = SimpleUploadedFile(
            name='test_project_image.jpg',
            content=open('test_project_image.jpg', 'rb').read(),
            content_type='image/jpeg'
        )

    def test_list_projects(self):
        url = reverse('projects:list_projects')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Test Project')
        self.assertEqual(response.data[0]['description'], 'This is a test project')
        self.assertEqual(response.data[0]['creator']['username'], 'testuser')
        self.assertEqual(response.data[0]['category']['name'], 'Test Category')
        self.assertEqual(response.data[0]['tags'][0]['name'], 'Test Tag')
        self.assertEqual(response.data[0]['comments_count'], 1)
        self.assertEqual(response.data[0]['likes_count'], 0)
        self.assertEqual(response.data[0]['saved_count'], 0)

    def test_autocomplete_tags(self):
        url = reverse('projects:autocomplete_tags')
        response = self.client.get(url, {'q': 'Test'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Test Tag')

    def test_search_tags(self):
        url = reverse('projects:search_tags')
        response = self.client.get(url, {'q': 'Test'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Test Tag')

    def test_autocomplete_projects(self):
        url = reverse('projects:autocomplete_projects')
        response = self.client.get(url, {'q': 'Test'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Test Project')

    def test_search_projects(self):
        url = reverse('projects:search_projects')
        response = self.client.get(url, {'q': 'Test'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Test Project')

    def test_create_project(self):
        url = reverse('projects:create_project')
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        data = {
            'title': 'New Test Project',
            'description': 'This is a new test project',
            'category': self.category.id,
            'tags': [self.tag1.id, self.tag2.id],
            'is_published': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), 3)

