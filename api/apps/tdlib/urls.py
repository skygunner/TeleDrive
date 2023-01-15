from django.urls import path

from tdlib.views import download, upload

urlpatterns = [
    path("upload/", upload, name="upload"),
    path("download/<int:file_id>/", download, name="download"),
]
