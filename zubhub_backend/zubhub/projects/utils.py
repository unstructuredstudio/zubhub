from contextlib import contextmanager
from celery.five import monotonic
from django.core.cache import cache

LOCK_EXPIRE = {"30mins": 60 * 30}


@contextmanager
def task_lock(lock_id, oid):
    timeout_at = monotonic() + LOCK_EXPIRE["30mins"] - 3
    status = cache.add(lock_id, oid, LOCK_EXPIRE["30mins"])
    try:
        yield status
    finally:
        if monotonic() < timeout_at and status:
            cache.delete(lock_id)
