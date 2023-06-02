package com.vraj.blogapplication.exceptions;
/*
    vrajshah 21/04/2023
*/

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(value = {Exception.class, StatusException.class})
    public ResponseEntity<?> handleException(Exception exception) {
        if (exception instanceof StatusException statusException) {
            return ResponseEntity.status(statusException.getHttpStatus())
                    .body(statusException.getMessage());
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(exception.getMessage());
    }

    @ExceptionHandler(value = {MethodArgumentNotValidException.class})
    public ResponseEntity<?> handleValidationException(MethodArgumentNotValidException exception, WebRequest request) {
        Map<String, List<String>> errorMessages = new HashMap<>();
        exception.getBindingResult().getFieldErrors().forEach(error -> {
            List<String> msg = errorMessages.getOrDefault(error.getField(), new ArrayList<>());
            msg.add(error.getDefaultMessage());
            errorMessages.put(error.getField(), msg);
        });
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(errorMessages);
    }

    @ExceptionHandler(value = {AccessDeniedException.class})
    public ResponseEntity<?> handleAccessDeniedException(AccessDeniedException exception) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(exception.getMessage());
    }

    @ExceptionHandler(value = {AuthenticationException.class})
    public ResponseEntity<?> handleAuthenticationException(AuthenticationException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(exception.getMessage());
    }
}
