package com.example.foodordering.order;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record CreateOrderRequest(
        @NotBlank String customerName,
        @NotBlank String restaurantName,
        @NotEmpty List<@NotBlank String> items,
        @NotNull @DecimalMin("0.01") BigDecimal totalAmount) {
}
