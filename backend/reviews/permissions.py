import os
from rest_framework.permissions import BasePermission


class IsAdminApiKey(BasePermission):
    message = 'Admin authentication failed.'

    def has_permission(self, request, view):
        expected = os.getenv('ADMIN_API_KEY')
        if not expected:
            return False
        provided = request.headers.get('X-Admin-Key') or request.META.get('HTTP_X_ADMIN_KEY')
        return provided == expected


