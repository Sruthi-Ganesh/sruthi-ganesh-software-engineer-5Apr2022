from datetime import datetime

from rest_framework import serializers

from restaurant.models import Restaurant, RestaurantCollection, RestaurantOpenDateTimes


class RestaurantOpenDateTimesSerializer(serializers.ModelSerializer):
    start_time = serializers.SerializerMethodField()
    end_time = serializers.SerializerMethodField()
    open_day_of_week = serializers.SerializerMethodField()

    def get_start_time(self, obj):
        return obj.start_time_indexing()

    def get_end_time(self, obj):
        return obj.end_time_indexing()

    def get_open_day_of_week(self, obj):
        return obj.open_day_of_week_indexing()

    class Meta:
        model = RestaurantOpenDateTimes
        fields = ['start_time', 'end_time', 'open_day_of_week']


class RestaurantSerializer(serializers.ModelSerializer):
    open_date_times = RestaurantOpenDateTimesSerializer(many=True, read_only=True)
    is_open = serializers.SerializerMethodField()

    class Meta:
        model = Restaurant
        fields = ['id', 'title', 'open_date_times', 'collections', 'is_open']

    def get_is_open(self, obj):
        if 'request' in self.context:
            request_object = self.context['request']
            time_seconds = request_object.query_params.get('time', None)
            day_of_week = request_object.query_params.get('day', None)
            if time_seconds and day_of_week:
                time_seconds = int(time_seconds)
                open_date_times = obj.open_date_times.all()
                open_date_for_weekday = next((item for item in open_date_times
                                              if item.open_day_of_week_indexing().lower() == day_of_week.lower()), None)
                if open_date_for_weekday:
                    if open_date_for_weekday.start_time <= time_seconds and \
                            (time_seconds < open_date_for_weekday.end_time or open_date_for_weekday.is_next_day):
                        return True
        return False


class RestaurantCollectionSerializer(serializers.ModelSerializer):
    restaurants = RestaurantSerializer(many=True, read_only=True)

    def create(self, validated_data):
        if 'request' in self.context:
            request_object = self.context['request']
            validated_data['owner'] = request_object.user
        return super(RestaurantCollectionSerializer, self).create(validated_data)

    class Meta:
        model = RestaurantCollection
        fields = '__all__'
        read_only_fields = ['owner']
        extra_kwargs = {"restaurants": {"required": False, "allow_null": True}}

