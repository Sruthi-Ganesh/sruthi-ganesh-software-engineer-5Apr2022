from collections import OrderedDict

from rest_framework import serializers

from restaurant.models import Restaurant


class RestaurantDocumentSerializer(serializers.ModelSerializer):
    collections = serializers.SerializerMethodField()
    open_date_times = serializers.SerializerMethodField()
    is_open = serializers.SerializerMethodField()

    class Meta:
        model = Restaurant
        fields = ['id', 'title', 'collections', 'open_date_times', 'is_open']

    def get_collections(self, obj):
        if obj.collections:
            return list(obj.collections)
        else:
            return []

    def get_open_date_times(self, obj):
        open_date_times = []
        if obj.open_date_times:
            for o in obj.open_date_times:
                open_date_times.append(o.to_dict())
        return open_date_times

    def get_is_open(self, obj):
        if 'request' in self.context:
            request_object = self.context['request']
            time_seconds = request_object.query_params.get('time', None)
            day_of_week = request_object.query_params.get('day', None)
            if time_seconds and day_of_week:
                time_seconds = int(time_seconds)
                open_date_times = self.get_open_date_times(obj)
                open_date_for_weekday = next((item for item in open_date_times if item['open_day_of_week'].lower()
                                              == day_of_week.lower()), None)
                if open_date_for_weekday:
                    if open_date_for_weekday['start_time'] <= time_seconds and \
                            (time_seconds < open_date_for_weekday['end_time'] or open_date_for_weekday['is_next_day']):
                        return True
        return False


class RestaurantSuggestSerializer(serializers.ModelSerializer):

    class Meta:
        model = Restaurant
        fields = ['id', 'title']

