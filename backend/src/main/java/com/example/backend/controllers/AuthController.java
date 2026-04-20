package com.example.backend.controllers;

import com.example.backend.models.AppUser;
import com.example.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody AppUser newUser) {
        if (userRepository.findByEmail(newUser.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists!");
        }
        

        // Force new signups to be Customers for safety
        newUser.setRole("Customer");
        AppUser savedUser = userRepository.save(newUser);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AppUser loginRequest) {
        AppUser user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Note: For a university project deadline, plain text matching is fine. 
        // In production, you would use BCrypt password hashing here.
        if (!user.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid password");
        }
        
        return ResponseEntity.ok(user);
    }
}