/**
 * Voice Agent Integration for Dashboard
 * Connects Communications tab to real Gmail and Google Calendar
 */

const VOICE_AGENT_API = 'http://localhost:8000';

// Load emails when Communications tab is opened
async function loadRealEmails() {
    console.log('Loading real emails from Gmail...');
    const container = document.getElementById('email-list-container');
    const countSpan = document.getElementById('email-count');

    try {
        const response = await fetch(`${VOICE_AGENT_API}/voice-agent/emails?max_results=20`);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        // Get emails from response
        const emails = data.emails || [];

        if (emails.length === 0) {
            container.innerHTML = `
                <div class="p-6 text-center">
                    <p class="text-gray-600 mb-2">📭 No emails found</p>
                    <p class="text-xs text-gray-500">Your inbox is empty or Gmail isn't connected</p>
                    <button onclick="refreshEmails()" class="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                        Try Again
                    </button>
                </div>
            `;
            countSpan.textContent = '(0)';
            return;
        }

        // Update count
        countSpan.textContent = `(${emails.length})`;

        // Display emails
        container.innerHTML = emails.map((email, index) => `
            <div class="p-3 hover:bg-blue-50 cursor-pointer transition-all" onclick="showEmailDetail(${index})">
                <div class="flex justify-between items-start mb-1">
                    <p class="font-semibold text-sm text-gray-900">${escapeHtml(email.from || 'Unknown Sender')}</p>
                    <span class="text-xs text-gray-500">${formatEmailDate(email.date)}</span>
                </div>
                <p class="text-sm font-medium text-gray-800 mb-1">${escapeHtml(email.subject || 'No Subject')}</p>
                <p class="text-xs text-gray-600 line-clamp-2">${escapeHtml(email.preview || '').substring(0, 100)}...</p>
                ${email.unread ? '<span class="inline-block mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Unread</span>' : ''}
            </div>
        `).join('');

        // Store emails globally for detail view
        window.currentEmails = emails;

        console.log(`Loaded ${emails.length} emails from Gmail`);

    } catch (error) {
        console.error('Error loading emails:', error);
        container.innerHTML = `
            <div class="p-6 text-center">
                <p class="text-red-600 font-semibold mb-2">⚠️ Error Loading Emails</p>
                <p class="text-sm text-gray-600 mb-3">${error.message}</p>
                <button onclick="refreshEmails()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                    Retry
                </button>
            </div>
        `;
        countSpan.textContent = '(Error)';
    }
}

// Refresh emails
async function refreshEmails() {
    console.log('Refreshing emails...');
    const container = document.getElementById('email-list-container');
    container.innerHTML = `
        <div class="p-6 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p class="text-sm text-gray-600">Refreshing...</p>
        </div>
    `;
    await loadRealEmails();
}

// Show email detail (modal or expanded view)
function showEmailDetail(index) {
    if (!window.currentEmails || !window.currentEmails[index]) {
        alert('Email not found');
        return;
    }

    const email = window.currentEmails[index];

    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200">
                <div class="flex justify-between items-start mb-4">
                    <h2 class="text-xl font-bold text-gray-900">${escapeHtml(email.subject || 'No Subject')}</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">×</button>
                </div>
                <div class="space-y-2 text-sm">
                    <p><strong>From:</strong> ${escapeHtml(email.from || 'Unknown')}</p>
                    <p><strong>Date:</strong> ${formatEmailDate(email.date)}</p>
                    ${email.to ? `<p><strong>To:</strong> ${escapeHtml(email.to)}</p>` : ''}
                </div>
            </div>
            <div class="p-6">
                <div class="prose max-w-none">
                    <p class="whitespace-pre-wrap">${escapeHtml(email.preview || email.body || 'No content')}</p>
                </div>
            </div>
            <div class="p-6 border-t border-gray-200 flex gap-3">
                <button onclick="draftReply('${escapeHtml(email.from)}', '${escapeHtml(email.subject)}')"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold">
                    ↩️ Reply
                </button>
                <button onclick="this.closest('.fixed').remove()"
                    class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded font-semibold">
                    Close
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Draft reply using Voice Agent
async function draftReply(to, subject) {
    alert(`Drafting reply to: ${to}\n\nThis will open the voice agent interface to help you compose the reply.`);
    // TODO: Integrate with voice agent drafting system
}

// Load calendar events
async function loadRealCalendar() {
    console.log('Loading real calendar events...');
    // TODO: Implement calendar loading from Google Calendar API
    // For now, using the existing static calendar in the dashboard
}

// Utility: Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Utility: Format email date
function formatEmailDate(dateString) {
    if (!dateString) return 'Unknown date';

    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
        return dateString;
    }
}

// Auto-load emails when Communications tab is opened
function initVoiceAgentIntegration() {
    console.log('Initializing Voice Agent integration...');

    // Listen for tab switches
    const originalSwitchTab = window.switchTab;
    window.switchTab = function(tab) {
        // Call original switchTab
        if (originalSwitchTab) {
            originalSwitchTab(tab);
        }

        // Load emails when Communications tab is opened
        if (tab === 'email') {
            setTimeout(() => loadRealEmails(), 100);
        }
    };

    // If Communications tab is already active, load emails
    const emailTab = document.getElementById('content-email');
    if (emailTab && !emailTab.classList.contains('hidden')) {
        loadRealEmails();
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVoiceAgentIntegration);
} else {
    initVoiceAgentIntegration();
}

console.log('Voice Agent Integration loaded successfully');
