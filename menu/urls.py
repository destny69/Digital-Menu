from django.urls import path
from . import views

urlpatterns = [
    path('', views.select_language_table, name='select_language_table'),
    path('menu/', views.menu_view, name='menu'),
]
