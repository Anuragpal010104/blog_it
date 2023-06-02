package com.vraj.blogapplication.controllers;
/*
    vrajshah 20/05/2023
*/

import com.vraj.blogapplication.models.UserDto;
import com.vraj.blogapplication.services.interfaces.UserService;
import com.vraj.blogapplication.utils.Helper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getProfile() {
        Long userId = Helper.getLoggedInUserDetails().getUser().getId();
        UserDto user = userService.getById(userId);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(
            @PathVariable(name = "userId") Long userId
    ) {
        UserDto user = userService.getById(userId);
        return ResponseEntity.ok(user);
    }
}
