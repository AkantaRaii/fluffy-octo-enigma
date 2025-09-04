from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework import permissions

class IsAdminOrSelf(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Admin: full access
        if request.user.is_staff or request.user.role == "ADMIN":
            return True
        # Normal user: only themselves
        return obj.id == request.user.id

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "ADMIN"


class IsAnalyzer(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "ANALYZER"


class IsUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "USER"


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.role == "ADMIN"
class IsAdminOrAnalyzer(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role in ["ADMIN", "ANALYZER"]
        )

class IsAdminOrAnalyzerOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        # Allow safe methods for any authenticated user
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated
        
        # Allow write methods only for Admin or Analyzer
        return (
            request.user.is_authenticated and
            request.user.role in ["ADMIN", "ANALYZER"]
        )