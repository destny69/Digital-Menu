from django.contrib import admin
from parler.admin import TranslatableAdmin
from .models import Table, Category, MenuItem, Order


@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
    list_display = ("number", "is_occupied")
    list_filter = ("is_occupied",)
    search_fields = ("number",)


@admin.register(Category)
class CategoryAdmin(TranslatableAdmin):
    list_display = ("name",)
    search_fields = ("translations__name",)


@admin.register(MenuItem)
class MenuItemAdmin(TranslatableAdmin):
    list_display = ("name", "price", "category")
    list_filter = ("category",)
    search_fields = ("translations__name", "translations__description")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "table", "total_price", "created_at")
    list_filter = ("created_at", "table")
    search_fields = ("id",)
    filter_horizontal = ("items",)
