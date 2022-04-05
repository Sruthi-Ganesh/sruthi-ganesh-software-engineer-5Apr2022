from restaurant.tasks import rebuild_es_index

def update_search(instance, **kwargs):
    rebuild_es_index.delay()
