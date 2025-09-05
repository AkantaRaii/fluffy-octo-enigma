from rest_framework.permissions import BasePermission, SAFE_METHODS

class CanEditOwnResponseUntilSubmitted(BasePermission):
    """
    - Users: can edit their own responses only if exam attempt is not submitted
    - Admin/Analyzer: full access
    """

    def has_object_permission(self, request, view, obj):
        user = request.user

        # Admin / Analyzer -> full access
        if user.role in ["ADMIN", "ANALYZER"]:
            return True

        # User -> only their own response
        if obj.attempt.user != user:
            return False

        # After submission -> read-only
        if obj.attempt.is_submitted:
            return request.method in SAFE_METHODS

        # Before submission -> full access
        return True


class IsAdminOrAnalyzerOrSelfAttempt(BasePermission):
    """
    Admin/Analyzer: full access
    User: only their own attempts
    After submission: read-only for User
    """

    def has_object_permission(self, request, view, obj):
        user = request.user

        # Admin/Analyzer: full access
        if user.role in ["ADMIN", "ANALYZER"]:
            return True

        # Users: only their own attempts
        if obj.user != user:
            return False

        # After submission, read-only
        if obj.is_submitted:
            return request.method in SAFE_METHODS

        # Before submission, full access
        return True
