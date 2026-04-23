package com.example.backend.controllers;

import com.example.backend.models.MenuItem;
import com.example.backend.repositories.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "http://localhost:3000") 
public class MenuController {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @PostMapping("/add")
    public ResponseEntity<?> addMenuItem(@RequestBody MenuItem newItem) {
        MenuItem savedItem = menuItemRepository.save(newItem);
        return ResponseEntity.ok(savedItem); 
    }

    @GetMapping("/all")
    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteMenuItem(@PathVariable Long id) {

        if(!menuItemRepository.existsById(id)){
            return ResponseEntity.notFound().build();
        }

        menuItemRepository.deleteById(id);

        return ResponseEntity.ok("Menu item deleted");
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable Long id) {
        return menuItemRepository.findById(id)
                .map(item -> ResponseEntity.ok(item))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<MenuItem> updateMenuItem(@PathVariable Long id, @RequestBody MenuItem updatedDetails) {
        return menuItemRepository.findById(id)
                .map(existingItem -> {
                    // Update the fields with the new data from React
                    existingItem.setName(updatedDetails.getName());
                    existingItem.setDescription(updatedDetails.getDescription());
                    existingItem.setPrice(updatedDetails.getPrice());
                    existingItem.setCategory(updatedDetails.getCategory());
                    existingItem.setItemType(updatedDetails.getItemType());
                    
                    
                    // Notice we DO NOT touch the 'createdAt' or 'isActive' fields 
                    // so they remain safely unchanged in the database.

                    MenuItem savedItem = menuItemRepository.save(existingItem);
                    return ResponseEntity.ok(savedItem);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}