package com.assetflow.controller;

import com.assetflow.dto.ApiResponse;
import com.assetflow.security.JwtProvider;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final JwtProvider jwtProvider;

    @PostMapping("/login")
    public ApiResponse<Map<String, String>> login(@RequestBody LoginRequest loginRequest) {
        String token = jwtProvider.generateToken(loginRequest.getUsername() != null ? loginRequest.getUsername() : "admin");
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("username", loginRequest.getUsername() != null ? loginRequest.getUsername() : "admin");
        return ApiResponse.success(response, "Login successful");
    }

    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }
}
