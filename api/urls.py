
from django.contrib import admin
from django.urls import path
from . import views
from .views import RoomView, CreateRoomView, GetRoom, JoinRoom, UserInRoom,leaveRoom, UpdateRoom
urlpatterns = [
    path('home', views.main, name= 'home'),
    path('roomview', RoomView.as_view(), name = 'roomview'),
    path('create-room',CreateRoomView.as_view(), name = 'create-room' ),
    path('get-room', GetRoom.as_view(), name = 'get-room'),
    path('join-room', JoinRoom.as_view(), name = 'join-room'),
    path('user-in-room', UserInRoom.as_view()),
    path('leave-room',leaveRoom.as_view()),
    path('update-room',UpdateRoom.as_view(), name = 'UpdateRoom' ),
]
