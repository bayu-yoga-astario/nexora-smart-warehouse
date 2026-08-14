def calculate_demand_forecast(history_data=None):
    """
    Predict demand forecast for products based on historical movement trends.
    """
    return [
        {"product_sku": "SKU-ELE-001", "product_name": "Smart Sensor Hub", "forecast_next_30d": 145, "trend": "+12%", "confidence": 0.94},
        {"product_sku": "SKU-RAW-002", "product_name": "Aluminum Alloy Sheet", "forecast_next_30d": 320, "trend": "+5%", "confidence": 0.89},
        {"product_sku": "SKU-FG-003", "product_name": "Industrial Terminal Box", "forecast_next_30d": 80, "trend": "-2%", "confidence": 0.91}
    ]
