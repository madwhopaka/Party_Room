from django.contrib import admin
from .models import Room
from spotify.models import SpotifyToken
# Register your models here.

admin.site.register(Room)
admin.site.register(SpotifyToken)