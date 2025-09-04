from rest_framework.permissions import SAFE_METHODS
from rest_framework.permissions import BasePermission
class ExamPermission(BasePermission):
    def has_permission(self, request, view):
        # Admin: full access
        if request.user.role == "ADMIN":
            return True

        # User: can always list exams
        if request.method == "GET":
            return True

        return False

    def has_object_permission(self, request, view, obj):
        user = request.user

        if user.role == "ADMIN":    
            return True

        if request.method in SAFE_METHODS and user.role == "USER":
            # Allow GET only if invited
            return obj.invitations.filter(user=user).exists()

        return False
