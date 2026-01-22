package com.patuljci.gearshare.service;

import com.patuljci.gearshare.dto.*;
import com.patuljci.gearshare.model.Admin;
import com.patuljci.gearshare.model.Client;
import com.patuljci.gearshare.model.Merchant;
import com.patuljci.gearshare.model.UserEntity;
import com.patuljci.gearshare.repository.AdminRepository;
import com.patuljci.gearshare.repository.ClientRepository;
import com.patuljci.gearshare.repository.MerchantRepository;
import com.patuljci.gearshare.repository.UserRepository;

import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

import org.springframework.security.core.Authentication;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final MerchantRepository merchantRepository;
    private final PasswordEncoder passwordEncoder;
    private final @Lazy AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final AdminRepository adminRepository;

    public AuthenticationService(
            UserRepository userRepository, ClientRepository clientRepository, MerchantRepository merchantRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            EmailService emailService, AdminRepository adminRepository
    ) {
        this.clientRepository = clientRepository;
        this.merchantRepository = merchantRepository;
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.adminRepository = adminRepository;
    }

    public UserEntity signup(RegisterUserDto input) {
        UserEntity user = new UserEntity(input.getUsername(), input.getEmail(), passwordEncoder.encode(input.getPassword()));
        user.setVerificationCode(generateVerificationCode());
        user.setVerificationCodeExpiresAt(String.valueOf(LocalDateTime.now().plusMinutes(15)));
        user.setEnabled(false);
        sendVerificationEmail(user);
        return userRepository.save(user);
    }

    @Transactional
    public Client signupClient(ClientRegisterDTO clientRegisterDTO) {
        Client client = new Client();

        UserEntity user = new UserEntity(clientRegisterDTO.getUsername(), clientRegisterDTO.getEmail(), passwordEncoder.encode(clientRegisterDTO.getPassword()));
        user.setVerificationCode(generateVerificationCode());
        user.setVerificationCodeExpiresAt(String.valueOf(LocalDateTime.now().plusMinutes(15)));
        user.setEnabled(false);
        sendVerificationEmail(user);

        client.setCanRent(true);
        client.setUser(userRepository.save(user));

        return clientRepository.save(client);
    }

    public Admin signupAdmin(RegisterUserDto adminRegisterDTO) {
        Admin admin = new Admin();

        UserEntity user = new UserEntity(adminRegisterDTO.getUsername(), adminRegisterDTO.getEmail(), passwordEncoder.encode(adminRegisterDTO.getPassword()));
        user.setVerificationCode(generateVerificationCode());
        user.setVerificationCodeExpiresAt(String.valueOf(LocalDateTime.now().plusMinutes(15)));
        user.setEnabled(false);
        sendVerificationEmail(user);


        admin.setUser(userRepository.save(user));

        return adminRepository.save(admin);
    }

    public Merchant signupMerchant(MerchantRegisterDTO dto){
        Merchant merchant = new Merchant();

        UserEntity user = new UserEntity(dto.getUsername(), dto.getEmail(), passwordEncoder.encode(dto.getPassword()));
        user.setVerificationCode(generateVerificationCode());
        user.setVerificationCodeExpiresAt(String.valueOf(LocalDateTime.now().plusMinutes(15)));
        user.setEnabled(false);
        sendVerificationEmail(user);

        merchant.setBusinessName(dto.getBusinessName());
        merchant.setAddress(dto.getAddress());
        merchant.setCity(dto.getCity());
        merchant.setCountry(dto.getCountry());
        merchant.setDescription(dto.getDescription());
        merchant.setPostalCode(dto.getPostalCode());

        merchant.setUser(userRepository.save(user));
        return merchantRepository.save(merchant);
    }

    public UserEntity authenticate(LoginUserDto input) {
        UserEntity user = userRepository.findByEmail(input.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getGoogleId() != null) {
            throw new RuntimeException(
                    "This account was created with Google. Please sign in with Google or set a password."
            );
        }

        if (!user.isEnabled()) {
            throw new RuntimeException("Account not verified.");
        }

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );

        user.setAuthorities(auth.getAuthorities());

        return user;
    }



    public void verifyUser(VerifyUserDto input) {
        Optional<UserEntity> optionalUser = userRepository.findByEmail(input.getEmail());

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        UserEntity user = optionalUser.get();


        if (user.getVerificationCodeExpiresAt() == null ||
                LocalDateTime.parse(user.getVerificationCodeExpiresAt()).isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Verification code has expired");
        }


        if (!user.getVerificationCode().equals(input.getVerificationCode())) {
            throw new RuntimeException("Invalid verification code");
        }

        user.setEnabled(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiresAt(null);
        userRepository.save(user);
    }

    public void resendVerificationCode(String email) {
        Optional<UserEntity> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            UserEntity user = optionalUser.get();
            if (user.isEnabled()) {
                throw new RuntimeException("Account is already verified");
            }
            user.setVerificationCode(generateVerificationCode());
            user.setVerificationCodeExpiresAt(String.valueOf(LocalDateTime.now().plusHours(1)));
            sendVerificationEmail(user);
            userRepository.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    private void sendVerificationEmail(UserEntity user) {
        String subject = "Account Verification";
        String verificationCode = "VERIFICATION CODE " + user.getVerificationCode();
        String htmlMessage = "<html>"
                + "<body style=\"font-family: Arial, sans-serif;\">"
                + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
                + "<h2 style=\"color: #333;\">Welcome to Gearshare!</h2>"
                + "<p style=\"font-size: 16px;\">Please enter the verification code below to continue:</p>"
                + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                + "<h3 style=\"color: #333;\">Verification Code:</h3>"
                + "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + verificationCode + "</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

        try {
            emailService.sendVerificationEmail(user.getEmail(), subject, htmlMessage);
        } catch (Exception e) {
            // Handle email sending exception
            e.printStackTrace();
        }
    }
    private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }
    @Transactional
    public UserEntity processGoogleUser(String googleId, String email, String name) {

        Optional<UserEntity> byGoogleId = userRepository.findByGoogleId(googleId);
        if (byGoogleId.isPresent()) {
            return byGoogleId.get();
        }

        Optional<UserEntity> byEmail = userRepository.findByEmail(email);
        if (byEmail.isPresent()) {
            UserEntity user = byEmail.get();
            user.setGoogleId(googleId);
            return userRepository.save(user);
        }

        // 3️⃣ Novi user (Google signup)
        UserEntity user = new UserEntity();
        user.setGoogleId(googleId);
        user.setEmail(email);
        user.setUsername(name);

        user.setPassword(
                passwordEncoder.encode(UUID.randomUUID().toString())
        );
        user.setEnabled(true);

        return userRepository.save(user);
    }


}
