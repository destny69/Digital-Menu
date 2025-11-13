from django import forms
from .models import Table

class LanguageTableForm(forms.Form):
    language = forms.ChoiceField(
        choices=[("", "Choose Language"), ("en", "English"), ("ja", "日本語"), ("ne", "नेपाली")],
        required=True,
        label="Language",
        widget=forms.Select(attrs={
            'class': 'form-select',
            'style': 'padding:10px; border-radius:8px; border:1px solid #ccc; width:100%; font-size:16px; margin-bottom:15px;'
        })
    )

    table = forms.ModelChoiceField(
        queryset=Table.objects.filter(is_occupied=False),
        required=True,
        label="Table",
        empty_label="Select Table",
        widget=forms.Select(attrs={
            'class': 'form-select',
            'style': 'padding:10px; border-radius:8px; border:1px solid #ccc; width:100%; font-size:16px; margin-bottom:15px;'
        })
    )
