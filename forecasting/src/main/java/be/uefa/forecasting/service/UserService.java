package be.uefa.forecasting.service;

import be.uefa.forecasting.dto.UserDto;
import be.uefa.forecasting.entity.ConfirmationTokenEntity;
import be.uefa.forecasting.entity.UserEntity;
import be.uefa.forecasting.repository.ConfirmationTokenRepository;
import be.uefa.forecasting.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConfirmationTokenRepository confirmationTokenRepository;

    @Autowired
    private EmailService emailService;

    public UserDto saveUser(UserDto user) {

        if (userRepository.existsByEmailIgnoreCase(user.email())) {
            return null;
        }

        UserEntity userEntity = new UserEntity(user.email());
        ConfirmationTokenEntity confirmationToken = new ConfirmationTokenEntity(userEntity);
        userRepository.save(userEntity);
        confirmationTokenRepository.save(confirmationToken);


        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(userEntity.getEmail());
        mailMessage.setSubject("Complete Registration!");
        mailMessage.setText("To confirm your account, please click here : "
                +"http://localhost:8080/users/confirm-account?token=" + confirmationToken.getToken());
        emailService.sendEmail(mailMessage);

        System.out.println("Confirmation Token: " + confirmationToken.getToken());

//        return ResponseEntity.ok("Verify email by the link sent on your email address");
        return user;
    }

    public ConfirmationTokenEntity confirmEmail(String confirmationToken) {
        ConfirmationTokenEntity token = confirmationTokenRepository.findByToken(confirmationToken);

        if(token != null)
        {
            UserEntity user = userRepository.findByEmailIgnoreCase(token.getUserEntity().getEmail());
            user.setEnabled(true);
            userRepository.save(user);
            return token;
        }
        return null;
    }

}
