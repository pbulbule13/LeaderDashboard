/**
 * Apple Watch Style Progress Ring Chart
 * Simple, beautiful progress rings like Apple Watch activity
 */

class ProgressRingChart {
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
            labels = [],
            values = [],
            maxValues = [],
            colors = []
        } = this.data;

        // Calculate percentages
        const percentages = values.map((val, i) => {
            const max = maxValues[i] || 100;
            return Math.min((val / max) * 100, 100);
        });

        // Generate colors if not provided
        const ringColors = colors.length > 0 ? colors : generateProgressColors(labels.length);

        //Create chart datasets - one ring per data point
        const datasets = labels.map((label, index) => {
            const percentage = percentages[index];
            const remaining = 100 - percentage;

            return {
                label: label,
                data: [percentage, remaining],
                backgroundColor: [ringColors[index], 'rgba(229, 231, 235, 0.3)'],
                borderWidth: 0,
                cutout: `${50 + (index * 12)}%`, // Each ring gets progressively smaller - thicker rings
                circumference: 360,
                rotation: -90, // Start from top
                borderRadius: 10,
                spacing: 0
            };
        });

        this.chart = new Chart(this.canvas, {
            type: 'doughnut',
            data: {
                labels: ['Progress', 'Remaining'],
                datasets: datasets.reverse() // Reverse so innermost is first
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: !!this.options.title,
                        text: this.options.title || '',
                        font: { size: 13, weight: '600', family: "'Inter', 'system-ui', sans-serif" },
                        color: '#1F2937',
                        padding: { bottom: 15 }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1F2937',
                        bodyColor: '#4B5563',
                        borderColor: '#E5E7EB',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            title: (tooltipItems) => {
                                const datasetIndex = tooltipItems[0].datasetIndex;
                                return labels[labels.length - 1 - datasetIndex]; // Reverse index
                            },
                            label: (context) => {
                                if (context.dataIndex === 0) {
                                    const datasetIndex = context.datasetIndex;
                                    const actualIndex = labels.length - 1 - datasetIndex;
                                    const value = values[actualIndex];
                                    const max = maxValues[actualIndex] || 100;
                                    const percentage = percentages[actualIndex].toFixed(1);
                                    return `${value.toLocaleString()} / ${max.toLocaleString()} (${percentage}%)`;
                                }
                                return null;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: false,
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });

        // Add center text
        this.addCenterText();
    }

    addCenterText() {
        if (!this.options.showCenterText) return;

        const centerPlugin = {
            id: 'centerText',
            beforeDraw: (chart) => {
                const ctx = chart.ctx;
                const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
                const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;

                ctx.save();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#1F2937';
                ctx.font = 'bold 24px Inter, system-ui, sans-serif';

                const mainValue = this.data.values[0];
                ctx.fillText(mainValue.toLocaleString(), centerX, centerY - 5);

                ctx.fillStyle = '#6B7280';
                ctx.font = '12px Inter, system-ui, sans-serif';
                ctx.fillText(this.options.centerLabel || '', centerX, centerY + 15);

                ctx.restore();
            }
        };

        this.chart.options.plugins.push(centerPlugin);
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

// Helper function to create progress ring chart
function createProgressRingChart(config) {
    const {
        canvasId,
        labels,
        values,
        maxValues,
        colors,
        title,
        centerLabel,
        showCenterText = true
    } = config;

    return new ProgressRingChart(canvasId, {
        labels: labels,
        values: values,
        maxValues: maxValues,
        colors: colors || generateProgressColors(labels.length)
    }, {
        title: title,
        centerLabel: centerLabel,
        showCenterText: showCenterText
    });
}

// Apple Watch style color generator
function generateProgressColors(count) {
    const appleWatchColors = [
        '#FF2D55', // Move ring (red/pink)
        '#00FF00', // Exercise ring (green)
        '#00C7BE', // Stand ring (cyan)
        '#5856D6', // Purple
        '#FF9500', // Orange
        '#FFCC00'  // Yellow
    ];

    const colors = [];
    for (let i = 0; i < count; i++) {
        colors.push(appleWatchColors[i % appleWatchColors.length]);
    }
    return colors;
}

// Make it globally available
window.ProgressRingChart = ProgressRingChart;
window.createProgressRingChart = createProgressRingChart;
window.generateProgressColors = generateProgressColors;
