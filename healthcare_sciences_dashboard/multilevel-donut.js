/**
 * Multilevel Donut Chart Implementation
 * Creates beautiful nested donut charts with multiple levels
 */

class MultilevelDonutChart {
    constructor(canvasId, data, options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.data = data;
        this.options = options;
        this.chart = null;

        this.init();
    }

    init() {
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }

        this.createChart();
    }

    createChart() {
        const {
            outerLabels = [],
            outerData = [],
            innerLabels = [],
            innerData = [],
            colors = []
        } = this.data;

        // Generate colors if not provided
        const outerColors = colors.outer || generateMultilevelColors(outerLabels.length, 'outer');
        const innerColors = colors.inner || generateMultilevelColors(innerLabels.length, 'inner');

        // Create the multilevel donut chart
        this.chart = new Chart(this.canvas, {
            type: 'doughnut',
            data: {
                labels: [...innerLabels, ...outerLabels],
                datasets: [
                    // Inner ring
                    {
                        label: this.options.innerLabel || 'Category',
                        data: [...innerData, ...new Array(outerLabels.length).fill(0)],
                        backgroundColor: [...innerColors, ...new Array(outerLabels.length).fill('transparent')],
                        borderWidth: 3,
                        borderColor: '#ffffff',
                        hoverBorderWidth: 4,
                        hoverBorderColor: '#f0f0f0',
                        borderRadius: 8,
                        weight: 1
                    },
                    // Outer ring
                    {
                        label: this.options.outerLabel || 'Subcategory',
                        data: [...new Array(innerLabels.length).fill(0), ...outerData],
                        backgroundColor: [...new Array(innerLabels.length).fill('transparent'), ...outerColors],
                        borderWidth: 3,
                        borderColor: '#ffffff',
                        hoverBorderWidth: 4,
                        hoverBorderColor: '#f0f0f0',
                        borderRadius: 8,
                        weight: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.4,
                cutout: '45%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 12,
                            font: { size: 10, family: "'Inter', 'system-ui', sans-serif" },
                            usePointStyle: true,
                            pointStyle: 'circle',
                            generateLabels: (chart) => {
                                const datasets = chart.data.datasets;
                                return chart.data.labels.map((label, i) => {
                                    const dataset = i < innerLabels.length ? datasets[0] : datasets[1];
                                    const index = i < innerLabels.length ? i : i - innerLabels.length;
                                    const bgColor = i < innerLabels.length ? innerColors[i] : outerColors[index];

                                    return {
                                        text: label,
                                        fillStyle: bgColor,
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: this.options.title || 'Multilevel Distribution',
                        font: { size: 13, weight: '600', family: "'Inter', 'system-ui', sans-serif" },
                        color: '#1F2937',
                        padding: { bottom: 15 }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1F2937',
                        bodyColor: '#4B5563',
                        borderColor: '#E5E7EB',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const dataset = context.dataset;
                                const total = dataset.data.reduce((acc, val) => acc + (val || 0), 0);
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;

                                if (value === 0) return null;

                                return `${label}: ${value.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    update(newData) {
        this.data = newData;
        this.destroy();
        this.createChart();
    }

    destroy() {
        if (this.chart) this.chart.destroy();
    }
}

// Helper function to create multilevel donut chart
function createMultilevelDonutChart(config) {
    const {
        canvasId,
        innerData,
        outerData,
        colorScheme = 'professional'
    } = config;

    const innerColors = generateMultilevelColors(innerData.labels.length, 'inner', colorScheme);
    const outerColors = generateMultilevelColors(outerData.labels.length, 'outer', colorScheme);

    return new MultilevelDonutChart(canvasId, {
        innerLabels: innerData.labels,
        innerData: innerData.values,
        outerLabels: outerData.labels,
        outerData: outerData.values,
        colors: {
            inner: innerColors,
            outer: outerColors
        }
    }, {
        title: config.title,
        innerLabel: config.innerLabel,
        outerLabel: config.outerLabel
    });
}

// Professional color generator for multilevel charts
function generateMultilevelColors(count, level = 'outer', scheme = 'professional') {
    const colorSchemes = {
        professional: {
            inner: [
                '#BFDBFE', // Light blue
                '#A7F3D0', // Light green
                '#FDE68A', // Light yellow
                '#FCA5A5', // Light red
                '#DDD6FE', // Light purple
                '#FBCFE8'  // Light pink
            ],
            outer: [
                '#93C5FD', // Medium light blue
                '#86EFAC', // Medium light green
                '#FCD34D', // Medium light yellow
                '#F87171', // Medium light red
                '#C4B5FD', // Medium light purple
                '#F9A8D4'  // Medium light pink
            ]
        },
        blue: {
            inner: ['#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA'],
            outer: ['#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF']
        },
        green: {
            inner: ['#D1FAE5', '#A7F3D0', '#6EE7B7', '#34D399'],
            outer: ['#10B981', '#059669', '#047857', '#065F46']
        },
        mixed: {
            inner: ['#DBEAFE', '#D1FAE5', '#FEF3C7', '#FED7AA', '#EDE9FE', '#FCE7F3'],
            outer: ['#93C5FD', '#86EFAC', '#FCD34D', '#FDBA74', '#C4B5FD', '#F9A8D4']
        }
    };

    const colors = colorSchemes[scheme] || colorSchemes.professional;
    let palette = colors[level] || colors.outer;

    // Repeat palette if needed
    while (palette.length < count) {
        palette = palette.concat(palette);
    }

    return palette.slice(0, count);
}

// Make it globally available
window.MultilevelDonutChart = MultilevelDonutChart;
window.createMultilevelDonutChart = createMultilevelDonutChart;
window.generateMultilevelColors = generateMultilevelColors;
