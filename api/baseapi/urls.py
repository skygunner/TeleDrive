from django.urls import include, path

from api.views import health

urlpatterns = [
    path("health", health, name="health"),
    path("v1/", include("api.v1.urls"), name="v1"),
    path("i18n/", include("django.conf.urls.i18n")),
]
