from rest_framework.metadata import BaseMetadata


class MinimalMetadata(BaseMetadata):
    def determine_metadata(self, request, view):
        return None
