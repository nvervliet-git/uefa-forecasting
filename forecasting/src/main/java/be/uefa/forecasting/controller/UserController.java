package be.uefa.forecasting.controller;


import be.uefa.forecasting.dto.StringResponse;
import be.uefa.forecasting.dto.UserDto;
import be.uefa.forecasting.dto.UserResponse;
import be.uefa.forecasting.entity.ConfirmationTokenEntity;
import be.uefa.forecasting.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.security.Principal;

@RestController
@RequestMapping("/users")
public class UserController {

    Logger logger = LoggerFactory.getLogger(UserController.class);


    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@RequestBody UserDto user) {
        logger.info("Registering user: [{}]", user);
        final UserDto userDto = userService.saveUser(user);
        if (userDto == null) {
            return ResponseEntity.badRequest().body(new UserResponse("Error: Email is already in use!", user.email()));
        }
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{email}").buildAndExpand(userDto.email()).toUri();
        return ResponseEntity.created(uri).body(new UserResponse(String.format("Email: %s is successfully registered.", user.email()), user.email()));
    }

    @GetMapping(value="/confirm-account")
    public ResponseEntity<StringResponse> confirmUserAccount(@RequestParam("token") String confirmationToken) {
        logger.info("Confirming account token: [{}]", confirmationToken);
        ConfirmationTokenEntity token = userService.confirmEmail(confirmationToken);
        if (token == null) {
            return ResponseEntity.badRequest().body(new StringResponse("Error: Couldn't verify email"));
        }
        return ResponseEntity.ok(new StringResponse("Email verified successfully!"));
    }

    @GetMapping(path = "login")
    public ResponseEntity<StringResponse> login(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        logger.info("Logging in user: [{}]", userDetails.getUsername());
        return ResponseEntity.ok(new StringResponse("You are authenticated"));
    }
}
