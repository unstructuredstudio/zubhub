from random import uniform

from celery import shared_task


@shared_task(bind=True, acks_late=True, max_retries=10)
def delete_file_task(self, url):
    from zubhub.utils import delete_file_from_media_server

    try:
        res = delete_file_from_media_server(url)

        res = res.json()
        if res["result"] != "ok" and res["result"]["HTTPStatusCode"] != 204:
            raise Exception()

    except Exception as e:
        raise self.retry(exc=e, countdown=int(uniform(2, 4) ** self.request.retries))
