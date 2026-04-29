from rest_framework.permissions import BasePermission

class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        IS_TRUE = request.user and request.user.is_authenticated
        if IS_TRUE and request.user == obj.user:
            return True
        return False

# REFACTOR: IsOwner

