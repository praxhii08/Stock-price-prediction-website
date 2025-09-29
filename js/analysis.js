// Market Analysis functionality
class MarketAnalysis {
    constructor() {
        this.currentTool = 'technical';
        this.charts = {};
        this.indicators = [];
    }

    // Initialize analysis tools
    init() {
        this.setupToolSwitcher();
        this.setupCharts();
        this.setupIndicators();
        this.loadInitialData();
    }

    // Set up tool switching functionality
    setupToolSwitcher() {
        const buttons = document.querySelectorAll('.tool-btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tool = e.target.textContent.toLowerCase().split(' ')[0];
                this.switchTool(tool);
            });
        });
    }

    // Switch between analysis tools
    switchTool(tool) {
        const buttons = document.querySelectorAll('.tool-btn');
        const panels = document.querySelectorAll('.analysis-panel');

        buttons.forEach(button => {
            button.classList.remove('active');
            if (button.textContent.toLowerCase().includes(tool)) {
                button.classList.add('active');
            }
        });

        panels.forEach(panel => {
            panel.classList.remove('active');
            if (panel.id.includes(tool)) {
                panel.classList.add('active');
            }
        });

        this.currentTool = tool;
        this.updateAnalysis();
    }

    // Set up technical analysis charts
    setupCharts() {
        const technicalCtx = document.getElementById('technicalChart').getContext('2d');
        
        this.charts.technical = new Chart(technicalCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Price',
                        data: [],
                        borderColor: 'rgb(41, 98, 255)',
                        fill: false
                    },
                    {
                        label: 'MA(20)',
                        data: [],
                        borderColor: 'rgb(255, 99, 132)',
                        fill: false
                    },
                    {
                        label: 'MA(50)',
                        data: [],
                        borderColor: 'rgb(75, 192, 192)',
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Price (USD)'
                        }
                    }
                }
            }
        });
    }

    // Set up technical indicators
    setupIndicators() {
        // Add event listeners for indicator selectors
        const timeframeSelect = document.getElementById('timeframe');
        const indicatorSelect = document.getElementById('indicators');

        if (timeframeSelect) {
            timeframeSelect.addEventListener('change', () => this.updateAnalysis());
        }

        if (indicatorSelect) {
            indicatorSelect.addEventListener('change', () => this.updateIndicators());
        }
    }

    // Load initial market data
    loadInitialData() {
        const mockData = this.generateMockMarketData();
        this.updateCharts(mockData);
    }

    // Update analysis based on current tool
    updateAnalysis() {
        switch (this.currentTool) {
            case 'technical':
                this.updateTechnicalAnalysis();
                break;
            case 'fundamental':
                this.updateFundamentalAnalysis();
                break;
            case 'sentiment':
                this.updateSentimentAnalysis();
                break;
        }
    }

    // Update technical analysis charts and indicators
    updateTechnicalAnalysis() {
        const mockData = this.generateMockMarketData();
        this.updateCharts(mockData);
        this.updateIndicators();
    }

    // Update fundamental analysis metrics
    updateFundamentalAnalysis() {
        // Update fundamental metrics display
        const metrics = this.generateMockFundamentalMetrics();
        this.displayFundamentalMetrics(metrics);
    }

    // Update market sentiment analysis
    updateSentimentAnalysis() {
        const sentiment = this.generateMockSentimentData();
        this.displaySentimentData(sentiment);
    }

    // Update chart data
    updateCharts(data) {
        if (this.charts.technical) {
            this.charts.technical.data.labels = data.dates;
            this.charts.technical.data.datasets[0].data = data.prices;
            this.charts.technical.data.datasets[1].data = this.calculateMA(data.prices, 20);
            this.charts.technical.data.datasets[2].data = this.calculateMA(data.prices, 50);
            this.charts.technical.update();
        }
    }

    // Update technical indicators
    updateIndicators() {
        const indicators = document.querySelectorAll('.indicator-data .data-row');
        indicators.forEach(indicator => {
            const value = indicator.querySelector('.value');
            if (value) {
                value.textContent = this.generateMockIndicatorValue();
            }
        });
    }

    // Calculate Moving Average
    calculateMA(prices, period) {
        const ma = [];
        for (let i = 0; i < prices.length; i++) {
            if (i < period - 1) {
                ma.push(null);
            } else {
                const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
                ma.push(sum / period);
            }
        }
        return ma;
    }

    // Generate mock market data
    generateMockMarketData() {
        const dates = [];
        const prices = [];
        const currentDate = new Date();
        
        for (let i = 30; i >= 0; i--) {
            const date = new Date(currentDate);
            date.setDate(date.getDate() - i);
            dates.push(date.toLocaleDateString());
            prices.push(Math.random() * 50 + 150); // Random prices between 150 and 200
        }

        return { dates, prices };
    }

    // Generate mock fundamental metrics
    generateMockFundamentalMetrics() {
        return {
            peRatio: (Math.random() * 20 + 15).toFixed(2),
            pbRatio: (Math.random() * 5 + 2).toFixed(2),
            pegRatio: (Math.random() * 1 + 1).toFixed(2),
            debtToEquity: (Math.random() * 50 + 30).toFixed(2),
            currentRatio: (Math.random() * 1 + 1.5).toFixed(2),
            quickRatio: (Math.random() * 0.5 + 1).toFixed(2)
        };
    }

    // Generate mock sentiment data
    generateMockSentimentData() {
        return {
            overallSentiment: Math.random() * 100,
            newsScore: Math.random() * 100,
            socialScore: Math.random() * 100,
            analystRating: (Math.random() * 5).toFixed(1)
        };
    }

    // Generate mock indicator value
    generateMockIndicatorValue() {
        return (Math.random() * 100).toFixed(2);
    }

    // Display fundamental metrics
    displayFundamentalMetrics(metrics) {
        const metricsContainer = document.querySelector('.fundamental-metrics');
        if (metricsContainer) {
            Object.entries(metrics).forEach(([key, value]) => {
                const element = metricsContainer.querySelector(`[data-metric="${key}"]`);
                if (element) {
                    element.textContent = value;
                }
            });
        }
    }

    // Display sentiment data
    displaySentimentData(sentiment) {
        const sentimentContainer = document.querySelector('.sentiment-overview');
        if (sentimentContainer) {
            const scoreElement = sentimentContainer.querySelector('.score-value');
            if (scoreElement) {
                scoreElement.textContent = `${sentiment.overallSentiment.toFixed(1)}%`;
                scoreElement.className = 'score-value ' + 
                    (sentiment.overallSentiment >= 50 ? 'positive' : 'negative');
            }
        }
    }
}

// Initialize analysis when page loads
document.addEventListener('DOMContentLoaded', () => {
    const analysis = new MarketAnalysis();
    analysis.init();
});