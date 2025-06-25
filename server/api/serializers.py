from rest_framework import serializers
from .models import *
# from authapp.serializers import UserSerializer
from datetime import datetime, timedelta

class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'

class MenuSerializer(serializers.ModelSerializer):
    foods = serializers.SerializerMethodField()
    restaurant = serializers.SerializerMethodField()

    class Meta:
        model = Menu
        fields = ['id', 'name', 'restaurant', 'foods', 'category', 'description', 'image', 'is_active']

    def get_restaurant(self, obj):
        return {
            'id': obj.restaurant.id,
            'name': obj.restaurant.name
        }

    def get_foods(self, obj):
        return obj.foods.all().values()


# 3. Food Serializer
class FoodSerializer(serializers.ModelSerializer):
    menus = serializers.SerializerMethodField()
    restaurants = serializers.SerializerMethodField()

    class Meta:
        model = Food
        fields = '__all__'

    def get_menus(self, obj):
        return list(obj.menus.values('id', 'name', 'category', 'description', 'image', 'is_active'))

    def get_restaurants(self, obj):
        restaurants = {menu.restaurant for menu in obj.menus.all()}
        return [
            {'id': r.id, 'name': r.name}
            for r in restaurants
        ]



class ReservationSerializer(serializers.ModelSerializer):
    total_amount = serializers.SerializerMethodField()
    duration=serializers.SerializerMethodField()
    time_left = serializers.ReadOnlyField()
    class Meta:
        model=Reservation
        fields='__all__'

    def get_total_amount(self, obj):
        return obj.number_of_people * 250
    

    def get_duration(self, obj):
            try:
                start_dt = timezone.make_aware(datetime.combine(obj.reservation_date, obj.reservation_time))
                end_dt = timezone.make_aware(datetime.combine(obj.reservation_date, obj.reservation_end_time))

                if end_dt <= start_dt:
                    end_dt += timedelta(days=1)

                duration = end_dt - start_dt

                total_seconds = duration.total_seconds()

                hours = int(total_seconds // 3600)  
                minutes = int((total_seconds % 3600) // 60) 
                return f"{hours} hours {minutes} minutes" if hours > 0 else f"{minutes} minutes"

            except Exception as e:
                return "Unknown"   

class TableSerializer(serializers.ModelSerializer):
    restaurant=RestaurantSerializer()
    restaurant=serializers.PrimaryKeyRelatedField(queryset=Restaurant.objects.all())

    class Meta:
        model=Table
        # fields= '__all__'
        fields= ['id','table_number','seats','restaurant','qr_code']


class TableQrSerializer(serializers.ModelSerializer):
    class Meta:
        model=Table
        fields= ['id','table_number','qr_code']


class QRCodeSerializer(serializers.ModelSerializer):
    qr_code_url = serializers.SerializerMethodField()
    table_number = serializers.SerializerMethodField()

    class Meta:
        model = QRCode
        fields = ['id', 'qr_code_url', 'table_id', 'table_number']

    def get_qr_code_url(self, obj):
        request = self.context.get('request')
        if obj.qr_code and hasattr(obj.qr_code, 'url'):
            return request.build_absolute_uri(obj.qr_code.url)
        return None

    def get_table_number(self, obj):
        return obj.details.get('table_number') if obj.details else None

    def get_target_url(self, obj):
        request = self.context.get('request')
        if obj.details:
            table_number = obj.details.get('table_number')
            if table_number and request:
                return request.build_absolute_uri(f"/qrcode/?table_number={table_number}")
        return None
    

class OrderItemSerializer(serializers.ModelSerializer):
    foods = FoodSerializer(many=True, read_only=True)
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    table = TableSerializer()
    items=OrderItemSerializer(many=True,read_only=True)
    foods = FoodSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = '__all__'


class CartItemSerializer(serializers.ModelSerializer):
    food=FoodSerializer()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'food', 'quantity', 'total_price']

    def update(self, instance, validated_data):
        quantity = validated_data.get('quantity', instance.quantity)
        instance.quantity = quantity
        instance.save()
        return instance

    def get_total_price(self, obj):
        return obj.food.price * obj.quantity


class ReceiptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receipt
        fields = '__all__'
        
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    # user=UserSerializer()
    class Meta:
        model = Payment
        fields = '__all__'
