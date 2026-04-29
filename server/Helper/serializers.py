from rest_framework import serializers
from django.contrib.auth import get_user_model
from Service.serializers import ServiceSerializers
from Service.models import Service
from .models import Location, HelperService
User = get_user_model()

class LocationSerializers(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ["id", "country", "city", "area"]
        read_only_fields = ["id"]




class HelperServiceSerializers(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        read_only = True
    )
    service = ServiceSerializers(read_only = True)
    service_id = serializers.PrimaryKeyRelatedField(
        queryset = Service.objects.all(),
        write_only = True,
        source = 'service',
    )
    location_id = serializers.PrimaryKeyRelatedField(
        write_only = True,
        queryset = Location.objects.all(),
        many = True,
        source = 'location',
    )
    location = LocationSerializers(read_only = True,many = True)
    class Meta:
        model = HelperService
        fields = [
            "id",
            "user",
            "service_id",
            "service",
            "location_id",
            "location",
            "price",
            "experience_year",
            "is_available",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ['id','user','created_at','updated_at','service','location']



    def create(self, validated_data):
        validated_data['user'] = self.context['user']
        return super().create(validated_data)


