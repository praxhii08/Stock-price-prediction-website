import numpy as np
from datetime import datetime, timedelta
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import MinMaxScaler

class StockPredictor:
    def __init__(self):
        self.scaler = MinMaxScaler()
        self.model = LinearRegression()
        
    def generate_mock_data(self, symbol, days=30):
        # Generate synthetic historical data
        dates = [(datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d') for i in range(days, 0, -1)]
        base_price = 100 + np.random.rand() * 100  # Random base price between 100 and 200
        trend = np.random.rand() * 0.1 - 0.05  # Random trend between -5% and 5%
        
        prices = []
        current_price = base_price
        for _ in dates:
            noise = np.random.normal(0, 1)
            current_price = current_price * (1 + trend) + noise
            prices.append(current_price)
        
        return dates, prices
    
    def predict(self, symbol, future_days=7):
        # Get historical data
        dates, prices = self.generate_mock_data(symbol)
        
        # Prepare data for prediction
        X = np.array(range(len(prices))).reshape(-1, 1)
        y = np.array(prices)
        
        # Scale data
        X_scaled = self.scaler.fit_transform(X)
        y_scaled = self.scaler.fit_transform(y.reshape(-1, 1))
        
        # Train model
        self.model.fit(X_scaled, y_scaled)
        
        # Generate future dates
        future_dates = [(datetime.now() + timedelta(days=i)).strftime('%Y-%m-    %d')
                       for i in range(1, future_days + 1)]
        
        # Predict future values
        X_future = np.array(range(len(prices), len(prices) + future_days)).reshape(-1, 1)
        X_future_scaled = self.scaler.transform(X_future)
        y_future_scaled = self.model.predict(X_future_scaled)
        y_future = self.scaler.inverse_transform(y_future_scaled)
        
        # Calculate confidence scores (mock values)
        confidence_scores = [
            85 - i * 2 for i in range(len(y_future))  # Decreasing confidence over time
        ]
        
        return {
            'dates': dates,
            'historical_prices': prices,
            'future_dates': future_dates,
            'predictions': y_future.flatten().tolist(),
            'confidence_scores': confidence_scores
        }

class PredictionHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/api/predictions/'):
            symbol = self.path.split('/')[-1]
            predictor = StockPredictor()
            result = predictor.predict(symbol)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = json.dumps(result)
            self.wfile.write(response.encode())
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Not Found')
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Access-Control-Allow-Headers', 'x-requested-with')
        self.end_headers()

def run_server(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, PredictionHandler)
    print(f'Starting server on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()