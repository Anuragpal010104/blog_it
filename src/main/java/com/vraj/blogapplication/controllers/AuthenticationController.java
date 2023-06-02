package com.vraj.blogapplication.controllers;
/*
    vrajshah 21/04/2023
*/

import com.vraj.blogapplication.models.enums.TokenType;
import com.vraj.blogapplication.models.payloads.SignInRequest;
import com.vraj.blogapplication.models.payloads.SignUpRequest;
import com.vraj.blogapplication.services.CookieService;
import com.vraj.blogapplication.services.interfaces.TokenService;
import com.vraj.blogapplication.services.interfaces.UserService;
import com.vraj.blogapplication.utils.Constants;
import com.vraj.blogapplication.utils.Helper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private final UserService userService;
    private final TokenService tokenService;

    public AuthenticationController(UserService userService, TokenService tokenService) {
        this.userService = userService;
        this.tokenService = tokenService;
    }

    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@Valid @RequestBody SignUpRequest signUpRequest) {
        userService.registerUser(signUpRequest);
        return ResponseEntity.ok("Account created successfully.");
    }

    @PostMapping("/sign-in")
    public ResponseEntity<?> signIn(@Valid @RequestBody SignInRequest signInRequest, HttpServletResponse httpServletResponse) {
        Long userId = userService.signInUser(signInRequest);
        CookieService.add(httpServletResponse, Constants.REFRESH_TOKEN, tokenService.generateRefreshToken(userId), -1);
        CookieService.add(httpServletResponse, Constants.ACCESS_TOKEN, tokenService.generateAccessToken(userId), -1);
        return ResponseEntity.ok("Login successful");
    }

    @PostMapping("/sign-out")
    public ResponseEntity<?> signOut(@CookieValue(name = Constants.REFRESH_TOKEN) String refreshToken, HttpServletResponse httpServletResponse) {
        Long userId = Helper.getLoggedInUserDetails().getUser().getId();
        tokenService.deleteToken(refreshToken, TokenType.REFRESH_TOKEN, userId);
        CookieService.add(httpServletResponse, Constants.ACCESS_TOKEN, null, 0);
        CookieService.add(httpServletResponse, Constants.REFRESH_TOKEN, null, 0);
        return ResponseEntity.ok("Logout successfully.");
    }
}
