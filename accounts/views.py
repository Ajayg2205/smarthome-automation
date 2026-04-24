from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from .serializers import RegisterSerializer

User = get_user_model()


class RegisterView(APIView):
    permission_classes = [AllowAny]    # anyone can register — no token needed

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {"message": "Registered successfully", "id": user.pk},
                status=201
            )
        return Response(serializer.errors, status=400)


class LoginView(APIView):
    permission_classes = [AllowAny]    # anyone can attempt login — no token needed

    def post(self, request):
        email    = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(request, username=email, password=password)

        if not user:
            return Response({"error": "Invalid email or password"}, status=401)

        refresh = RefreshToken.for_user(user)
        refresh["role"] = user.role    # embed role in the token so frontend can read it
        refresh["name"] = user.name

        return Response({
            "access":  str(refresh.access_token),
            "refresh": str(refresh),
            "role":    user.role,
            "name":    user.name,
        })