from __future__ import absolute_import

import os

from celery import Celery

# set the default Django settings module for the 'celery' program.
# this is also used in manage.py
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_dj.settings')

BASE_REDIS_URL = os.environ.get('REDIS_URL', 'redis://redis:6379')

app = Celery('restaurant_dj')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()

app.conf.broker_url = BASE_REDIS_URL
