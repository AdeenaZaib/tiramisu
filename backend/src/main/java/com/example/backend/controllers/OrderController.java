package com.example.backend.controllers;

import com.example.backend.models.*;
import com.example.backend.repositories.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

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
    public Order updateStatus(@PathVariable Long id, @RequestBody String status){

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record Not Found"));

        order.setStatus(status);

        return orderRepository.save(order);
    }

}