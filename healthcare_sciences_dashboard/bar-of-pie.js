/**
 * Bar of Pie Chart Implementation
 * Creates a composite chart with a pie chart and a bar chart showing breakdown of one slice
 */

class BarOfPieChart {
    constructor(pieCanvasId, barCanvasId, data, options = {}) {
        this.pieCanvas = document.getElementById(pieCanvasId);
        this.barCanvas = document.getElementById(barCanvasId);
        this.data = data;
        this.options = options;
        this.pieChart = null;
        this.barChart = null;

        this.init();
    }

    init() {
        if (!this.pieCanvas || !this.barCanvas) {
            console.error('Canvas elements not found');
            return;
        }

        this.createCharts();
    }

    createCharts() {
        const {
            pieLabels = [],
            pieData = [],
            pieColors = [],
            breakdownIndex = 0, // Which slice to break down
            breakdownLabels = [],
            breakdownData = [],
            breakdownColors = []
        } = this.data;

        // Create Pie Chart
        this.pieChart = new Chart(this.pieCanvas, {
            type: 'pie',
            data: {
                labels: pieLabels,
                datasets: [{
                    data: pieData,
                    backgroundColor: pieColors,
                    borderWidth: 3,
                    borderColor: '#ffffff',
                    hoverBorderWidth: 4,
                    hoverBorderColor: '#f0f0f0'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.3,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 8,
                            font: { size: 10 },
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    title: {
                        display: true,
                        text: this.options.pieTitle || 'Overview',
                        font: { size: 11, weight: '600', family: "'Inter', 'system-ui', sans-serif" },
                        color: '#1F2937',
                        padding: { bottom: 8 }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1F2937',
                        bodyColor: '#4B5563',
                        borderColor: '#E5E7EB',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });

        // Create Bar Chart for breakdown
        this.barChart = new Chart(this.barCanvas, {
            type: 'bar',
            data: {
                labels: breakdownLabels,
                datasets: [{
                    label: this.options.breakdownTitle || 'Breakdown',
                    data: breakdownData,
                    backgroundColor: breakdownColors,
                    borderWidth: 2,
                    borderColor: '#ffffff',
                    borderRadius: 6,
                    hoverBackgroundColor: breakdownColors.map(c => c.replace('B3', 'E6'))
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.4,
                indexAxis: 'y', // Horizontal bars
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: this.options.breakdownTitle || 'Detailed Breakdown',
                        font: { size: 11, weight: '600', family: "'Inter', 'system-ui', sans-serif" },
                        color: '#1F2937',
                        padding: { bottom: 8 }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1F2937',
                        bodyColor: '#4B5563',
                        borderColor: '#E5E7EB',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.x || 0;
                                return `${context.label}: ${value.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            color: '#F3F4F6',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#6B7280',
                            font: { size: 10 },
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#6B7280',
                            font: { size: 10 }
                        }
                    }
                }
            }
        });
    }

    update(newData) {
        this.data = newData;
        this.destroy();
        this.createCharts();
    }

    destroy() {
        if (this.pieChart) this.pieChart.destroy();
        if (this.barChart) this.barChart.destroy();
    }
}

// Helper function to create Bar of Pie chart with default styling
function createBarOfPieChart(config) {
    const {
        pieCanvasId,
        barCanvasId,
        mainData,
        breakdownData,
        colorScheme = 'default'
    } = config;

    // Generate colors based on color scheme
    const pieColors = generateColorPalette(mainData.labels.length, colorScheme);
    const breakdownColors = generateColorPalette(breakdownData.labels.length, colorScheme, true);

    return new BarOfPieChart(pieCanvasId, barCanvasId, {
        pieLabels: mainData.labels,
        pieData: mainData.values,
        pieColors: pieColors,
        breakdownIndex: config.breakdownIndex || 0,
        breakdownLabels: breakdownData.labels,
        breakdownData: breakdownData.values,
        breakdownColors: breakdownColors
    }, {
        pieTitle: config.pieTitle,
        breakdownTitle: config.breakdownTitle
    });
}

// Color palette generator - Professional light colors
function generateColorPalette(count, scheme = 'default', lighter = false) {
    const schemes = {
        default: [
            '#93C5FD', // Light blue
            '#86EFAC', // Light green
            '#FCD34D', // Light yellow
            '#FCA5A5', // Light red
            '#C4B5FD', // Light purple
            '#F9A8D4', // Light pink
            '#67E8F9', // Light cyan
            '#FDE68A'  // Light amber
        ],
        blue: [
            '#DBEAFE', // Lightest blue
            '#BFDBFE', // Very light blue
            '#93C5FD', // Light blue
            '#60A5FA', // Sky blue
            '#3B82F6'  // Medium blue (still light)
        ],
        green: [
            '#D1FAE5', // Lightest green
            '#A7F3D0', // Very light green
            '#6EE7B7', // Light green
            '#34D399', // Mint green
            '#10B981'  // Medium green
        ],
        purple: [
            '#EDE9FE', // Lightest purple
            '#DDD6FE', // Very light purple
            '#C4B5FD', // Light purple
            '#A78BFA', // Medium light purple
            '#8B5CF6'  // Medium purple
        ],
        mixed: [
            '#DBEAFE', // Light blue
            '#D1FAE5', // Light green
            '#FEF3C7', // Light yellow
            '#FED7AA', // Light orange
            '#EDE9FE', // Light purple
            '#FCE7F3', // Light pink
            '#CFFAFE', // Light cyan
            '#FEE2E2'  // Light red
        ]
    };

    let palette = schemes[scheme] || schemes.default;

    if (lighter) {
        // Create even lighter versions for breakdown with subtle transparency
        palette = palette.map(color => {
            return color + 'B3'; // Add subtle transparency (70%)
        });
    }

    // Repeat palette if needed
    while (palette.length < count) {
        palette = palette.concat(palette);
    }

    return palette.slice(0, count);
}

// Make it globally available
window.BarOfPieChart = BarOfPieChart;
window.createBarOfPieChart = createBarOfPieChart;
