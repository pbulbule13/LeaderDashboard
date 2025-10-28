"""
Email Adapters Package
Adapters for various email providers (Gmail API, IMAP/SMTP, Outlook Graph)
"""

from .base import BaseEmailAdapter
from .gmail_adapter import GmailAdapter

__all__ = ["BaseEmailAdapter", "GmailAdapter"]
