from django.urls import path

from tdlib.views import (
    create_folder,
    download,
    get_file_share_token,
    get_file_token_from_shared_token,
    list_files,
    list_folders,
    rud_folder,
    ud_file,
    upload,
)

urlpatterns = [
    path("/upload", upload, name="upload"),
    path("/download", download, name="download"),
    path("/files", list_files, name="list_files"),
    path("/folders", list_folders, name="list_folders"),
    path("/folder", create_folder, name="create_folder"),
    path("/file/<int:file_id>", ud_file, name="ud_file"),
    path("/folder/<int:folder_id>", rud_folder, name="rud_folder"),
    path("/file/<int:file_id>/share", get_file_share_token, name="get_file_share_token"),
    path("/file/share/download/token", get_file_token_from_shared_token, name="get_file_token_from_shared_token"),
]
