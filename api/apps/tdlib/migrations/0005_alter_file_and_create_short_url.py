# Generated by Django 4.0.5 on 2023-03-08 13:10

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("auth", "0002_alter_deleted_at"),
        ("tdlib", "0004_alter_file_index"),
    ]

    operations = [
        migrations.AlterIndexTogether(
            name="file",
            index_together={("user", "file_id")},
        ),
        migrations.RemoveField(
            model_name="historicalfile",
            name="file_uuid",
        ),
        migrations.AlterField(
            model_name="file",
            name="file_name",
            field=models.CharField(db_index=True, max_length=255),
        ),
        migrations.AlterField(
            model_name="historicalfile",
            name="file_name",
            field=models.CharField(db_index=True, max_length=255),
        ),
        migrations.CreateModel(
            name="ShortURL",
            fields=[
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("deleted_at", models.DateTimeField(blank=True, db_index=True, null=True)),
                ("share_token", models.CharField(max_length=255, primary_key=True, serialize=False)),
                ("reason", models.CharField(choices=[("ShareFile", "ShareFile")], max_length=255)),
                ("expire_at", models.DateTimeField(blank=True, null=True)),
                (
                    "file",
                    models.ForeignKey(
                        blank=True,
                        db_column="file_id",
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="tdlib.file",
                    ),
                ),
                (
                    "folder",
                    models.ForeignKey(
                        blank=True,
                        db_column="folder_id",
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="tdlib.folder",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.RemoveField(
            model_name="file",
            name="file_uuid",
        ),
    ]
