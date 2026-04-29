from rest_framework import serializers
from django.conf import settings
from django.db.models import Avg
from Booking.models import Booking
from .models import Review
from Helper.serializers import HelperServiceSerializers

User = settings.AUTH_USER_MODEL


class ReviewSerializers(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    booking_details = serializers.SerializerMethodField(read_only=True)
    helper_average_rating = serializers.SerializerMethodField(read_only=True)
    helper_service = HelperServiceSerializers(
        source='booking.helper_service', 
        read_only=True
    )
    booking = serializers.PrimaryKeyRelatedField(
        write_only=True, 
        queryset=Booking.objects.all()
    )
    
    class Meta:
        model = Review
        fields = [
            "id",
            "user",
            "booking",
            "booking_details",
            "rating",
            "comment",
            "helper_service",
            "helper_average_rating",
            "created_at",
        ]
        read_only_fields = ["id", "created_at", "booking_details", "helper_average_rating"]

    def get_booking_details(self, obj):
        return {
            "id": obj.booking.id,
            "service": obj.booking.helper_service.service.name,
            "scheduled_at": obj.booking.scheduled_at,
        }

    def get_helper_average_rating(self, obj):
        helper_user = obj.booking.helper_service.user
        avg = Review.objects.filter(
            booking__helper_service__user=helper_user
        ).aggregate(avg_rating=Avg("rating"))
        return round(avg['avg_rating'] or 0, 2)

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


    def validate(self, attrs):
        if attrs['rating'] not in range(0,6):
            raise serializers.ValidationError("Rating Must Be From One To Five")

        if not attrs['booking'].status == "Completed":
            raise serializers.ValidationError("Comment Only When Booking Is Completed")

        if not attrs['booking'].user == self.user:
            raise serializers.ValidationError('Only Booked User Can Comment')

        if Review.objects.filter(user = self.user,booking = self.booking).exists():
            raise serializers.ValidationError('Only One Comment On One Booking')

        return attrs
