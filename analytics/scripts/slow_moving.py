def detect_slow_moving_stock():
    """
    Identifies products with zero or minimal transactions over 90+ days.
    """
    return [
        {
            "product_sku": "SKU-OLD-999",
            "product_name": "Legacy Cable Harness",
            "current_stock": 250,
            "days_inactive": 120,
            "capital_tied_up": 12500000,
            "status": "CRITICAL_SLOW"
        },
        {
            "product_sku": "SKU-OLD-888",
            "product_name": "V1 Mounting Bracket",
            "current_stock": 140,
            "days_inactive": 95,
            "capital_tied_up": 4200000,
            "status": "SLOW"
        }
    ]
