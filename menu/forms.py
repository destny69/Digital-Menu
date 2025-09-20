from django import forms
from django.conf import settings
from .models import Table

class LanguageTableForm(forms.Form):
    language = forms.ChoiceField(choices=settings.LANGUAGES, label="Select Language")
    table = forms.ModelChoiceField(queryset=Table.objects.all(), label="Select Table")
