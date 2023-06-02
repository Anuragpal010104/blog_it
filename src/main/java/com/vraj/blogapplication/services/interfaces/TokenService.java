package com.vraj.blogapplication.services.interfaces;

import com.vraj.blogapplication.models.enums.TokenType;

public interface TokenService {
    String generateAccessToken(Long userId);

    String generateRefreshToken(Long userId);

    boolean isTokenValid(String token, TokenType type, Long userId);

    void deleteToken(String token, TokenType tokenType, Long userId);
}
