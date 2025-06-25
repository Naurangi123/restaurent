from django.conf import settings
from rest_framework import serializers
from django.contrib.auth import get_user_model
from api.serializers import OrderItemSerializer
from api.models import OrderItem,Order

User = get_user_model()

class RegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def save(self, **kwargs):
        password = self.validated_data['password']
        password2 = self.validated_data['password2']

        if password != password2:
            raise serializers.ValidationError("Passwords don't match.")

        if User.objects.filter(email=self.validated_data['email']).exists():
            raise serializers.ValidationError("Email already exists.")

        user = User.objects.create_user(
            username=self.validated_data['username'],
            email=self.validated_data['email'],
            password=password,
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


# class PastOrderSerializer(serializers.ModelSerializer):
#     items = serializers.SerializerMethodField()
#     total_bill = serializers.SerializerMethodField()
#     user_info = UserSerializer()

#     class Meta:
#         model = Order
#         fields = ['id', 'created_at', 'status', 'total_bill', 'items', 'user_info']

#     def get_items(self, obj):
#         items = OrderItem.objects.filter(order=obj)
#         return OrderItemSerializer(items, many=True).data

#     def get_total_bill(self, obj):
#         items = OrderItem.objects.filter(order=obj)
#         return sum(item.food.price * item.quantity for item in items)
