from django.db import models
from parler.models import TranslatableModel, TranslatedFields


class Table(models.Model):
    number = models.IntegerField(unique=True)
    is_occupied = models.BooleanField(default=False)

    def __str__(self):
        return f"Table {self.number} - {'Occupied' if self.is_occupied else 'Available'}"


class Category(TranslatableModel):
    translations = TranslatedFields(
        name=models.CharField(max_length=100)
    )

    def __str__(self):
        return self.safe_translation_getter("name", any_language=True)


class MenuItem(TranslatableModel):
    translations = TranslatedFields(
        name=models.CharField(max_length=100),
        description=models.TextField(),
    )
    price = models.DecimalField(max_digits=6, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='items')


    def __str__(self):
        return self.safe_translation_getter("name", any_language=True)


# New model for multiple images
class MenuItemImage(models.Model):
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to="menu_items/")  # folder inside MEDIA_ROOT
    alt_text = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.menu_item} Image"
    



# Temporary cart item
class CartItem(models.Model):
    session_key = models.CharField(max_length=40)  # track by user session (for guest users)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    def subtotal(self):
        return self.menu_item.price * self.quantity





# Final Order
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('preparing', 'Preparing'),
        ('served', 'Served'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    table = models.ForeignKey(Table, on_delete=models.CASCADE, related_name="orders")
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # Optional: user (if needed for login)
    # user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"Order #{self.id} - Table {self.table.number} - {self.status}"
    
    def save(self, *args, **kwargs):
        # Get old instance to compare status changes
        old_status = None
        if self.pk:
            old_status = Order.objects.filter(pk=self.pk).values_list("status", flat=True).first()

        super().save(*args, **kwargs)  # Save first so `self.table` is attached

        # Mark table as occupied if order is newly created
        if not old_status and self.table:
            self.table.is_occupied = True
            self.table.save(update_fields=["is_occupied"])

        # If order was completed/cancelled and status changed -> free table
        if old_status and old_status != self.status:
            if self.status in ["completed", "cancelled"] and self.table:
                self.table.is_occupied = False
                self.table.save(update_fields=["is_occupied"])


# Items inside order
class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def subtotal(self):
        return self.menu_item.price * self.quantity
