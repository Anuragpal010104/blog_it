package com.vraj.blogapplication.services;
/*
    vrajshah 26/04/2023
*/

import org.springframework.beans.factory.annotation.Value;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Arrays;
import java.util.Optional;

public class CookieService {

    @Value("${cookie.secure}")
    private static boolean isSecure;

    @Value("${cookie.http_only}")
    private static boolean isHttpOnly;

    public static void add(HttpServletResponse httpServletResponse, String name, String value, int expire) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(isHttpOnly);
        cookie.setSecure(isSecure);
        cookie.setPath("/");
        if (expire != -1)
            cookie.setMaxAge(expire);
        httpServletResponse.addCookie(cookie);
    }

    public static String get(HttpServletRequest httpServletRequest, String name) {
        if (httpServletRequest.getCookies() == null)
            return null;
        Optional<Cookie> cookie = Arrays.stream(httpServletRequest.getCookies())
                .filter(c -> c.getName().equals(name))
                .findFirst();
        return cookie.map(Cookie::getValue).orElse(null);
    }

}
