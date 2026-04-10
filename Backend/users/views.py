from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

from .models import CustomUser, UniversityMember
from .serializers import UserSerializer, UserCreateSerializer, LoginSerializer, UniversityMemberSerializer
from .permissions import IsSuperAdmin, IsStaffOrSuperAdmin


# ====================== LOGIN ======================
class LoginView(APIView):
    permission_classes = []  # No auth needed for login

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password']
            )
            if user and user.is_active:
                token, created = Token.objects.get_or_create(user=user)
                return Response({
                    'token': token.key,
                    'user': {
                        "success":True,
                        'id': user.id,
                        'username': user.username,
                        'full_name': user.full_name,
                        'role': user.role,
                    }
                }, status=status.HTTP_200_OK)
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ====================== STAFF MANAGEMENT (Superadmin Only) ======================
class StaffListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def get(self, request):
        staff = CustomUser.objects.filter(role='staff')
        serializer = UserSerializer(staff, many=True)
        return Response({
            "success": True,
            "staff": serializer.data
        })

    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "success": True,
                "message": "Staff created successfully",
                "user": UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StaffDetailView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def get_object(self, pk):
        try:
            return CustomUser.objects.get(pk=pk, role='staff')
        except CustomUser.DoesNotExist:
            return None

    def get(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response({"error": "Staff not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user)
        return Response({
            "success": True,
            "user": serializer.data
        })

    def put(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response({"error": "Staff not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Staff updated successfully", 
                "user": serializer.data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response({"error": "Staff not found"}, status=status.HTTP_404_NOT_FOUND)
        
        user.delete()
        return Response({
            "success": True,
            "message": "Staff deleted successfully"
        }, status=status.HTTP_204_NO_CONTENT)


# ====================== ID VERIFICATION ======================
class VerifyUniversityUserView(APIView):
    permission_classes = [IsAuthenticated, IsStaffOrSuperAdmin]

    def get(self, request, university_id):
        try:
            member = UniversityMember.objects.get(university_id=university_id)
            serializer = UniversityMemberSerializer(member)
            return Response({
                "success": True,
                "user": serializer.data
            })
        except UniversityMember.DoesNotExist:
            return Response({"error": "User with this university ID not found"}, status=status.HTTP_404_NOT_FOUND)