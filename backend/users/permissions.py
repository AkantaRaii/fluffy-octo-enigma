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
class IsSelfOrReadOnly(permissions.BasePermission):
    """
    - Normal user can only read their own data.
    - Can only update allowed fields (first_name, last_name, phone_number).
    - Can set department only on create.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return obj == request.user  # can only read self
        return obj == request.user
    
class IsAdminOrAnalyzerOrSelf(BasePermission):
    """
    - SAFE methods: any authenticated user can read
    - ADMIN/ANALYZER: full write access
    - USER: can only write to their own record
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow safe methods
        if request.method in SAFE_METHODS:
            return True

        # Admin/Analyzer can write to anyone
        if request.user.role in ["ADMIN", "ANALYZER"]:
            return True

        # Self can write to their own object only
        return obj == request.user