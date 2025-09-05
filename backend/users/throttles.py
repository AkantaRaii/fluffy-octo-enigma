from rest_framework.throttling import SimpleRateThrottle

class IPBasedThrottle(SimpleRateThrottle):
    scope = None  # will be defined per view

    def get_cache_key(self, request, view):
        ip = self.get_ident(request)
        if not self.scope:
            return None
        return f"throttle_{self.scope}_{ip}"
