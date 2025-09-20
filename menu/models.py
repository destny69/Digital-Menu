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
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.safe_translation_getter("name", any_language=True)


class Order(models.Model):
    items = models.ManyToManyField(MenuItem)
    total_price = models.DecimalField(max_digits=8, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    table = models.ForeignKey(Table, on_delete=models.CASCADE)

    def __str__(self):
        return f"Order {self.id} - ${self.total_price}"
