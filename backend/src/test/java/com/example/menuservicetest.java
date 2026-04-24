package com.example; 

import com.example.model.MenuItem;
import com.example.repository.MenuRepository;
import com.example.service.MenuService;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * White-Box Unit Tests — Sprint 1
 * Module: Menu & Catalog Management (CMS-01 to CMS-05)
 *
 * Test naming convention:
 *   test[Story]_[Condition]_[ExpectedOutcome]
 */
@ExtendWith(MockitoExtension.class)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@DisplayName("Sprint 1 — Menu & Catalog Management Tests")
public class MenuServiceTest {

    @Mock
    private MenuRepository menuRepository;

    @InjectMocks
    private MenuService menuService;

    // ── Shared test fixtures ─────────────────────────────────────────────────

    private MenuItem validItem() {
        MenuItem item = new MenuItem();
        item.setId(1L);
        item.setName("Chicken Karahi");
        item.setDescription("Rich tomato-based chicken curry.");
        item.setPrice(2800.0);
        item.setCategory("Pakistani");
        return item;
    }

    // ════════════════════════════════════════════════════════════════════════
    // CMS-01 — Add New Menu Item
    // ════════════════════════════════════════════════════════════════════════

    @Test
    @Order(1)
    @DisplayName("CMS-01 | testAddItem_DatabaseConnection_Success")
    void testAddItem_DatabaseConnection_Success() {
        // Arrange
        MenuItem item = validItem();
        when(menuRepository.save(any(MenuItem.class))).thenReturn(item);

        // Act
        MenuItem saved = menuService.addItem(item);

        // Assert
        assertNotNull(saved, "Saved item should not be null");
        assertEquals("Chicken Karahi", saved.getName());
        verify(menuRepository, times(1)).save(item);
    }

    @Test
    @Order(2)
    @DisplayName("CMS-01 | testAddItem_Validation_NullNameThrowsException")
    void testAddItem_Validation_NullNameThrowsException() {
        // Arrange — item with no name (invalid)
        MenuItem item = new MenuItem();
        item.setName(null);
        item.setPrice(500.0);
        item.setCategory("Italian");

        // Act & Assert
        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> menuService.addItem(item),
            "Expected exception for null name"
        );
        assertTrue(ex.getMessage().toLowerCase().contains("name"),
            "Exception message should mention 'name'");
        verify(menuRepository, never()).save(any());
    }

    @Test
    @Order(3)
    @DisplayName("CMS-01 | testAddItem_Validation_NegativePriceHandled")
    void testAddItem_Validation_NegativePriceHandled() {
        // Arrange — item with negative price (invalid)
        MenuItem item = new MenuItem();
        item.setName("Biryani");
        item.setPrice(-100.0);
        item.setCategory("Pakistani");

        // Act & Assert
        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> menuService.addItem(item),
            "Expected exception for negative price"
        );
        assertTrue(ex.getMessage().toLowerCase().contains("price"),
            "Exception message should mention 'price'");
        verify(menuRepository, never()).save(any());
    }

    // ════════════════════════════════════════════════════════════════════════
    // CMS-02 — Edit Existing Menu Item
    // ════════════════════════════════════════════════════════════════════════

    @Test
    @Order(4)
    @DisplayName("CMS-02 | testEditItem_UpdatePrice_ReflectsInDatabase")
    void testEditItem_UpdatePrice_ReflectsInDatabase() {
        // Arrange
        MenuItem existing = validItem();
        MenuItem updated = validItem();
        updated.setPrice(3500.0);

        when(menuRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(menuRepository.save(any(MenuItem.class))).thenReturn(updated);

        // Act
        MenuItem result = menuService.editItem(1L, updated);

        // Assert
        assertNotNull(result);
        assertEquals(3500.0, result.getPrice(), 0.001,
            "Price should be updated to 3500");
        verify(menuRepository, times(1)).findById(1L);
        verify(menuRepository, times(1)).save(any(MenuItem.class));
    }

    @Test
    @Order(5)
    @DisplayName("CMS-02 | testEditItem_NonExistentID_ReturnsError")
    void testEditItem_NonExistentID_ReturnsError() {
        // Arrange — ID that doesn't exist in DB
        when(menuRepository.findById(999L)).thenReturn(Optional.empty());

        MenuItem updates = new MenuItem();
        updates.setName("Ghost Item");
        updates.setPrice(100.0);

        // Act & Assert
        NoSuchElementException ex = assertThrows(
            NoSuchElementException.class,
            () -> menuService.editItem(999L, updates),
            "Expected exception for non-existent ID"
        );
        assertNotNull(ex.getMessage());
        verify(menuRepository, never()).save(any());
    }

    // ════════════════════════════════════════════════════════════════════════
    // CMS-03 — Delete Menu Item
    // ════════════════════════════════════════════════════════════════════════

    @Test
    @Order(6)
    @DisplayName("CMS-03 | testDeleteItem_ConfirmAction_RemovesRecord")
    void testDeleteItem_ConfirmAction_RemovesRecord() {
        // Arrange
        MenuItem item = validItem();
        when(menuRepository.findById(1L)).thenReturn(Optional.of(item));
        doNothing().when(menuRepository).deleteById(1L);

        // Act
        boolean deleted = menuService.deleteItem(1L, true); // true = confirmed

        // Assert
        assertTrue(deleted, "Delete should return true on confirm");
        verify(menuRepository, times(1)).deleteById(1L);
    }

    @Test
    @Order(7)
    @DisplayName("CMS-03 | testDeleteItem_CancelAction_AbortsProcess")
    void testDeleteItem_CancelAction_AbortsProcess() {
        // Act — user cancelled the confirmation dialog
        boolean deleted = menuService.deleteItem(1L, false); // false = cancelled

        // Assert
        assertFalse(deleted, "Delete should return false when cancelled");
        verify(menuRepository, never()).deleteById(anyLong());
    }

    // ════════════════════════════════════════════════════════════════════════
    // CMS-04 — View Menu Catalog
    // ════════════════════════════════════════════════════════════════════════

    @Test
    @Order(8)
    @DisplayName("CMS-04 | testViewCatalog_EmptyDatabase_ShowsFriendlyMessage")
    void testViewCatalog_EmptyDatabase_ShowsFriendlyMessage() {
        // Arrange — empty DB
        when(menuRepository.findAll()).thenReturn(Collections.emptyList());

        // Act
        List<MenuItem> result = menuService.getAllItems();
        String message = menuService.getEmptyMenuMessage(result);

        // Assert
        assertTrue(result.isEmpty(), "Result list should be empty");
        assertEquals(
            "Our menu is currently being updated. Please check back shortly.",
            message,
            "Friendly fallback message should match spec"
        );
    }

    // ════════════════════════════════════════════════════════════════════════
    // CMS-05 — Filter Menu by Cuisine
    // ════════════════════════════════════════════════════════════════════════

    @Test
    @Order(9)
    @DisplayName("CMS-05 | testFilter_CuisineExists_ReturnsFilteredList")
    void testFilter_CuisineExists_ReturnsFilteredList() {
        // Arrange
        MenuItem pak1 = validItem();
        MenuItem pak2 = new MenuItem();
        pak2.setId(2L); pak2.setName("Nihari");
        pak2.setPrice(2400.0); pak2.setCategory("Pakistani");

        MenuItem italian = new MenuItem();
        italian.setId(3L); italian.setName("Pasta");
        italian.setPrice(1900.0); italian.setCategory("Italian");

        when(menuRepository.findByCategory("Pakistani"))
            .thenReturn(List.of(pak1, pak2));

        // Act
        List<MenuItem> result = menuService.filterByCuisine("Pakistani");

        // Assert
        assertEquals(2, result.size(), "Should return exactly 2 Pakistani dishes");
        assertTrue(result.stream().allMatch(i -> i.getCategory().equals("Pakistani")),
            "All results must be Pakistani cuisine");
        verify(menuRepository, times(1)).findByCategory("Pakistani");
    }

    @Test
    @Order(10)
    @DisplayName("CMS-05 | testFilter_CuisineMissing_ReturnsNoDishesMessage")
    void testFilter_CuisineMissing_ReturnsNoDishesMessage() {
        // Arrange — cuisine with no items in DB
        when(menuRepository.findByCategory("Chinese"))
            .thenReturn(Collections.emptyList());

        // Act
        List<MenuItem> result = menuService.filterByCuisine("Chinese");
        String message = menuService.getNoResultsMessage(result, "Chinese");

        // Assert
        assertTrue(result.isEmpty(), "Filtered list should be empty");
        assertEquals(
            "No dishes available for this cuisine at the moment",
            message,
            "No-results message should match spec"
        );
    }
}