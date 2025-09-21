from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from menu.models import Order
from .serializers import OrderSerializer


class OrderListView(generics.ListAPIView):
    queryset = Order.objects.all().order_by("-created_at")
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]


class OrderDetailView(generics.RetrieveUpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        order = self.get_object()
        status_value = request.data.get("status")

        if status_value not in dict(Order.STATUS_CHOICES):
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        order.status = status_value
        order.save()
        return Response(OrderSerializer(order).data)
