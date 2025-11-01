// ==================== TEST DATA FOR DASHBOARD ====================
// This file provides fallback test data when API is unavailable

const TEST_DATA = {
    overview: {
        order_volume: {
            monthly_orders: 245680,
            average_daily_orders: 8189,
            growth_metrics: {
                mom: 12.3,
                yoy: 45.7,
                qoq: 18.5
            },
            trend_data: [
                { period: 'Jan', count: 198000 },
                { period: 'Feb', count: 205000 },
                { period: 'Mar', count: 218000 },
                { period: 'Apr', count: 225000 },
                { period: 'May', count: 232000 },
                { period: 'Jun', count: 245680 }
            ],
            by_category: [
                { category: 'Genetic Testing', orders: 98000, percentage: 39.9 },
                { category: 'Blood Work', orders: 73000, percentage: 29.7 },
                { category: 'Pathology', orders: 49000, percentage: 19.9 },
                { category: 'Radiology', orders: 25680, percentage: 10.5 }
            ]
        },
        compliance: {
            overall_return_rate: 1.5,
            rejection_rate: 0.9,
            total_returns: 3685,
            total_claims: 245680,
            monthly_trend: [
                { month: 'Jan', return_rate: 2.1 },
                { month: 'Feb', return_rate: 1.9 },
                { month: 'Mar', return_rate: 1.7 },
                { month: 'Apr', return_rate: 1.6 },
                { month: 'May', return_rate: 1.5 },
                { month: 'Jun', return_rate: 1.5 }
            ],
            top_return_reasons: [
                { reason: 'Missing Documentation', count: 1250, percentage: 33.9 },
                { reason: 'Incorrect Codes', count: 884, percentage: 24.0 },
                { reason: 'Authorization Issues', count: 738, percentage: 20.0 },
                { reason: 'Other', count: 813, percentage: 22.1 }
            ]
        },
        reimbursement: {
            total_reimbursed: 45250000,
            total_reimbursed_amount: 45250000,
            pending_amount: 3800000,
            average_processing_days: 18.5,
            average_turnaround_days: 18.5,
            total_claims: 245680,
            claims_reimbursed: 240120,
            reimbursement_percentage: 97.7,
            growth_rate: 2.6,
            monthly_trend: [
                { month: 'Jan', amount: 38500000 },
                { month: 'Feb', amount: 39800000 },
                { month: 'Mar', amount: 41200000 },
                { month: 'Apr', amount: 42900000 },
                { month: 'May', amount: 44100000 },
                { month: 'Jun', amount: 45250000 }
            ],
            by_payer: [
                { payer_name: 'Medicare', amount: 18100000, percentage: 40.0, claims: 98272, reimbursed_claims: 97890, reimbursement_rate: 99.6, avg_turnaround_days: 16 },
                { payer_name: 'Private Insurance', amount: 15838000, percentage: 35.0, claims: 85988, reimbursed_claims: 84273, reimbursement_rate: 98.0, avg_turnaround_days: 19 },
                { payer_name: 'Medicaid', amount: 9050000, percentage: 20.0, claims: 49136, reimbursed_claims: 47792, reimbursement_rate: 97.3, avg_turnaround_days: 22 },
                { payer_name: 'Self-Pay', amount: 2262000, percentage: 5.0, claims: 12284, reimbursed_claims: 10165, reimbursement_rate: 82.8, avg_turnaround_days: 14 }
            ]
        },
        operating_costs: {
            total_monthly_costs: 32450000,
            total_operating_costs: 32450000,
            cost_per_test: 132,
            monthly_trend: [
                { month: 'Jan', cost: 28500000, total_cost: 28500000 },
                { month: 'Feb', cost: 29200000, total_cost: 29200000 },
                { month: 'Mar', cost: 30100000, total_cost: 30100000 },
                { month: 'Apr', cost: 31200000, total_cost: 31200000 },
                { month: 'May', cost: 31800000, total_cost: 31800000 },
                { month: 'Jun', cost: 32450000, total_cost: 32450000 }
            ]
        },
        lab_metrics: {
            average_tat_hours: 38.5,
            average_turnaround_hours: 38.5,
            target_turnaround_hours: 42,
            tests_processed: 245680,
            capacity_utilization: 87.3,
            lab_capacity: {
                utilization_percentage: 87.3,
                current_load: 214469,
                max_capacity: 245680
            },
            efficiency_score: 94.5,
            error_rate: 0.8,
            turnaround_trend: [
                { period: 'Week 1', hours: 40.2 },
                { period: 'Week 2', hours: 39.8 },
                { period: 'Week 3', hours: 38.9 },
                { period: 'Week 4', hours: 38.5 }
            ],
            tests_by_type: [
                { test_type: 'Molecular', count: 98000 },
                { test_type: 'Chemistry', count: 73000 },
                { test_type: 'Hematology', count: 49000 },
                { test_type: 'Microbiology', count: 25680 }
            ]
        },
        regional: {
            territories: [
                { territory_name: 'Northeast', total_orders: 65432, revenue: 42300000, growth: 15.2 },
                { territory_name: 'West Coast', total_orders: 58765, revenue: 38700000, growth: 18.9 },
                { territory_name: 'Southeast', total_orders: 52341, revenue: 35200000, growth: 12.1 },
                { territory_name: 'Midwest', total_orders: 45892, revenue: 31800000, growth: 8.5 },
                { territory_name: 'Southwest', total_orders: 23250, revenue: 16200000, growth: 22.3 }
            ]
        },
        forecasting: {
            next_quarter_orders: 720000,
            forecast_growth: 14.2,
            revenue_forecast: 132480000,
            confidence_level: 92,
            year_end_projection: 3150000,
            assumptions: {
                market_growth_rate: 12.5,
                seasonality_factor: 'Q4 holiday impact'
            },
            quarterly_forecast: [
                { quarter: 'Q2 2025', predicted_orders: 720000, orders: 720000, confidence: 92, revenue: 132480000, growth: 14.2 },
                { quarter: 'Q3 2025', predicted_orders: 785000, orders: 785000, confidence: 87, revenue: 144440000, growth: 9.0 },
                { quarter: 'Q4 2025', predicted_orders: 850000, orders: 850000, confidence: 81, revenue: 156400000, growth: 8.3 },
                { quarter: 'Q1 2026', predicted_orders: 920000, orders: 920000, confidence: 75, revenue: 169280000, growth: 8.2 }
            ]
        },
        market_intelligence: {
            news: [
                {
                    title: 'FDA Approves New Genetic Testing Protocol',
                    source: 'Genomics News',
                    timestamp: '2 hours ago',
                    relevance: 'high'
                },
                {
                    title: 'Healthcare Spending Projected to Increase 15%',
                    source: 'Healthcare Finance',
                    timestamp: '5 hours ago',
                    relevance: 'medium'
                },
                {
                    title: 'AI in Diagnostics Market Reaches $2.1B',
                    source: 'MedTech Daily',
                    timestamp: '1 day ago',
                    relevance: 'high'
                }
            ],
            competitors: [
                {
                    name: 'GenomaCorp',
                    activity: 'Launched AI-powered test analysis platform',
                    impact: 'high'
                },
                {
                    name: 'BioTest Systems',
                    activity: 'Acquired regional lab network for $450M',
                    impact: 'medium'
                }
            ]
        },
        milestones: {
            total_projects: 3,
            projects_on_track: 2,
            projects_at_risk: 0,
            projects_delayed: 0,
            active_projects: [
                {
                    project_name: 'FDA Submission - New Test Panel',
                    overall_status: 'on_track',
                    completion_percentage: 85
                },
                {
                    project_name: 'Lab Expansion - West Coast',
                    overall_status: 'on_track',
                    completion_percentage: 92
                },
                {
                    project_name: 'AI Integration - Results Analysis',
                    overall_status: 'at_risk',
                    completion_percentage: 45
                }
            ],
            critical_items: [
                'DiagnosticTest A 2.0 FDA submission on target for Q4 2025',
                'Lab equipment maintenance required by end of month'
            ],
            projects: [
                {
                    name: 'FDA Submission - New Test Panel',
                    status: 'on_track',
                    completion: 85,
                    due_date: '2025-11-15',
                    owner: 'R&D Team'
                },
                {
                    name: 'Lab Expansion - West Coast',
                    status: 'on_track',
                    completion: 92,
                    due_date: '2025-10-30',
                    owner: 'Operations'
                },
                {
                    name: 'AI Integration - Results Analysis',
                    status: 'at_risk',
                    completion: 45,
                    due_date: '2025-12-31',
                    owner: 'IT Department'
                }
            ]
        },
        market_intelligence: {
            latest_news: [
                {
                    title: 'FDA Approves New Genetic Testing Protocol',
                    summary: 'FDA approval expands market opportunities for genetic testing',
                    source: 'Genomics News',
                    date: '2 hours ago',
                    importance: 'high'
                },
                {
                    title: 'Healthcare Spending Projected to Increase 15%',
                    summary: 'Healthcare expenditure growth favorable for diagnostic services',
                    source: 'Healthcare Finance',
                    date: '5 hours ago',
                    importance: 'medium'
                },
                {
                    title: 'AI in Diagnostics Market Reaches $2.1B',
                    summary: 'AI diagnostic tools market experiencing rapid growth',
                    source: 'MedTech Daily',
                    date: '1 day ago',
                    importance: 'high'
                }
            ],
            competitor_updates: [
                {
                    competitor_name: 'GenomaCorp',
                    description: 'Launched AI-powered test analysis platform',
                    impact_level: 'high'
                },
                {
                    competitor_name: 'BioTest Systems',
                    description: 'Acquired regional lab network for $450M',
                    impact_level: 'medium'
                }
            ],
            critical_alerts: [],
            news: [
                {
                    title: 'FDA Approves New Genetic Testing Protocol',
                    source: 'Genomics News',
                    timestamp: '2 hours ago',
                    relevance: 'high'
                },
                {
                    title: 'Healthcare Spending Projected to Increase 15%',
                    source: 'Healthcare Finance',
                    timestamp: '5 hours ago',
                    relevance: 'medium'
                },
                {
                    title: 'AI in Diagnostics Market Reaches $2.1B',
                    source: 'MedTech Daily',
                    timestamp: '1 day ago',
                    relevance: 'high'
                }
            ],
            competitors: [
                {
                    name: 'GenomaCorp',
                    activity: 'Launched AI-powered test analysis platform',
                    impact: 'high'
                },
                {
                    name: 'BioTest Systems',
                    activity: 'Acquired regional lab network for $450M',
                    impact: 'medium'
                }
            ]
        },
        stock: {
            current_price: { price: 127.45, change: 2.35, change_percentage: '+1.88' },
            day_high: 128.90,
            day_low: 125.20,
            volume: 2450000,
            pe_ratio: 24.5,
            market_cap: '$3.2B'
        }
    },
    stock: {
        current_price: { price: 127.45, change: 2.35, change_percentage: '+1.88' },
        day_high: 128.90,
        day_low: 125.20,
        volume: 2450000,
        pe_ratio: 24.5,
        market_cap: '$3.2B'
    }
};

// AI Response Templates for CEO Executive Assistant
const AI_RESPONSES = {
    // Department-specific keywords
    keywords: {
        orders: ['order', 'volume', 'sales', 'growth', 'customer'],
        compliance: ['compliance', 'return', 'regulation', 'quality', 'fda'],
        lab: ['lab', 'laboratory', 'test', 'processing', 'turnaround', 'tat'],
        finance: ['cost', 'expense', 'revenue', 'reimbursement', 'financial', 'budget'],
        operations: ['operation', 'capacity', 'utilization', 'efficiency'],
        regional: ['region', 'territory', 'geographic', 'location', 'northeast', 'west', 'south'],
        forecasting: ['forecast', 'predict', 'future', 'projection', 'trend'],
        market: ['market', 'competitor', 'industry', 'news'],
        risk: ['risk', 'alert', 'danger', 'threat', 'warning'],
        opportunity: ['opportunity', 'growth', 'potential', 'expand']
    },

    // Response templates
    templates: {
        orders: [
            "Our order volume is performing excellently. We're at 245,680 monthly orders with 12.3% MoM growth and impressive 45.7% YoY growth. The trend shows consistent upward momentum across all categories, with Genetic Testing leading at 40% of total volume.",
            "Order analysis shows strong performance across all regions. Daily average is 8,189 orders. Growth is particularly strong in the Southwest region (+22.3%) and West Coast (+18.9%). I recommend capitalizing on this momentum."
        ],
        compliance: [
            "Compliance metrics are solid. We're maintaining a 98.5% compliance rate with only 1.5% return rate. The trend is improving month-over-month. Main areas needing attention are documentation completeness (34% of returns) and coding accuracy (24% of returns).",
            "Our compliance performance exceeds industry standards. We're processing 245,680 claims with minimal returns. I recommend focusing on the documentation workflow to reduce the primary return reason."
        ],
        lab: [
            "Lab operations are running efficiently. Current TAT is 38.5 hours, which is below our 42-hour target. We're at 87.3% capacity utilization, processing 245,680 tests monthly. Molecular testing accounts for 40% of volume.",
            "Laboratory metrics show excellent operational efficiency. TAT has improved from 40.2 to 38.5 hours over the past month. Capacity utilization at 87% is optimal - not too stressed, not underutilized."
        ],
        finance: [
            "Financial performance is strong. Total reimbursement reached $45.25M this month, up from $44.1M last month. Average cost per test is $132 with total operating costs at $32.45M. Net margin is healthy at approximately 28%.",
            "Reimbursement trends are positive across all payer categories. Medicare leads at 40% ($18.1M), followed by private insurance at 35% ($15.8M). Processing time averages 18.5 days, which is competitive."
        ],
        operations: [
            "Operations are running smoothly. Lab capacity utilization is at 87%, order processing at 92%, and staff utilization at 78%. These metrics indicate balanced workload distribution without bottlenecks.",
            "Operational efficiency is excellent across all metrics. We're processing orders quickly, maintaining quality, and using resources effectively. No immediate concerns."
        ],
        regional: [
            "Regional performance varies significantly. Northeast leads with $42.3M revenue (+15.2% growth), followed by West Coast at $38.7M (+18.9% growth). Southwest shows highest growth potential at +22.3% despite smaller base.",
            "Geographic analysis shows strong performance in established markets (Northeast, West Coast) and explosive growth in emerging markets (Southwest +22.3%). Consider resource allocation to capitalize on Southwest growth."
        ],
        forecasting: [
            "Q2-Q4 projections are bullish. We're forecasting 720K orders for Q2 (92% confidence), scaling to 850K by Q4. This represents sustained ~20% quarterly growth. Confidence levels are strong, indicating reliable forecasts.",
            "Forward-looking metrics are positive. Trend analysis suggests we'll exceed 850K orders by Q4 2025 and reach 920K by Q1 2026. Market conditions support these projections."
        ],
        market: [
            "Market intelligence shows significant activity. FDA's new genetic testing protocol approval will expand our addressable market. Healthcare spending increase (+15%) is favorable. Key competitive threat: GenomaCorp's AI platform launch.",
            "Industry trends are favorable. AI in diagnostics market hit $2.1B, validating our AI integration project. Main competitive pressure from GenomaCorp and BioTest Systems' lab network acquisition."
        ],
        risk: [
            "Key risks identified: 1) Lab equipment maintenance alert requires immediate attention, 2) Reagent inventory below threshold - reorder needed, 3) Q4 audit in 2 weeks - compliance review recommended. All are manageable with prompt action.",
            "Current risk profile is moderate. Most pressing: equipment maintenance and inventory management. Reimbursement claims pending review increased 8% - monitor closely. No critical risks detected."
        ],
        opportunity: [
            "Major opportunities: 1) Southwest region showing 22.3% growth - invest in expansion, 2) Genetic testing demand up 40% - increase capacity, 3) AI integration project can improve TAT by estimated 15%, 4) Medicare reimbursement rate changes may be favorable.",
            "Growth vectors identified: Geographic expansion (Southwest), product mix optimization (genetic testing has highest margins), operational efficiency (AI integration), and market timing (healthcare spending increase)."
        ],
        general: [
            "Overall business health is excellent. All key metrics trending positive: orders +12.3% MoM, compliance at 98.5%, reimbursement $45.25M, TAT under target at 38.5 hours. Strong execution across all departments.",
            "Executive summary: Strong financial performance, operational efficiency, and market position. Growth trajectory is sustainable. Main focus areas should be capacity expansion and maintaining quality standards during scaling."
        ]
    }
};

// Smart AI response generator
function generateAIResponse(query) {
    const queryLower = query.toLowerCase();

    // Determine which department/topic this relates to
    let detectedDepartment = 'general';
    let maxMatches = 0;

    for (const [dept, keywords] of Object.entries(AI_RESPONSES.keywords)) {
        const matches = keywords.filter(keyword => queryLower.includes(keyword)).length;
        if (matches > maxMatches) {
            maxMatches = matches;
            detectedDepartment = dept;
        }
    }

    // Get appropriate response template
    const templates = AI_RESPONSES.templates[detectedDepartment] || AI_RESPONSES.templates.general;
    const responseText = templates[Math.floor(Math.random() * templates.length)];

    return {
        success: true,
        response: responseText,
        agent_used: detectedDepartment.charAt(0).toUpperCase() + detectedDepartment.slice(1),
        confidence: 0.85 + Math.random() * 0.1 // 85-95%
    };
}
