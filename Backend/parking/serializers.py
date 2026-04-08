from rest_framework import serializers
from .models import ParkingLot, Booking

class ParkingLotSerializer(serializers.ModelSerializer):
    available_spots = serializers.ReadOnlyField()
    created_by = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model = ParkingLot
        fields = [
            'id', 'name', 'lot_type', 'location', 'description',
            'total_capacity', 'current_occupied', 'available_spots',
            'is_active', 'created_by', 'created_at', 'updated_at'
        ]


class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['parking_lot', 'start_time', 'end_time', 'vehicle_number']


class BookingSerializer(serializers.ModelSerializer):
    parking_lot_name = serializers.ReadOnlyField(source='parking_lot.name')
    user_username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Booking
        fields = [
            'id', 'user_username', 'parking_lot', 'parking_lot_name',
            'start_time', 'end_time', 'status', 'vehicle_number', 'created_at'
        ]
        read_only_fields = ['user_username', 'status']