package com.vraj.blogapplication.services.interfaces;

import com.vraj.blogapplication.models.UserDto;
import com.vraj.blogapplication.models.payloads.SignInRequest;
import com.vraj.blogapplication.models.payloads.SignUpRequest;

public interface UserService {
    UserDto registerUser(SignUpRequest signup);

    Long signInUser(SignInRequest signIn);

    UserDto getById(Long userId);
}
