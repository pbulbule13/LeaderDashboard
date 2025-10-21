import React, { useState } from 'react';
import { TrendingUp, Package, DollarSign, Users, Activity, Mail, Calendar, MessageSquare, Send, ChevronDown, AlertCircle, CheckCircle, BarChart3 } from 'lucide-react';

export default function HealthCareSciencesDashboard() {
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponses, setAiResponses] = useState([]);
  const [expandedTile, setExpandedTile] = useState(null);

  // HealthCare Sciences Products
  const products = {
    'Cologuard': { orders: 456789, returned: 234, revenue: 89500000, margin: 78 },
    'Oncotype DX': { orders: 234567, returned: 145, revenue: 67800000, margin: 82 },
    'PreventionGenetics': { orders: 123456, returned: 89, revenue: 34200000, margin: 75 },
    'Cologuard Plus': { orders: 89012, returned: 67, revenue: 28900000, margin: 76 }
  };

  const quarterlyBudget = {
    'Q4 2025 (Current)': {
      'R&D': { allocated: 45000000, spent: 38200000, remaining: 6800000 },
      'Sales & Marketing': { allocated: 67000000, spent: 59400000, remaining: 7600000 },
      'Operations': { allocated: 34000000, spent: 31200000, remaining: 2800000 },
      'G&A': { allocated: 23000000, spent: 20100000, remaining: 2900000 }
    },
    'Q1 2026 (Next)': {
      'R&D': { allocated: 48000000, spent: 0, remaining: 48000000 },
      'Sales & Marketing': { allocated: 71000000, spent: 0, remaining: 71000000 },
      'Operations': { allocated: 36000000, spent: 0, remaining: 36000000 },
      'G&A': { allocated: 24000000, spent: 0, remaining: 24000000 }
    }
  };

  const revenueData = {
    'Oct 2025': { actual: 185000000, projected: 180000000 },
    'Q4 2025': { actual: 520000000, projected: 540000000 },
    'Q1 2026': { actual: 0, projected: 565000000 }
  };

  const supportTickets = {
    'Critical': { open: 3, closed: 12, avgResolution: '2.3 hrs' },
    'High': { open: 15, closed: 45, avgResolution: '4.7 hrs' },
    'Medium': { open: 28, closed: 89, avgResolution: '8.2 hrs' },
    'Low': { open: 42, closed: 156, avgResolution: '24 hrs' }
  };

  const employeeMetrics = {
    total: 6200,
    departments: {
      'R&D': 1450,
      'Sales': 2100,
      'Operations': 1800,
      'Support': 580,
      'G&A': 270
    },
    criticalVacancies: [
      { role: 'VP of Clinical Affairs', daysOpen: 52, location: 'Madison, WI' },
      { role: 'Director of Lab Operations', daysOpen: 34, location: 'Phoenix, AZ' },
      { role: 'Regional Sales Director', daysOpen: 28, location: 'New York, NY' }
    ]
  };

  const stockData = {
    current: 62.45,
    change: 1.23,
    changePercent: 2.01,
    marketCap: '11.2B'
  };

  const availableMetrics = [
    { id: 'products', name: 'Products & Orders', icon: Package, description: 'Real-time orders, returns, and revenue by product line' },
    { id: 'revenue', name: 'Revenue Performance', icon: DollarSign, description: 'Actual vs projected revenue for month/quarter' },
    { id: 'budget', name: 'Budget Analysis', icon: BarChart3, description: 'Current and next quarter budget allocation and burn rate' },
    { id: 'support', name: 'Support Operations', icon: Activity, description: 'Ticket status, resolution times, and priority breakdown' },
    { id: 'employees', name: 'Workforce Insights', icon: Users, description: 'Headcount, department breakdown, and critical vacancies' },
    { id: 'stock', name: 'Stock Performance', icon: TrendingUp, description: 'Real-time HCS stock price and market metrics' }
  ];

  const handleAiQuery = () => {
    if (!aiQuery.trim()) return;

    let response = '';
    const query = aiQuery.toLowerCase();

    if (query.includes('cologuard') || query.includes('product')) {
      response = 'Cologuard leads with 456K orders this month generating $89.5M revenue (78% margin). Return rate is exceptionally low at 0.05%. Cologuard Plus (newer version) shows strong adoption with 89K orders and similar margin profile. Both products tracking above Q4 targets.';
    } else if (query.includes('budget') || query.includes('spending')) {
      response = 'Q4 budget execution: 85% spent across all departments. Sales & Marketing at 89% utilization (highest), Operations at 92%. Current quarter has $20.1M remaining. Q1 2026 budget increased 6% YoY to $179M total, with largest increase in Sales & Marketing (+6%).';
    } else if (query.includes('revenue') || query.includes('target')) {
      response = 'October revenue: $185M (103% of target). Q4 tracking at $520M vs $540M target (96%). Shortfall primarily in Oncotype DX segment. Q1 2026 projected at $565M representing 4.6% sequential growth. Cologuard driving 48% of total revenue.';
    } else if (query.includes('ticket') || query.includes('support')) {
      response = 'Support metrics strong: 3 critical tickets open (12 resolved), average resolution 2.3 hours. Total open tickets: 88 across all priorities. 302 tickets resolved this month. High-priority resolution time improved 18% vs last month. Operations team performing above SLA.';
    } else if (query.includes('employee') || query.includes('hiring') || query.includes('vacancy')) {
      response = 'Workforce: 6,200 employees. Sales organization largest at 2,100 (34%). Three critical leadership vacancies: VP Clinical Affairs (52 days open - urgent), Director Lab Ops (34 days), Regional Sales Director NY (28 days). Sales vacancy impacting East Coast pipeline development.';
    } else if (query.includes('stock') || query.includes('hcs')) {
      response = 'HCS trading at $62.45, up $1.23 (+2.01%) today. Market cap $11.2B. Stock up 8% over 30 days driven by strong Cologuard adoption data and FDA progress on Cologuard Plus label expansion. Outperforming diagnostics sector index by 3.2%.';
    } else {
      response = 'I can help analyze any dashboard metric. Try asking: "How is Cologuard performing?", "What\'s our revenue status?", "Show me budget for Q4", "Any critical support tickets?", "Tell me about employee headcount", or "Stock performance?". I have real-time access to all tile data.';
    }

    setAiResponses([...aiResponses, { query: aiQuery, response }]);
    setAiQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">HealthCare Sciences</h1>
              <p className="text-sm text-slate-600">CEO Executive Dashboard | Friday, October 17, 2025 - 8:45 AM</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-slate-500">HCS Stock</p>
                <p className="text-xl font-bold text-green-600">${stockData.current}</p>
                <p className="text-xs text-green-600">+{stockData.changePercent}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* AI Assistant - 30% width constraint */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <MessageSquare className="text-white mr-2" size={20} />
              <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
            </div>
            
            <div className="bg-white rounded-lg p-3 mb-3 h-48 overflow-y-auto">
              {aiResponses.length === 0 ? (
                <p className="text-slate-500 text-xs">Ask about any metric...</p>
              ) : (
                <div className="space-y-3">
                  {aiResponses.map((item, idx) => (
                    <div key={idx}>
                      <div className="bg-blue-50 rounded p-2 mb-1">
                        <p className="text-xs font-medium text-blue-900">{item.query}</p>
                      </div>
                      <div className="bg-slate-50 rounded p-2">
                        <p className="text-xs text-slate-700">{item.response}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAiQuery()}
                placeholder="Ask about metrics..."
                className="flex-1 px-3 py-2 text-sm rounded-lg border-0 focus:ring-2 focus:ring-blue-300"
              />
              <button
                onClick={handleAiQuery}
                className="bg-white text-blue-600 p-2 rounded-lg hover:bg-blue-50"
              >
                <Send size={16} />
              </button>
            </div>

            {/* Compact Calendar & Email */}
            <div className="mt-4 space-y-2">
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <div className="flex items-center text-white text-xs mb-2">
                  <Calendar size={14} className="mr-1" />
                  <span className="font-semibold">Next Meeting</span>
                </div>
                <p className="text-white text-xs">FDA Pre-submission - 11:00 AM</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <div className="flex items-center text-white text-xs mb-2">
                  <Mail size={14} className="mr-1" />
                  <span className="font-semibold">Urgent Email</span>
                </div>
                <p className="text-white text-xs">FDA Response Required (4h)</p>
              </div>
            </div>
          </div>

          {/* Available Metrics Selection */}
          <div className="col-span-2 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Available Dashboard Metrics</h2>
            <div className="grid grid-cols-2 gap-3">
              {availableMetrics.map((metric) => (
                <button
                  key={metric.id}
                  onClick={() => setSelectedMetric(metric.id)}
                  className={`p-4 rounded-lg border-2 transition text-left ${
                    selectedMetric === metric.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <metric.icon className={selectedMetric === metric.id ? 'text-blue-600' : 'text-slate-400'} size={20} />
                    <div>
                      <h3 className="font-semibold text-slate-800 text-sm">{metric.name}</h3>
                      <p className="text-xs text-slate-600 mt-1">{metric.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Metric Display */}
        {selectedMetric === 'products' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <Package className="mr-2 text-blue-600" />
              Products & Orders (October 2025)
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(products).map(([name, data]) => (
                <div key={name} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-bold text-slate-800 mb-3">{name}</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-slate-600">Orders Received</p>
                      <p className="text-2xl font-bold text-blue-600">{data.orders.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Returned</p>
                      <p className="text-lg font-semibold text-red-600">{data.returned}</p>
                      <p className="text-xs text-slate-500">({((data.returned/data.orders)*100).toFixed(2)}%)</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Revenue</p>
                      <p className="text-lg font-semibold text-green-600">${(data.revenue/1000000).toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Margin</p>
                      <p className="text-sm font-semibold text-purple-600">{data.margin}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedMetric === 'revenue' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <DollarSign className="mr-2 text-green-600" />
              Revenue Performance
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {Object.entries(revenueData).map(([period, data]) => (
                <div key={period} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                  <h3 className="font-bold text-slate-800 mb-4">{period}</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-600">Actual Revenue</p>
                      <p className="text-3xl font-bold text-green-600">
                        ${data.actual > 0 ? (data.actual/1000000).toFixed(0) : '—'}M
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Projected</p>
                      <p className="text-2xl font-semibold text-slate-700">
                        ${(data.projected/1000000).toFixed(0)}M
                      </p>
                    </div>
                    {data.actual > 0 && (
                      <div className={`flex items-center gap-2 ${data.actual >= data.projected ? 'text-green-600' : 'text-orange-600'}`}>
                        {data.actual >= data.projected ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                        <span className="text-sm font-semibold">
                          {((data.actual/data.projected)*100).toFixed(1)}% of target
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedMetric === 'budget' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <BarChart3 className="mr-2 text-purple-600" />
              Quarterly Budget Analysis
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(quarterlyBudget).map(([quarter, depts]) => (
                <div key={quarter}>
                  <h3 className="font-bold text-slate-800 mb-3 text-lg">{quarter}</h3>
                  <div className="space-y-3">
                    {Object.entries(depts).map(([dept, budget]) => (
                      <div key={dept} className="bg-slate-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-slate-700">{dept}</h4>
                          <span className="text-sm font-semibold text-blue-600">
                            ${(budget.allocated/1000000).toFixed(1)}M
                          </span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Spent</span>
                            <span className="font-medium text-slate-800">
                              ${(budget.spent/1000000).toFixed(1)}M
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Remaining</span>
                            <span className="font-medium text-green-600">
                              ${(budget.remaining/1000000).toFixed(1)}M
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(budget.spent/budget.allocated)*100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedMetric === 'support' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <Activity className="mr-2 text-orange-600" />
              Support Operations
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(supportTickets).map(([priority, data]) => (
                <div key={priority} className={`rounded-lg p-4 border-2 ${
                  priority === 'Critical' ? 'bg-red-50 border-red-300' :
                  priority === 'High' ? 'bg-orange-50 border-orange-300' :
                  priority === 'Medium' ? 'bg-yellow-50 border-yellow-300' :
                  'bg-blue-50 border-blue-300'
                }`}>
                  <h3 className="font-bold text-slate-800 mb-3">{priority}</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-slate-600">Open Tickets</p>
                      <p className="text-2xl font-bold text-orange-600">{data.open}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Closed (30d)</p>
                      <p className="text-xl font-semibold text-green-600">{data.closed}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Avg Resolution</p>
                      <p className="text-sm font-semibold text-slate-700">{data.avgResolution}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedMetric === 'employees' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <Users className="mr-2 text-indigo-600" />
              Workforce Insights
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <div className="bg-indigo-50 rounded-lg p-6 mb-4 border border-indigo-200">
                  <p className="text-sm text-slate-600 mb-1">Total Employees</p>
                  <p className="text-5xl font-bold text-indigo-600">{employeeMetrics.total.toLocaleString()}</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(employeeMetrics.departments).map(([dept, count]) => (
                    <div key={dept} className="bg-slate-50 rounded-lg p-4">
                      <p className="text-xs text-slate-600 mb-1">{dept}</p>
                      <p className="text-2xl font-bold text-slate-800">{count.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-700 mb-3">Critical Vacancies</h3>
                <div className="space-y-3">
                  {employeeMetrics.criticalVacancies.map((vacancy, idx) => (
                    <div key={idx} className="bg-red-50 rounded-lg p-3 border-l-4 border-red-500">
                      <p className="font-semibold text-slate-800 text-sm">{vacancy.role}</p>
                      <p className="text-xs text-slate-600 mt-1">{vacancy.location}</p>
                      <p className="text-xs text-red-600 font-medium mt-1">{vacancy.daysOpen} days open</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedMetric === 'stock' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <TrendingUp className="mr-2 text-green-600" />
              HCS Stock Performance
            </h2>
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <p className="text-sm text-slate-600 mb-2">Current Price</p>
                <p className="text-4xl font-bold text-green-600">${stockData.current}</p>
                <p className="text-sm text-green-600 font-semibold mt-1">
                  +${stockData.change} (+{stockData.changePercent}%)
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <p className="text-sm text-slate-600 mb-2">Market Cap</p>
                <p className="text-4xl font-bold text-blue-600">{stockData.marketCap}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                <p className="text-sm text-slate-600 mb-2">30-Day Change</p>
                <p className="text-4xl font-bold text-purple-600">+8.2%</p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
                <p className="text-sm text-slate-600 mb-2">YTD Performance</p>
                <p className="text-4xl font-bold text-indigo-600">+24.5%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}