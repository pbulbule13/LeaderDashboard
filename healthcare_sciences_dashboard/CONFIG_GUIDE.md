# Dashboard Configuration Guide

## Overview
All dashboard settings are now centralized in **`config.js`**. This single file controls every aspect of the dashboard, making it easy to customize without touching the main code.

## Quick Start
1. Open `healthcare_sciences_dashboard/config.js`
2. Modify any settings you need
3. Save the file
4. Refresh the dashboard - changes apply immediately!

## Configuration Sections

### 1. API Settings (`CONFIG.api`)
Control all API endpoints and connection settings:

```javascript
api: {
    baseUrl: 'http://localhost:8000',           // Change your API server URL
    refreshInterval: 300000,                    // Auto-refresh interval (5 minutes)
    endpoints: {
        overview: '/api/dashboard/overview',    // Individual endpoint paths
        stock: '/api/dashboard/tiles/stock',
        // ... more endpoints
    }
}
```

**Common Changes:**
- Update `baseUrl` to point to production server
- Change `refreshInterval` for faster/slower updates (milliseconds)
- Modify endpoint paths if your API structure changes

---

### 2. Company Branding (`CONFIG.branding`)
Customize company information and branding:

```javascript
branding: {
    companyName: 'HealthCare Sciences',         // Full company name
    companyShortName: 'HCS',                    // Logo abbreviation
    dashboardTitle: 'Executive Command Center', // Main dashboard title
    logoColors: {
        from: '#3B82F6',                        // Gradient start color
        to: '#2563EB'                           // Gradient end color
    }
}
```

**How to Use:**
- Change company name and logo
- Update colors using hex codes
- Modify dashboard title

---

### 3. Navigation Tabs (`CONFIG.tabs`)
Define all navigation tabs that appear in the dashboard:

```javascript
tabs: [
    { id: 'overview', label: 'Dashboard', icon: '📊', default: true },
    { id: 'email', label: 'Email', icon: '📧' },
    // Add, remove, or reorder tabs
]
```

**Examples:**
```javascript
// Add a new tab
{ id: 'reports', label: 'Reports', icon: '📄' }

// Remove a tab - just delete the line or comment it out
// { id: 'personal', label: 'Personal', icon: '💼' },

// Reorder tabs - just move the lines around
```

---

### 4. Metrics Configuration (`CONFIG.metrics`)
Configure each metric tile (Orders, Reimbursement, etc.):

```javascript
metrics: {
    orders: {
        id: 'orders',
        label: 'Orders',
        icon: '📈',
        color: '#3B82F6',              // Main color (hex)
        bgColor: '#DBEAFE',            // Background color
        textColor: '#2563EB',          // Text color
        borderColor: '#93C5FD',        // Border color
        format: (value) => ...,        // How to display values
        chartType: 'line',             // Chart type
        periods: ['day', 'week', 'month', 'year'],
        defaultPeriod: 'day',
        baseValues: {                  // Mock data values
            day: 1500,
            week: 35000,
            month: 250000,
            year: 1000000
        }
    }
}
```

**Common Changes:**
- Update colors to match your brand
- Change `label` and `icon`
- Modify `format` function to change how numbers display
- Adjust `baseValues` for more realistic mock data

---

### 5. Email Settings (`CONFIG.email`)
Configure email integration:

```javascript
email: {
    folders: [
        { id: 'inbox', label: 'Inbox', badge: 24 },
        { id: 'sent', label: 'Sent' },
        // Add your own folders
    ],
    sampleEmails: [
        {
            from: 'John Doe',
            initials: 'JD',
            subject: 'Q4 Financial Review',
            preview: 'Please review...',
            time: '9:30 AM',
            urgent: true
        }
        // Customize sample emails
    ]
}
```

**How to Customize:**
- Add/remove email folders
- Modify sample emails for demos
- Update folder names and badges

---

### 6. Calendar Settings (`CONFIG.calendar`)
Configure calendar and events:

```javascript
calendar: {
    defaultView: 'month',              // 'day', 'week', or 'month'
    timeManagement: {
        enabled: true,
        trackMeetings: true,
        trackFocusTime: true
    },
    todayEvents: [
        {
            time: '9:00 AM - 10:00 AM',
            title: 'Executive Team Meeting',
            location: '📍 Conference Room A',
            color: 'blue'
        }
        // Add your events
    ]
}
```

---

### 7. Feature Flags (`CONFIG.features`)
Enable/disable dashboard features:

```javascript
features: {
    aiAssistant: true,          // AI chat panel
    aiReasoning: true,          // AI reasoning widget
    quickNotes: true,           // Quick notes widget
    stockTicker: true,          // Stock price display
    emailIntegration: true,     // Email tab
    calendarIntegration: true,  // Calendar tab
    personalAssistant: true,    // Personal tab
    autoRefresh: true,          // Auto-refresh data
    notifications: false,       // Future feature
    darkMode: false,           // Future feature
    exportData: false          // Future feature
}
```

**Quick Toggles:**
- Set any feature to `false` to disable it
- Set to `true` to enable it
- No code changes needed!

---

### 8. Display Limits (`CONFIG.limits`)
Control how many items to display:

```javascript
limits: {
    topTerritories: 5,         // Top territories to show
    recentProjects: 2,         // Recent projects
    criticalAlerts: 4,         // Critical alerts
    marketNews: 4,             // Market news items
    competitorUpdates: 4,      // Competitor updates
    emailPreview: 3,           // Emails in preview
    calendarEvents: 4,         // Calendar events
    quickNotes: 3              // Quick notes to display
}
```

**Performance Tip:** Lower these numbers for faster loading!

---

### 9. Theme & Styling (`CONFIG.theme`)
Customize colors and styling:

```javascript
theme: {
    colors: {
        primary: '#2563EB',        // Primary blue
        secondary: '#6366F1',      // Secondary indigo
        success: '#22C55E',        // Green
        warning: '#F59E0B',        // Amber
        danger: '#EF4444',         // Red
        info: '#3B82F6',           // Blue

        background: {
            main: 'bg-gradient-to-br from-blue-50 via-white to-indigo-50',
            card: 'bg-white',
            hover: 'bg-gray-50'
        }
    }
}
```

---

## Common Customization Scenarios

### Change API Server
```javascript
api: {
    baseUrl: 'https://production-api.yourcompany.com',
}
```

### Rebrand the Dashboard
```javascript
branding: {
    companyName: 'Your Company Name',
    companyShortName: 'YCN',
    dashboardTitle: 'Executive Dashboard',
    logoColors: {
        from: '#FF6B6B',
        to: '#4ECDC4'
    }
}
```

### Remove Tabs
```javascript
// Comment out or delete tabs you don't want:
tabs: [
    { id: 'overview', label: 'Dashboard', icon: '📊', default: true },
    { id: 'email', label: 'Email', icon: '📧' },
    // { id: 'personal', label: 'Personal', icon: '💼' },  // Disabled
    { id: 'orders', label: 'Orders', icon: '📈' },
]
```

### Disable Features
```javascript
features: {
    aiAssistant: false,        // Turn off AI
    personalAssistant: false,  // Turn off personal tab
    autoRefresh: false,        // Turn off auto-refresh
}
```

### Change Metric Colors
```javascript
metrics: {
    orders: {
        color: '#FF6B6B',          // New red color
        bgColor: '#FFE5E5',        // Light red background
        textColor: '#CC0000',      // Dark red text
    }
}
```

### Adjust Display Limits
```javascript
limits: {
    topTerritories: 10,    // Show 10 instead of 5
    marketNews: 8,         // Show 8 news items
}
```

---

## Testing Your Changes

1. **Save** `config.js`
2. **Refresh** the dashboard in your browser
3. **Verify** your changes appear correctly
4. **Test** interactive features still work

---

## Troubleshooting

**Dashboard not loading?**
- Check browser console for errors (F12)
- Verify config.js syntax (missing commas, brackets)
- Make sure config.js is loaded before dashboard.js

**Colors not appearing?**
- Use valid hex color codes (#RRGGBB)
- Check Tailwind CSS class names are correct

**Features not toggling?**
- Some HTML elements may need manual hiding
- Feature flags control JavaScript behavior

---

## Best Practices

1. **Backup First:** Copy config.js before making major changes
2. **Test Incrementally:** Make small changes and test
3. **Use Comments:** Document why you changed settings
4. **Version Control:** Commit config.js changes with descriptive messages
5. **Environment Configs:** Consider separate configs for dev/staging/prod

---

## Advanced Configuration

### Adding New Metrics
1. Add metric to `CONFIG.metrics`
2. Add corresponding HTML in dashboard.html
3. Chart will auto-generate from config

### Custom Formatting Functions
```javascript
format: (value) => {
    // Custom logic
    if (value > 1000000) return (value/1000000).toFixed(1) + 'M';
    if (value > 1000) return (value/1000).toFixed(1) + 'K';
    return value.toString();
}
```

### Multiple Environments
```javascript
// Development
const DEV_CONFIG = { api: { baseUrl: 'http://localhost:8000' } };

// Production
const PROD_CONFIG = { api: { baseUrl: 'https://api.prod.com' } };

// Auto-detect
const CONFIG = window.location.hostname === 'localhost' ? DEV_CONFIG : PROD_CONFIG;
```

---

## Support

For questions or issues with configuration:
1. Check this guide first
2. Review config.js comments
3. Check browser console for errors
4. Refer to the main README.md

---

**Last Updated:** October 2025
**Version:** 1.0
