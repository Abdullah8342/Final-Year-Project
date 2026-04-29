from rest_framework import serializers
from django.utils import timezone
from django.contrib.auth import get_user_model
from Helper.models import HelperService
from Helper.serializers import HelperServiceSerializers
from .models import Booking

User = get_user_model()


class BookingSerializers(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    helper_service_id = serializers.PrimaryKeyRelatedField(
        queryset=HelperService.objects.all(), write_only=True, source="helper_service"
    )
    helper_service = HelperServiceSerializers(read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "user",
            "helper_service",
            "helper_service_id",
            "status",
            "scheduled_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_scheduled_at(self,value):
        min_time = timezone.now() + timezone.timedelta(minutes=15)
        if value < min_time:
            raise serializers.ValidationError("Booking must be at least 15 minutes in the future.")
        return value

    def validate(self, attrs):
        user = self.context['request'].user
        if user == attrs['helper_service'].user:
            raise serializers.ValidationError("You Cannot Book Your Own Service")

        if not attrs['helper_service'].is_available:
            raise serializers.ValidationError("Unavailable Service")

        conflict = (
            Booking.objects.filter(
                helper_service=attrs['helper_service'],
                scheduled_at=attrs['scheduled_at'],
                status__in=["Pending", "Accepted"],
            )
        )
        if self.instance:
            if conflict.exclude(pk = self.instance.pk).exists():
                raise serializers.ValidationError("Helper already booked at this time")
        
        
        return super().validate(attrs)

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)
