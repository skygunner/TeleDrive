from django.urls import path

from tdlib.views import create_folder, download, ud_file, ud_folder, upload

urlpatterns = [
    path("upload", upload, name="upload"),
    path("download/<int:file_id>", download, name="download"),
    path("folder", create_folder, name="create_folder"),
    path("file/<int:file_id>", ud_file, name="ud_file"),
    path("folder/<int:folder_id>", ud_folder, name="ud_folder"),
]
