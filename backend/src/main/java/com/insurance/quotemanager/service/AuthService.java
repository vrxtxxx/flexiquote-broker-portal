
package com.insurance.quotemanager.service;

import com.insurance.quotemanager.dto.AuthRequest;
import com.insurance.quotemanager.dto.AuthResponse;
import com.insurance.quotemanager.dto.UserDto;
import com.insurance.quotemanager.model.User;
import com.insurance.quotemanager.repository.UserRepository;
import com.insurance.quotemanager.security.JwtTokenProvider;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public AuthResponse login(AuthRequest authRequest) {
        User user = userRepository.findByEmail(authRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + authRequest.getEmail()));
        
        if (!passwordEncoder.matches(authRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        
        String token = jwtTokenProvider.generateToken(user.getId());
        UserDto userDto = convertToDto(user);
        
        return new AuthResponse(token, userDto);
    }
    
    private UserDto convertToDto(User user) {
        UserDto userDto = new UserDto();
        BeanUtils.copyProperties(user, userDto);
        if (user.getBroker() != null) {
            userDto.setBrokerId(user.getBroker().getId());
        }
        return userDto;
    }
}
