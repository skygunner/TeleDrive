from django.db import models

from simple_history.models import HistoricalRecords
from utils.models import BaseModelMixin


class User(BaseModelMixin):
    history = HistoricalRecords(table_name="historical_users", custom_model_name="HistoricalUser", app="auth")

    id = models.BigIntegerField(primary_key=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255, null=True, blank=True)
    username = models.CharField(max_length=255, null=True, blank=True, db_index=True)

    class Meta:
        db_table = "users"

    @property
    def is_anonymous(self):
        return False

    @property
    def is_authenticated(self):
        return True

    @classmethod
    def find_by_id(self, id: str):
        return self.objects.filter(id=id).first()

    @classmethod
    def create(self, id: int, first_name: str, last_name: str, username: str):
        user = User(id=id, first_name=first_name, last_name=last_name, username=username)
        user.save()
        return user

    def update(self, first_name: str, last_name: str, username: str):
        self.first_name = first_name
        self.last_name = last_name
        self.username = username
        self.save()


class InvalidToken(BaseModelMixin):
    REASON_SIGN_OUT = "SignOut"
    REASONS = ((REASON_SIGN_OUT, REASON_SIGN_OUT),)

    token_id = models.CharField(primary_key=True, max_length=255)
    user = models.ForeignKey(to=User, to_field="id", db_column="user_id", on_delete=models.CASCADE)
    reason = models.CharField(max_length=255, choices=REASONS)
    expire_at = models.DateTimeField()

    class Meta:
        db_table = "invalid_tokens"

    @classmethod
    def find_by_token_id(self, token_id: str):
        self.objects.filter(token_id=token_id).first()

    @classmethod
    def create(self, token_id: str, user: User, reason: str, expire_at: any):
        invalid_token = InvalidToken(token_id=token_id, user=user, reason=reason, expire_at=expire_at)
        invalid_token.save()
        return invalid_token
