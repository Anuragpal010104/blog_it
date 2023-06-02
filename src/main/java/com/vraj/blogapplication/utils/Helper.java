package com.vraj.blogapplication.utils;
/*
    vrajshah 29/04/2023
*/

import com.vraj.blogapplication.models.AppUser;
import org.springframework.security.core.context.SecurityContextHolder;

public class Helper {

    public static AppUser getLoggedInUserDetails() {
        AppUser appUser = (AppUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return appUser;
    }

}
