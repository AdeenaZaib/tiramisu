package com.example;

import com.example.backend.models.MenuItem;
import com.example.backend.repositories.MenuItemRepository;
import com.example.backend.services.MenuService;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@DisplayName("Sprint 1 — Menu & Catalog Management Tests")
public class MenuServiceTest { 

    @Mock
    private MenuItemRepository menuRepository;

    @InjectMocks
    private MenuService menuService;

    // ── Shared fixture ───────────────────────────────────────────────────

    private MenuItem validItem() {
        MenuItem item = new MenuItem();
        item.setName("Chicken Karahi");
        item.setDescription("Rich tomato-based chicken curry.");
        item.setPrice(2800.0);
        item.setCategory("Pakistani");
        return item;
    }

    // ════════════════════════════════════════════════════════════════════
    // CMS-01 — Add New Menu Item
    // ════════════════════════════════════════════════════════════════════

    @Test @Order(1)
    @DisplayName("CMS-01 | testAddItem_DatabaseConnection_Success")
    void testAddItem_DatabaseConnection_Success() {
        MenuItem item = validItem();
        when(menuRepository.save(any(MenuItem.class))).thenReturn(item);

        MenuItem saved = menuService.addItem(item);

        assertNotNull(saved);
        assertEquals("Chicken Karahi", saved.getName());
        verify(menuRepository, times(1)).save(item);
    }

    @Test @Order(2)
    @DisplayName("CMS-01 | testAddItem_Validation_NullNameThrowsException")
    void testAddItem_Validation_NullNameThrowsException() {
        MenuItem item = new MenuItem();
        item.setName(null);
        item.setPrice(500.0);
        item.setCategory("Italian");

        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> menuService.addItem(item)
        );
        assertTrue(ex.getMessage().toLowerCase().contains("name"));
        verify(menuRepository, never()).save(any());
    }

    @Test @Order(3)
    @DisplayName("CMS-01 | testAddItem_Validation_NegativePriceHandled")
    void testAddItem_Validation_NegativePriceHandled() {
        MenuItem item = new MenuItem();
        item.setName("Biryani");
        item.setPrice(-100.0);
        item.setCategory("Pakistani");

        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> menuService.addItem(item)
        );
        assertTrue(ex.getMessage().toLowerCase().contains("price"));
        verify(menuRepository, never()).save(any());
    }

    // ════════════════════════════════════════════════════════════════════
    // CMS-02 — Edit Existing Menu Item
    // ════════════════════════════════════════════════════════════════════

    @Test @Order(4)
    @DisplayName("CMS-02 | testEditItem_UpdatePrice_ReflectsInDatabase")
    void testEditItem_UpdatePrice_ReflectsInDatabase() {
        MenuItem existing = validItem();
        MenuItem updated = validItem();
        updated.setPrice(3500.0);

        when(menuRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(menuRepository.save(any(MenuItem.class))).thenReturn(updated);

        MenuItem result = menuService.editItem(1L, updated);

        assertNotNull(result);
        assertEquals(3500.0, result.getPrice(), 0.001);
        verify(menuRepository, times(1)).findById(1L);
        verify(menuRepository, times(1)).save(any(MenuItem.class));
    }

    @Test @Order(5)
    @DisplayName("CMS-02 | testEditItem_NonExistentID_ReturnsError")
    void testEditItem_NonExistentID_ReturnsError() {
        when(menuRepository.findById(999L)).thenReturn(Optional.empty());

        MenuItem updates = new MenuItem();
        updates.setName("Ghost Item");
        updates.setPrice(100.0);

        assertThrows(
            NoSuchElementException.class,
            () -> menuService.editItem(999L, updates)
        );
        verify(menuRepository, never()).save(any());
    }

    // ════════════════════════════════════════════════════════════════════
    // CMS-03 — Delete Menu Item
    // ════════════════════════════════════════════════════════════════════

    @Test @Order(6)
    @DisplayName("CMS-03 | testDeleteItem_ConfirmAction_RemovesRecord")
    void testDeleteItem_ConfirmAction_RemovesRecord() {
        MenuItem item = validItem();
        when(menuRepository.findById(1L)).thenReturn(Optional.of(item));
        doNothing().when(menuRepository).deleteById(1L);

        boolean deleted = menuService.deleteItem(1L, true);

        assertTrue(deleted);
        verify(menuRepository, times(1)).deleteById(1L);
    }

    @Test @Order(7)
    @DisplayName("CMS-03 | testDeleteItem_CancelAction_AbortsProcess")
    void testDeleteItem_CancelAction_AbortsProcess() {
        boolean deleted = menuService.deleteItem(1L, false);

        assertFalse(deleted);
        verify(menuRepository, never()).deleteById(anyLong());
    }

    // ════════════════════════════════════════════════════════════════════
    // CMS-04 — View Menu Catalog
    // ════════════════════════════════════════════════════════════════════

    @Test @Order(8)
    @DisplayName("CMS-04 | testViewCatalog_EmptyDatabase_ShowsFriendlyMessage")
    void testViewCatalog_EmptyDatabase_ShowsFriendlyMessage() {
        when(menuRepository.findAll()).thenReturn(Collections.emptyList());

        List<MenuItem> result = menuService.getAllItems();
        String message = menuService.getEmptyMenuMessage(result);

        assertTrue(result.isEmpty());
        assertEquals(
            "Our menu is currently being updated. Please check back shortly.",
            message
        );
    }

    // ════════════════════════════════════════════════════════════════════
    // CMS-05 — Filter Menu by Cuisine
    // ════════════════════════════════════════════════════════════════════

    @Test @Order(9)
    @DisplayName("CMS-05 | testFilter_CuisineExists_ReturnsFilteredList")
    void testFilter_CuisineExists_ReturnsFilteredList() {
        MenuItem pak1 = validItem();
        MenuItem pak2 = new MenuItem();
        pak2.setName("Nihari");
        pak2.setPrice(2400.0);
        pak2.setCategory("Pakistani");

        when(menuRepository.findByCategory("Pakistani"))
            .thenReturn(List.of(pak1, pak2));

        List<MenuItem> result = menuService.filterByCuisine("Pakistani");

        assertEquals(2, result.size());
        assertTrue(result.stream().allMatch(i -> i.getCategory().equals("Pakistani")));
        verify(menuRepository, times(1)).findByCategory("Pakistani");
    }

    @Test @Order(10)
    @DisplayName("CMS-05 | testFilter_CuisineMissing_ReturnsNoDishesMessage")
    void testFilter_CuisineMissing_ReturnsNoDishesMessage() {
        when(menuRepository.findByCategory("Chinese"))
            .thenReturn(Collections.emptyList());

        List<MenuItem> result = menuService.filterByCuisine("Chinese");
        String message = menuService.getNoResultsMessage(result, "Chinese");

        assertTrue(result.isEmpty());
        assertEquals(
            "No dishes available for this cuisine at the moment",
            message
        );
    }
}