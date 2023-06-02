package com.vraj.blogapplication.models.payloads;
/*
    vrajshah 02/06/2023
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentRequest {
    private Long blogId;
    private String comment;
}
