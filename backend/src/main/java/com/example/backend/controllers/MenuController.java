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
}