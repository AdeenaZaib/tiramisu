package com.example.backend.services;

import com.example.backend.models.Order;
import com.example.backend.models.OrderItem;
import com.example.backend.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // ── CMS-07: Place Catering Order ──────────────────────────────────────

    public Order createOrder(Order order) {
        if (order.getItems() == null || order.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one menu item");
        }
        
        if (order.getEventDate() != null) {
            LocalDate eventDate = order.getEventDate();

            if (eventDate.isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("Event date cannot be in the past");
            }
        }
        
        order.setStatus("Pending");
        return orderRepository.save(order);
    }

    // ── CMS-08: View Order Statuses ───────────────────────────────────────

    public List<Order> getCustomerOrders(String customerName) {
        return orderRepository.findByCustomerName(customerName);
    }

    public String getEmptyOrdersMessage(List<Order> orders) {
        if (orders == null || orders.isEmpty()) {
            return "You have no official bookings yet.";
        }
        return "";
    }

    // ── CMS-09: Update Order Status ───────────────────────────────────────

    public Order updateStatus(Long id, String newStatus) {
        Order existing = orderRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Order not found with id: " + id));

        existing.setStatus(newStatus);
        return orderRepository.save(existing);
    }

    // ── CMS-10: Automatically Calculate Total Cost ────────────────────────

    public double calculateTotalCost(Order order) {
        if (order.getItems() == null || order.getItems().isEmpty()) {
            return 0.0;
        }
        
        double total = 0.0;
        for (OrderItem item : order.getItems()) {
            if (item.getQuantity() < 1) {
                throw new IllegalArgumentException("Item quantity must be at least 1 pax");
            }
            // Assumes getPriceAtOrder() holds the snapshot price at checkout
            total += item.getPriceAtOrder() * item.getQuantity();
        }
        return total;
    }
}