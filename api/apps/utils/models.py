import uuid

from django.db import models
from django.db.models import manager, query
from django.utils import timezone


def make_uuid() -> str:
    return str(uuid.uuid4())


class BaseQuerySet(query.QuerySet):
    def update(self, *args, **kwargs):
        kwargs["updated_at"] = timezone.now()
        return super().update(*args, **kwargs)


class BaseManager(manager.BaseManager.from_queryset(BaseQuerySet)):
    def get_queryset(self):
        return super().get_queryset().filter(deleted_at__isnull=True)


class BaseModelMixin(models.Model):
    objects = BaseManager()

    created_at = models.DateTimeField(null=False, blank=False, auto_now_add=True)
    updated_at = models.DateTimeField(null=False, blank=False, auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True, db_index=True)

    class Meta:
        abstract = True

    def delete(self, *args, **kwargs):
        self.deleted_at = timezone.now()
        self.save()

    def save(self, *args, **kwargs):
        self.updated_at = timezone.now()
        return super().save(*args, **kwargs)
