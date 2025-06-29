import qrcode
import stripe
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from django.http import FileResponse
from django.core.files import File
import os
from io import BytesIO
from django.core.files.base import ContentFile
from django.http import FileResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django.shortcuts import get_object_or_404, render
from rest_framework import status
from rest_framework.exceptions import ValidationError
from django.core.exceptions import ObjectDoesNotExist
from .models import *
from .serializers import *
from authapp.models import User
from django.utils import timezone
import os
from django.conf import settings
from PIL import Image
from django.core.files.uploadedfile import InMemoryUploadedFile
from .utils import generate_receipt_pdf

stripe.api_key = settings.STRIPE_SECRET_KEY
from django.db import transaction
from django.db.models import Q



# Search API for Food And Menu
class SearchFoodAPIView(APIView):
    def get(self, request):
        query = request.query_params.get('name')
        foods = Food.objects.all()
        if query:
            foods = foods.filter(Q(name__icontains=query))
            data = list(foods.values())
            return Response(data, status=status.HTTP_200_OK)
        return Response({"error": "No query parameter 'name' provided."}, status=status.HTTP_404_NOT_FOUND)


class GetCategory(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        food_categories = Food.objects.values_list('category', flat=True).distinct()
        menu_categories = Menu.objects.values_list('category', flat=True).distinct()
        all_categories = list(set(food_categories) | set(menu_categories))
        return Response(all_categories)


# Restaurant API
class RestaurantAPIView(APIView):
    def get(self, request):
        restaurants = Restaurant.objects.all()
        serializer = RestaurantSerializer(restaurants, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        name = request.data.get('name')
        location = request.data.get('location')
        contact_number = request.data.get('contact_number')

        if Restaurant.objects.filter(name=name).exists():
            return Response({"error": "A restaurant with this name already exists."}, status=status.HTTP_400_BAD_REQUEST)

        restaurant = Restaurant.objects.create(
            name=name,
            location=location,
            contact_number=contact_number
        )

        qr = qrcode.make(f"http://localhost:8000/api/restaurants/{restaurant.id}/menu")
        buffer = BytesIO()
        qr.save(buffer, format="PNG")

        restaurant.qr_code.save(f"qr_{restaurant.id}.png", ContentFile(buffer.getvalue()), save=False)
        restaurant.save()

        serializer = RestaurantSerializer(restaurant)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class RestaurantQRAPIView(APIView):
    def get(self, request, pk):
        restaurant = get_object_or_404(Restaurant, pk=pk)
        return FileResponse(open(restaurant.qr_code.path, "rb"), content_type="image/png")


# Menus API
class MenusAPIView(APIView):
    def get(self, request, restaurant_id, table_id):
        restaurant = get_object_or_404(Restaurant, id=restaurant_id)
        table = get_object_or_404(Table, id=table_id, restaurant=restaurant)

        menu_items = restaurant.menus.all()
        serializer = MenuSerializer(menu_items, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


# Food API
class FoodAPIView(APIView):
    def get(self, request):
        query = request.query_params.get('name')
        foods = Food.objects.all()
        if query:
            foods = foods.filter(Q(name__icontains=query))
        
        serializer = FoodSerializer(foods, many=True)
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data.copy()
        img = request.FILES.get('img')

        if img:
            with Image.open(img) as img_file:
                resized_img = img_file.resize((300, 300))
                img_io = BytesIO()
                resized_img.save(img_io, format='JPEG')
                img_io.seek(0)

                resized_image = InMemoryUploadedFile(
                    img_io,
                    None,
                    'resized_img.jpg',
                    'image/jpeg',
                    img_io.getbuffer().nbytes,
                    None
                )
                data['image'] = resized_image

        serializer = FoodSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FoodDetailAPIView(APIView):
    def get(self, request, pk):
        food = get_object_or_404(Food, pk=pk)
        serializer = FoodSerializer(food)
        return Response(serializer.data)

    def patch(self, request, pk):
        food = get_object_or_404(Food, pk=pk)
        serializer = FoodSerializer(food, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# Menu API
class MenuAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        menus = Menu.objects.all()
        serializer = MenuSerializer(menus, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # def post(self, request):
    #     serializer = MenuSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request):
        data = request.data

        # Check if data is a list (bulk insert)
        if isinstance(data, list):
            serializer = MenuSerializer(data=data, many=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Otherwise, treat as single object
        serializer = MenuSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MenuDetailAPIView(APIView):
    def get(self, request, pk):
        try:
            menu = Menu.objects.prefetch_related('foods').get(pk=pk)
            serializer = MenuSerializer(menu)
            return Response({"data": serializer.data}, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({"error": "Menu item not found."}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, pk):
        menu = get_object_or_404(Menu, pk=pk)
        serializer = MenuSerializer(menu, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Table API

class TableQrAPIView(APIView):
    def get(self, request):
        try:
            tables = Table.objects.all()
            serializer = TableQrSerializer(tables, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        

class TableAPIView(APIView):
    def get(self, request):
        try:
            unbooked_tables = Table.objects.filter(reservations__isnull=True).select_related('restaurant')
            serializer = TableSerializer(unbooked_tables, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        restaurant_id = request.data.get("restaurant")
        table_number = request.data.get("table_number")
        seats = request.data.get("seats")
        restaurant = get_object_or_404(Restaurant, id=restaurant_id)

        table = Table.objects.create(
            restaurant=restaurant,
            table_number=table_number,
            seats=seats,
            is_available=False
        )

        qr = qrcode.make(f"http://127.0.0.1:8000/api/menus/?table_number={table_number}")
        buffer = BytesIO()
        qr.save(buffer, format="PNG")

        table.qr_code.save(f"qr_{table.id}.png", ContentFile(buffer.getvalue()), save=False)
        table.save()

        serializer = TableSerializer(table)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TableDetail(APIView):
    def get(self, request, id):
        table = get_object_or_404(Table, id=id)
        serializer = TableSerializer(table)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, id):
        table = get_object_or_404(Table, id=id)
        serializer = TableSerializer(table, data=request.data, partial=True)
        if serializer.is_valid():
            qr = qrcode.make(f"http://127.0.0.1:8000/api/menus/?table_number={request.data.get('table_number')}")
            buffer = BytesIO()
            qr.save(buffer, format="PNG")

            table.qr_code.save(f"qr_{table.id}.png", ContentFile(buffer.getvalue()), save=False)
            table.save()
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Cart API
class CartItemCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart_items = CartItem.objects.filter(user=request.user,checked_out=False).select_related('food')
        serializer = CartItemSerializer(cart_items, many=True)
        return Response({"data": serializer.data, "total": cart_items.count()}, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            food_id = request.data.get('food')
            quantity = request.data.get('quantity', 1)

            if not food_id:
                return Response({"error": "Food ID is required."}, status=status.HTTP_400_BAD_REQUEST)

            food = get_object_or_404(Food, id=food_id)

            existing_item = CartItem.objects.filter(food=food, user=request.user).first()
            if existing_item:
                return Response(
                    {"error": "This item is already in the cart."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            cart_item = CartItem.objects.create(
                food=food,
                quantity=quantity,
                user=request.user
            )
            return Response(CartItemSerializer(cart_item).data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, item_id):
        cart_item = get_object_or_404(CartItem, id=item_id, user=request.user)
        cart_item.quantity = request.data.get('quantity', cart_item.quantity)
        cart_item.save()
        return Response({"message": "Cart updated successfully"}, status=status.HTTP_200_OK)

    def delete(self, request, item_id):
        cart_item = get_object_or_404(CartItem, id=item_id, user=request.user)
        cart_item.delete()
        return Response({"message": "Item removed from cart"}, status=status.HTTP_204_NO_CONTENT)


class CartDetailAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, pk):
        cart_item = get_object_or_404(CartItem, id=pk, user=request.user)
        serializer = CartItemSerializer(cart_item)
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        cart_item = get_object_or_404(CartItem, id=pk, user=request.user)
        serializer = CartItemSerializer(cart_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        cart_item = get_object_or_404(CartItem, id=pk, user=request.user)
        cart_item.delete()
        return Response({"message": "Cart Item Deleted Successfully"}, status=status.HTTP_204_NO_CONTENT)

# fix it here
class ReservationAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            now = timezone.localtime()
            today = now.date()

            # Clean up expired reservations and free up tables
            for reservation in Reservation.objects.filter(status='booked'):
                if reservation.is_expired:
                    reservation.table.is_available = True
                    reservation.table.save()
                    reservation.delete()

            active_reservations = Reservation.objects.filter(
                reservation_date__gte=today,
                status='booked'
            ).order_by('reservation_date', 'reservation_time')

            inactive_reservations = Reservation.objects.filter(
                status='unbooked'
            ).order_by('reservation_date', 'reservation_time')

            inactive_reservations.delete()

            return Response({
                "active_reservations": ReservationSerializer(active_reservations, many=True).data,
                "inactive_reservations": ReservationSerializer(inactive_reservations, many=True).data,
                "message": "Expired reservations deleted and tables freed."
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        serializer = ReservationSerializer(data=request.data)
        if serializer.is_valid():
            table = serializer.validated_data['table']
            date = serializer.validated_data['reservation_date']
            time = serializer.validated_data['reservation_time']
            end_time = serializer.validated_data['reservation_end_time']

            is_booked = Reservation.objects.filter(
                table=table,
                reservation_date=date,
                reservation_time=time,
                reservation_end_time=end_time,
                status='booked'
            ).exists()

            if is_booked:
                return Response(
                    {'error': 'This table is already booked at the selected date and time.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            table.is_available = False
            table.save()

            serializer.save()
            return Response({'message': 'Booking submitted!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class QROrderView(APIView):
    def get(self, request):
        table_id = request.query_params.get('table_id')
        if not table_id:
            raise ValidationError("Table ID is required")

        table = get_object_or_404(Table, id=table_id)
        items = OrderItem.objects.all()
        serializer = OrderItemSerializer(items, many=True)

        return Response({
            "table_id": table.id,
            "menu": serializer.data
        }, status=status.HTTP_200_OK)

    def post(self, request):
        table_id = request.data.get('table_id')
        if not table_id:
            raise ValidationError("Table ID is required")

        table = get_object_or_404(Table, id=table_id)

        # Check if a pending order exists for the table
        order = Order.objects.filter(table=table, status="pending").first()
        if not order:
            order = Order.objects.create(table=table, status="pending")

        cart_items_data = request.data.get('cart_items', [])
        if not cart_items_data:
            raise ValidationError("Cart items are required")

        # Add items to the order
        for cart_item in cart_items_data:
            item_id = cart_item.get('item_id')
            quantity = cart_item.get('quantity', 1)
            item = get_object_or_404(OrderItem, id=item_id)
            OrderItem.objects.create(order=order, food=item.food, quantity=quantity)

        order_serializer = OrderSerializer(order)
        return Response(order_serializer.data, status=status.HTTP_201_CREATED)


class OrderAPIView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request):
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request):
        user = request.user
        cart_items = CartItem.objects.filter(user=user)
        
        if not cart_items.exists():
            return Response({'error': 'No items in cart'}, status=status.HTTP_400_BAD_REQUEST)
        
        total_price = sum(item.food.price * item.quantity for item in cart_items)

        existing_order = Order.objects.filter(user=user, status='Paid').first()
        if existing_order:
            return Response({'error': 'This order has already been paid.'}, status=status.HTTP_400_BAD_REQUEST)

        order_data = {
            'user': user,
            'total_price': total_price,
        }
        order = Order.objects.create(**order_data)
        
        for item in cart_items:
            order.items.create(food=item.food, quantity=item.quantity)
    
        cart_items.delete()

        return Response({'message': 'Order placed successfully', 'order_id': order.id}, status=status.HTTP_201_CREATED)

class OrderItemAPIView(APIView):
    def get(self, request):
        # Retrieve order items by order_id or all order items if no order_id is provided
        order_id = request.GET.get("order_id")
        if order_id:
            order_items = OrderItem.objects.filter(order_id=order_id)
        else:
            order_items = OrderItem.objects.all()

        # Serialize and return the order items
        serializer = OrderItemSerializer(order_items, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Create a new order item
        serializer = OrderItemSerializer(data=request.data)
        if serializer.is_valid():
            food_id = request.data.get("food")
            try:
                # Fetch food item by id
                food = Food.objects.get(id=food_id)
            except Food.DoesNotExist:
                return Response({"detail": "Food not found"}, status=status.HTTP_404_NOT_FOUND)

            quantity = request.data.get("quantity")
            if not quantity:
                return Response({"detail": "Quantity is required"}, status=status.HTTP_400_BAD_REQUEST)

            # Create and save the order item
            order_item = serializer.save(food=food, quantity=quantity)
            return Response(OrderItemSerializer(order_item).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        # Update an existing order item
        order_item = get_object_or_404(OrderItem, pk=pk)
        serializer = OrderItemSerializer(order_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        # Delete an existing order item
        order_item = get_object_or_404(OrderItem, pk=pk)
        order_item.delete()
        return Response({"detail": "Order item deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# Order Status API
class OrderStatusAPIView(APIView):
    def get(self, request, order_id):
        order = get_object_or_404(Order, pk=order_id)
        return Response({"order_status": order.status})

    def patch(self, request, order_id):
        order = get_object_or_404(Order, pk=order_id)
        order.status = request.data.get("status", order.status)
        order.save()
        return Response({"message": "Order status updated", "status": order.status})


# Order Detail API
class OrderDetailAPIView(APIView):
    def get(self, request, order_id):
        order = get_object_or_404(Order, pk=order_id)
        items = order.items.all()

        order_data = {
            "order_id": order.id,
            "restaurant_name": order.restaurant.name,
            "customer_name": order.customer_name,
            "status": order.status,
            "created_at": order.created_at.strftime('%Y-%m-%d %H:%M'),
            "items": [
                {
                    "Food_name": item.food.name,
                    "Quantity": item.quantity,
                    "Item_price": item.food.price,
                    "Total": item.quantity * item.food.price
                } for item in items
            ]
        }

        return Response(order_data, status=status.HTTP_200_OK)

# Order Confirmation API
class OrderConfirmationView(APIView):
    def post(self, request, order_id):
        order = get_object_or_404(Order, pk=order_id)

        if order.status != 'Completed':
            order.status = 'Confirmed'
            order.save()

            return Response(
                {"message": "Order has been confirmed", "order_id": order.id, "status": order.status},
                status=status.HTTP_200_OK
            )

        return Response(
            {"error": "Order has already been completed."},
            status=status.HTTP_400_BAD_REQUEST
        )


# Payment API
class PaymentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        payments = Payment.objects.filter(user=request.user).all()
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        data = request.data
        items = data.get('order', [])
        amount = data.get('amount')
        customer_name=data.get("customer_name")
        customer_contact=data.get("customer_contact")
        payment_method = data.get('payment_method')
        restaurant_id = data.get('restaurant_id')

        print("user 1",request.user)

        if any(field in [None, ''] for field in [items, amount, payment_method, restaurant_id,customer_name]):
            return Response(
                {"success": False, "error": "Missing required payment information."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            restaurant = Restaurant.objects.get(id=restaurant_id)
        except Restaurant.DoesNotExist:
            return Response(
                {"success": False, "error": "Restaurant not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if payment_method not in ['Cash', 'Credit Card', 'UPI', 'Wallet']:
            return Response(
                {"success": False, "error": "Invalid payment method."},
                status=status.HTTP_400_BAD_REQUEST
            )
        

        try:
            print("bc ky achal rah atahi")
            order = Order.objects.create(
                user=request.user,
                restaurant=restaurant,
                customer_name=customer_name,
                customer_contact=customer_contact,
            )
            print("order",order)

            for item in items:
                food_id = item.get('id')
                quantity = item.get('quantity')

                food = Food.objects.get(id=food_id)
                if not food:
                    return Response({"success": False, "error": f"Food item with id {food_id} not found."},status=status.HTTP_404_NOT_FOUND)

                OrderItem.objects.create(order=order,food=food,quantity=quantity)

            existing_payment = Payment.objects.filter(user=request.user, order=order, is_paid=True).first()
            if existing_payment:
                CartItem.objects.filter(user=request.user, order=order, checked_out=False).update(checked_out=True)
                return Response({"success": True, "message": "Payment already made."}, status=status.HTTP_400_BAD_REQUEST)

            print("exit payemtn",existing_payment)
            payment = Payment.objects.create(
                user=request.user,
                order=order,
                amount=amount,
                payment_method=payment_method,
                is_paid=True
            )
            print("user 2",request.user)
            items_to_checkout = CartItem.objects.filter(user=request.user, checked_out=False)
            # items_to_checkout=CartItem.objects.filter(user=request.user, checked_out=False).update(checked_out=True)
            items_to_checkout.update(checked_out=True)
            items_to_checkout.delete()

            return Response(
                {
                    "success": True,
                    "order_id": order.id,
                    "payment_id": payment.id,
                    "is_paid": True,
                    "message": "Order and payment processed successfully."
                },
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            print("what the hell")
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



# Receipt API
class GenerateReceiptAPIView(APIView):
    def get(self, request, order_id):
        order = get_object_or_404(Order, pk=order_id)
        items = order.items.all()

        # Ensure the receipts directory exists
        receipt_dir = os.path.join(settings.BASE_DIR, 'uploads', 'receipts')
        os.makedirs(receipt_dir, exist_ok=True)

        # Path to save the PDF
        file_path = os.path.join(receipt_dir, f'order_{order.id}.pdf')

        # Create a PDF using ReportLab
        c = canvas.Canvas(file_path, pagesize=letter)
        width, height = letter

        # Title
        c.setFont("Helvetica-Bold", 16)
        c.drawString(200, height - 40, f"Receipt for Order #{order.id}")

        # Restaurant and Customer Info
        c.setFont("Helvetica", 12)
        c.drawString(50, height - 80, f"Restaurant: {order.restaurant.name}")
        c.drawString(50, height - 100, f"Customer: {order.customer_name}")
        c.drawString(50, height - 120, f"Date: {order.created_at.strftime('%Y-%m-%d %H:%M')}")

        # Items List Header
        c.setFont("Helvetica-Bold", 10)
        c.drawString(50, height - 150, "Item Name")
        c.drawString(200, height - 150, "Quantity")
        c.drawString(300, height - 150, "Unit Price")
        c.drawString(400, height - 150, "Subtotal")
        # Items List
        c.setFont("Helvetica", 10)
        y_position = height - 170
        total = 0

        for item in items:
            # Truncate long item names
            max_length = 30
            item_name = item.food.name
            if len(item_name) > max_length:
                item_name = item_name[:max_length - 3] + "..."

            subtotal = item.quantity * item.food.price
            c.drawString(50, y_position, item_name)
            c.drawString(200, y_position, str(item.quantity))
            c.drawString(300, y_position, f"₹{item.food.price:.2f}")
            c.drawString(400, y_position, f"₹{subtotal:.2f}")
            y_position -= 20
            total += subtotal

        # Total
        c.setFont("Helvetica-Bold", 12)
        c.drawString(350, y_position - 20, f"Total: ₹{total:.2f}")
        y_position -= 60

        # Greeting / Thank you message
        c.setFont("Helvetica-Oblique", 11)
        c.drawCentredString(width / 2, y_position, "❤️ Thank you for dining with us! We hope to see you again soon. ❤️")
        c.drawCentredString(width / 2, y_position - 20, "With love, your favorite restaurant 💕")

        # Save the PDF
        c.save()

        # Serve the PDF
        try:
            return FileResponse(open(file_path, "rb"), content_type="application/pdf")
        except FileNotFoundError:
            return Response("Receipt file could not be generated.", status=500)

    def post(self, request, order_id):
        order = get_object_or_404(Order, pk=order_id)
        # PDF file path
        pdf_file_path = os.path.join(settings.MEDIA_ROOT, f"receipts/order_{order_id}.pdf")

        # Check if the receipt already exists
        if Receipt.objects.filter(order=order).exists():
            receipt = Receipt.objects.get(order=order)
            return FileResponse(open(receipt.pdf_file.path, "rb"), content_type="application/pdf")

        try:
            # Generate the receipt PDF
            self.get(request, order_id)

            # Create a Receipt entry in the database
            receipt = Receipt.objects.create(order=order, pdf_file=f"receipts/order_{order_id}.pdf")
            
            # Return the newly generated receipt as a response
            return FileResponse(open(pdf_file_path, "rb"), content_type="application/pdf")

        except Exception as e:
            return Response({"error": str(e)}, status=500)


# Review API
class ReviewAPIView(APIView):
    def get(self, request):
        reviews = Review.objects.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Review complete successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# For QR code 
class MenuByTableAPIView(APIView):
    def get(self, request):
        table_number = request.GET.get("table_number")
        try:
            table = Table.objects.get(table_number=table_number)
            restaurant = table.restaurant
            menus = Menu.objects.filter(restaurant=restaurant, is_active=True)
            serializer = MenuSerializer(menus, many=True)
            return Response({"table_id": table.id, "restaurant_name": restaurant.name, "menus": serializer.data})
        except Table.DoesNotExist:
            return Response({"error": "Invalid table number"}, status=status.HTTP_400_BAD_REQUEST)
        

class CreateOrderAPIView(APIView):
    def post(self, request):
        table_id = request.data.get("table_id")
        cart_items = request.data.get("cart_items")  # List of {food_id, quantity}
        customer_name = request.data.get("customer_name")
        customer_contact = request.data.get("customer_contact")

        if not table_id or not cart_items:
            return Response({"error": "Missing table or cart information."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            table = Table.objects.get(id=table_id)
            restaurant = table.restaurant
            user = request.user if request.user.is_authenticated else None

            order = Order.objects.create(
                restaurant=restaurant,
                user=user,
                table=table,
                customer_name=customer_name,
                customer_contact=customer_contact,
            )

            for item in cart_items:
                food = Food.objects.get(id=item['food_id'])
                OrderItem.objects.create(order=order, food=food, quantity=item['quantity'])

            return Response({"message": "Order placed successfully!", "order_id": order.id}, status=status.HTTP_201_CREATED)

        except Table.DoesNotExist:
            return Response({"error": "Invalid table id."}, status=status.HTTP_400_BAD_REQUEST)
        except Food.DoesNotExist:
            return Response({"error": "Invalid food item in cart."}, status=status.HTTP_400_BAD_REQUEST)

class UpdateOrderStatusAPIView(APIView):
    def post(self, request, order_id):
        order = Order.objects.get(id=order_id)
        new_status = request.data.get("status")

        if new_status not in ['Pending', 'Preparing', 'Completed', 'Cancelled']:
            return Response({"error": "Invalid status."}, status=status.HTTP_400_BAD_REQUEST)

        order.status = new_status
        order.save()

        return Response({"message": f"Order #{order.id} status updated to {new_status}."}, status=status.HTTP_200_OK)

class ManualOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            orders = Order.objects.all()
            serializer = OrderSerializer(orders, many=True)
            return Response(serializer.data)
        except Order.DoesNotExist:
            return Response({"error": "Non order yet"}, status=status.HTTP_400_BAD_REQUEST)


    def post(self, request):
        data = request.data
        table_number = data.get('table_number')
        customer_name = data.get('customer_name')
        customer_contact = data.get('customer_contact')
        food_items = data.get('food_items')

        if not table_number or not food_items:
            return Response({"error": "Table number and food items are required."}, status=400)

        table = get_object_or_404(Table, table_number=table_number)

        order = Order.objects.create(
            user=request.user,
            table=table,
            restaurant=table.restaurant,
            customer_name=customer_name,
            customer_contact=customer_contact,
            status='Pending'
        )

        total = 0
        for item in food_items:
            food = get_object_or_404(Food, id=item['food_id'])
            quantity = item.get('quantity', 1)
            OrderItem.objects.create(order=order, food=food, quantity=quantity)
            total += food.price * quantity

        # ✅ Step to generate receipt PDF
        try:
            # Generate receipt PDF (you must have your generate_receipt_pdf function ready)
            generate_receipt_pdf(order)

            # Correct filename: add "manual_order_" prefix
            filename = f"manual_order_{order.id}.pdf"
            pdf_file_path = os.path.join(settings.MEDIA_ROOT,"uploads", "receipts", filename)

            # Save to model properly
            if os.path.exists(pdf_file_path):
                with open(pdf_file_path, "rb") as pdf:
                    receipt = Receipt(order=order)
                    receipt.pdf_file.save(filename, File(pdf))  # Proper file save
                    receipt.save()

        except Exception as e:
            return Response({"error": f"Order saved, but receipt failed: {str(e)}"}, status=500)

        return Response({
            "message": "Order and receipt generated successfully.",
            "order_id": order.id,
            "total_amount": float(total),
            "currency": "₹",
            "receipt_url": f"{settings.MEDIA_URL}receipts/{filename}"
        }, status=status.HTTP_201_CREATED)
