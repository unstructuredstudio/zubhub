from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

from activities.models import Activity
from activities.serializers import ActivitySerializer
from activities.views import ActivityCreateAPIView, UnPublishedActivitiesAPIView
from activities.permissions import IsStaffOrModeratorOrEducator

Creator = get_user_model()

class TestUserActivitiesAPIView(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.user1 = Creator.objects.create_user(username='user1', password='password1')
        self.user2 = Creator.objects.create_user(username='user2', password='password2')

        self.activity1 = Activity.objects.create(title='Activity 1', learning_goals="example_goal", materials_used="Example")
        self.activity1.creators.add(self.user1)
        self.activity2 = Activity.objects.create(title='Activity 2',learning_goals="example_goal", materials_used="Example")
        self.activity2.creators.add(self.user1)
        self.activity3 = Activity.objects.create(title='Activity 3',learning_goals="example_goal", materials_used="Example")
        self.activity3.creators.add(self.user2)

        self.url = reverse('activities:myActivities')

    def test_get_user_activities_authenticated(self):
        self.client.login(username='user1', password='password1')

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_user_activities_unauthenticated(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_user_activities_wrong_user(self):
        self.client.login(username='user2', password='password2')

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)


class PublishedActivitiesAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.creator = Creator.objects.create_user(username='testuser', password='testpassword')
        self.published_activity = Activity.objects.create(
            title='Published Activity',
            learning_goals="example_goal",
            materials_used="Example",
            publish=True
        )
        self.published_activity.creators.add(self.creator)
        self.unpublished_activity = Activity.objects.create(
            title='Unpublished Activity',
            learning_goals="example_goal",
            materials_used="Example",
            publish=False
        )
        self.unpublished_activity.creators.add(self.creator)
        self.url = reverse('activities:index')

    def test_get_published_activities(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Published Activity')

    def test_unpublished_activities_excluded(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotContains(response, 'Unpublished Activity')

    def test_permission_classes(self):
        self.client.force_authenticate(user=self.creator)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.logout()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class UnPublishedActivitiesAPIViewTestCase(APITestCase):

    def setUp(self):
        self.url = reverse('activities:unPublished')
        self.client = APIClient()
        self.user = Creator.objects.create_user(
            username='testuser', password='testpassword')
        self.staff_user = Creator.objects.create_user(
            username='staffuser', password='staffpassword', is_staff=True)
        self.activity1 = Activity.objects.create(
            title='Activity 01',learning_goals="example_goal", materials_used='example material', publish=True)
        self.activity1.creators.add(self.user)
        self.activity2 = Activity.objects.create(
            title='Activity 02',learning_goals="example_goal", materials_used='example material', publish=False)
        self.activity2.creators.add(self.staff_user)

    def test_get_unpublished_activities_without_authentication(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_unpublished_activities_with_non_staff_user(self):
        self.client.login(
            username='testuser', password='testpassword')
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_unpublished_activities_with_staff_user(self):
        self.client.login(
            username='staffuser', password='staffpassword')
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)




class ActivityCreateAPIViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create test users with different roles
        self.staff_user = Creator.objects.create_user(username='staff', password='testpassword', is_staff=True)
        self.moderator_user = Creator.objects.create_user(username='moderator', password='testpassword')  # Assign moderator role
        self.educator_user = Creator.objects.create_user(username='educator',password='testpassword')  # Assign educator role
        self.regular_user = Creator.objects.create_user(username='regular', password='testpassword')

        self.url = reverse('activities:create')
        self.data = {
            'creators': Creator.objects.create_user(username="test_user",email="test@example.com", password="testpassword"),
            'title': 'Test Activity',
            'materials_used': 'Programming material',
        }

    def test_create_activity_authenticated(self):
        for user in [self.staff_user, self.moderator_user, self.educator_user]:
            self.client.force_authenticate(user)
            response = self.client.post(self.url, self.data)
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.assertEqual(Activity.objects.count(), 1)
            self.assertEqual(Activity.objects.get().title, 'Test Activity')  
            self.assertEqual(Activity.objects.get().materials_used, 'Programming material')
            Activity.objects.all().delete()  # Clean up for the next iteration

    def test_create_activity_unauthenticated(self):
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
           
    def test_create_activity_not_allowed(self):
        self.client.force_authenticate(self.regular_user)
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Activity.objects.count(), 0)


class ActivityUpdateAPIViewTestCase(APITestCase):
    def setUp(self):
        self.user = Creator.objects.create_user(
            username='testuser', email='testuser@example.com', password='testpass'
        )

        self.activity = Activity.objects.create(
            title='Activity',learning_goals="example_goal", materials_used='example material')
        self.activity.creators.add(self.user)
    
        self.url = reverse('activities:update', kwargs={'pk': self.activity.pk})

    def test_update_activity_with_authenticated_owner(self):
        """
        Test updating an activity with an authenticated owner
        """
        self.client.force_login(self.user)
        data = {
                'title': 'Updated Test Activity',
                'learning_goals':'example_goal',
                'materials_used': 'Programming material',
                'facilitation_tips': 'example_tips',
                'motivation': 'example_motivation',
                'views_count': 10,
                'saved_count': 2,
                }
        response = self.client.patch(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_activity_with_unauthenticated_user(self):
        """
        Test updating an activity with an unauthenticated user
        """
        data = {
                'title': 'Updated Test Activity',
                'learning_goals':'example_goal',
                'materials_used': 'Programming material',
                'facilitation_tips': 'example_tips',
                'motivation': 'example_motivation',
                'views_count': 10,
                'saved_count': 2,
                }
        response = self.client.patch(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_activity_with_authenticated_non_owner(self):
        """
        Test updating an activity with an authenticated non-owner
        """
        non_owner = Creator.objects.create_user(
            username='testuser2', email='testuser2@example.com', password='testpass'
        )
        self.client.force_login(non_owner)
        data = {
                'title': 'Updated Test Activity',
                'learning_goals':'example_goal',
                'materials_used': 'Programming material',
                'facilitation_tips': 'example_tips',
                'motivation': 'example_motivation',
                'views_count': 10,
                'saved_count': 2,
                }
        response = self.client.patch(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class ActivityDeleteAPIViewTestCase(APITestCase):
    def setUp(self):
        self.user = Creator.objects.create_user(
            username='testuser', email='testuser@example.com', password='testpass'
        )

        self.activity = Activity.objects.create(
            title='Activity',learning_goals="example_goal", materials_used='example material', publish=True)
        self.activity.creators.add(self.user)
        
        self.url = reverse('activities:delete', kwargs={'pk': self.activity.pk})

    def test_delete_activity_with_authenticated_owner(self):
        """
        Test deleting an activity with an authenticated owner
        """
        self.client.force_login(self.user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_activity_with_unauthenticated_user(self):
        """
        Test deleting an activity with an unauthenticated user
        """
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_activity_with_authenticated_non_owner(self):
        """
        Test deleting an activity with an authenticated non-owner
        """
        non_owner = Creator.objects.create_user(
            username='testuser2', email='testuser2@example.com', password='testpass'
        )
        self.client.force_login(non_owner)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class ToggleSaveAPIViewTest(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = Creator.objects.create_user(
            username='testuser', email='testuser@example.com', password='testpass'
        )
        self.client.force_authenticate(user=self.user)

    def test_toggle_save_activity(self):
        """
        Ensure authenticated user can toggle save activity.
        """
    
        self.activity = Activity.objects.create(
            title='Activity',learning_goals="example_goal", materials_used='example material', publish=True)
        self.activity.creators.add(self.user)
        self.url = reverse('activities:save', kwargs={'pk': self.activity.pk})
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.activity.saved_by.count(), 1)
       

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.activity.saved_by.count(), 0)


class TogglePublishActivityAPIViewTest(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = Creator.objects.create_user(
            username='tests_user', password='testpass'
        )
        self.staff_user = Creator.objects.create_user(username='staff', password='testpassword', is_staff=True)
        self.client.force_authenticate(user=self.staff_user)

    def test_toggle_publish_activity(self):
        """
        Ensure authenticated staff user can toggle publish activity.
        """
        self.activity = Activity.objects.create(
            title='Activity',learning_goals="example_goal", materials_used='example material', publish=True)
        self.activity.creators.add(self.staff_user)

        self.url = reverse('activities:publish', kwargs={'pk': self.activity.pk})
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.activity.publish, True)


    def test_non_staff_user_cannot_toggle_publish_activity(self):
        """
        Ensure non-staff user cannot toggle publish activity.
        """

        self.activity = Activity.objects.create(
            title='Activity',learning_goals="example_goal", materials_used='example material', publish=False)
        self.activity.creators.add(self.user)

        self.url = reverse('activities:publish', kwargs={'pk': self.activity.pk})
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
