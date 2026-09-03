package com.example.foodordering.order;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record FoodOrder(
        String id,
        String customerName,
        String restaurantName,
        List<String> items,
        BigDecimal totalAmount,
        OrderStatus status,
        Instant createdAt) {
}
