# Generated by Django 4.0.5 on 2023-01-11 13:32

import django.db.models.deletion
from django.db import migrations, models

import simple_history.models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="User",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("deleted_at", models.DateTimeField(blank=True, db_index=True, default=None, null=True)),
                ("first_name", models.CharField(max_length=255)),
                ("last_name", models.CharField(max_length=255)),
            ],
            options={
                "db_table": "users",
            },
        ),
        migrations.CreateModel(
            name="InvalidToken",
            fields=[
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("deleted_at", models.DateTimeField(blank=True, db_index=True, default=None, null=True)),
                ("token_id", models.CharField(max_length=255, primary_key=True, serialize=False)),
                ("reason", models.CharField(choices=[("SignOut", "SignOut")], max_length=255)),
                ("expire_at", models.DateTimeField()),
                (
                    "user",
                    models.ForeignKey(db_column="user_id", on_delete=django.db.models.deletion.CASCADE, to="auth.user"),
                ),
            ],
            options={
                "db_table": "invalid_tokens",
            },
        ),
        migrations.CreateModel(
            name="HistoricalUser",
            fields=[
                ("id", models.BigIntegerField(auto_created=True, blank=True, db_index=True, verbose_name="ID")),
                ("created_at", models.DateTimeField(blank=True, editable=False)),
                ("updated_at", models.DateTimeField(blank=True, editable=False)),
                ("deleted_at", models.DateTimeField(blank=True, db_index=True, default=None, null=True)),
                ("first_name", models.CharField(max_length=255)),
                ("last_name", models.CharField(max_length=255)),
                ("history_id", models.AutoField(primary_key=True, serialize=False)),
                ("history_date", models.DateTimeField(db_index=True)),
                ("history_change_reason", models.CharField(max_length=100, null=True)),
                (
                    "history_type",
                    models.CharField(choices=[("+", "Created"), ("~", "Changed"), ("-", "Deleted")], max_length=1),
                ),
                (
                    "history_user",
                    models.ForeignKey(
                        null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="+", to="auth.user"
                    ),
                ),
            ],
            options={
                "verbose_name": "historical user",
                "verbose_name_plural": "historical users",
                "db_table": "historical_users",
                "ordering": ("-history_date", "-history_id"),
                "get_latest_by": ("history_date", "history_id"),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
    ]
