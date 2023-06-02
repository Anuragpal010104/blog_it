package com.vraj.blogapplication.models.payloads;
/*
    vrajshah 22/04/2023
*/

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class SignInRequest {
    @NotBlank(message = "Username/Email is required.")
    @Size(max = 255, message = " '${validatedValue}' should not contain more than {max} characters.")
    private String username;

    @NotBlank(message = "Password is required.")
    @Size(min = 8, max = 16, message = "Password should be {min} - {max} characters.")
    private String password;
}
