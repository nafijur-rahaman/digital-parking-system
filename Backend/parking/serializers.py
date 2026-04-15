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
    university_id = serializers.CharField(write_only=True, required=True, help_text="University ID of the parker")
    start_time = serializers.DateTimeField(write_only=True, required=False)
    end_time = serializers.DateTimeField(write_only=True, required=False)

    class Meta:
        model = Booking
        fields = ['parking_lot', 'start_time', 'end_time', 'vehicle_number', 'university_id']


class BookingSerializer(serializers.ModelSerializer):
    parking_lot_name = serializers.ReadOnlyField(source='parking_lot.name')
    university_member_name = serializers.ReadOnlyField(source='university_member.full_name')
    created_by_username = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model = Booking
        fields = [
            'id', 'created_by_username', 'university_member_name', 'parking_lot', 'parking_lot_name',
            'start_time', 'end_time', 'status', 'vehicle_number', 'exit_token', 'created_at'
        ]
        read_only_fields = ['status', 'exit_token']
