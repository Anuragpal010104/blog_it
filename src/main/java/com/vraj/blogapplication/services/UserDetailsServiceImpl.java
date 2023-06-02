package com.vraj.blogapplication.services;
/*
    vrajshah 22/04/2023
*/

import com.vraj.blogapplication.models.AppUser;
import com.vraj.blogapplication.models.entities.User;
import com.vraj.blogapplication.repositories.interfaces.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("Fetching user with {}", username);
        User user = userRepository.findUserByUsernameIgnoreCaseOrEmailIgnoreCase(username.toLowerCase())
                .orElseThrow(
                        () -> new UsernameNotFoundException("Invalid username/email or password")
                );
        return new AppUser(user);
    }
}
