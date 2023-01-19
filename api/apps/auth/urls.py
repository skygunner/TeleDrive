from django.urls import path

from auth.views import sign_in, sign_out

urlpatterns = [
    path("signIn", sign_in, name="sign_in"),
    path("signOut", sign_out, name="sign_out"),
]
