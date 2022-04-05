import abc
import operator
from functools import reduce

from elasticsearch_dsl import Q
from elasticsearch_dsl.query import Nested
from rest_framework import viewsets

from restaurant.documents import RestaurantDocument
from search.serializers import RestaurantDocumentSerializer


class PaginatedElasticSearchAPIView(viewsets.ModelViewSet):
    serializer_class = None
    document_class = None

    def __init__(self, *args, **kwargs):
        super(PaginatedElasticSearchAPIView, self).__init__(*args, **kwargs)

    @abc.abstractmethod
    def generate_q_nested_expression(self, time, day, next_day):
        """This method should be overridden
        and return a Q() expression."""

    @abc.abstractmethod
    def generate_q_expression(self, title):
        """This method should be overridden
        and return a Q() expression."""

    @abc.abstractmethod
    def autocomplete_title(self, title, search):
        """This method should be overridden
            and return a Q() expression."""

    def get_serializer_context(self):
        return {
            'request': self.request,
            'format': self.format_kwarg,
            'view': self
        }

    def get_serializer(self, *args, **kwargs):
        """
        Return the serializer instance that should be used for validating and
        deserializing input, and for serializing output.
        """
        serializer_class = self.serializer_class
        kwargs['context'] = self.get_serializer_context()
        return serializer_class(*args, **kwargs)

    def list(self, request, *args, **kwargs):
        q_nested = self.generate_q_nested_expression(request.GET.get('time', ''), request.GET.get('day', ''),
                                                     bool(request.GET.get('is_next_day', False)))
        q = self.generate_q_expression(request.GET.get('title', ''))
        search = self.document_class.search().extra(size=2500)
        if q_nested:
            search = search.query(Nested(path='open_date_times', query=q_nested))
        if q:
            search = search.query(q)
        response = search.execute()
        serializer = self.get_serializer(response, many=True)
        data = serializer.data
        is_open = bool(request.GET.get('is_open', False))
        order_by_title = bool(request.GET.get('orderbytitle', False))
        sorted_data = data
        if order_by_title:
            sorted_data = sorted(data, key=lambda d: d['title'])
        if is_open:
            sorted_data = [d for d in sorted_data if d['is_open'] is True]
        else:
            sorted_data = sorted(sorted_data, key=lambda d: not d['is_open'])
        p = self.paginate_queryset(sorted_data)
        return self.get_paginated_response(p)


class SearchRestaurants(PaginatedElasticSearchAPIView):
    serializer_class = RestaurantDocumentSerializer
    document_class = RestaurantDocument

    def generate_q_nested_expression(self, time, day, next_day):
        filters = []
        if time:
            filters.append(Q('range', open_date_times__start_time={'lte': time}))
            filters.append(Q('range', open_date_times__end_time={'gt': time}))
        if day:
            filters.append(Q('match', open_date_times__open_day_of_week=day))
        if day:
            filters.append(Q('match', open_date_times__is_next_day=next_day))
        if filters:
            return reduce(operator.iand, filters)

    def generate_q_expression(self, title):
        if title:
            return Q(
                'multi_match', query=title,
                fields=[
                    'title'
                ], fuzziness='auto')


class SuggestView(viewsets.ModelViewSet):
    document_class = RestaurantDocument

    def list(self, request, *args, **kwargs):
        search = self.document_class.search().extra(size=2500)
        results = self.autocomplete_title(request.GET.get('title', ''), search)
        p = self.paginate_queryset(results)
        return self.get_paginated_response(p)

    @staticmethod
    def autocomplete_title(title, search):
        text_fields = []
        for i in list(search.suggest("title_suggestions", title,
                                     completion={'field': 'title.suggest'}).execute().suggest['title_suggestions'][
                          0].options)[:5]:
            text_fields.append({'title': i.text, 'id': i._id})
        return text_fields
