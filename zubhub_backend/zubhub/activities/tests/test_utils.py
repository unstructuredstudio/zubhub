from django.test import TestCase
from activities.models import * #import all the models
from activities.utils import * #import all the utilities

class TestUtils(TestCase):
  def setUp(self):
    # sample image url from the internet
    self.test_image_data = {
      'file_url': 'https://picsum.photos/300',
      'public_id': 'A sample image from the loren picsum website',
    }
    
    # create image instance 
    self.test_image = Image.objects.create(**self.test_image_data)
    
    # create activity
    self.test_activity = Activity.objects.create(
      title='A dummy activity',
      introduction='This is the activity for John/Jane Doe',
      video='https://www.youtube.com/watch?v=CmzKQ3PSrow',
      slug='a-dummy-activity',
      # the other fields are not compulsory
    )
    
  def test_create_inspiring_artist(self):    
    # get a dictionary out of the created image instance
    image_map = self.test_image.__dict__
    # remove data that doesn't need to be passed to artist
    image_map.pop('_state', None)
    image_map.pop('id', None)

    # create artist data    
    inspiring_artist_data = {
      'name': 'John Doe',
      'short_biography': 'A short biography about John Doe',
      'image': image_map
    }
    
    # call the function being tested
    artist = create_inspiring_artist(inspiring_artist_data)
    
    self.assertIsInstance(artist, InspiringArtist)
    self.assertEqual(artist.name, inspiring_artist_data['name'])
    self.assertNotEqual(artist.name, 'Jane Doe')
    self.assertEqual(artist.image, inspiring_artist_data['image'])
    self.assertTrue(InspiringArtist.objects.filter(name='John Doe').exists())


  def test_update_image(self):
    new_data = {
      'file_url': 'https://picsum.photos/400', # notice the 400 instead of 300
      'public_id': self.test_image_data['public_id'],
    }
    
    new_image = update_image(self.test_image, new_data)
    
    self.assertIsInstance(new_image, Image)
    db_query = Image.objects.get(public_id=new_data['public_id'])
    # assert that the changes have reflected in the database
    self.assertEqual(db_query.file_url, new_data['file_url'])
    self.assertNotEqual(new_image.file_url, self.test_image_data['file_url'])
    
  def test_create_activity_images(self):
    images = [
      {
        'image': {
          'file_url': 'https://picsum.photos/500',
          'public_id': 'Activity image 1',
        }
      },
      {
        'image': {
          'file_url': 'https://picsum.photos/600',
          'public_id': 'Activity image 2',
        }
      }
    ]
    
    # get activity images count & images count before function
    activity_image_count_before = ActivityImage.objects.filter(activity=self.test_activity).count()
    image_count_before = Image.objects.all().count()
    # create activity images
    create_activity_images(activity=self.test_activity, images=images)
    # get activity images count & images count after function
    activity_image_count_after = ActivityImage.objects.filter(activity=self.test_activity).count()
    image_count_after = Image.objects.all().count()
    # assert that images and activity images were created
    self.assertEqual(activity_image_count_after - activity_image_count_before, len(images))
    self.assertEqual(image_count_after - image_count_before, len(images))
    
  def test_create_making_steps(self):
    making_steps = [
      {
        'title': 'Step 1',
        'description': 'Description for step 1',
        'step_order': 1,
        'image': [{'file_url': 'https://picsum.photos/710','public_id': '1',}]
      },
      {
        'title': 'Step 2',
        'description': 'Description for step 2',
        'step_order': 2,
        'image': [{'file_url': 'https://picsum.photos/720','public_id': '2',}]
      },
      {
        'title': 'Step 3',
        'description': 'Description for step 3',
        'step_order': 3,
        'image': [{'file_url': 'https://picsum.photos/730','public_id': '3',}]
      },
    ]
    
    # get counts before calling function
    activity_steps_count_before = ActivityMakingStep.objects.all().count()
    image_count_before = Image.objects.all().count()
    # call function to be tested
    create_making_steps(self.test_activity, making_steps)
    # get counts after function call
    activity_steps_count_after = ActivityMakingStep.objects.all().count()
    image_count_after = Image.objects.all().count()
    self.assertEquals(activity_steps_count_after - activity_steps_count_before, len(making_steps))
    # check that there are now more images than there were before
    self.assertGreater(image_count_after, image_count_before)
    
  def test_create_inspiring_example(self):
    inspiring_examples_data = [
      {
        'description': 'Inspiring example 1',
        'credit': 'credit',
        'image': {
          'file_url': 'https://picsum.photos/300',
          'public_id': 'A sample image from the loren picsum website',
        }
      },
      {
        'description': 'Inspiring example 2',
        'credit': 'credit',
        # no image in this inspiring example
      },
    ]
    
    # get number of examples and images before function call
    examples_count_before = InspiringExample.objects.filter(activity=self.test_activity).count()
    images_count_before = Image.objects.all().count()
    # function call
    create_inspiring_examples(self.test_activity, inspiring_examples=inspiring_examples_data)
    # get number of examples and images after function call
    examples_count_after = InspiringExample.objects.filter(activity=self.test_activity).count()
    images_count_after = Image.objects.all().count()
    # Assert new InspiringExample instances were created
    self.assertGreater(examples_count_after, examples_count_before)
    # Assert only one image was created
    self.assertEqual(images_count_after - images_count_before, 1)

  def test_update_activity_image(self):
    images = [
      {
        'image': {
          'file_url': 'https://picsum.photos/500',
          'public_id': 'Activity image 1',
        }
      },
      {
        'image': {
          'file_url': 'https://picsum.photos/600',
          'public_id': 'Activity image 2',
        }
      }
    ]

    update_activity_images(self.test_activity, images_to_save=images)
    # get count of activity images after function call
    activity_images_count_after = ActivityImage.objects.filter(activity=self.test_activity).count()
    self.assertEqual(activity_images_count_after, len(images))
    
  def test_update_making_steps(self):
    making_steps = [
      {
        'title': 'Step 1',
        'description': 'Description for step 1',
        'step_order': 1,
        'image': [{'file_url': 'https://picsum.photos/710','public_id': '1',}]
      },
      {
        'title': 'Step 2',
        'description': 'Description for step 2',
        'step_order': 2,
        'image': [{'file_url': 'https://picsum.photos/720','public_id': '2',}]
      },
      {
        'title': 'Step 3',
        'description': 'Description for step 3',
        'step_order': 3,
        'image': [{'file_url': 'https://picsum.photos/730','public_id': '3',}]
      },
    ]
    
    update_making_steps(self.test_activity, making_steps)
    # get counts after function call
    activity_steps_count_after = ActivityMakingStep.objects.filter(activity=self.test_activity).count()
    self.assertEqual(activity_steps_count_after, len(making_steps))

  def test_update_inspiring_examples(self):
    inspiring_examples_data = [
      {
        'description': 'Inspiring example 1',
        'credit': 'credit',
        'image': {
          'file_url': 'https://picsum.photos/300',
          'public_id': 'A sample image from the loren picsum website',
        }
      },
      {
        'description': 'Inspiring example 2',
        'credit': 'credit',
        # no image in this inspiring example
      },
    ]
    
    update_inspiring_examples(self.test_activity, inspiring_examples_data)
    # get counts after function call
    examples_count_after = InspiringExample.objects.filter(activity=self.test_activity).count()
    self.assertEqual(examples_count_after, len(inspiring_examples_data))