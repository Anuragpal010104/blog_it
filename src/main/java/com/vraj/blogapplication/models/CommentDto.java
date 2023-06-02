package com.vraj.blogapplication.models;
/*
    vrajshah 02/06/2023
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;


public record CommentDto(
        Long id,
         String comment,
         String user,
         Date createdOn
) {

}