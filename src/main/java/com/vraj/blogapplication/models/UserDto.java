package com.vraj.blogapplication.models;

import com.vraj.blogapplication.models.enums.Role;

import java.util.Date;

public record UserDto(
        Long id,
        String name,
        String username,
        String email,
        Role role,
        Date createdOn
) {
}
