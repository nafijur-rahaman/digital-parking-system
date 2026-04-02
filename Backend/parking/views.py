from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User, Vehicle, ParkingSlot, Booking
from .serializers import BookingSerializer
import uuid
from django.core.mail import send_mail
from django.utils import timezone

class CreateBookingAPIView(APIView):
    """
    Staff creates booking by inputting user ID and vehicle ID
    """

    def post(self, request):
        user_id = request.data.get('university_id')
        vehicle_number = request.data.get('vehicle_number')

        try:
            user = User.objects.get(university_id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # Assign first available slot
        slot = ParkingSlot.objects.filter(is_occupied=False).first()
        if not slot:
            return Response({'error': 'No slots available'}, status=status.HTTP_400_BAD_REQUEST)

        # Mark slot occupied
        slot.is_occupied = True
        slot.save()

        # Generate token
        token = str(uuid.uuid4()).split('-')[0].upper()

        # Create booking
        booking = Booking.objects.create(
            user=user,
            vehicle=Vehicle.objects.get_or_create(user=user, vehicle_number=vehicle_number)[0],
            slot=slot,
            token=token
        )

        # Send email
        # send_mail(
        #     subject='University Parking Token',
        #     message=f'Hello {user.name}, your parking token is {token}. Slot: {slot.slot_code}',
        #     from_email='your_email@gmail.com',
        #     recipient_list=[user.email],
        #     fail_silently=False,
        # )

        serializer = BookingSerializer(booking)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ExitBookingAPIView(APIView):
    """
    Staff marks exit by token
    """
    def post(self, request):
        token = request.data.get('token')

        try:
            booking = Booking.objects.get(token=token, status='active')
        except Booking.DoesNotExist:
            return Response({'error': 'Invalid or inactive token'}, status=status.HTTP_404_NOT_FOUND)

        booking.exit_time = timezone.now()
        booking.status = 'completed'
        booking.slot.is_occupied = False
        booking.slot.save()
        booking.save()

        return Response({'message': f'Booking {token} completed successfully'}, status=status.HTTP_200_OK)