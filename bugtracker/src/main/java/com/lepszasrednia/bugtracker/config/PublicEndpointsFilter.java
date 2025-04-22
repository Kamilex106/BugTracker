package com.lepszasrednia.bugtracker.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class PublicEndpointsFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // Pomijanie weryfikacji JWT dla publicznych endpointow
        String path = request.getRequestURI();
        if (path.equals("/registration")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Kontynuuj normalne przetwarzanie dla innych żądań
        filterChain.doFilter(request, response);
    }
}
