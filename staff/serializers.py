from rest_framework import serializers
from menu.models import Order, OrderItem, MenuItem, Table


class MenuItemSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = MenuItem
        fields = ["id", "name", "price"]

    def get_name(self, obj):
        # parler safe getter for translated name
        return obj.safe_translation_getter("name", any_language=True)


class OrderItemSerializer(serializers.ModelSerializer):
    menu_item = MenuItemSerializer()

    class Meta:
        model = OrderItem
        fields = ["id", "menu_item", "quantity"]


class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ["id", "number", "is_occupied"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    table = TableSerializer()

    class Meta:
        model = Order
        fields = ["id", "status", "created_at", "total_price", "table", "items"]
