from django.shortcuts import render, redirect
from django.utils import translation
from .models import MenuItem, Table
from .forms import LanguageTableForm

from django.shortcuts import render, redirect, get_object_or_404
from .models import  *
from django.db.models import F


def select_language_table(request):
    if request.method == 'POST':
        form = LanguageTableForm(request.POST)
        if form.is_valid():
            lang_code = form.cleaned_data['language']
            table = form.cleaned_data['table'].number

            # Save in session
            request.session['django_language'] = lang_code
            request.session['table'] = table

            # Activate immediately
            translation.activate(lang_code)
            request.LANGUAGE_CODE = lang_code

            return redirect('menu:menu')
    else:
        form = LanguageTableForm()
    return render(request, 'menu/select_language_table.html', {'form': form})


def menu_view(request):
    lang_code = request.session.get('django_language', 'en')
    table = request.session.get('table')
    print(lang_code, table)
    categories = Category.objects.prefetch_related('items').all()
    return render(request, 'menu/index.html', {
        'table': table,
        'categories': categories,
    })



def add_to_cart(request, item_id):
    menu_item = get_object_or_404(MenuItem, id=item_id)
    session_key = request.session.session_key or request.session.create()
    cart_item, created = CartItem.objects.get_or_create(
        session_key=session_key,
        menu_item=menu_item,
    )
    if not created:
        cart_item.quantity += 1
        cart_item.save()
    return redirect('menu:cart')


def cart_view(request):
    session_key = request.session.session_key
    cart_items = CartItem.objects.filter(session_key=session_key)
    total = sum([item.subtotal() for item in cart_items])
    return render(request, 'menu/cart.html', {'cart_items': cart_items, 'total': total})


def remove_cart_item(request, cart_id):
    cart_item = get_object_or_404(CartItem, id=cart_id)
    cart_item.delete()
    return redirect('menu:cart')


def checkout(request):
    session_key = request.session.session_key
    cart_items = CartItem.objects.filter(session_key=session_key)
    if not cart_items:
        return redirect('menu:menu')

    order = Order.objects.create(
        table=get_object_or_404(Table, number=request.session.get('table')),
        total_price=sum([item.subtotal() for item in cart_items])
    )
    for item in cart_items:
        OrderItem.objects.create(
            order=order,
            menu_item=item.menu_item,
            quantity=item.quantity
        )
    cart_items.delete()
    return render(request, 'menu/checkout.html', {'order': order})



from django.http import JsonResponse

def add_to_cart_ajax(request, item_id):
    menu_item = get_object_or_404(MenuItem, id=item_id)
    session_key = request.session.session_key or request.session.create()
    cart_item, created = CartItem.objects.get_or_create(
        session_key=session_key,
        menu_item=menu_item,
    )
    if not created:
        cart_item.quantity += 1
        cart_item.save()
    return JsonResponse({
        'success': True,
        'item_name': menu_item.name,
        'quantity': cart_item.quantity,
        'subtotal': float(cart_item.subtotal())
    })


def update_cart_item(request, cart_id):
    action = request.GET.get('action')
    cart_item = get_object_or_404(CartItem, id=cart_id)
    if action == 'increment':
        cart_item.quantity += 1
        cart_item.save()
    elif action == 'decrement' and cart_item.quantity > 1:
        cart_item.quantity -= 1
        cart_item.save()
    elif action == 'remove':
        cart_item.delete()
        return JsonResponse({'success': True, 'removed': True})
    return JsonResponse({
        'success': True,
        'quantity': cart_item.quantity,
        'subtotal': float(cart_item.subtotal())
    })
