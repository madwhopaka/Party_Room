from django.db import models
import string , random

def generate_unique_code():
    length = 6 
    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k =length)) #random string generate
        if Room.objects.filter(code= code).count() == 0:
            break
    return code
'''
So what this function does is it generates random code of length = 6 char in a  infinite loop
until the if condition matches, if condition : it fill first filter out the codes from the db model 
and matches it with the genrated random code , if the count of the matches is zero,
the loop breaks, and we are returned random code 

'''
# Create your models here.


class Room(models.Model):
    code  = models.CharField(max_length= 8 , default = generate_unique_code , unique=True)
    host = models.CharField(max_length = 50 , unique= True)
    votes_to_skip = models.IntegerField(null = False)
    guest_can_pause= models.BooleanField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)


