const API_BASE = 'http://localhost:8000';
let overviewChartsCreated = false;
let charts = {};

// Set current date
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    // Initialize
    switchTab('overview');
    loadOverviewData();
    loadStockData();
    renderNotes();
    generateCalendar();

    // Auto-refresh every 5 minutes
    setInterval(() => {
        loadOverviewData();
        loadStockData();
    }, 300000);
});

// AI Panel Functions
function toggleAIPanel() {
    const panel = document.getElementById('aiPanel');
    panel.classList.toggle('translate-x-full');
}

async function askAI() {
    const input = document.getElementById('aiQueryInput');
    const query = input.value.trim();
    if (!query) return;

    const chatMessages = document.getElementById('aiChatMessages');

    chatMessages.innerHTML += `
        <div class="flex justify-end">
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-3 max-w-[80%]">
                <p class="text-sm">${query}</p>
            </div>
        </div>
    `;
    chatMessages.scrollTop = chatMessages.scrollHeight;
    input.value = '';

    chatMessages.innerHTML += `
        <div id="loading" class="flex justify-start">
            <div class="bg-gray-200 rounded-lg p-3">
                <p class="text-sm text-gray-600">AI is analyzing...</p>
            </div>
        </div>
    `;
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const response = await fetch(`${API_BASE}/api/query/ask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, context: {} })
        });

        const result = await response.json();
        document.getElementById('loading').remove();

        if (result.success) {
            chatMessages.innerHTML += `
                <div class="flex justify-start">
                    <div class="bg-white border border-gray-200 rounded-lg p-3 max-w-[80%]">
                        <p class="text-sm text-gray-700">${result.response}</p>
                    </div>
                </div>
            `;
        } else {
            chatMessages.innerHTML += `
                <div class="flex justify-start">
                    <div class="bg-red-50 border border-red-200 rounded-lg p-3 max-w-[80%]">
                        <p class="text-sm text-red-700">Error: Failed to get response</p>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        document.getElementById('loading')?.remove();
        chatMessages.innerHTML += `
            <div class="flex justify-start">
                <div class="bg-red-50 border border-red-200 rounded-lg p-3 max-w-[80%]">
                    <p class="text-sm text-red-700">Error: ${error.message}</p>
                </div>
            </div>
        `;
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function askQuick(query) {
    document.getElementById('aiQueryInput').value = query;
    askAI();
}

// Notes Functions
let notes = JSON.parse(localStorage.getItem('ceoNotes') || '[]');

function saveNote() {
    const noteText = document.getElementById('quickNotes').value.trim();
    if (!noteText) return;

    const note = {
        id: Date.now(),
        text: noteText,
        timestamp: new Date().toLocaleString()
    };

    notes.unshift(note);
    localStorage.setItem('ceoNotes', JSON.stringify(notes));

    document.getElementById('quickNotes').value = '';
    renderNotes();
}

function renderNotes() {
    const container = document.getElementById('savedNotes');
    if (notes.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = notes.slice(0, 3).map(note => `
        <div class="bg-white rounded-lg shadow p-3 border border-amber-300">
            <p class="text-sm text-gray-700">${note.text}</p>
            <div class="flex items-center justify-between mt-2">
                <p class="text-xs text-gray-500">${note.timestamp}</p>
                <button onclick="deleteNote(${note.id})" class="text-xs text-red-600 hover:underline">Delete</button>
            </div>
        </div>
    `).join('');
}

function deleteNote(id) {
    notes = notes.filter(n => n.id !== id);
    localStorage.setItem('ceoNotes', JSON.stringify(notes));
    renderNotes();
}

function viewAllNotes() {
    alert(`You have ${notes.length} saved notes.`);
}

// Tab Switching
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('[id^="tab-"]').forEach(el => el.classList.remove('tab-active'));
    document.getElementById('content-' + tabName).classList.remove('hidden');
    document.getElementById('tab-' + tabName).classList.add('tab-active');

    if (tabName === 'orders') loadOrdersData();
    else if (tabName === 'compliance') loadComplianceData();
    else if (tabName === 'reimbursement') loadReimbursementData();
    else if (tabName === 'costs') loadCostsData();
    else if (tabName === 'lab') loadLabData();
    else if (tabName === 'regional') loadRegionalData();
    else if (tabName === 'forecasting') loadForecastingData();
    else if (tabName === 'market') loadMarketData();
    else if (tabName === 'milestones') loadMilestonesData();
}

// Create Overview Charts
function createOverviewCharts(data) {
    if (overviewChartsCreated) return;

    // Orders Trend Chart
    const ordersCtx = document.getElementById('overviewOrdersChart').getContext('2d');
    charts.overviewOrders = new Chart(ordersCtx, {
        type: 'line',
        data: {
            labels: data.order_volume.trend_data.map(t => t.period),
            datasets: [{
                label: 'Orders',
                data: data.order_volume.trend_data.map(t => t.count),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return (value / 1000) + 'K';
                        }
                    }
                }
            }
        }
    });

    // Financial Chart
    const financialCtx = document.getElementById('overviewFinancialsChart').getContext('2d');
    charts.overviewFinancials = new Chart(financialCtx, {
        type: 'bar',
        data: {
            labels: data.operating_costs.monthly_trend.slice(-6).map(m => m.month),
            datasets: [{
                label: 'Operating Costs',
                data: data.operating_costs.monthly_trend.slice(-6).map(m => m.total_cost / 1000000),
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
                borderColor: 'rgb(239, 68, 68)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value + 'M';
                        }
                    }
                }
            }
        }
    });

    overviewChartsCreated = true;
}

// Load Overview Data
async function loadOverviewData() {
    try {
        const response = await fetch(`${API_BASE}/api/dashboard/overview`);
        const result = await response.json();
        if (!result.success) return;

        const data = result.data;

        // Update KPI cards
        document.getElementById('overview-orders').textContent = data.order_volume.monthly_orders.toLocaleString();
        document.getElementById('overview-orders-growth').textContent = `↑ ${data.order_volume.growth_metrics.mom}% MoM`;

        document.getElementById('overview-compliance').textContent = `${(100 - data.compliance.overall_return_rate).toFixed(1)}%`;
        document.getElementById('overview-compliance-returns').textContent = `${data.compliance.total_returns} returns`;

        document.getElementById('overview-reimbursement').textContent = `${data.reimbursement.reimbursement_percentage.toFixed(1)}%`;
        document.getElementById('overview-reimbursement-claims').textContent = `${data.reimbursement.claims_reimbursed.toLocaleString()} approved`;

        document.getElementById('overview-lab').textContent = `${data.lab_metrics.average_turnaround_hours.toFixed(1)}h`;
        document.getElementById('overview-lab-target').textContent = `Target: ${data.lab_metrics.target_turnaround_hours}h`;

        document.getElementById('overview-costs').textContent = `$${(data.operating_costs.total_operating_costs / 1000000).toFixed(1)}M`;
        document.getElementById('overview-costs-trend').textContent = `Monthly`;

        document.getElementById('overview-forecast').textContent = `${(data.forecasting.next_quarter_orders / 1000).toFixed(0)}K`;
        document.getElementById('overview-forecast-growth').textContent = `Projected`;

        // Create charts
        createOverviewCharts(data);

        // Stock summary
        document.getElementById('overview-stock-summary').innerHTML = `
            <div class="text-center mb-4">
                <p class="text-sm text-gray-600">HCS Stock Price</p>
                <p class="text-4xl font-bold ${data.stock.current_price.change >= 0 ? 'text-green-600' : 'text-red-600'}">$${data.stock.current_price.price}</p>
                <p class="text-sm ${data.stock.current_price.change >= 0 ? 'text-green-600' : 'text-red-600'} mt-2">${data.stock.current_price.change >= 0 ? '↑' : '↓'} $${Math.abs(data.stock.current_price.change).toFixed(2)} (${data.stock.current_price.change_percentage}%)</p>
            </div>
            <div class="space-y-2 text-sm border-t pt-4">
                <div class="flex justify-between">
                    <span class="text-gray-600">Day High:</span>
                    <span class="font-semibold">$${data.stock.day_high}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Day Low:</span>
                    <span class="font-semibold">$${data.stock.day_low}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Volume:</span>
                    <span class="font-semibold">${(data.stock.volume / 1000000).toFixed(2)}M</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">P/E Ratio:</span>
                    <span class="font-semibold">${data.stock.pe_ratio}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Market Cap:</span>
                    <span class="font-semibold">${data.stock.market_cap}</span>
                </div>
            </div>
        `;

        // Regional
        document.getElementById('overview-regional').innerHTML = data.regional.territories.slice(0, 5).map(t => `
            <div class="flex justify-between text-sm hover:bg-gray-50 p-2 rounded cursor-pointer" onclick="switchTab('regional')">
                <span class="font-medium">${t.territory_name}</span>
                <span class="font-bold text-blue-600">${t.orders.toLocaleString()}</span>
            </div>
        `).join('');

        // Projects
        document.getElementById('overview-projects').innerHTML = `
            <div class="space-y-2">
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Total Projects:</span>
                    <span class="font-bold">${data.milestones.total_projects}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">On Track:</span>
                    <span class="font-bold text-green-600">${data.milestones.projects_on_track}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">At Risk:</span>
                    <span class="font-bold text-orange-600">${data.milestones.projects_at_risk}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Delayed:</span>
                    <span class="font-bold text-red-600">${data.milestones.projects_delayed}</span>
                </div>
            </div>
            ${data.milestones.active_projects.slice(0, 2).map(p => `
                <div class="text-xs p-2 rounded mt-2 ${p.overall_status === 'on_track' ? 'bg-green-50' : p.overall_status === 'at_risk' ? 'bg-orange-50' : 'bg-red-50'}">
                    <div class="flex justify-between mb-1">
                        <span class="font-medium">${p.project_name}</span>
                        <span class="font-bold">${p.completion_percentage}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-1">
                        <div class="${p.overall_status === 'on_track' ? 'bg-green-500' : p.overall_status === 'at_risk' ? 'bg-orange-500' : 'bg-red-500'} h-1 rounded-full" style="width: ${p.completion_percentage}%"></div>
                    </div>
                </div>
            `).join('')}
        `;

        // Alerts
        const alerts = [];
        if (data.milestones.critical_items.length > 0) {
            alerts.push(...data.milestones.critical_items.map(item => `<div class="bg-orange-50 border-l-4 border-orange-500 rounded p-2 text-xs">${item}</div>`));
        }
        if (data.market_intelligence.critical_alerts.length > 0) {
            alerts.push(...data.market_intelligence.critical_alerts.map(alert => `<div class="bg-red-50 border-l-4 border-red-500 rounded p-2 text-xs">${alert}</div>`));
        }
        document.getElementById('overview-alerts').innerHTML = alerts.length > 0 ? alerts.slice(0, 4).join('') : '<p class="text-gray-600 text-sm">No critical alerts</p>';

        // Operations
        document.getElementById('overview-stats').innerHTML = `
            <div class="space-y-3">
                <div>
                    <div class="flex justify-between text-sm mb-1">
                        <span class="text-gray-600">Lab Capacity:</span>
                        <span class="font-bold">${data.lab_metrics.lab_capacity.utilization_percentage.toFixed(0)}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-500 h-2 rounded-full" style="width: ${data.lab_metrics.lab_capacity.utilization_percentage}%"></div>
                    </div>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Efficiency:</span>
                    <span class="font-bold">${data.lab_metrics.efficiency_score}%</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Error Rate:</span>
                    <span class="font-bold ${data.lab_metrics.error_rate < 1 ? 'text-green-600' : 'text-orange-600'}">${data.lab_metrics.error_rate}%</span>
                </div>
            </div>
        `;

        // Market Intelligence
        document.getElementById('overview-market').innerHTML = data.market_intelligence.latest_news.slice(0, 4).map(n => `
            <div class="text-sm p-3 rounded border-l-4 ${n.importance === 'high' ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50'}">
                <p class="font-semibold text-xs mb-1">${n.title}</p>
                <p class="text-xs text-gray-600">${n.summary}</p>
                <p class="text-xs text-gray-500 mt-1">${n.source} | ${n.date}</p>
            </div>
        `).join('');

        // Competitors
        document.getElementById('overview-competitors').innerHTML = data.market_intelligence.competitor_updates.slice(0, 4).map(c => `
            <div class="text-sm p-3 rounded border-l-4 ${c.impact_level === 'high' ? 'border-red-500 bg-red-50' : 'border-orange-500 bg-orange-50'}">
                <p class="font-semibold text-xs mb-1">${c.competitor_name}</p>
                <p class="text-xs text-gray-700">${c.description}</p>
                <p class="text-xs text-gray-500 mt-1">Impact: ${c.impact_level.toUpperCase()}</p>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading overview:', error);
    }
}

// Load Stock Data
async function loadStockData() {
    try {
        const response = await fetch(`${API_BASE}/api/dashboard/tiles/stock`);
        const result = await response.json();
        if (result.success) {
            const stock = result.data.current_price;
            document.getElementById('stockPrice').innerHTML = `
                <p class="text-xs text-gray-600">HCS Stock</p>
                <p class="text-xl font-bold ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}">$${stock.price}</p>
                <p class="text-xs ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}">${stock.change >= 0 ? '↑' : '↓'} ${stock.change_percentage}%</p>
            `;
        }
    } catch (error) {
        console.error('Error loading stock data:', error);
    }
}

// Email Functions
function composeEmail() {
    alert('Opening email composer...');
}

function loadEmails(folder) {
    alert(`Loading ${folder} folder...`);
}

function refreshEmails() {
    alert('Refreshing emails...');
}

function aiSummarizeEmails() {
    alert('AI is summarizing your inbox...');
}

function aiPriorityEmails() {
    alert('AI is finding priority emails...');
}

// Calendar Functions
function scheduleNewMeeting() {
    alert('Opening meeting scheduler...');
}

function generateCalendar() {
    const grid = document.getElementById('calendarGrid');
    if (!grid) return;

    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = '';

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="p-2"></div>';
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today.getDate();
        html += `
            <div class="p-2 text-center hover:bg-blue-50 rounded cursor-pointer ${isToday ? 'bg-blue-600 text-white font-bold' : 'text-gray-700'}">
                ${day}
            </div>
        `;
    }

    grid.innerHTML = html;
}

// Placeholder load functions for other tabs
async function loadOrdersData() {
    // Will be implemented with charts
}

async function loadComplianceData() {
    // Will be implemented with charts
}

async function loadReimbursementData() {
    // Will be implemented with charts
}

async function loadCostsData() {
    // Will be implemented with charts
}

async function loadLabData() {
    // Will be implemented with charts
}

async function loadRegionalData() {
    // Will be implemented with charts
}

async function loadForecastingData() {
    // Will be implemented with charts
}

async function loadMarketData() {
    // Will be implemented with charts
}

async function loadMilestonesData() {
    // Will be implemented with charts
}

// ==================== INTERACTIVE METRIC CHARTS ====================

// Store metric data and chart instances for interactive period switching
let metricData = {
    orders: null,
    reimbursement: null,
    compliance: null,
    lab: null,
    costs: null,
    forecast: null
};

let metricCharts = {};
let currentPeriods = {
    orders: 'day',
    reimbursement: 'day',
    compliance: 'day',
    lab: 'day',
    costs: 'day',
    forecast: 'day'
};

// Generate sample data for different time periods
function generateMetricData(metric, period) {
    const periods = {
        day: { labels: ['12AM', '4AM', '8AM', '12PM', '4PM', '8PM'], count: 6 },
        week: { labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], count: 7 },
        month: { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], count: 4 },
        year: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], count: 12 }
    };

    const config = periods[period];
    const data = [];

    const baseValues = {
        orders: { day: 1500, week: 35000, month: 250000, year: 1000000 },
        reimbursement: { day: 97, week: 98, month: 99, year: 98.5 },
        compliance: { day: 99.2, week: 99.4, month: 99.3, year: 99.5 },
        lab: { day: 38, week: 39, month: 40, year: 39 },
        costs: { day: 3500000, week: 24500000, month: 103500000, year: 1242000000 },
        forecast: { day: 45000, week: 315000, month: 1350000, year: 16200000 }
    };

    const baseValue = baseValues[metric][period];

    for (let i = 0; i < config.count; i++) {
        const variance = (Math.random() - 0.5) * 0.2; // ±10% variance
        data.push(baseValue * (1 + variance));
    }

    return { labels: config.labels, data };
}

// Update metric chart when period button is clicked
function updateMetricPeriod(metric, period) {
    currentPeriods[metric] = period;

    // Update button styles
    const buttons = document.querySelectorAll(`[data-metric="${metric}"]`);
    buttons.forEach(btn => {
        const btnPeriod = btn.getAttribute('data-period');
        if (btnPeriod === period) {
            btn.className = `period-btn px-2 py-1 text-xs rounded font-semibold`;
            const colors = {
                orders: 'bg-blue-100 text-blue-600',
                reimbursement: 'bg-purple-100 text-purple-600',
                compliance: 'bg-green-100 text-green-600',
                lab: 'bg-orange-100 text-orange-600',
                costs: 'bg-red-100 text-red-600',
                forecast: 'bg-indigo-100 text-indigo-600'
            };
            btn.className += ` ${colors[metric]}`;
        } else {
            btn.className = 'period-btn px-2 py-1 text-xs rounded hover:bg-gray-100 text-gray-600';
        }
    });

    // Update chart
    const { labels, data } = generateMetricData(metric, period);
    const chart = metricCharts[metric];

    if (chart) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = data;
        chart.update();
    }
}

// Create all metric charts
function createMetricCharts() {
    const chartConfigs = {
        orders: { color: 'rgba(59, 130, 246', label: 'Orders', format: (v) => (v/1000).toFixed(0) + 'K' },
        reimbursement: { color: 'rgba(168, 85, 247', label: 'Reimbursement %', format: (v) => v.toFixed(1) + '%' },
        compliance: { color: 'rgba(34, 197, 94', label: 'Compliance %', format: (v) => v.toFixed(1) + '%' },
        lab: { color: 'rgba(249, 115, 22', label: 'TAT (hours)', format: (v) => v.toFixed(1) + 'h' },
        costs: { color: 'rgba(239, 68, 68', label: 'Costs', format: (v) => '$' + (v/1000000).toFixed(1) + 'M' },
        forecast: { color: 'rgba(99, 102, 241', label: 'Forecast', format: (v) => (v/1000).toFixed(0) + 'K' }
    };

    Object.keys(chartConfigs).forEach(metric => {
        const canvas = document.getElementById(`chart${metric.charAt(0).toUpperCase() + metric.slice(1)}`);
        if (!canvas) return;

        const config = chartConfigs[metric];
        const { labels, data } = generateMetricData(metric, 'day');

        metricCharts[metric] = new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: config.label,
                    data,
                    borderColor: config.color + ', 1)',
                    backgroundColor: config.color + ', 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => config.format(context.parsed.y)
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: metric === 'reimbursement' || metric === 'compliance' ? false : true,
                        ticks: {
                            callback: config.format
                        }
                    },
                    x: {
                        ticks: {
                            font: { size: 10 }
                        }
                    }
                }
            }
        });
    });
}

// ==================== AI REASONING WIDGET ====================

let reasoningWidgetCollapsed = false;

function toggleReasoningWidget() {
    const widget = document.getElementById('aiReasoningWidget');
    const content = document.getElementById('reasoningContent');
    const btn = event.target;

    if (reasoningWidgetCollapsed) {
        content.classList.remove('hidden');
        btn.textContent = '−';
        reasoningWidgetCollapsed = false;
    } else {
        content.classList.add('hidden');
        btn.textContent = '+';
        reasoningWidgetCollapsed = true;
    }
}

async function askReasoning() {
    const input = document.getElementById('reasoningInput');
    const query = input.value.trim();
    if (!query) return;

    const messages = document.getElementById('reasoningMessages');

    messages.innerHTML += `
        <div class="bg-purple-50 border border-purple-200 rounded p-2 text-xs">
            <strong>You:</strong> ${query}
        </div>
    `;
    messages.scrollTop = messages.scrollHeight;
    input.value = '';

    try {
        const response = await fetch(`${API_BASE}/api/query/ask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, context: { page: getCurrentTab() } })
        });

        const result = await response.json();

        if (result.success) {
            messages.innerHTML += `
                <div class="bg-white border border-gray-200 rounded p-2 text-xs">
                    <strong>AI:</strong> ${result.response}
                </div>
            `;
        } else {
            messages.innerHTML += `
                <div class="bg-red-50 border border-red-200 rounded p-2 text-xs">
                    Error: Failed to analyze
                </div>
            `;
        }
    } catch (error) {
        messages.innerHTML += `
            <div class="bg-red-50 border border-red-200 rounded p-2 text-xs">
                Error: ${error.message}
            </div>
        `;
    }

    messages.scrollTop = messages.scrollHeight;
}

function analyzeCurrentPage() {
    const currentTab = getCurrentTab();
    document.getElementById('reasoningInput').value = `Analyze all metrics on the ${currentTab} page and provide insights`;
    askReasoning();
}

function getCurrentTab() {
    const activeTab = document.querySelector('[id^="tab-"].tab-active');
    return activeTab ? activeTab.id.replace('tab-', '') : 'overview';
}

// ==================== QUICK NOTES ====================

function saveQuickNote() {
    const input = document.getElementById('quickNoteInput');
    const note = input.value.trim();
    if (!note) return;

    const notes = JSON.parse(localStorage.getItem('quickNotes') || '[]');
    notes.unshift({
        id: Date.now(),
        text: note,
        timestamp: new Date().toLocaleString()
    });

    // Keep only last 10 notes
    if (notes.length > 10) notes.pop();

    localStorage.setItem('quickNotes', JSON.stringify(notes));
    input.value = '';
    renderQuickNotes();
}

function renderQuickNotes() {
    const display = document.getElementById('quickNotesDisplay');
    if (!display) return;

    const notes = JSON.parse(localStorage.getItem('quickNotes') || '[]');

    if (notes.length === 0) {
        display.innerHTML = '<p class="text-gray-400 text-xs">No notes yet</p>';
        return;
    }

    display.innerHTML = notes.slice(0, 3).map(note => `
        <div class="bg-amber-50 border-l-2 border-amber-500 p-2 rounded">
            <p class="text-gray-800">${note.text}</p>
            <p class="text-gray-400 text-xs mt-1">${note.timestamp}</p>
        </div>
    `).join('');
}

// Initialize metric charts and quick notes on load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        createMetricCharts();
        renderQuickNotes();
    }, 1000);
});
