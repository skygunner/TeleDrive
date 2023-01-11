from django.urls import include, path

urlpatterns = [
    path("auth/", include("auth.urls"), name="auth"),
    path("user/", include("auth.user.urls"), name="user"),
]
