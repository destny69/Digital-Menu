import csv
from django.core.management.base import BaseCommand
from menu.models import MenuItem, Category

class Command(BaseCommand):
    help = "Import menu items from CSV (with English, Japanese, and Nepali translations)"

    def add_arguments(self, parser):
        parser.add_argument("csv_file", type=str, help="Path to the CSV file")

    def handle(self, *args, **options):
        csv_file = options["csv_file"]

        with open(csv_file, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)

            for row in reader:
                # --- Handle Category ---
                category_en = row["category_en"]

                # Try to fetch by English name
                category_qs = Category.objects.translated("en", name=category_en)
                if category_qs.exists():
                    category = category_qs.first()
                else:
                    category = Category.objects.create()

                    # English
                    category.set_current_language("en")
                    category.name = row["category_en"]
                    category.save()

                    # Japanese
                    category.set_current_language("ja")
                    category.name = row["category_ja"]
                    category.save()

                    # Nepali
                    category.set_current_language("ne")
                    category.name = row["category_ne"]
                    category.save()

                # --- Handle MenuItem ---
                item = MenuItem.objects.create(
                    price=row["price"],
                    category=category,
                )

                # English
                item.set_current_language("en")
                item.name = row["name_en"]
                item.description = row["desc_en"]
                item.save()

                # Japanese
                item.set_current_language("ja")
                item.name = row["name_ja"]
                item.description = row["desc_ja"]
                item.save()

                # Nepali
                item.set_current_language("ne")
                item.name = row["name_ne"]
                item.description = row["desc_ne"]
                item.save()

                self.stdout.write(self.style.SUCCESS(f"Imported {row['name_en']}"))
