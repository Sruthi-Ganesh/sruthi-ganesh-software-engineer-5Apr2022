from rest_framework.routers import DefaultRouter
from django.urls import path, include

from restaurant.views import RestaurantViewSet, RestaurantCollectionViewSet

router = DefaultRouter()
router.register(r'restaurant', RestaurantViewSet, basename='collection')
router.register(r'collections', RestaurantCollectionViewSet, basename='collection')

urlpatterns = [
    path('', include(router.urls)),
]