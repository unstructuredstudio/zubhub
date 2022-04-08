from random import uniform
from celery import shared_task
from celery.decorators import periodic_task
from celery.task.schedules import crontab
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from ffmpy import FFmpeg


@shared_task(name="media.tasks.compress_video_task", bind=True, acks_late=True, max_retries=10)
def compress_video(self, file, key):
    print("hello")
    try:
        folder, name = key.split("/")
        #fs = FileSystemStorage("/media_store/" + folder)
        #fs.save("test" + name, file)

        root_dir = "/media_store/" + folder
        video_path = "{0}/{1}".format(root_dir, name)
        print("VIDEO_PATHyyyyyy: ", video_path)
        output_video_path = video_path + "hello.mp4"
        FFmpeg(inputs={video_path: None}, outputs={output_video_path: '-vf "scale=trunc(iw/4)*2:trunc(ih/4)*2" -c:v libx265 -crf 28'}).run()
        #-c:v libx264 -crf 28 -preset ultrafast
        #-aspect 10:1 -preset fast
        #-vf "scale=trunc(iw/4)*2:trunc(ih/4)*2" -c:v libx265 -crf 28
    except Exception as e:
        raise self.retry(exc=e, countdown=int(
            uniform(2, 4) ** self.request.retries))

#()