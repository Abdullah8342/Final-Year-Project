from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from rest_framework import viewsets,status,permissions
from .serializers import BookingSerializers
from .models import Booking
from .permissions import IsOwner


# Create your views here.
class BookingViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated,IsOwner]
    def get_queryset(self):
        queryset = Booking.objects.filter(user = self.request.user)
        return queryset

    serializer_class = BookingSerializers

    def get_serializer_context(self):
        return {'request':self.request}

    def destroy(self, request, *args, **kwargs):
        booking = get_object_or_404(Booking,id = kwargs['pk'])
        if booking.status in ["Accepted","In Progress","Completed"]:
            raise ValidationError("Can't Delete The Booking")
        return super().destroy(request, *args, **kwargs)
