// ==================== DASHBOARD CONFIGURATION ====================
// This is the SINGLE SOURCE OF TRUTH for all dashboard settings
// Modify this file to customize the entire dashboard

const DASHBOARD_CONFIG = {
    // ==================== API SETTINGS ====================
    api: {
        baseUrl: 'http://localhost:8000',
        endpoints: {
            overview: '/api/dashboard/overview',
            stock: '/api/dashboard/tiles/stock',
            orders: '/api/dashboard/tiles/orders',
            compliance: '/api/dashboard/tiles/compliance',
            reimbursement: '/api/dashboard/tiles/reimbursement',
            costs: '/api/dashboard/tiles/costs',
            lab: '/api/dashboard/tiles/lab',
            regional: '/api/dashboard/tiles/regional',
            forecasting: '/api/dashboard/tiles/forecasting',
            market: '/api/dashboard/tiles/market',
            milestones: '/api/dashboard/tiles/milestones',
            aiQuery: '/api/query/ask'
        },
        refreshInterval: 300000  // 5 minutes in milliseconds
    },

    // ==================== COMPANY BRANDING ====================
    branding: {
        companyName: 'HealthCare Sciences',
        companyShortName: 'HCS',
        dashboardTitle: 'CEO Dashboard',
        logoColors: {
            from: '#3B82F6',  // blue-500
            to: '#2563EB'     // blue-600
        }
    },

    // ==================== NAVIGATION TABS ====================
    tabs: [
        { id: 'overview', label: 'Dashboard', icon: '', default: true },
        { id: 'email', label: 'Email', icon: '' },
        { id: 'calendar', label: 'Calendar', icon: '' },
        { id: 'personal', label: 'Personal', icon: '' },
        { id: 'orders', label: 'Orders', icon: '' },
        { id: 'compliance', label: 'Compliance', icon: '' },
        { id: 'reimbursement', label: 'Reimbursement', icon: '' },
        { id: 'costs', label: 'Costs', icon: '' },
        { id: 'lab', label: 'Lab', icon: '' },
        { id: 'regional', label: 'Regional', icon: '' },
        { id: 'forecasting', label: 'Forecast', icon: '' },
        { id: 'market', label: 'Market', icon: '' },
        { id: 'milestones', label: 'Projects', icon: '' }
    ],

    // ==================== METRICS CONFIGURATION ====================
    metrics: {
        orders: {
            id: 'orders',
            label: 'Orders',
            icon: '',
            color: '#3B82F6',          // blue-600
            bgColor: '#DBEAFE',        // blue-100
            textColor: '#2563EB',      // blue-600
            borderColor: '#93C5FD',    // blue-200
            format: (value) => (value / 1000).toFixed(0) + 'K',
            chartType: 'polarArea',
            periods: ['day', 'week', 'month', 'quarter'],
            defaultPeriod: 'day',
            baseValues: {
                day: 1500,
                week: 35000,
                month: 250000,
                quarter: 750000
            }
        },
        reimbursement: {
            id: 'reimbursement',
            label: 'Reimbursement',
            icon: '',
            color: '#A855F7',          // purple-500
            bgColor: '#F3E8FF',        // purple-100
            textColor: '#9333EA',      // purple-600
            borderColor: '#E9D5FF',    // purple-200
            format: (value) => value.toFixed(1) + '%',
            chartType: 'polarArea',
            periods: ['day', 'week', 'month', 'quarter'],
            defaultPeriod: 'day',
            baseValues: {
                day: 97,
                week: 98,
                month: 99,
                quarter: 98.5
            }
        },
        compliance: {
            id: 'compliance',
            label: 'Compliance',
            icon: '',
            color: '#22C55E',          // green-500
            bgColor: '#DCFCE7',        // green-100
            textColor: '#16A34A',      // green-600
            borderColor: '#BBF7D0',    // green-200
            format: (value) => value.toFixed(1) + '%',
            chartType: 'polarArea',
            periods: ['day', 'week', 'month', 'quarter'],
            defaultPeriod: 'day',
            baseValues: {
                day: 99.2,
                week: 99.4,
                month: 99.3,
                quarter: 99.5
            }
        },
        lab: {
            id: 'lab',
            label: 'Lab TAT',
            icon: '',
            color: '#F97316',          // orange-500
            bgColor: '#FFEDD5',        // orange-100
            textColor: '#EA580C',      // orange-600
            borderColor: '#FED7AA',    // orange-200
            format: (value) => value.toFixed(1) + 'h',
            chartType: 'polarArea',
            periods: ['day', 'week', 'month', 'quarter'],
            defaultPeriod: 'day',
            baseValues: {
                day: 38,
                week: 39,
                month: 40,
                quarter: 39
            }
        },
        costs: {
            id: 'costs',
            label: 'Operating Costs',
            icon: '',
            color: '#EF4444',          // red-500
            bgColor: '#FEE2E2',        // red-100
            textColor: '#DC2626',      // red-600
            borderColor: '#FECACA',    // red-200
            format: (value) => '$' + (value / 1000000).toFixed(1) + 'M',
            chartType: 'polarArea',
            periods: ['day', 'week', 'month', 'quarter'],
            defaultPeriod: 'day',
            baseValues: {
                day: 3500000,
                week: 24500000,
                month: 103500000,
                quarter: 310500000
            }
        },
        forecast: {
            id: 'forecast',
            label: 'Forecast',
            icon: '',
            color: '#6366F1',          // indigo-500
            bgColor: '#E0E7FF',        // indigo-100
            textColor: '#4F46E5',      // indigo-600
            borderColor: '#C7D2FE',    // indigo-200
            format: (value) => (value / 1000).toFixed(0) + 'K',
            chartType: 'polarArea',
            periods: ['day', 'week', 'month', 'quarter'],
            defaultPeriod: 'day',
            baseValues: {
                day: 45000,
                week: 315000,
                month: 1350000,
                quarter: 4050000
            }
        }
    },

    // ==================== CHART SETTINGS ====================
    charts: {
        defaultType: 'line',
        animationDuration: 300,
        tension: 0.4,
        borderWidth: 2,
        fillOpacity: 0.1,
        periods: {
            day: { labels: ['Day'], count: 1 },
            week: { labels: ['Week'], count: 1 },
            month: { labels: ['Month'], count: 1 },
            quarter: { labels: ['Quarter'], count: 1 }
        },
        doughnutLabels: ['Day', 'Week', 'Month', 'Quarter']
    },

    // ==================== OVERVIEW PAGE CONFIG ====================
    overview: {
        topChartsLayout: 'grid-cols-3',  // Tailwind grid classes
        bottomChartsLayout: 'grid-cols-3',
        dataGridLayout: 'grid-cols-4',
        marketGridLayout: 'grid-cols-2',

        sections: {
            topCharts: ['orders', 'reimbursement', 'compliance'],
            bottomCharts: ['lab', 'costs', 'forecast'],
            widgets: ['email', 'calendar', 'notes'],
            largeCharts: ['orderVolumeTrend', 'operatingCosts', 'stockPerformance'],
            dataGrid: ['territories', 'projects', 'alerts', 'operations'],
            market: ['news', 'competitors']
        },

        widgets: {
            email: {
                title: 'Inbox',
                icon: '',
                badgeCount: 24,
                maxItems: 3
            },
            calendar: {
                title: "Today's Schedule",
                icon: '',
                maxItems: 3
            },
            notes: {
                title: 'Quick Notes',
                icon: '',
                maxNotes: 10,
                displayNotes: 3
            }
        }
    },

    // ==================== AI ASSISTANT SETTINGS ====================
    ai: {
        assistant: {
            title: 'AI Executive Assistant',
            icon: '',
            welcomeMessage: "ðŸ‘‹ Hello! I'm your AI Executive Assistant.\nI can help you with emails, schedule, analytics, and strategic insights.",
            quickActions: [
                { label: 'Emails', icon: '', query: 'Summarize my unread emails', color: 'blue' },
                { label: 'Schedule', icon: '', query: 'What meetings do I have today?', color: 'green' },
                { label: 'Priorities', icon: '', query: 'Top priorities for today', color: 'purple' },
                { label: 'Alerts', icon: '', query: 'What needs my attention?', color: 'red' }
            ]
        },
        reasoning: {
            title: 'AI Analytics & Reasoning',
            icon: '',
            position: 'right-4 bottom-4',  // Tailwind positioning classes
            maxHeight: 'max-h-96',
            quickActions: [
                { label: 'Analyze This Page', icon: '', action: 'analyzeCurrentPage', color: 'purple' },
                { label: 'Compare Trends', icon: '', query: 'Compare trends across metrics', color: 'indigo' },
                { label: 'Alerts', icon: '', query: 'What needs attention?', color: 'red' }
            ]
        }
    },

    // ==================== EMAIL SETTINGS ====================
    email: {
        folders: [
            { id: 'inbox', label: 'Inbox', badge: 24 },
            { id: 'sent', label: 'Sent' },
            { id: 'drafts', label: 'Drafts', badge: 3 },
            { id: 'starred', label: 'â­ Starred' },
            { id: 'archive', label: 'ðŸ“¦ Archive' }
        ],
        sampleEmails: [
            {
                from: 'John Doe',
                initials: 'JD',
                subject: 'Q4 Financial Review Meeting',
                preview: 'Please review the attached Q4 financial projections before tomorrow\'s board meeting...',
                time: '9:30 AM',
                urgent: true,
                bgColor: 'bg-blue-100'
            },
            {
                from: 'Sarah Miller - VP Operations',
                initials: 'SM',
                subject: 'Lab Capacity Update',
                preview: 'Great news! We\'ve successfully increased lab capacity by 15%. Processing times are down...',
                time: '8:15 AM',
                urgent: false,
                bgColor: 'bg-green-100',
                highlight: true
            },
            {
                from: 'Robert Johnson - CFO',
                initials: 'RJ',
                subject: 'Budget Approval Request',
                preview: 'Requesting approval for additional $2.5M investment in new sequencing equipment...',
                time: 'Yesterday',
                urgent: false,
                bgColor: 'bg-purple-100'
            }
        ]
    },

    // ==================== CALENDAR SETTINGS ====================
    calendar: {
        defaultView: 'month',  // day, week, month
        timeManagement: {
            enabled: true,
            trackMeetings: true,
            trackFocusTime: true
        },
        todayEvents: [
            {
                time: '9:00 AM - 10:00 AM',
                title: 'Executive Team Meeting',
                location: 'ðŸ“ Conference Room A',
                color: 'blue'
            },
            {
                time: '11:30 AM - 12:30 PM',
                title: 'Investor Call - Q3 Results',
                location: 'ðŸ“ž Virtual',
                color: 'green'
            },
            {
                time: '2:00 PM - 3:00 PM',
                title: 'Product Strategy Review',
                location: 'ðŸ‘¥ With VP Product',
                color: 'purple'
            },
            {
                time: '4:00 PM - 5:00 PM',
                title: 'Board Prep Session',
                location: 'ðŸ“ Office',
                color: 'orange'
            }
        ]
    },

    // ==================== PERSONAL ASSISTANT SETTINGS ====================
    personal: {
        health: {
            enabled: true,
            goals: {
                steps: { target: 10000, label: 'Steps Today' },
                exercise: { target: 5, label: 'Exercise This Week', unit: 'days' },
                water: { target: 8, label: 'Water Intake', unit: 'glasses' }
            }
        },
        tasks: {
            enabled: true,
            maxDisplay: 10
        },
        habits: {
            enabled: true,
            trackingPeriod: 7  // days
        },
        quickActions: [
            { label: 'Call Assistant', icon: '', color: 'blue' },
            { label: 'Book Car', icon: '', color: 'green' },
            { label: 'Travel Plans', icon: '', color: 'purple' },
            { label: 'Reservations', icon: '', color: 'orange' }
        ]
    },

    // ==================== THEME & STYLING ====================
    theme: {
        colors: {
            primary: '#2563EB',        // blue-600
            secondary: '#6366F1',      // indigo-500
            success: '#22C55E',        // green-500
            warning: '#F59E0B',        // amber-500
            danger: '#EF4444',         // red-500
            info: '#3B82F6',           // blue-500

            background: {
                main: 'bg-gradient-to-br from-blue-50 via-white to-indigo-50',
                card: 'bg-white',
                hover: 'bg-gray-50'
            },

            text: {
                primary: 'text-gray-800',
                secondary: 'text-gray-600',
                muted: 'text-gray-500'
            },

            border: {
                default: 'border-gray-200',
                primary: 'border-blue-200'
            }
        },

        shadows: {
            sm: 'shadow-sm',
            md: 'shadow-md',
            lg: 'shadow-lg',
            xl: 'shadow-xl',
            '2xl': 'shadow-2xl'
        },

        rounded: {
            sm: 'rounded',
            md: 'rounded-lg',
            lg: 'rounded-xl',
            full: 'rounded-full'
        },

        transitions: {
            default: 'transition',
            all: 'transition-all duration-300',
            transform: 'transform transition-transform duration-300'
        }
    },

    // ==================== FEATURE FLAGS ====================
    features: {
        aiAssistant: true,
        aiReasoning: true,
        quickNotes: true,
        stockTicker: true,
        emailIntegration: true,
        calendarIntegration: true,
        personalAssistant: true,
        autoRefresh: true,
        notifications: false,        // Future feature
        darkMode: false,            // Future feature
        exportData: false           // Future feature
    },

    // ==================== DISPLAY LIMITS ====================
    limits: {
        topTerritories: 5,
        recentProjects: 2,
        criticalAlerts: 4,
        marketNews: 4,
        competitorUpdates: 4,
        emailPreview: 3,
        calendarEvents: 4,
        quickNotes: 3
    },

    // ==================== DATE & TIME FORMATS ====================
    formats: {
        date: {
            long: { year: 'numeric', month: 'long', day: 'numeric' },
            short: { year: 'numeric', month: 'short', day: 'numeric' },
            monthYear: { year: 'numeric', month: 'long' }
        },
        time: {
            '12hour': true,
            showSeconds: false
        },
        currency: {
            symbol: '$',
            locale: 'en-US'
        }
    },

    // ==================== AI PROMPTS & BEHAVIORS ====================
    aiPrompts: {
        // System prompts for AI assistant
        system: {
            executive: `You are an AI executive assistant for the CEO of ${this?.branding?.companyName || 'HealthCare Sciences'}.
Provide concise, actionable insights focused on what executives need to know.
Be professional, data-driven, and strategic.`,

            analyst: `You are a business analyst for ${this?.branding?.companyName || 'HealthCare Sciences'}.
Analyze data, identify trends, and provide evidence-based recommendations.
Focus on metrics, patterns, and strategic implications.`,

            advisor: `You are a strategic advisor for ${this?.branding?.companyName || 'HealthCare Sciences'}.
Provide high-level guidance, risk assessment, and opportunity identification.
Think strategically about long-term implications.`
        },

        // Context-specific prompts
        contexts: {
            emailSummary: `Analyze these emails and provide an executive summary:
- Urgent items requiring immediate attention
- Important items for today
- Key decisions needed
- FYI items for awareness

Keep it scannable and actionable. Focus on business impact.`,

            dataAnalysis: `Analyze the following data and provide insights:
1. Key trends and patterns
2. Notable changes or anomalies
3. Business implications
4. Recommended actions

Be specific and quantitative where possible.`,

            prioritization: `Review these items and prioritize them:
Criteria:
- Urgency x Impact
- Strategic alignment
- Resource requirements
- Dependencies

Provide top 3 priorities with brief rationale.`,

            recommendation: `Based on the data provided, generate recommendations:
1. Immediate actions (next 24 hours)
2. Short-term initiatives (next week)
3. Strategic considerations (next month)

Focus on high-impact, achievable actions.`
        },

        // Quick action templates
        quickActions: {
            summarize: 'Provide a brief executive summary of: ',
            analyze: 'Analyze the trends and patterns in: ',
            recommend: 'What actions should I take regarding: ',
            compare: 'Compare and contrast: ',
            explain: 'Explain the implications of: ',
            forecast: 'What can we expect in the future based on: '
        }
    },

    // ==================== EMAIL BEHAVIOR SETTINGS ====================
    emailBehavior: {
        // Auto-categorization rules
        categorization: {
            urgent: {
                keywords: ['urgent', 'asap', 'immediate', 'critical', 'emergency'],
                senders: ['board@', 'ceo@', 'cfo@'],
                subjectPatterns: ['RE: Board', 'URGENT:', 'Action Required']
            },
            important: {
                keywords: ['important', 'review', 'approval', 'decision'],
                senders: ['vp@', 'director@', 'senior@'],
                subjectPatterns: ['Approval:', 'Review:', 'Decision:']
            },
            lowPriority: {
                keywords: ['fyi', 'newsletter', 'update', 'notification'],
                senders: ['noreply@', 'notifications@'],
                subjectPatterns: ['Newsletter', 'Digest', 'Update']
            }
        },

        // Email processing settings
        processing: {
            autoArchiveAfterDays: 30,
            maxInboxSize: 100,
            groupByThread: true,
            showPreviewLines: 2,
            markReadAfterSeconds: 3,
            enableSmartReply: true
        },

        // Draft assistance settings
        draftAssistance: {
            enabled: true,
            tone: 'professional',  // professional, casual, formal
            length: 'medium',      // brief, medium, detailed
            includeGreeting: true,
            includeSignature: true,
            signature: `Best regards,\n${this?.branding?.companyName || 'HealthCare Sciences'} Leadership Team`,
            templates: {
                approval: 'I approve the {subject}. Please proceed with {action}.',
                followup: 'Following up on {subject}. Can you provide an update by {date}?',
                meeting: 'Let\'s schedule a meeting to discuss {subject}. My availability: {times}.',
                thanks: 'Thank you for {action}. This will help us {benefit}.'
            }
        },

        // Notification settings
        notifications: {
            enabled: true,
            urgentOnly: false,
            playSound: true,
            showDesktop: true,
            groupByTime: 5  // minutes
        }
    },

    // ==================== AGENT BEHAVIOR SETTINGS ====================
    agentBehaviors: {
        // Response style settings
        responseStyle: {
            defaultTone: 'professional',  // professional, analytical, casual, formal
            verbosity: 'concise',         // brief, concise, detailed
            format: 'bullet_points',      // bullet_points, paragraphs, mixed
            includeMetrics: true,
            includeTrends: true,
            includeRecommendations: true,
            maxResponseLength: 500        // characters
        },

        // Data presentation settings
        dataPresentation: {
            showRawData: false,
            roundDecimals: 2,
            usePercentages: true,
            useThousandsSeparator: true,
            highlightChanges: true,
            compareWithPrevious: true
        },

        // Analysis depth
        analysisDepth: {
            quickSummary: {
                context: 'minimal',
                recommendations: 'top3',
                dataPoints: 5
            },
            standard: {
                context: 'medium',
                recommendations: 'top5',
                dataPoints: 10
            },
            detailed: {
                context: 'full',
                recommendations: 'comprehensive',
                dataPoints: 20
            }
        },

        // Error handling
        errorHandling: {
            showTechnicalDetails: false,
            suggestAlternatives: true,
            provideFallback: true,
            logErrors: true
        }
    },

    // ==================== USER PREFERENCES ====================
    userPreferences: {
        // Dashboard personalization
        dashboard: {
            defaultView: 'overview',
            favoriteMetrics: ['orders', 'reimbursement', 'compliance'],
            pinnedWidgets: ['email', 'calendar'],
            theme: 'light',  // light, dark, auto
            compactMode: false
        },

        // Notification preferences
        notifications: {
            email: true,
            push: false,
            sms: false,
            digest: {
                enabled: true,
                frequency: 'daily',  // hourly, daily, weekly
                time: '08:00'
            }
        },

        // AI interaction preferences
        aiInteraction: {
            proactive: true,      // AI suggests insights proactively
            contextual: true,     // AI considers current page context
            learning: true,       // AI learns from user interactions
            suggestions: true     // AI provides quick action suggestions
        }
    }
};

// Make config globally available
window.DASHBOARD_CONFIG = DASHBOARD_CONFIG;

