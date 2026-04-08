from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ValidationError
from django.db import transaction

from .models import ParkingLot, Booking
from .serializers import (
    ParkingLotSerializer, 
    BookingSerializer, 
    BookingCreateSerializer
)
from users.permissions import IsSuperAdmin


# ====================== PARKING LOT MANAGEMENT (Superadmin Only) ======================
class ParkingLotListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def get(self, request):
        """List all parking lots with availability"""
        lots = ParkingLot.objects.all()
        serializer = ParkingLotSerializer(lots, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """Create new parking lot"""
        serializer = ParkingLotSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response({
                "message": "Parking lot created successfully",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ParkingLotDetailView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def get_object(self, pk):
        try:
            return ParkingLot.objects.get(pk=pk)
        except ParkingLot.DoesNotExist:
            return None

    def get(self, request, pk):
        lot = self.get_object(pk)
        if not lot:
            return Response({"error": "Parking lot not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ParkingLotSerializer(lot)
        return Response(serializer.data)

    def put(self, request, pk):
        lot = self.get_object(pk)
        if not lot:
            return Response({"error": "Parking lot not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ParkingLotSerializer(lot, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Parking lot updated successfully",
                "data": serializer.data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        lot = self.get_object(pk)
        if not lot:
            return Response({"error": "Parking lot not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Optional: Prevent delete if there are active bookings
        if lot.bookings.filter(status__in=['pending', 'active']).exists():
            return Response({"error": "Cannot delete lot with active bookings"}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        lot.delete()
        return Response({"message": "Parking lot deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


# ====================== BOOKING MANAGEMENT ======================
class BookingListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Staff sees their own bookings, Superadmin sees all"""
        if request.user.role == 'superadmin':
            bookings = Booking.objects.select_related('parking_lot', 'user').all()
        else:
            bookings = Booking.objects.select_related('parking_lot').filter(user=request.user)
        
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @transaction.atomic
    def post(self, request):
        """Create a new booking with capacity & overlap check"""
        serializer = BookingCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        parking_lot = serializer.validated_data['parking_lot']
        start_time = serializer.validated_data['start_time']
        end_time = serializer.validated_data['end_time']
        vehicle_number = serializer.validated_data.get('vehicle_number', '')

        if not parking_lot.is_active:
            return Response({"error": "This parking lot is currently inactive"}, 
                          status=status.HTTP_400_BAD_REQUEST)

        booking = Booking(
            user=request.user,
            parking_lot=parking_lot,
            start_time=start_time,
            end_time=end_time,
            vehicle_number=vehicle_number,
            status='pending'
        )

        try:
            booking.save()  # This triggers clean() → overlap + capacity check
            return Response({
                "message": "Booking created successfully",
                "booking": BookingSerializer(booking).data
            }, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class BookingDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            booking = Booking.objects.select_related('parking_lot').get(pk=pk)
            # Staff can only access their own booking
            if booking.user != self.request.user and self.request.user.role != 'superadmin':
                return None
            return booking
        except Booking.DoesNotExist:
            return None

    def get(self, request, pk):
        booking = self.get_object(pk)
        if not booking:
            return Response({"error": "Booking not found or access denied"}, 
                          status=status.HTTP_404_NOT_FOUND)
        serializer = BookingSerializer(booking)
        return Response(serializer.data)

    def patch(self, request, pk):
        """Cancel a booking"""
        booking = self.get_object(pk)
        if not booking:
            return Response({"error": "Booking not found or access denied"}, 
                          status=status.HTTP_404_NOT_FOUND)

        if booking.status in ['completed', 'cancelled']:
            return Response({"error": "This booking cannot be cancelled anymore"}, 
                          status=status.HTTP_400_BAD_REQUEST)

        booking.status = 'cancelled'
        booking.save()
        return Response({
            "message": "Booking cancelled successfully",
            "booking": BookingSerializer(booking).data
        }, status=status.HTTP_200_OK)