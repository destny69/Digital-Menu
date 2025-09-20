from django.shortcuts import render, redirect
from django.utils import translation
from .models import MenuItem, Table
from .forms import LanguageTableForm

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

            return redirect('menu')
    else:
        form = LanguageTableForm()
    return render(request, 'menu/select_language_table.html', {'form': form})


def menu_view(request):
    lang_code = request.session.get('django_language', 'en')
    table = request.session.get('table')

    items = MenuItem.objects.all().translated(lang_code)

    return render(request, 'menu/index.html', {
        'table': table,
        'menu_items': items,
    })
