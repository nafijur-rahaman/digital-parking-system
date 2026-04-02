from django.urls import path
from .views import CreateBookingAPIView, ExitBookingAPIView

urlpatterns = [
    path('booking/create/', CreateBookingAPIView.as_view(), name='create-booking'),
    path('booking/exit/', ExitBookingAPIView.as_view(), name='exit-booking'),
]