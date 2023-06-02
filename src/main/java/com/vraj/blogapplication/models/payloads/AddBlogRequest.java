package com.vraj.blogapplication.models.payloads;
/*
    vrajshah 29/04/2023
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddBlogRequest {

    private String title;
    private String content;
    private String thumbnail;
    private Long category;

}
