from django.db import models
from users.models import CustomUser

# Vehicle model
class Vehicle(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    vehicle_number = models.CharField(max_length=20)
    vehicle_type = models.CharField(max_length=20)  # bike/car

    def __str__(self):
        return self.vehicle_number

# Parking slot model
class ParkingSlot(models.Model):
    slot_code = models.CharField(max_length=5, unique=True)
    is_occupied = models.BooleanField(default=False)

    def __str__(self):
        return self.slot_code

# Booking / History model
class Booking(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('overstayed', 'Overstayed'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    slot = models.ForeignKey(ParkingSlot, on_delete=models.CASCADE)
    token = models.CharField(max_length=10, unique=True, default=uuid.uuid4)
    entry_time = models.DateTimeField(auto_now_add=True)
    exit_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')

    def __str__(self):
        return f"{self.token} - {self.user.name}"