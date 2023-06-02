package com.vraj.blogapplication.utils;
/*
    vrajshah 22/04/2023
*/

import com.vraj.blogapplication.models.entities.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Configuration
public class JwtProvider {
    private final int JWT_TOKEN_VALIDITY = 60 * 1000;

    @Value("${jwt.secret_key}")
    private String secretKey;
    @Value("${jwt.expire_in}")
    private int expireIn;

    //retrieve username from jwt token
    public String getEmailFromToken(String token) {
        Claims claims = getAllClaimsFromToken(token);
        String email = claims.get("email_id").toString();
        return email;
    }

    //retrieve expiration date from jwt token
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token) {
        final Claims claims = Jwts
                .parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
        return claims;
    }

    public String doGenerateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email_id", user.getEmail());
        claims.put("user_id", user.getId());
        claims.put("username", user.getUsername());
        claims.put("role", user.getRole());
        return GenerateAccessToken(user.getId().toString(), claims, expireIn);
    }

    private String GenerateAccessToken(String subject, Map<String, Object> claims, long expireIn) {
        return Jwts
                .builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + (JWT_TOKEN_VALIDITY * expireIn)))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();

    }

    //check if the token has expired
    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    //validate token
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String email = getEmailFromToken(token);
        return (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
