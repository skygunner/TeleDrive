# Generated by Django 4.0.5 on 2023-03-22 13:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("tdlib", "0005_alter_file_and_create_short_url"),
    ]

    operations = [
        migrations.AlterModelTable(
            name="shorturl",
            table="short_urls",
        ),
    ]