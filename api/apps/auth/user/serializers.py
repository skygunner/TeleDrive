from auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    user_id = serializers.SerializerMethodField()

    def get_user_id(self, obj):
        return str(obj.id)  # JavaScript issue with BigInt

    class Meta:
        model = User
        fields = [
            "user_id",
            "first_name",
            "last_name",
            "username",
            "created_at",
            "updated_at",
        ]
