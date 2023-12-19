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