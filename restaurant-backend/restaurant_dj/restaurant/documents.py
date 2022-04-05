from django.conf import settings
from django_elasticsearch_dsl import Document, fields, Index, Completion
from django_elasticsearch_dsl.registries import registry
from elasticsearch_dsl import analyzer

from restaurant.models import Restaurant, RestaurantOpenDateTimes

html_strip = analyzer(
    'html_strip',
    tokenizer="standard",
    filter=["lowercase", "stop", "snowball"],
    char_filter=["html_strip"]
)

restaurantIndex = Index(settings.ES_INDEX)
restaurantIndex.settings(
    number_of_shards=1,
    number_of_replicas=0
)


@registry.register_document
class RestaurantDocument(Document):
    open_date_times = fields.NestedField(attr='open_date_times_indexing',
                                         properties={
                                             'id': fields.IntegerField(),
                                             'open_day_of_week': fields.TextField(),
                                             'start_time': fields.IntegerField(),
                                             'end_time': fields.IntegerField(),
                                             'is_next_day': fields.BooleanField(),
                                         })

    title = fields.TextField(
        attr='title',
        fields={
            'suggest': fields.CompletionField(),
        }
    )

    collections = fields.TextField(
        attr='collections_indexing',
        analyzer=html_strip,
        fields={
            'raw': fields.TextField(analyzer='keyword', multi=True),
            'suggest': fields.CompletionField(multi=True),
        },
        multi=True
    )

    def get_queryset(self):
        """Not mandatory but to improve performance we can select related in one sql request"""
        return super(RestaurantDocument, self).get_queryset().prefetch_related(
            'open_date_times'
        )

    class Index:
        name = settings.ES_INDEX

    class Django:
        model = Restaurant
        fields = [
            'id',
        ]
        related_models = [RestaurantOpenDateTimes]
