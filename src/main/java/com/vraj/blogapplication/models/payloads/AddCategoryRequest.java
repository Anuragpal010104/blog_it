package com.vraj.blogapplication.models.payloads;
/*
    vrajshah 30/04/2023
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddCategoryRequest {

    private String name;
}
