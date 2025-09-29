// Market data update functionality
class MarketData {
    constructor() {
        this.marketSymbols = {
            'sp500': { element: 'sp500', basePrice: 4890.97 },
            'nasdaq': { element: 'nasdaq', basePrice: 15360.28 },
            'dow': { element: 'dow', basePrice: 37490.17 }
        };
        
        this.updateInterval = 5000; // Update every 5 seconds
    }

    // Simulate real-time price changes
    updatePrices() {
        for (let symbol in this.marketSymbols) {
            const market = this.marketSymbols[symbol];
            const element = document.getElementById(market.element);
            if (element) {
                // Generate random price movement
                const change = (Math.random() - 0.5) * 10;
                const newPrice = market.basePrice + change;
                
                // Update price display
                element.textContent = newPrice.toFixed(2);
                
                // Update color based on change
                element.className = 'price ' + (change >= 0 ? 'up' : 'down');
                
                // Update base price for next change
                market.basePrice = newPrice;
            }
        }
    }

    // Start real-time updates
    startUpdates() {
        this.updatePrices();
        setInterval(() => this.updatePrices(), this.updateInterval);
    }
}

// Initialize market data updates when page loads
document.addEventListener('DOMContentLoaded', () => {
    const market = new MarketData();
    market.startUpdates();
});

// Responsive navigation
const toggleNavigation = () => {
    const nav = document.querySelector('.nav-menu');
    nav.classList.toggle('active');
};

// Dark mode toggle functionality (if implemented)
const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
};

// Check for saved dark mode preference
const checkDarkMode = () => {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
};

// Load animations for feature cards
const animateOnScroll = () => {
    const features = document.querySelectorAll('.feature-card');
    features.forEach(feature => {
        const featurePosition = feature.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (featurePosition < screenPosition) {
            feature.classList.add('animate');
        }
    });
};

// Add scroll event listener for animations
window.addEventListener('scroll', animateOnScroll);

// Utility functions
const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
};

const formatPercentage = (percentage) => {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(percentage / 100);
};

// Error handling function
const handleError = (error, context) => {
    console.error(`Error in ${context}:`, error);
    // You could implement user notification here
};

// Load preferences
document.addEventListener('DOMContentLoaded', () => {
    try {
        checkDarkMode();
        animateOnScroll();
    } catch (error) {
        handleError(error, 'preference loading');
    }
});