from django.db import models
from django.core.validators import MinValueValidator
from django.conf import settings
from django.utils import timezone
from datetime import datetime, timedelta
from django.utils.timezone import localtime, make_aware


class Restaurant(models.Model):
    name = models.CharField(max_length=255, unique=True,null=True, blank=True)
    location = models.TextField(default="Write Location.",null=True, blank=True)
    contact_number = models.CharField(max_length=15,null=True, blank=True)
    opening_hours = models.CharField(max_length=100, default="9 AM - 11 PM",null=True)
    image = models.ImageField(upload_to="restaurant_images/", null=True, blank=True)
    qr_code = models.ImageField(upload_to="qrcodes/", blank=True, null=True)


    def __str__(self):
        return f"{self.name}"



class Menu(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name="menus")
    name = models.CharField(max_length=255,null=True,blank=True)  # Example: Breakfast, Lunch, Dinner
    category = models.CharField(max_length=255, null=True, blank=True)  # Example: Vegetarian, Non-Vegetarian
    description = models.TextField(null=True,blank=True)
    image = models.ImageField(upload_to="menu_images/", null=True, blank=True)
    is_active = models.BooleanField(default=True)  # Allows enabling/disabling menus

    def __str__(self):
        return f"{self.name} Menu - {self.restaurant.name}"

class Food(models.Model):
    menus = models.ManyToManyField(Menu, related_name="foods")
    name = models.CharField(max_length=255,null=True,blank=True)
    description = models.TextField(null=True,blank=True)
    ingredients = models.TextField(null=True,blank=True)
    category = models.CharField(max_length=255, null=True, blank=True)  # Example: Appetizer, Main Course, Dessert
    is_vegetarian = models.BooleanField(default=False)
    image = models.ImageField(upload_to="food_images/", null=True, blank=True)
    price = models.DecimalField(max_digits=6, decimal_places=2, validators=[MinValueValidator(0)],null=True, blank=True)
    stock_quantity = models.PositiveIntegerField(default=0)
    cuisine_type=models.CharField(max_length=150,null=True,blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0, validators=[MinValueValidator(0)])
    
    def __str__(self):
        menu_names = ", ".join([menu.name for menu in self.menus.all()])
        return f"{self.name} ({menu_names})"
    
class CartItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart_items')
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    checked_out = models.BooleanField(default=False)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'food')

    def __str__(self):
        return f"{self.quantity} x {self.food.name} x {self.user.username}"
    
    
class Table(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='tables')
    table_number = models.IntegerField()
    seats = models.PositiveIntegerField()
    is_available=models.BooleanField(default=True)
    qr_code = models.ImageField(upload_to="table-qrcodes/", blank=True, null=True)

    def __str__(self):
        return f"Table {self.table_number} - {self.restaurant.name}"
    
class QRCode(models.Model):
    restaurant=models.ForeignKey(Restaurant,on_delete=models.CASCADE)
    type=models.CharField(max_length=200,null=True,blank=True)
    qr_code=models.ImageField(upload_to="qrcode_images/", null=True, blank=True)
    details=models.JSONField()

    def __str__(self):
        return f"{self.type} {self.details}"

class Reservation(models.Model):
    table = models.ForeignKey(Table, on_delete=models.CASCADE, related_name='reservations')
    customer_name = models.CharField(max_length=100,null=True,blank=True)
    customer_email = models.EmailField()
    reservation_date = models.DateField()
    reservation_time = models.TimeField()
    reservation_end_time=models.TimeField()
    number_of_people = models.PositiveIntegerField()
    is_paid = models.BooleanField(default=False)
    status = models.CharField(max_length=20, default='booked')

    def __str__(self):
        return f"Reservation for {self.customer_name} on {self.reservation_date} at {self.table} Paid {self.is_paid} Status {self.status}"

    @property
    def is_expired(self):
        now = localtime()
        reservation_datetime = make_aware(datetime.combine(self.reservation_date, self.reservation_end_time))
        return now > reservation_datetime and not self.is_paid

    @property
    def time_left(self):
        now = localtime()
        end_datetime = make_aware(datetime.combine(self.reservation_date, self.reservation_end_time))
        remaining = end_datetime - now
        if remaining.total_seconds() < 0:
            return "Expired"
        return str(remaining)


class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Preparing', 'Preparing'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE,null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    table = models.ForeignKey(Table, on_delete=models.SET_NULL, null=True, blank=True)
    customer_name = models.CharField(max_length=255, null=True, blank=True) 
    customer_contact = models.CharField(max_length=15, null=True, blank=True)
    food_items = models.ManyToManyField(Food, through='OrderItem', related_name="orders")
    delivery_address = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        food_names = ", ".join([food.name for food in self.food_items.all()])
        return f"Order #{self.id} for {self.user.username}, food items: {food_names}"

    
    
class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    food = models.ForeignKey('Food', on_delete=models.CASCADE,related_name="order_items")
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])

    def __str__(self):
        return f"{self.quantity} x {self.food.name} (Order {self.order.id})"

    @property
    def total_price(self):
        # Dynamic property to calculate total price for item
        return self.food.price * self.quantity
    
class Payment(models.Model):
    PAYMENT_METHOD=[
        ('Cash', 'Cash'),
        ('Credit Card', 'Credit Card'),
        ('UPI', 'UPI'),
        ('Wallet', 'Wallet')
    ]
    user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='user_payment',null=True,blank=True)
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="payment")
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHOD,default='Cash')
    currency = models.CharField(max_length=10,null=True,blank=True)
    is_paid = models.BooleanField(default=False)
    stripe_id = models.CharField(max_length=100, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Payment for Order {self.order.id} by {self.user} - {'Paid' if self.is_paid else 'Pending'} {self.amount}"

class Receipt(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="receipt")
    pdf_file = models.FileField(upload_to="receipts/",max_length=500, blank=True, null=True)

    def __str__(self):
        return f"Receipt for Order {self.order.id}"

class Review(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name="reviews")
    rating = models.IntegerField(validators=[MinValueValidator(1)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review for {self.restaurant.name} - {self.rating}/5"
