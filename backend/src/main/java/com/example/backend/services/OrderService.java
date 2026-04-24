package com.example.backend.services;

import com.example.backend.models.Order;
import com.example.backend.models.OrderItem;
import com.example.backend.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Map;

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

    // ── CMS-11: Cancel Pending Order ──────────────────────────────────────

    public Order cancelOrder(Long id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Order not found with id: " + id));

        if (!"Pending".equalsIgnoreCase(order.getStatus())) {
            throw new IllegalStateException("Error: Order cannot be cancelled at this stage.");
        }

        order.setStatus("Cancelled");
        return orderRepository.save(order);
    }

    // ── CMS-12: View Digital Invoice ──────────────────────────────────────

    public Order getInvoice(Long id) {
        return orderRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Error: Invoice not found."));
    }

    // ── CMS-13: Submit Order Feedback ─────────────────────────────────────

    public Order submitFeedback(Long id, Integer rating, String feedback) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Order not found with id: " + id));

        if (!"Delivered".equalsIgnoreCase(order.getStatus())) {
            throw new IllegalStateException("Feedback can only be left for delivered orders.");
        }
        if (rating == null || rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5.");
        }

        order.setRating(rating);
        order.setFeedback(feedback);
        return orderRepository.save(order);
    }

    // ── CMS-14: Manager Analytics Dashboard ───────────────────────────────

    public Map<String, Object> getAnalytics() {
        Double totalRevenue = orderRepository.sumTotalRevenue();
        Long totalOrders = orderRepository.countActiveOrders();

        Map<String, Object> analytics = new HashMap<>();
        // Graceful fallback if database queries return null (empty database)
        analytics.put("totalRevenue", totalRevenue != null ? totalRevenue : 0.0);
        analytics.put("totalOrders", totalOrders != null ? totalOrders : 0L);
        
        return analytics;
    }
}