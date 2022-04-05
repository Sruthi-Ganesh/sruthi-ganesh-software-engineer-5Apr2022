# Generated by Django 4.0.3 on 2022-03-21 05:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurant', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='restaurantopendatetimes',
            name='is_next_day',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='restaurantopendatetimes',
            name='end_time',
            field=models.IntegerField(default=0, null=True),
        ),
        migrations.AlterField(
            model_name='restaurantopendatetimes',
            name='start_time',
            field=models.IntegerField(default=0, null=True),
        ),
    ]
