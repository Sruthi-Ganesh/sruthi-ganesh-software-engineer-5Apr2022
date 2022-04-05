

from search.views import SearchRestaurants, SuggestView
from django.urls import path

urlpatterns = [
    path('', SearchRestaurants.as_view({'get': 'list'})),
    path('suggest/', SuggestView.as_view({'get': 'list'}))
]