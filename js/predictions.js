// Stock Prediction functionality
class StockPredictor {
    constructor() {
        this.apiEndpoint = '/api/predictions'; // Would point to actual API in production
        this.chartInstance = null;
        this.currentSymbol = null;
    }

    // Initialize prediction charts and functionality
    init() {
        this.setupSearchHandler();
        this.setupChart();
        // Load default stock (AAPL)
        this.loadStock('AAPL');
    }

    // Setup search functionality
    setupSearchHandler() {
        const searchInput = document.getElementById('stockSearch');
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchStock();
            }
        });
    }

    // Handle stock search
    async searchStock() {
        const searchInput = document.getElementById('stockSearch');
        const symbol = searchInput.value.toUpperCase();
        
        if (symbol) {
            this.loadStock(symbol);
        }
    }

    // Load stock data and predictions
    async loadStock(symbol) {
        // In a real application, this would fetch from an API
        // For demo, we'll use mock data
        const mockData = this.getMockStockData(symbol);
        
        this.currentSymbol = symbol;
        this.updatePredictionDisplay(mockData);
        this.updateChart(mockData);
    }

    // Setup prediction chart
    setupChart() {
        const ctx = document.getElementById('predictionChart').getContext('2d');
        this.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Historical Price',
                    data: [],
                    borderColor: 'rgb(41, 98, 255)',
                    fill: false
                },
                {
                    label: 'Predicted Price',
                    data: [],
                    borderColor: 'rgb(255, 99, 132)',
                    borderDash: [5, 5],
                    fill: false
                }]
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

    // Update chart with new data
    updateChart(data) {
        const dates = [...data.historicalDates, ...data.futureDates];
        const historicalPrices = data.historicalPrices;
        const predictedPrices = data.predictedPrices;

        this.chartInstance.data.labels = dates;
        this.chartInstance.data.datasets[0].data = historicalPrices;
        this.chartInstance.data.datasets[1].data = Array(historicalPrices.length).fill(null).concat(predictedPrices);
        
        this.chartInstance.update();
    }

    // Update prediction display
    updatePredictionDisplay(data) {
        const predictionResult = document.getElementById('predictionResult');
        const stockInfo = predictionResult.querySelector('.stock-info h2');
        const currentPrice = predictionResult.querySelector('.current-price .value');
        
        stockInfo.textContent = `${data.symbol} - ${data.companyName}`;
        currentPrice.textContent = formatPrice(data.currentPrice);

        // Update prediction cards
        const cards = predictionResult.querySelectorAll('.prediction-card');
        cards.forEach((card, index) => {
            const prediction = data.predictions[index];
            const valueElement = card.querySelector('.prediction-value');
            const changeElement = card.querySelector('.prediction-change');
            const confidenceElement = card.querySelector('.confidence');

            valueElement.textContent = formatPrice(prediction.price);
            changeElement.textContent = formatPercentage(prediction.change);
            confidenceElement.textContent = `Confidence: ${prediction.confidence}%`;

            // Update classes for styling
            valueElement.className = 'prediction-value ' + (prediction.change >= 0 ? 'up' : 'down');
            changeElement.className = 'prediction-change ' + (prediction.change >= 0 ? 'up' : 'down');
        });
    }

    // Generate mock stock data for demonstration
    getMockStockData(symbol) {
        const currentDate = new Date();
        const dates = [];
        const historicalPrices = [];
        const futureDates = [];
        const predictedPrices = [];

        // Generate historical data
        for (let i = 30; i >= 0; i--) {
            const date = new Date(currentDate);
            date.setDate(date.getDate() - i);
            dates.push(date.toLocaleDateString());
            historicalPrices.push(Math.random() * 50 + 150); // Random prices between 150 and 200
        }

        // Generate future dates and predictions
        for (let i = 1; i <= 30; i++) {
            const date = new Date(currentDate);
            date.setDate(date.getDate() + i);
            futureDates.push(date.toLocaleDateString());
            predictedPrices.push(Math.random() * 50 + 150);
        }

        const currentPrice = historicalPrices[historicalPrices.length - 1];

        return {
            symbol: symbol,
            companyName: this.getCompanyName(symbol),
            currentPrice: currentPrice,
            historicalDates: dates,
            historicalPrices: historicalPrices,
            futureDates: futureDates,
            predictedPrices: predictedPrices,
            predictions: [
                {
                    period: '24h',
                    price: currentPrice * (1 + Math.random() * 0.05),
                    change: Math.random() * 5,
                    confidence: Math.round(Math.random() * 15 + 80)
                },
                {
                    period: '7d',
                    price: currentPrice * (1 + Math.random() * 0.1),
                    change: Math.random() * 10,
                    confidence: Math.round(Math.random() * 15 + 75)
                },
                {
                    period: '30d',
                    price: currentPrice * (1 + Math.random() * 0.2),
                    change: Math.random() * 20,
                    confidence: Math.round(Math.random() * 15 + 70)
                }
            ]
        };
    }

    // Get company name from symbol
    getCompanyName(symbol) {
        const companies = {
            'AAPL': 'Apple Inc.',
            'GOOGL': 'Alphabet Inc.',
            'MSFT': 'Microsoft Corporation',
            'AMZN': 'Amazon.com Inc.',
            'FB': 'Meta Platforms Inc.',
            'TSLA': 'Tesla Inc.'
        };
        return companies[symbol] || `${symbol} Corp`;
    }
}

// Initialize predictor when page loads
document.addEventListener('DOMContentLoaded', () => {
    const predictor = new StockPredictor();
    predictor.init();
});