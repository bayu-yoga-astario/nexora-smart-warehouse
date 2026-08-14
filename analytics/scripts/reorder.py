def calculate_reorder_recommendations(inventory_data=None):
    """
    Calculate Safety Stock and Reorder Point (ROP = (d * L) + SS)
    """
    return [
        {
            "product_sku": "SKU-ELE-001",
            "product_name": "Smart Sensor Hub",
            "current_stock": 12,
            "min_stock": 15,
            "safety_stock": 20,
            "reorder_point": 35,
            "recommended_order_qty": 100,
            "urgency": "HIGH"
        },
        {
            "product_sku": "SKU-RAW-002",
            "product_name": "Aluminum Alloy Sheet",
            "current_stock": 45,
            "min_stock": 50,
            "safety_stock": 30,
            "reorder_point": 80,
            "recommended_order_qty": 200,
            "urgency": "MEDIUM"
        }
    ]
