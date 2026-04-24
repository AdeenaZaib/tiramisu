package com.example.backend.controllers;

import com.example.backend.models.*;
import com.example.backend.repositories.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    private final double TAX_RATE = 0.10;

    // CMS-07 Create Order
    @PostMapping("/create")
    public Order createOrder(@RequestBody Order order){

        if(order.getEventDate().isBefore(LocalDate.now())){
            throw new RuntimeException("Invalid Date");
        }

        double subtotal = 0;

        for(OrderItem item : order.getItems()){

            MenuItem menu = menuItemRepository
                    .findById(item.getMenuItem().getId())
                    .orElseThrow(() -> new RuntimeException("Menu Item not found"));

            // CRITICAL FIX: Snapshot the price at the time of ordering for the DB
            item.setPriceAtOrder(menu.getPrice());
            
            subtotal += menu.getPrice() * item.getQuantity();

            item.setOrder(order);
        }

        double tax = subtotal * TAX_RATE;
        double total = subtotal + tax;

        order.setSubtotal(subtotal);
        order.setTax(tax); 
        order.setTotalCost(total);
        order.setStatus("Pending");

        return orderRepository.save(order);
    }

    // CMS-08 Get Orders for Customer
    @GetMapping("/customer/{name}")
    public List<Order> getCustomerOrders(@PathVariable String name){
        return orderRepository.findByCustomerName(name);
    }

    // CMS-09 Update Order Status
    @PutMapping("/{id}/status")
    public Order updateStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload){

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record Not Found"));

        // Safely extract just the value from the {"status": "Confirmed"} JSON
        String newStatus = payload.get("status");
        order.setStatus(newStatus);

        return orderRepository.save(order);
    }

    // CMS-09 Admin View All Orders
    @GetMapping("/all")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // CMS-12: Get a single order for the Digital Invoice
    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    // CMS-11: Customer Cancels a Pending Order
    @PutMapping("/{id}/cancel")
    public Order cancelOrder(@PathVariable Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        if (!order.getStatus().equals("Pending")) {
            throw new RuntimeException("Only pending orders can be cancelled.");
        }
        
        order.setStatus("Cancelled");
        return orderRepository.save(order);
    }

    // CMS-13: Customer Submits Feedback for a Delivered Order
    @PutMapping("/{id}/feedback")
    public Order submitFeedback(@PathVariable Long id, @RequestBody Order feedbackData) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // SATISFIES TC-08: Block action if the order is not Delivered
        if (!order.getStatus().equals("Delivered")) {
            throw new RuntimeException("Feedback can only be left for delivered orders.");
        }

        // SATISFIES TC-06 & TC-07: Enforce boundaries (1 to 5)
        Integer rating = feedbackData.getRating();
        if (rating == null || rating < 1 || rating > 5) {
            throw new RuntimeException("Form validation error: Rating must be between 1 and 5 stars.");
        }

        // SATISFIES TC-04 & TC-05: Valid inputs are saved
        order.setRating(rating);
        order.setFeedback(feedbackData.getFeedback());
        return orderRepository.save(order);
    }

    // CMS-14: Manager Analytics Dashboard Data
    @GetMapping("/analytics")
    public java.util.Map<String, Object> getAnalytics() {
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        
        Double totalRevenue = orderRepository.sumTotalRevenue();
        stats.put("totalOrders", orderRepository.countActiveOrders());
        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : 0.0);
        
        return stats;
    }
}