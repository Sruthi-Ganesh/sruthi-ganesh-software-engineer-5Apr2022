from datetime import datetime

from django.db import models
from django.db.models.signals import post_save

from restaurant.utils.es_index import update_search

from auth_users.models import User


# Create your models here.


class Restaurant(models.Model):
    title = models.CharField(max_length=200)

    def __str__(self):
        return self.title

    def open_weekday_indexing(self):
        return [odt.open_day_of_week_indexing() for odt in self.open_date_times.all()]

    def open_start_time_indexing(self):
        return [odt.start_time_indexing() for odt in self.open_date_times.all()]

    def open_end_time_indexing(self):
        return [odt.end_time_indexing() for odt in self.open_date_times.all()]

    def collections_indexing(self):
        return [c.title for c in self.collections.all()]

    def open_date_times_indexing(self):
        return [{'id': odt.id,
                 'is_next_day': odt.is_next_day,
                 'open_day_of_week': str(odt.open_day_of_week_indexing()),
                 'start_time': str(odt.start_time_indexing()),
                 'end_time': str(odt.end_time_indexing())} for odt in self.open_date_times.all()]

    def is_open_now_indexing(self):
        now = datetime.now()
        odt = None
        for odt in self.open_date_times.all():
            if odt.open_day_of_week == now.weekday():
                break
        return odt.is_open_now if odt else False

    def to_search(self):
        return {
            'id': self.id,
            'title': self.title,
            'collections': self.collections_indexing(),
            'open_weekday': self.open_weekday_indexing(),
            'start_time': self.open_start_time_indexing(),
            'end_time': self.open_end_time_indexing()
        }


class WeekOfDay(models.TextChoices):
    Mon = '0'
    Tue = '1'
    Wed = '2'
    Thu = '3'
    Fri = '4'
    Sat = '5'
    Sun = '6'


class WeekOfDay2(models.TextChoices):
    Mon = '0'
    Tues = '1'
    Weds = '2'
    Thurs = '3'
    Fri = '4'
    Sat = '5'
    Sun = '6'


class RestaurantOpenDateTimes(models.Model):
    restaurant = models.ForeignKey('Restaurant', related_name='open_date_times', on_delete=models.CASCADE)
    open_day_of_week = models.CharField(choices=WeekOfDay.choices, null=True, max_length=1)
    start_time = models.IntegerField(null=True, default=0)
    end_time = models.IntegerField(null=True, default=0)
    is_next_day = models.BooleanField(default=False)

    def get_week_of_day(self):
        return WeekOfDay(str(self.open_day_of_week))

    @staticmethod
    def get_week_of_day_ranges(day1, day2):
        ranges = []
        for i in range(day1, day2 + 1):
            ranges.append(str(WeekOfDay(i)))
        return ranges

    @staticmethod
    def get_int_for_day_of_week(day_of_week: str):
        week_day = [w for w in WeekOfDay if w.name.lower() == day_of_week.lower()]
        if len(week_day) == 1:
            return int(week_day[0])
        week_day = [w for w in WeekOfDay2 if w.name.lower() == day_of_week.lower()]
        if len(week_day) == 1:
            return int(week_day[0])

    @staticmethod
    def get_day_of_week_for_int(day_int: int):
        return WeekOfDay(str(day_int)).name

    def start_time_indexing(self):
        """Tags for indexing.

        Used in Elasticsearch indexing.
        """
        return self.start_time

    def end_time_indexing(self):
        """Tags for indexing.

        Used in Elasticsearch indexing.
        """
        return self.end_time

    def open_day_of_week_indexing(self):
        """Tags for indexing.

        Used in Elasticsearch indexing.
        """
        return WeekOfDay(self.open_day_of_week).name

    @property
    def is_open_now(self):
        now = datetime.now()
        return self.open_day_of_week == now.weekday() and self.start_time <= now.time() and now.time() > self.end_time


class RestaurantCollection(models.Model):
    restaurants = models.ManyToManyField('Restaurant', related_name='collections', blank=True)
    title = models.CharField(max_length=200)
    owner = models.ForeignKey(User, related_name='collections', on_delete=models.CASCADE)

    def __str__(self):
        return self.title


post_save.connect(update_search, sender=RestaurantCollection)
