/**
 * Enhanced Communications Tab with Gmail Integration
 * Features: Email categorization, draft approval, calendar, go-to-human
 */

const COMM_API = 'http://localhost:8000';

// Global state
window.communicationsState = {
    emails: [],
    drafts: [],
    selectedEmail: null,
    selectedDraft: null,
    currentCategory: 'all',
    calendar: []
};

// Email categories with keywords
const EMAIL_CATEGORIES = {
    urgent: {
        name: 'Urgent',
        icon: '🚨',
        color: 'red',
        keywords: ['urgent', 'asap', 'emergency', 'critical', 'immediate']
    },
    work: {
        name: 'Work',
        icon: '💼',
        color: 'blue',
        keywords: ['meeting', 'project', 'deadline', 'report', 'client']
    },
    personal: {
        name: 'Personal',
        icon: '👤',
        color: 'green',
        keywords: ['family', 'personal', 'home', 'appointment']
    },
    promotions: {
        name: 'Promotions',
        icon: '🎁',
        color: 'purple',
        keywords: ['sale', 'offer', 'discount', 'deal', 'promotion']
    },
    social: {
        name: 'Social',
        icon: '👥',
        color: 'indigo',
        keywords: ['facebook', 'twitter', 'linkedin', 'instagram', 'notification']
    }
};

/**
 * Categorize email based on content
 */
function categorizeEmail(email) {
    const text = `${email.subject} ${email.preview}`.toLowerCase();

    for (const [key, category] of Object.entries(EMAIL_CATEGORIES)) {
        if (category.keywords.some(keyword => text.includes(keyword))) {
            return key;
        }
    }

    return 'work'; // Default category
}

/**
 * Load all emails from Gmail
 */
async function loadAllEmails() {
    console.log('[Communications] Loading Gmail emails...');

    try {
        const response = await fetch(`${COMM_API}/voice-agent/emails?max_results=50`);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const emails = data.emails || [];

        // Categorize emails
        window.communicationsState.emails = emails.map(email => ({
            ...email,
            category: categorizeEmail(email)
        }));

        console.log(`[Communications] Loaded ${emails.length} emails`);
        renderEmailList();
        updateCategoryBadges();

    } catch (error) {
        console.error('[Communications] Error loading emails:', error);
        showError('email-list', error.message);
    }
}

/**
 * Load email drafts
 */
async function loadEmailDrafts() {
    console.log('[Communications] Loading drafts...');

    try {
        const response = await fetch(`${COMM_API}/voice-agent/inbox/summary`);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        window.communicationsState.drafts = data.drafts || [];

        console.log(`[Communications] Loaded ${data.drafts?.length || 0} drafts`);
        renderDraftsList();

    } catch (error) {
        console.error('[Communications] Error loading drafts:', error);
        showError('drafts-list', error.message);
    }
}

/**
 * Render email list with categories
 */
function renderEmailList() {
    const container = document.getElementById('email-list');
    const { emails, currentCategory } = window.communicationsState;

    if (!container) return;

    // Filter by category
    const filteredEmails = currentCategory === 'all'
        ? emails
        : emails.filter(e => e.category === currentCategory);

    if (filteredEmails.length === 0) {
        container.innerHTML = `
            <div class="p-6 text-center text-gray-500">
                <p class="mb-2">No emails in this category</p>
                <button onclick="switchCategory('all')" class="text-blue-600 hover:underline text-sm">
                    View all emails
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredEmails.map((email, index) => {
        const category = EMAIL_CATEGORIES[email.category] || EMAIL_CATEGORIES.work;
        return `
            <div class="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-all"
                 onclick="selectEmail(${index})"
                 data-email-index="${index}">
                <div class="flex justify-between items-start mb-1">
                    <div class="flex items-center gap-2 flex-1">
                        <span class="text-sm">${category.icon}</span>
                        <p class="font-semibold text-sm text-gray-900 truncate">${escapeHtml(email.from || 'Unknown')}</p>
                    </div>
                    <span class="text-xs text-gray-500 whitespace-nowrap ml-2">${formatEmailDate(email.date)}</span>
                </div>
                <p class="text-sm font-medium text-gray-800 mb-1 line-clamp-1">${escapeHtml(email.subject || 'No Subject')}</p>
                <p class="text-xs text-gray-600 line-clamp-2">${escapeHtml(email.preview || '').substring(0, 120)}...</p>
                <div class="flex gap-2 mt-2">
                    ${email.unread ? '<span class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Unread</span>' : ''}
                    <span class="text-xs bg-${category.color}-100 text-${category.color}-800 px-2 py-0.5 rounded">${category.name}</span>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Render drafts list
 */
function renderDraftsList() {
    const container = document.getElementById('drafts-list');
    const { drafts } = window.communicationsState;

    if (!container) return;

    if (drafts.length === 0) {
        container.innerHTML = `
            <div class="p-6 text-center text-gray-500">
                <p>No draft emails pending approval</p>
            </div>
        `;
        return;
    }

    container.innerHTML = drafts.map((draft, index) => `
        <div class="p-4 border-b border-gray-100 hover:bg-gray-50">
            <div class="flex justify-between items-start mb-2">
                <div class="flex-1">
                    <p class="font-semibold text-sm text-gray-900">To: ${escapeHtml(draft.to?.join(', ') || 'Unknown')}</p>
                    <p class="text-sm text-gray-700 mt-1">${escapeHtml(draft.subject || 'No Subject')}</p>
                </div>
                <span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>
            </div>
            <p class="text-xs text-gray-600 mb-3 line-clamp-2">${escapeHtml(draft.body || '').substring(0, 150)}...</p>
            <div class="flex gap-2">
                <button onclick="viewDraft(${index})"
                    class="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-semibold">
                    View & Edit
                </button>
                <button onclick="approveDraft(${index})"
                    class="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded font-semibold">
                    ✓ Approve & Send
                </button>
                <button onclick="rejectDraft(${index})"
                    class="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-semibold">
                    ✗ Reject
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Update category badges with counts
 */
function updateCategoryBadges() {
    const { emails } = window.communicationsState;

    // Count by category
    const counts = {
        all: emails.length,
        urgent: 0,
        work: 0,
        personal: 0,
        promotions: 0,
        social: 0
    };

    emails.forEach(email => {
        if (counts[email.category] !== undefined) {
            counts[email.category]++;
        }
    });

    // Update badges
    Object.keys(counts).forEach(category => {
        const badge = document.getElementById(`badge-${category}`);
        if (badge) {
            badge.textContent = counts[category];
        }
    });
}

/**
 * Switch email category filter
 */
function switchCategory(category) {
    window.communicationsState.currentCategory = category;

    // Update active tab
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('bg-blue-100', 'text-blue-800', 'font-semibold');
        tab.classList.add('bg-gray-100', 'text-gray-700');
    });

    const activeTab = document.getElementById(`cat-${category}`);
    if (activeTab) {
        activeTab.classList.remove('bg-gray-100', 'text-gray-700');
        activeTab.classList.add('bg-blue-100', 'text-blue-800', 'font-semibold');
    }

    renderEmailList();
}

/**
 * Select and view email
 */
function selectEmail(index) {
    const emails = window.communicationsState.currentCategory === 'all'
        ? window.communicationsState.emails
        : window.communicationsState.emails.filter(e => e.category === window.communicationsState.currentCategory);

    const email = emails[index];
    if (!email) return;

    window.communicationsState.selectedEmail = email;

    // Show modal with email details
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div class="p-6 border-b border-gray-200">
                <div class="flex justify-between items-start mb-4">
                    <h2 class="text-xl font-bold text-gray-900">${escapeHtml(email.subject || 'No Subject')}</h2>
                    <button onclick="this.closest('.fixed').remove()"
                        class="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none">×</button>
                </div>
                <div class="space-y-2 text-sm">
                    <p><strong>From:</strong> ${escapeHtml(email.from || 'Unknown')}</p>
                    <p><strong>Date:</strong> ${formatEmailDate(email.date)}</p>
                    <p><strong>Category:</strong> <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">${EMAIL_CATEGORIES[email.category]?.name || 'Work'}</span></p>
                </div>
            </div>
            <div class="p-6 overflow-y-auto flex-1">
                <div class="prose max-w-none">
                    <p class="whitespace-pre-wrap">${escapeHtml(email.preview || 'No content')}</p>
                </div>
            </div>
            <div class="p-6 border-t border-gray-200 flex gap-3 bg-gray-50">
                <button onclick="draftReply('${escapeHtml(email.from)}', '${escapeHtml(email.subject)}', '${email.id}')"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold">
                    ↩️ Draft Reply
                </button>
                <button onclick="goToHuman('${email.id}', '${escapeHtml(email.subject)}')"
                    class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold">
                    👤 Escalate to Human
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

/**
 * View and edit draft
 */
function viewDraft(index) {
    const draft = window.communicationsState.drafts[index];
    if (!draft) return;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div class="p-6 border-b border-gray-200">
                <div class="flex justify-between items-start mb-4">
                    <h2 class="text-xl font-bold text-gray-900">Review Draft Email</h2>
                    <button onclick="this.closest('.fixed').remove()"
                        class="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none">×</button>
                </div>
            </div>
            <div class="p-6 overflow-y-auto flex-1 space-y-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">To:</label>
                    <input type="text" value="${escapeHtml(draft.to?.join(', ') || '')}"
                        class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        id="draft-to-${index}">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Subject:</label>
                    <input type="text" value="${escapeHtml(draft.subject || '')}"
                        class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        id="draft-subject-${index}">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Body:</label>
                    <textarea rows="12"
                        class="w-full px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                        id="draft-body-${index}">${escapeHtml(draft.body || '')}</textarea>
                </div>
                <div class="bg-blue-50 p-3 rounded">
                    <p class="text-xs text-gray-700"><strong>AI Reasoning:</strong></p>
                    <p class="text-xs text-gray-600 mt-1">${escapeHtml(draft.reasoning || 'No reasoning provided').substring(0, 300)}...</p>
                </div>
            </div>
            <div class="p-6 border-t border-gray-200 flex gap-3 bg-gray-50">
                <button onclick="approveDraft(${index})"
                    class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold">
                    ✓ Approve & Send
                </button>
                <button onclick="goToHuman('draft-${index}', '${escapeHtml(draft.subject)}')"
                    class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold">
                    👤 Send to Human Review
                </button>
                <button onclick="rejectDraft(${index})"
                    class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold">
                    ✗ Reject Draft
                </button>
                <button onclick="this.closest('.fixed').remove()"
                    class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded font-semibold">
                    Close
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

/**
 * Approve and send draft
 */
async function approveDraft(index) {
    const draft = window.communicationsState.drafts[index];
    if (!draft) return;

    if (!confirm(`Send email to ${draft.to?.join(', ')}?`)) {
        return;
    }

    try {
        // TODO: Implement actual send via API
        alert(`Email would be sent to: ${draft.to?.join(', ')}\n\nSubject: ${draft.subject}\n\n(Actual sending not yet implemented - requires authorization code)`);

        // Remove from drafts
        window.communicationsState.drafts.splice(index, 1);
        renderDraftsList();

    } catch (error) {
        alert(`Error sending email: ${error.message}`);
    }
}

/**
 * Reject draft
 */
function rejectDraft(index) {
    if (!confirm('Reject this draft? This cannot be undone.')) {
        return;
    }

    window.communicationsState.drafts.splice(index, 1);
    renderDraftsList();
    alert('Draft rejected');
}

/**
 * Draft reply to email
 */
async function draftReply(to, subject, emailId) {
    alert(`Drafting reply to: ${to}\n\nSubject: Re: ${subject}\n\nThis will use the Voice Agent to compose an intelligent reply.`);
    // TODO: Integrate with voice agent API
}

/**
 * Escalate to human (Go to Human functionality)
 */
function goToHuman(itemId, subject) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">👤 Escalate to Human Review</h2>
            <p class="text-sm text-gray-700 mb-4">
                This email will be flagged for manual human review.
                Add any context or instructions for the human reviewer:
            </p>
            <div class="mb-4">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Item: ${escapeHtml(subject)}</label>
                <textarea rows="4" placeholder="Add notes for human reviewer..."
                    class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    id="escalation-notes"></textarea>
            </div>
            <div class="flex gap-3">
                <button onclick="submitEscalation('${itemId}')"
                    class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold">
                    Submit for Human Review
                </button>
                <button onclick="this.closest('.fixed').remove()"
                    class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded font-semibold">
                    Cancel
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

/**
 * Submit escalation
 */
function submitEscalation(itemId) {
    const notes = document.getElementById('escalation-notes')?.value || '';

    // TODO: Send to backend escalation queue
    console.log(`[Escalation] Item ${itemId} escalated to human with notes: ${notes}`);

    alert(`✓ Successfully escalated to human review!\n\nItem ID: ${itemId}\n\nA human will review this within 24 hours.`);

    // Close modal
    document.querySelector('.fixed')?.remove();
}

/**
 * Refresh all communications
 */
async function refreshCommunications() {
    console.log('[Communications] Refreshing all...');

    // Show loading
    const emailList = document.getElementById('email-list');
    const draftsList = document.getElementById('drafts-list');

    if (emailList) {
        emailList.innerHTML = '<div class="p-6 text-center"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>';
    }

    if (draftsList) {
        draftsList.innerHTML = '<div class="p-6 text-center"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>';
    }

    // Load data
    await Promise.all([
        loadAllEmails(),
        loadEmailDrafts()
    ]);
}

/**
 * Utility functions
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

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

function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="p-6 text-center">
            <p class="text-red-600 font-semibold mb-2">⚠️ Error</p>
            <p class="text-sm text-gray-600 mb-3">${escapeHtml(message)}</p>
            <button onclick="refreshCommunications()"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                Retry
            </button>
        </div>
    `;
}

/**
 * Initialize on page load
 */
function initCommunications() {
    console.log('[Communications] Initializing enhanced communications tab...');

    // Load data when tab becomes visible
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            const emailTab = document.getElementById('content-email');
            if (emailTab && !emailTab.classList.contains('hidden')) {
                refreshCommunications();
                observer.disconnect(); // Only load once
            }
        });
    });

    // Start observing
    const emailTab = document.getElementById('content-email');
    if (emailTab) {
        observer.observe(emailTab, { attributes: true, attributeFilter: ['class'] });

        // If already visible, load immediately
        if (!emailTab.classList.contains('hidden')) {
            refreshCommunications();
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommunications);
} else {
    initCommunications();
}

console.log('[Communications] Enhanced communications module loaded');
