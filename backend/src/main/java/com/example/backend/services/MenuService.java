package com.example.backend.services;

import com.example.backend.models.MenuItem;
import com.example.backend.repositories.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class MenuService {

    @Autowired
    private MenuItemRepository menuRepository;

    // Constructor for Mockito injection in tests
    public MenuService(MenuItemRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    // ── CMS-01: Add Item ──────────────────────────────────────────────────

    public MenuItem addItem(MenuItem item) {
        if (item.getName() == null || item.getName().isBlank()) {
            throw new IllegalArgumentException("Item name must not be null or empty");
        }
        if (item.getPrice() == null || item.getPrice() < 0) {
            throw new IllegalArgumentException("Item price must be a non-negative number");
        }
        return menuRepository.save(item);
    }

    // ── CMS-02: Edit Item ─────────────────────────────────────────────────

    public MenuItem editItem(Long id, MenuItem updatedDetails) {
        MenuItem existing = menuRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Menu item not found with id: " + id));

        existing.setName(updatedDetails.getName());
        existing.setDescription(updatedDetails.getDescription());
        existing.setPrice(updatedDetails.getPrice());
        existing.setCategory(updatedDetails.getCategory());

        return menuRepository.save(existing);
    }

    // ── CMS-03: Delete Item ───────────────────────────────────────────────

    public boolean deleteItem(Long id, boolean confirmed) {
        if (!confirmed) {
            return false;
        }
        menuRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Menu item not found with id: " + id));
        menuRepository.deleteById(id);
        return true;
    }

    // ── CMS-04: View Catalog ──────────────────────────────────────────────

    public List<MenuItem> getAllItems() {
        return menuRepository.findAll();
    }

    public String getEmptyMenuMessage(List<MenuItem> items) {
        if (items == null || items.isEmpty()) {
            return "Our menu is currently being updated. Please check back shortly.";
        }
        return "";
    }

    // ── CMS-05: Filter by Cuisine ─────────────────────────────────────────

    public List<MenuItem> filterByCuisine(String cuisine) {
        return menuRepository.findByCategory(cuisine);
    }

    public String getNoResultsMessage(List<MenuItem> items, String cuisine) {
        if (items == null || items.isEmpty()) {
            return "No dishes available for this cuisine at the moment";
        }
        return "";
    }
}