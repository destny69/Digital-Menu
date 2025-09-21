from django import forms
from .models import Table

class LanguageTableForm(forms.Form):
    language = forms.ChoiceField(
        choices=[("en", "English"), ("ja", "日本語"), ("ne", "नेपाली")],
        required=True,
        label="Language"
    )
    table = forms.ModelChoiceField(
        queryset=Table.objects.filter(is_occupied=False),
        required=True,
        label="Table"
    )
