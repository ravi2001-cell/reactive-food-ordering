package com.example.foodordering.order;

import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OrderService {
    private final Map<String, FoodOrder> orders = new ConcurrentHashMap<>();

    public Mono<FoodOrder> create(CreateOrderRequest request) {
        FoodOrder order = new FoodOrder(
                UUID.randomUUID().toString(),
                request.customerName(),
                request.restaurantName(),
                List.copyOf(request.items()),
                request.totalAmount(),
                OrderStatus.CREATED,
                Instant.now());
        orders.put(order.id(), order);
        return Mono.just(order);
    }

    public Flux<FoodOrder> findAll() {
        return Flux.fromIterable(orders.values());
    }

    public Mono<FoodOrder> findById(String id) {
        return Mono.justOrEmpty(orders.get(id))
                .switchIfEmpty(Mono.error(new OrderNotFoundException(id)));
    }

    public Mono<FoodOrder> confirm(String id) {
        return findById(id).map(existing -> {
            FoodOrder confirmed = new FoodOrder(
                    existing.id(), existing.customerName(), existing.restaurantName(),
                    existing.items(), existing.totalAmount(), OrderStatus.CONFIRMED,
                    existing.createdAt());
            orders.put(id, confirmed);
            return confirmed;
        });
    }
}
