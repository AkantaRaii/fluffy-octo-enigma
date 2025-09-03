from rest_framework import permissions

class IsAdminOrSelf(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Admin: full access
        if request.user.is_staff or request.user.role == "admin":
            return True
        # Normal user: only themselves
        return obj.id == request.user.id
