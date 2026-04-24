package com.example.backend.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "event_date")
    private LocalDate eventDate;

    @Column(name = "delivery_address")
    private String deliveryAddress;

    @Column(name = "customer_name")
    private String customerName;

    private String contact;

    private String status = "Pending";
    private Double subtotal = 0.0;
    
    @Column(name = "tax_amount")
    private Double taxAmount = 0.0;
    
    @Column(name = "total_cost")
    private Double totalCost = 0.0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    private Integer rating;
    
    @Column(length = 500)
    private String feedback;

    // Inside your Order.java Entity
    @Column(name = "event_name")
    private String eventName;

    // stage comments

    // THE FIX: Initialize the list to prevent NullPointerExceptions
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> items = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = "Pending";
        
        // Ensure bidirectional relationship is set before saving
        for (OrderItem item : items) {
            item.setOrder(this);
        }
    }

    // getters and setters
    public Long getId() { 
        return id; 
    }

    public Long getCustomerId() { 
        return customerId; 
    }  

    public void setCustomerId(Long customerId) { 
        this.customerId = customerId; 
    }

    public LocalDate getEventDate() { 
        return eventDate; 
    }

    public void setEventDate(LocalDate eventDate) { 
        this.eventDate = eventDate; 
    }

    public String getDeliveryAddress() { 
        return deliveryAddress; 
    }

    public void setDeliveryAddress(String deliveryAddress) { 
        this.deliveryAddress = deliveryAddress; 
    }

    public String getStatus() { 
        return status; 
    }

    public void setStatus(String status) { 
        this.status = status; 
    }

    public Double getSubtotal() { 
        return subtotal; 
    }

    public void setSubtotal(Double subtotal) { 
        this.subtotal = subtotal; 
    }

    public Double getTax() { 
        return taxAmount; 
    }

    public void setTax(Double taxAmount) { 
        this.taxAmount = taxAmount; 
    }

    public Double getTotalCost() { 
        return totalCost; 
    }

    public void setTotalCost(Double totalCost) { 
        this.totalCost = totalCost;
    }

    public LocalDateTime getCreatedAt() { 
        return createdAt; 
    }

    public void setCreatedAt(LocalDateTime createdAt) { 
        this.createdAt = createdAt; 
    }

    public List<OrderItem> getItems() { 
        return items; 
    }

    public void setItems(List<OrderItem> items) { 
        this.items = items; 
    }

    public String getCustomerName() { 
        return customerName; 
    }

    public void setCustomerName(String customerName) { 
        this.customerName = customerName; 
    }
    
    public String getContact() { 
        return contact; 
    }

    public void setContact(String contact) { 
        this.contact = contact; 
    }

    public Integer getRating() {
        return rating;
    }
    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
    
    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }
}