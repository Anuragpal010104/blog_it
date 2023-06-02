package com.vraj.blogapplication.models.payloads;
/*
    vrajshah 20/04/2023
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignUpRequest {

    @NotBlank(message = "Name is required.")
    @Size(max = 255, message = " '${validatedValue}' should not contain more than {max} characters.")
    @Pattern(regexp = "^[a-z ]+$", flags = {Pattern.Flag.CASE_INSENSITIVE}, message = "'{validatedValue}' should contain only alphabets and space.")
    private String name;

    @NotBlank(message = "Email is required.")
    @Size(max = 255, message = " '${validatedValue}' should not contain more than {max} characters.")
    @Email(message = "'${validatedValue}' is not a valid email.")
    private String email;

    @NotBlank(message = "Password is required.")
    @Size(min = 8, max = 16, message = "Password should be {min} - {max} characters.")
    private String password;

}
