from flask import Flask, jsonify, request
from flask_cors import CORS
from scripts.forecast import calculate_demand_forecast
from scripts.reorder import calculate_reorder_recommendations
from scripts.inventory_health import calculate_inventory_health
from scripts.slow_moving import detect_slow_moving_stock

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "service": "NEXORA Python Analytics Engine", "version": "1.0.0"})

@app.route('/api/analytics/forecast', methods=['GET'])
def get_forecast():
    forecast_data = calculate_demand_forecast()
    return jsonify({"status": "success", "data": forecast_data})

@app.route('/api/analytics/reorder', methods=['GET'])
def get_reorder():
    reorder_data = calculate_reorder_recommendations()
    return jsonify({"status": "success", "data": reorder_data})

@app.route('/api/analytics/inventory-health', methods=['GET'])
def get_inventory_health():
    health_data = calculate_inventory_health()
    return jsonify({"status": "success", "data": health_data})

@app.route('/api/analytics/slow-moving', methods=['GET'])
def get_slow_moving():
    slow_moving_data = detect_slow_moving_stock()
    return jsonify({"status": "success", "data": slow_moving_data})

if __name__ == '__main__':
    print("Starting NEXORA Python AI Analytics Service on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
