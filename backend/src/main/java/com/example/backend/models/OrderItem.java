package com.example.backend.models;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonIgnore // Prevents infinite recursion when sending JSON back to Next.js
    private Order order;

    @ManyToOne
    @JoinColumn(name = "menu_item_id")
    private MenuItem menuItem;

    private Integer quantity;

    @Column(name = "price_at_order")
    private Double priceAtOrder;

    // getters and setters
    public OrderItem() {}
    
    public Long getId() { 
        return id;
    }

    public Order getOrder() { 
        return order; 
    
    }
    public void setOrder(Order order) { 
        this.order = order; 
    }

    public MenuItem getMenuItem() { 
        return menuItem; 
    }

    public void setMenuItem(MenuItem menuItem) { 
        this.menuItem = menuItem; 
    }

    public Integer getQuantity() { 
        return quantity; 
    }

    public void setQuantity(Integer quantity) { 
        this.quantity = quantity; 
    }

    public Double getPriceAtOrder() { 
        return priceAtOrder; 
    }

    public void setPriceAtOrder(Double priceAtOrder) {
        this.priceAtOrder = priceAtOrder; 
    }
}