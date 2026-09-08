"""API endpoint for user registration."""

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import generics, serializers
from rest_framework.exceptions import ErrorDetail
from rest_framework.permissions import BasePermission

User = get_user_model()


class IsSuperuser(BasePermission):
    """Allow access only to authenticated superusers."""

    def has_permission(self, request, view):
        """Return whether the requesting user is a superuser."""
        return bool(request.user and request.user.is_superuser)


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for user update."""

    password = serializers.CharField(
        write_only=True,
        required=False,
        validators=[validate_password],
    )
    confirm_password = serializers.CharField(
        write_only=True,
        required=False,
    )

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "password",
            "confirm_password",
            "first_name",
            "last_name",
        )
        read_only_fields = ("id",)

    def validate(self, attrs):
        """Validate that the password and confirm_password fields match."""
        password = attrs.get("password")
        confirm_password = attrs.get("confirm_password")
        if password != confirm_password and (password or confirm_password):
            raise serializers.ValidationError(
                {
                    "confirm_password": [
                        ErrorDetail(
                            "Password fields didn't match.", code="password_mismatch"
                        )
                    ]
                }
            )
        return attrs

    def update(self, instance, validated_data):
        """Update user data and hash a new password when provided."""
        validated_data.pop("confirm_password", None)
        password = validated_data.pop("password", None)

        for attribute, value in validated_data.items():
            setattr(instance, attribute, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance



class UserUpdateApiView(generics.UpdateAPIView):
    """API view for user update."""

    queryset = User.objects.all()
    serializer_class = UserUpdateSerializer
    permission_classes = (IsSuperuser,)
