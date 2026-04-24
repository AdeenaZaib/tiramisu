package com.example;

import com.example.backend.models.Order;
import com.example.backend.models.OrderItem;
import com.example.backend.services.OrderService;
import com.example.backend.repositories.OrderRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@DisplayName("Sprint 2 — Order Processing & Math Logic Tests")
public class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    // ── Shared fixture ───────────────────────────────────────────────────

    private Order validOrder() {
        Order order = new Order();
        order.setCustomerName("Saleha Muhammad");
        
        // THE FIX: Removed .toString() because your model expects a LocalDate object
        order.setEventDate(LocalDate.now().plusDays(10)); 
        
        OrderItem item1 = new OrderItem();
        item1.setPriceAtOrder(20.0);
        item1.setQuantity(10);
        
        order.setItems(List.of(item1));
        return order;
    }

    // ════════════════════════════════════════════════════════════════════
    // CMS-07 — Place a Catering Order
    // ════════════════════════════════════════════════════════════════════

    // THE FIX: Fully qualified org.junit.jupiter.api.Order to prevent naming collision
    @Test @org.junit.jupiter.api.Order(1)
    @DisplayName("CMS-07 | testCreateOrder_ValidData_SuccessAndSetsPending")
    void testCreateOrder_ValidData_SuccessAndSetsPending() {
        Order order = validOrder();
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        Order saved = orderService.createOrder(order);

        assertNotNull(saved);
        assertEquals("Pending", saved.getStatus());
        verify(orderRepository, times(1)).save(order);
    }

    @Test @org.junit.jupiter.api.Order(2)
    @DisplayName("CMS-07 | testCreateOrder_Validation_PastDateThrowsException")
    void testCreateOrder_Validation_PastDateThrowsException() {
        Order order = validOrder();
        
        // THE FIX: Removed .toString()
        order.setEventDate(LocalDate.now().minusDays(5));

        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> orderService.createOrder(order)
        );
        assertTrue(ex.getMessage().toLowerCase().contains("past"));
        verify(orderRepository, never()).save(any());
    }

    @Test @org.junit.jupiter.api.Order(3)
    @DisplayName("CMS-07 | testCreateOrder_Validation_EmptyItemsThrowsException")
    void testCreateOrder_Validation_EmptyItemsThrowsException() {
        Order order = validOrder();
        order.setItems(Collections.emptyList());

        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> orderService.createOrder(order)
        );
        assertTrue(ex.getMessage().toLowerCase().contains("one menu item"));
        verify(orderRepository, never()).save(any());
    }

    // ════════════════════════════════════════════════════════════════════
    // CMS-08 — View Order Statuses
    // ════════════════════════════════════════════════════════════════════

    @Test @org.junit.jupiter.api.Order(4)
    @DisplayName("CMS-08 | testGetOrders_EmptyHistory_ShowsFriendlyMessage")
    void testGetOrders_EmptyHistory_ShowsFriendlyMessage() {
        List<Order> emptyList = Collections.emptyList();
        
        String message = orderService.getEmptyOrdersMessage(emptyList);

        assertEquals("You have no official bookings yet.", message);
    }

    // ════════════════════════════════════════════════════════════════════
    // CMS-09 — Update Order Status
    // ════════════════════════════════════════════════════════════════════

    @Test @org.junit.jupiter.api.Order(5)
    @DisplayName("CMS-09 | testUpdateStatus_ValidID_ReflectsInDatabase")
    void testUpdateStatus_ValidID_ReflectsInDatabase() {
        Order existing = validOrder();
        existing.setStatus("Pending");
        
        when(orderRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(orderRepository.save(any(Order.class))).thenReturn(existing);

        Order result = orderService.updateStatus(1L, "Confirmed");

        assertEquals("Confirmed", result.getStatus());
        verify(orderRepository, times(1)).findById(1L);
        verify(orderRepository, times(1)).save(existing);
    }

    @Test @org.junit.jupiter.api.Order(6)
    @DisplayName("CMS-09 | testUpdateStatus_NonExistentID_ReturnsError")
    void testUpdateStatus_NonExistentID_ReturnsError() {
        when(orderRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(
            NoSuchElementException.class,
            () -> orderService.updateStatus(999L, "Confirmed")
        );
        verify(orderRepository, never()).save(any());
    }

    // ════════════════════════════════════════════════════════════════════
    // CMS-10 — Automatically Calculate Total Cost
    // ════════════════════════════════════════════════════════════════════

    @Test @org.junit.jupiter.api.Order(7)
    @DisplayName("CMS-10 | testCalculateTotal_ValidItems_ReturnsCorrectSum")
    void testCalculateTotal_ValidItems_ReturnsCorrectSum() {
        Order order = new Order();
        OrderItem item1 = new OrderItem();
        item1.setPriceAtOrder(20.0);
        item1.setQuantity(10); // 200.0

        OrderItem item2 = new OrderItem();
        item2.setPriceAtOrder(10.0);
        item2.setQuantity(5);  // + 50.0 = 250.0

        order.setItems(List.of(item1, item2));

        double total = orderService.calculateTotalCost(order);

        assertEquals(250.0, total, 0.001);
    }

    @Test @org.junit.jupiter.api.Order(8)
    @DisplayName("CMS-10 | testCalculateTotal_NegativeQuantity_ThrowsException")
    void testCalculateTotal_NegativeQuantity_ThrowsException() {
        Order order = new Order();
        OrderItem invalidItem = new OrderItem();
        invalidItem.setPriceAtOrder(100.0);
        invalidItem.setQuantity(-2); 

        order.setItems(List.of(invalidItem));

        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> orderService.calculateTotalCost(order)
        );
        assertTrue(ex.getMessage().toLowerCase().contains("at least 1"));
    }
}