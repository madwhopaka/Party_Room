from rest_framework import serializers
from .models import Room 

class RoomSerializers(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'host', 'code', 'guest_can_pause', 'votes_to_skip', 'created_at')

class CreateRoomSerializers(serializers.ModelSerializer):
    class Meta:
        model = Room 
        fields = ('votes_to_skip', 'guest_can_pause')

class UpdateRoomSerializers(serializers.ModelSerializer):
    code = serializers.CharField(validators=[])
    class Meta:
        model = Room 
        fields = ('votes_to_skip', 'guest_can_pause','code')