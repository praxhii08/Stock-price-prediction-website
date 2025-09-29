#!/bin/bash

# Start the Python prediction server
echo "Starting Python prediction server..."
python3 python/stock_predictor.py &

# Start the HTTP server for the website
echo "Starting website server..."
cd /tmp/outputs/stock_prediction
python3 -m http.server 8080