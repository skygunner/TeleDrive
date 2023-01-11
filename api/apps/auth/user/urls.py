from django.urls import path

from auth.user.views import get_user

urlpatterns = [
    path("", get_user, name="get_user"),
]
