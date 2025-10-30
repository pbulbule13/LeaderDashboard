// ==================== TEST DATA FOR DASHBOARD ====================
// This file provides fallback test data when API is unavailable

const TEST_DATA = {
  overview: {
    order_volume: {
      monthly_orders: 245680,
      average_daily_orders: 8189,
      growth_metrics: { mom: 12.3, yoy: 45.7, qoq: 18.5 },
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
      pending_amount: 3800000,
      average_processing_days: 18.5,
      monthly_trend: [
        { month: 'Jan', amount: 38500000 },
        { month: 'Feb', amount: 39800000 },
        { month: 'Mar', amount: 41200000 },
        { month: 'Apr', amount: 42900000 },
        { month: 'May', amount: 44100000 },
        { month: 'Jun', amount: 45250000 }
      ],
      by_payer: [
        { payer_name: 'Medicare', amount: 18100000, percentage: 40.0 },
        { payer_name: 'Private Insurance', amount: 15838000, percentage: 35.0 },
        { payer_name: 'Medicaid', amount: 9050000, percentage: 20.0 },
        { payer_name: 'Self-Pay', amount: 2262000, percentage: 5.0 }
      ]
    },
    operating_costs: {
      total_monthly_costs: 32450000,
      cost_per_test: 132,
      monthly_trend: [
        { month: 'Jan', cost: 28500000 },
        { month: 'Feb', cost: 29200000 },
        { month: 'Mar', cost: 30100000 },
        { month: 'Apr', cost: 31200000 },
        { month: 'May', cost: 31800000 },
        { month: 'Jun', cost: 32450000 }
      ]
    },
    lab_metrics: {
      average_tat_hours: 38.5,
      tests_processed: 245680,
      capacity_utilization: 87.3,
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
      quarterly_forecast: [
        { quarter: 'Q2 2025', predicted_orders: 720000, confidence: 0.92 },
        { quarter: 'Q3 2025', predicted_orders: 785000, confidence: 0.87 },
        { quarter: 'Q4 2025', predicted_orders: 850000, confidence: 0.81 },
        { quarter: 'Q1 2026', predicted_orders: 920000, confidence: 0.75 }
      ]
    },
    market_intelligence: {
      news: [
        { title: 'FDA Approves New Genetic Testing Protocol', source: 'Genomics News', timestamp: '2 hours ago', relevance: 'high' },
        { title: 'AI in Diagnostics Market Reaches $2.1B', source: 'HealthTech Daily', timestamp: '6 hours ago', relevance: 'medium' },
        { title: 'BioTest Systems Acquires Regional Lab Network', source: 'Industry Wire', timestamp: '1 day ago', relevance: 'medium' }
      ]
    },
    milestones: {
      projects: [
        { name: 'FDA Submission - Genomic Panel', status: 'submitted', completion: 100, due_date: '2025-10-30', owner: 'Regulatory' },
        { name: 'AI Integration - Results Analysis', status: 'in_progress', completion: 45, due_date: '2025-12-31', owner: 'IT Department' }
      ]
    }
  },
  stock: {
    current_price: { price: 124.32, change: 1.85, change_percentage: 1.51 },
    day_high: 125.10,
    day_low: 122.76,
    volume: 12450000,
    pe_ratio: 21.4,
    market_cap: '$12.8B'
  }
};

// AI Response Templates for CEO Executive Assistant (kept simple)
const AI_RESPONSES = {
  keywords: {
    orders: ['order','volume','sales','growth','customer'],
    compliance: ['compliance','return','regulation','quality','fda'],
    lab: ['lab','laboratory','test','tat','turnaround'],
    finance: ['cost','expense','revenue','reimbursement','financial','budget'],
    operations: ['operation','capacity','utilization','efficiency'],
    regional: ['region','territory','geographic','location','northeast','west','south'],
    forecasting: ['forecast','predict','future','projection','trend'],
    market: ['market','competitor','industry','news'],
    risk: ['risk','alert','danger','threat','warning'],
    opportunity: ['opportunity','growth','potential','expand']
  },
  templates: {
    general: [
      'Overall business health is excellent. Orders +12.3% MoM, compliance 98.5%, reimbursement $45.25M, TAT 38.5h.',
      'Executive summary: strong financials and operations; focus on capacity expansion and quality as we scale.'
    ]
  }
};

function generateAIResponse(query) {
  const q = (query || '').toLowerCase();
  let best = 'general';
  let max = 0;
  for (const [dept, keys] of Object.entries(AI_RESPONSES.keywords)) {
    const matches = keys.filter(k => q.includes(k)).length;
    if (matches > max) { max = matches; best = dept; }
  }
  const tpl = AI_RESPONSES.templates[best] || AI_RESPONSES.templates.general;
  const responseText = tpl[Math.floor(Math.random()*tpl.length)];
  return { success: true, response: responseText, agent_used: best, confidence: 0.9 };
}
