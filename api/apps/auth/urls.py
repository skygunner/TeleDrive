from django.urls import path

from auth.views import refresh_access_token, sign_in, sign_out

urlpatterns = [
    path("signIn/", sign_in, name="sign_in"),
    path("token/refresh/", refresh_access_token, name="refresh_access_token"),
    path("signOut/", sign_out, name="sign_out"),
]
