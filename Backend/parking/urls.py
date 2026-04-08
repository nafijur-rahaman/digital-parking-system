from django.urls import path
from .views import (
    ParkingLotListCreateView,
    ParkingLotDetailView,
    BookingListCreateView,
    BookingDetailView,
)

urlpatterns = [
    # Parking Lot CRUD (Superadmin only)
    path('lots/', ParkingLotListCreateView.as_view(), name='parking-lot-list-create'),
    path('lots/<int:pk>/', ParkingLotDetailView.as_view(), name='parking-lot-detail'),

    # Booking endpoints
    path('bookings/', BookingListCreateView.as_view(), name='booking-list-create'),
    path('bookings/<int:pk>/', BookingDetailView.as_view(), name='booking-detail'),
]