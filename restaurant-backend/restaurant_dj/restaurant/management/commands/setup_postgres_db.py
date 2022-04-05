import os
import re
from datetime import datetime, timedelta

from django.conf import settings
from django.core.management.base import BaseCommand
from dotenv import load_dotenv

from restaurant.models import Restaurant, RestaurantOpenDateTimes, RestaurantCollection

env_path = os.path.join(settings.BASE_DIR.parent, "dev.env")
load_dotenv(dotenv_path=env_path)


class Command(BaseCommand):
    def handle(self, *args, **options):
        delete_all_tables()
        csv_file_path = os.path.join(settings.BASE_DIR, os.environ.get('CSV_FILE_PATH'))
        restaurants = []
        with open(csv_file_path) as fp:
            lines = fp.readlines()
            print("Storing data. Please wait .....")
            print("This may take several minutes")
            for line in lines:
                title, date_string = re.findall('\"[^\"]*\"|[^,]+', line.rstrip())
                restaurant = Restaurant(title=title)
                restaurants.append(restaurant)
            restaurant_objs = Restaurant.objects.bulk_create(restaurants)
        restaurant_open_objs = []
        with open(csv_file_path) as fp:
            lines = fp.readlines()
            for index, line in enumerate(lines):
                title, date_string = re.findall('\"[^\"]*\"|[^,]+', line.rstrip())
                dates = list(filter(bool, re.findall('[^/]*', date_string)))
                for date in dates:
                    date = date.replace("\"", '').strip()
                    groups = date.rsplit(' ', 5)
                    date, time = ' '.join(groups[:-5]), ' '.join(groups[-5:])
                    possible_multiple_dates = split_function(date, ',')
                    possible_dates_len = len(possible_multiple_dates)
                    for i in range(0, possible_dates_len):
                        restaurant_open_objs.extend(get_restaurant_open_obj(restaurant_objs[index].id,
                                                                            possible_multiple_dates[i].strip(),
                                                                            time))
        RestaurantOpenDateTimes.objects.bulk_create(restaurant_open_objs)
        print("Storing complete!")


def delete_all_tables():
    Restaurant.objects.all().delete()
    RestaurantOpenDateTimes.objects.all().delete()
    RestaurantCollection.objects.all().delete()


def split_function(text, split_string=None, maxsplit=None):
    if split_string and maxsplit:
        return list(map(str.strip, text.split(split_string, maxsplit=maxsplit)))
    elif split_string:
        return list(map(str.strip, text.split(split_string)))
    elif maxsplit:
        return list(map(str.strip, text.split(maxsplit=maxsplit)))
    else:
        return list(map(str.strip, text.split()))


def get_restaurant_open_obj(restaurant_id: int, days_of_week: str, time: str):
    restaurant_times = []
    start_time, end_time = convert_times(time)
    next_day = False
    if start_time >= end_time:
        next_day = True
    if days_of_week.find('-') != -1:
        day1, day2 = split_function(days_of_week, '-')
        days_of_week1 = RestaurantOpenDateTimes.get_int_for_day_of_week(day1)
        days_of_week2 = RestaurantOpenDateTimes.get_int_for_day_of_week(day2)
        for days_of_week_integer in range(days_of_week1, days_of_week2 + 1):
            restaurant_times.append(RestaurantOpenDateTimes(restaurant_id=restaurant_id,
                                                            start_time=start_time,
                                                            is_next_day=next_day,
                                                            end_time=end_time,
                                                            open_day_of_week=days_of_week_integer))
    else:
        days_of_week_integer = RestaurantOpenDateTimes.get_int_for_day_of_week(days_of_week.strip())
        restaurant_times.append(RestaurantOpenDateTimes(restaurant_id=restaurant_id,
                                                        start_time=start_time,
                                                        is_next_day=next_day,
                                                        end_time=end_time,
                                                        open_day_of_week=days_of_week_integer))
    return restaurant_times


def convert_times(time_str):
    start_time_str, end_time_str = split_function(time_str, '-')
    start_time = strp_time(start_time_str)
    end_time = strp_time(end_time_str)
    start_time_seconds = timedelta(hours=start_time.hour, minutes=start_time.minute,
                                   seconds=start_time.second).total_seconds()
    end_time_seconds = timedelta(hours=end_time.hour, minutes=end_time.minute, seconds=end_time.second).total_seconds()
    return start_time_seconds, end_time_seconds


def strp_time(time):
    try:
        return datetime.strptime(time, '%I:%M %p')
    except ValueError:
        return datetime.strptime(time, '%I %p')


def strip_day_of_week(date):
    dates = [date]
    possible_multiple_dates = []
    if date.count('-') == 2:
        dates = split_function(date, '-', maxsplit=1)
    for p in dates:
        possible_multiple_dates = split_function(p, ',')
    return possible_multiple_dates
