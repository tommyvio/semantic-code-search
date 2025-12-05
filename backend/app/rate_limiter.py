from collections import defaultdict
from datetime import datetime, timedelta
from typing import Dict, Tuple

class RateLimiter:
    """Simple in-memory rate limiter based on IP address"""

    def __init__(self):
        # Store: {ip_address: [(timestamp, action), ...]}
        self.requests: Dict[str, list] = defaultdict(list)

        # Limits per hour
        self.limits = {
            'upload': 10,    # 10 uploads per hour
            'search': 50,    # 50 searches per hour
        }

    def is_allowed(self, ip_address: str, action: str) -> Tuple[bool, str]:
        """
        Check if request is allowed based on rate limits
        Returns: (is_allowed: bool, message: str)
        """
        if action not in self.limits:
            return True, ""

        now = datetime.now()
        cutoff = now - timedelta(hours=1)

        # Clean old requests
        self.requests[ip_address] = [
            (ts, act) for ts, act in self.requests[ip_address]
            if ts > cutoff
        ]

        # Count requests for this action in the last hour
        action_count = sum(1 for ts, act in self.requests[ip_address] if act == action)

        limit = self.limits[action]

        if action_count >= limit:
            return False, f"Rate limit exceeded. Maximum {limit} {action}s per hour."

        # Record this request
        self.requests[ip_address].append((now, action))

        return True, ""

# Global rate limiter instance
rate_limiter = RateLimiter()
