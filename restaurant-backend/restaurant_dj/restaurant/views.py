from django.conf import settings
from django.core.paginator import Paginator
from rest_framework import viewsets
from rest_framework.response import Response

from restaurant.models import Restaurant, RestaurantCollection
from restaurant.serializers import RestaurantSerializer, RestaurantCollectionSerializer


class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.all().prefetch_related('open_date_times', 'collections')
    serializer_class = RestaurantSerializer

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
        restaurants = Restaurant.objects.all()
        order_by_title = bool(request.GET.get('orderbytitle', False))
        if order_by_title:
            restaurants = restaurants.order_by('title')
        p = self.paginate_queryset(restaurants)
        serializer = self.get_serializer(p, many=True)
        data = serializer.data
        return self.get_paginated_response(data)


class RestaurantCollectionViewSet(viewsets.ModelViewSet):
    queryset = RestaurantCollection.objects.all()
    serializer_class = RestaurantCollectionSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = queryset.filter(owner=self.request.user)
        return queryset

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

    def update(self, request, *args, **kwargs):
        if 'restaurants' in request.data:
            restaurants = request.data['restaurants']
            collection_id = kwargs.get('pk')
            if collection_id:
                collection_id = int(collection_id)
                try:
                    collections = RestaurantCollection.objects.filter(id=collection_id, owner=request.user)
                    if len(collections) == 1:
                        collection = collections[0]
                        collection.restaurants.add(*restaurants)
                        collection.save()
                        return Response(status=200, data='Successfully saved')
                except RestaurantCollection.DoesNotExist:
                    return Response(status=404, data='Collection not found')
        return Response(status=400, data='Invalid input')
