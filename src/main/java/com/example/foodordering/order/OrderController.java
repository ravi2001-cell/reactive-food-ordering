package com.example.foodordering.order;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<FoodOrder> create(@Valid @RequestBody CreateOrderRequest request) {
        return orderService.create(request);
    }

    @GetMapping
    public Flux<FoodOrder> findAll() {
        return orderService.findAll();
    }

    @GetMapping("/{id}")
    public Mono<FoodOrder> findById(@PathVariable String id) {
        return orderService.findById(id);
    }

    @PatchMapping("/{id}/confirm")
    public Mono<FoodOrder> confirm(@PathVariable String id) {
        return orderService.confirm(id);
    }
}
