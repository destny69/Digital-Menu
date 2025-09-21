from django.urls import path
from . import views

app_name = 'menu'

urlpatterns = [
    path('', views.select_language_table, name='select_language_table'),
    path('menu/', views.menu_view, name='menu'),
    path('cart/', views.cart_view, name='cart'),
    path('add/<int:item_id>/', views.add_to_cart, name='add_to_cart'),
    path('remove/<int:cart_id>/', views.remove_cart_item, name='remove_cart_item'),
    path('checkout/', views.checkout, name='checkout'),
    path('add_ajax/<int:item_id>/', views.add_to_cart_ajax, name='add_to_cart_ajax'),
    path('update/<int:cart_id>/', views.update_cart_item, name='update_cart_item'),

]


