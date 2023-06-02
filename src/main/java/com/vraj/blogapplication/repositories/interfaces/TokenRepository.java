package com.vraj.blogapplication.repositories.interfaces;

import com.vraj.blogapplication.models.entities.Token;
import com.vraj.blogapplication.models.enums.TokenType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {

    @Query("SELECT t FROM Token t WHERE t.token =?1 and t.type=?2 and t.user.id=?3")
    Optional<Token> findTokenByTypeAndUser(String token, TokenType tokenType, Long userId);
}
