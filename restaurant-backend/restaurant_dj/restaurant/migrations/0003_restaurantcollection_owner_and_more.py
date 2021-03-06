# Generated by Django 4.0.3 on 2022-04-03 15:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('restaurant', '0002_restaurantopendatetimes_is_next_day_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='restaurantcollection',
            name='owner',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='collections', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='restaurantcollection',
            name='restaurants',
            field=models.ManyToManyField(blank=True, related_name='collections', to='restaurant.restaurant'),
        ),
    ]
