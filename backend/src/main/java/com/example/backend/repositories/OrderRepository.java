package com.example.backend.repositories;

import com.example.backend.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByCustomerName(String customerName);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status != 'Cancelled'")
    long countActiveOrders();

    @Query("SELECT SUM(o.totalCost) FROM Order o WHERE o.status != 'Cancelled'")
    Double sumTotalRevenue();

}