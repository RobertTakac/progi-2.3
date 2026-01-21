package com.patuljci.gearshare.controller;
import com.patuljci.gearshare.dto.*;
import com.patuljci.gearshare.model.Admin;
import com.patuljci.gearshare.model.Client;
import com.patuljci.gearshare.model.Merchant;
import com.patuljci.gearshare.model.UserEntity;
import com.patuljci.gearshare.responses.LoginResponse;
import com.patuljci.gearshare.service.AuthenticationService;
import com.patuljci.gearshare.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {
    private final JwtService jwtService;

    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<UserEntity> register(@RequestBody RegisterUserDto registerUserDto) {
        System.out.println("Signup request received: " + registerUserDto.getEmail());
        UserEntity registeredUser = authenticationService.signup(registerUserDto);
        System.out.println("User registered: " + registeredUser.getEmail());
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/client-signup")
    public ResponseEntity<Client> registerAsClient(@RequestBody ClientRegisterDTO clientRegisterDTO) {
        //System.out.println("Signup request received: " + registerUserDto.getEmail());

        //UserEntity registeredUser = authenticationService.signup(registerUserDto);

        Client client = authenticationService.signupClient(clientRegisterDTO);

        //System.out.println("User registered: " + registeredUser.getEmail());
        return ResponseEntity.ok(client);
    }


    @PostMapping("/merchant-signup")
    public ResponseEntity<Merchant> registerAsMerchant(@RequestBody MerchantRegisterDTO dto) {


        Merchant merchant = authenticationService.signupMerchant(dto);

        return ResponseEntity.ok(merchant);
    }

    @PostMapping("/admin-signup")
    public ResponseEntity<Admin> registerAsAdmin(@RequestBody RegisterUserDto registerUserDto){

        Admin admin = authenticationService.signupAdmin(registerUserDto);


        return ResponseEntity.ok(admin);
    }



    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto){
        UserEntity authenticatedUser = authenticationService.authenticate(loginUserDto);
        String jwtToken = jwtService.generateToken(authenticatedUser);
        LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime());
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody VerifyUserDto verifyUserDto) {
        try {
            authenticationService.verifyUser(verifyUserDto);
            return ResponseEntity.ok("Account verified successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/resend")
    public ResponseEntity<?> resendVerificationCode(@RequestParam String email) {
        try {
            authenticationService.resendVerificationCode(email);
            return ResponseEntity.ok("Verification code sent");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}