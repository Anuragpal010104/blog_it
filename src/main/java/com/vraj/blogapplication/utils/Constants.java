package com.vraj.blogapplication.utils;
/*
    vrajshah 20/04/2023
*/

public class Constants {
    public static final String[] WHITELISTED_URLS = {
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/auth/sign-up",
            "/auth/sign-in",
            "/h2-console/**"
    };

    public static final String REFRESH_TOKEN = "refresh_token";
    public static final String ACCESS_TOKEN = "access_token";
}
