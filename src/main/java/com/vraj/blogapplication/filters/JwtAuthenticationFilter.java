package com.vraj.blogapplication.filters;
/*
    vrajshah 26/04/2023
*/

import com.vraj.blogapplication.models.enums.TokenType;
import com.vraj.blogapplication.services.CookieService;
import com.vraj.blogapplication.services.interfaces.TokenService;
import com.vraj.blogapplication.utils.Constants;
import com.vraj.blogapplication.utils.JwtProvider;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.PathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;

@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final UserDetailsService userDetailsService;
    private final JwtProvider jwtProvider;
    private final PathMatcher pathMatcher;
    private final TokenService tokenService;

    public JwtAuthenticationFilter(UserDetailsService userDetailsService, JwtProvider jwtProvider, PathMatcher pathMatcher, TokenService tokenService) {
        this.userDetailsService = userDetailsService;
        this.jwtProvider = jwtProvider;
        this.pathMatcher = pathMatcher;
        this.tokenService = tokenService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return Arrays.stream(Constants.WHITELISTED_URLS)
                .anyMatch(p -> pathMatcher.match(p, request.getRequestURI()));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String accessToken = CookieService.get(request, Constants.ACCESS_TOKEN);
        if (accessToken != null) {
            try {
                String email = jwtProvider.getEmailFromToken(accessToken);
                loadUser(request, email);
            } catch (ExpiredJwtException expiredJwtException) {
                Claims claims = expiredJwtException.getClaims();
                Long userId = claims.get("user_id", Long.class);
                String refreshToken = CookieService.get(request, Constants.REFRESH_TOKEN);
                if (tokenService.isTokenValid(refreshToken, TokenType.REFRESH_TOKEN, userId)) {
                    tokenService.deleteToken(refreshToken, TokenType.REFRESH_TOKEN, userId);
                    refreshToken = tokenService.generateRefreshToken(userId);
                    accessToken = tokenService.generateAccessToken(userId);
                    CookieService.add(response, Constants.REFRESH_TOKEN, refreshToken, -1);
                    CookieService.add(response, Constants.ACCESS_TOKEN, accessToken, -1);
                    loadUser(request, claims.get("email_id", String.class));
                }
            } catch (Exception exception) {
                CookieService.add(response, Constants.ACCESS_TOKEN, null, 0);
                CookieService.add(response, Constants.REFRESH_TOKEN, null, 0);
            }

        }
        log.info("JWT filter completed..");
        filterChain.doFilter(request, response);
    }

    private void loadUser(HttpServletRequest request, String email) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        if (userDetails != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            log.info("User with {} email login successful", email);
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            authenticationToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }
    }
}
