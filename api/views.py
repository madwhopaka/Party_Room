from django.shortcuts import render, HttpResponse
from rest_framework import generics,status
from .models import Room
from .serializer import RoomSerializers,CreateRoomSerializers, UpdateRoomSerializers
from rest_framework.views import APIView 
from rest_framework.response import Response
from django.http import JsonResponse
# Create your views here.


def main(request):
    return HttpResponse('Hello World')

class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializers

class GetRoom(APIView):
    serializer_class = RoomSerializers
    lookup_url_kwarg= 'code'
    def get (self, request, format = None):
        code =request.GET.get(self.lookup_url_kwarg)
        if code != None:
            room = Room.objects.filter(code =code)
            if len(room)>0:
                data = RoomSerializers(room[0]).data
                data['is_host']= self.request.session.session_key==room[0].host
                return Response(data, status = status.HTTP_200_OK)
            return Response({'ROOM NOT FOUND' : 'Invalid Room Code'}, status = status.HTTP_404_NOT_FOUND)
        return Response({'BAD REQUEST' :  'Code Parameter not found'}, status =status.HTTP_400_BAD_REQUEST)


class JoinRoom(APIView):
    def post(self, request, format= None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        lookup_url_kwarg = 'code'
        code = request.data.get(lookup_url_kwarg)
        if code != None:
            room_result = Room.objects.filter(code = code)
            if len(room_result)>0:
                room = room_result[0]
                self.request.session['room_code'] = code
                return Response({'message':'Room Joined'}, status=status.HTTP_200_OK)
            return Response({'message':'Invalid Code, Room not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request':'Invalid post data, could not find a code key'}, status = status.HTTP_400_BAD_REQUEST)


class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializers

    def post(self, request, format= None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip') 
            host = self.request.session.session_key
            queryset =Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip 
                room.save(update_fields=['guest_can_pause', 'votes_to_skip']) 
                self.request.session['room_code'] = room.code
                return Response(RoomSerializers(room).data,status = status.HTTP_201_CREATED)  
            else:
                room = Room(host= host, guest_can_pause =guest_can_pause, votes_to_skip= votes_to_skip)
                room.save()
                self.request.session['room_code'] = room.code
                return Response(RoomSerializers(room).data,status = status.HTTP_201_CREATED)
            return Response(RoomSerializers(room).data,status = status.HTTP_201_CREATED)
        else:
            return Response(RoomSerializers(room).data,status = status.HTTP_400_BAD_REQUEST )
            

class UserInRoom(APIView):
    def get (self, request, format = None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        data = {
            'code' : self.request.session.get('room_code')
        }
        return JsonResponse(data, status= status.HTTP_200_OK)



class leaveRoom(APIView):
    def post (self ,request, format = None):
        if 'room_code' in self.request.session:
            self.request.session.pop('room_code')
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host = host_id)
            if len(room_results)>0 :
                room = room_results[0]
                room.delete()
        return Response({'Message':'Success'},status = status.HTTP_200_OK)


class UpdateRoom(APIView):
    serializer_class = UpdateRoomSerializers
    def patch(self, request, format = None):
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            user_id = self.request.session.session_key
            code = request.data.get('code')
            votes_to_skip = request.data.get('votes_to_skip')
            guest_can_pause = request.data.get('guest_can_pause')
            queryset = Room.objects.filter(code = code)
            if not queryset.exists():
                return Response({'message':'Room not Found'},status =status.HTTP_404_NOT_FOUND)
            room = queryset[0]
            user_id = self.request.session.session_key
            host = room.host
            if user_id!= host:
                return Response({'Message': 'You are not the host'})
            room.guest_can_pause = guest_can_pause
            room.votes_to_skip = votes_to_skip
            room.save(update_fields=['votes_to_skip', 'guest_can_pause'])
            return Response(RoomSerializers(room).data, status= status.HTTP_200_OK)
        return Response({'Bad Request':'Invalid Data'},status = status.HTTP_400_BAD_REQUEST)


