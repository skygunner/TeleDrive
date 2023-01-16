# Generated by Django 4.0.5 on 2023-01-16 19:17

import django.db.models.deletion
from django.db import migrations, models

import simple_history.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("auth", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Folder",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("deleted_at", models.DateTimeField(blank=True, db_index=True, default=None, null=True)),
                ("folder_name", models.CharField(max_length=255)),
                (
                    "parent",
                    models.ForeignKey(
                        db_column="folder_id", on_delete=django.db.models.deletion.CASCADE, to="tdlib.folder"
                    ),
                ),
            ],
            options={
                "db_table": "folders",
            },
        ),
        migrations.CreateModel(
            name="HistoricalFolder",
            fields=[
                ("id", models.BigIntegerField(auto_created=True, blank=True, db_index=True, verbose_name="ID")),
                ("created_at", models.DateTimeField(blank=True, editable=False)),
                ("updated_at", models.DateTimeField(blank=True, editable=False)),
                ("deleted_at", models.DateTimeField(blank=True, db_index=True, default=None, null=True)),
                ("folder_name", models.CharField(max_length=255)),
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
                (
                    "parent",
                    models.ForeignKey(
                        blank=True,
                        db_column="folder_id",
                        db_constraint=False,
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="+",
                        to="tdlib.folder",
                    ),
                ),
            ],
            options={
                "verbose_name": "historical folder",
                "verbose_name_plural": "historical folders",
                "db_table": "historical_folders",
                "ordering": ("-history_date", "-history_id"),
                "get_latest_by": ("history_date", "history_id"),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name="HistoricalFile",
            fields=[
                ("id", models.BigIntegerField(auto_created=True, blank=True, db_index=True, verbose_name="ID")),
                ("created_at", models.DateTimeField(blank=True, editable=False)),
                ("updated_at", models.DateTimeField(blank=True, editable=False)),
                ("deleted_at", models.DateTimeField(blank=True, db_index=True, default=None, null=True)),
                ("file_id", models.BigIntegerField()),
                ("file_name", models.CharField(db_index=True, max_length=255)),
                ("file_size", models.BigIntegerField()),
                ("part_size", models.BigIntegerField()),
                ("total_parts", models.BigIntegerField()),
                ("last_uploaded_part", models.BigIntegerField(default=0)),
                ("md5_checksum", models.CharField(max_length=255)),
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
                (
                    "parent",
                    models.ForeignKey(
                        blank=True,
                        db_column="folder_id",
                        db_constraint=False,
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="+",
                        to="tdlib.folder",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        db_column="user_id",
                        db_constraint=False,
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="+",
                        to="auth.user",
                    ),
                ),
            ],
            options={
                "verbose_name": "historical file",
                "verbose_name_plural": "historical files",
                "db_table": "historical_files",
                "ordering": ("-history_date", "-history_id"),
                "get_latest_by": ("history_date", "history_id"),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name="File",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("deleted_at", models.DateTimeField(blank=True, db_index=True, default=None, null=True)),
                ("file_id", models.BigIntegerField()),
                ("file_name", models.CharField(db_index=True, max_length=255)),
                ("file_size", models.BigIntegerField()),
                ("part_size", models.BigIntegerField()),
                ("total_parts", models.BigIntegerField()),
                ("last_uploaded_part", models.BigIntegerField(default=0)),
                ("md5_checksum", models.CharField(max_length=255)),
                (
                    "parent",
                    models.ForeignKey(
                        blank=True,
                        db_column="folder_id",
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="tdlib.folder",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(db_column="user_id", on_delete=django.db.models.deletion.CASCADE, to="auth.user"),
                ),
            ],
            options={
                "db_table": "files",
                "unique_together": {("user", "file_id")},
                "index_together": {("user", "file_id")},
            },
        ),
    ]
