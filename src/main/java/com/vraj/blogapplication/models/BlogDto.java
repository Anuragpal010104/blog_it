package com.vraj.blogapplication.models;

import java.util.Date;

public record BlogDto(
        Long id,
        String title,
        String content,
        String thumbnail,
        String category,
        UserDto user,
        Date createdOn,
        Long views
) {
}
