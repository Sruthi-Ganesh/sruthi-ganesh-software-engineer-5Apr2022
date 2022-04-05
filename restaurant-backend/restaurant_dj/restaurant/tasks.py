from celery import shared_task
from django.core.management import call_command


@shared_task(name="process_job")
def rebuild_es_index():
    call_command('search_index', '--rebuild', '-f')