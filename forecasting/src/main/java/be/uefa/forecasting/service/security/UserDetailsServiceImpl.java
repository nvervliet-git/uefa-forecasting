package be.uefa.forecasting.service.security;

import be.uefa.forecasting.entity.UserEntity;
import be.uefa.forecasting.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity userEntity = userRepository.findByEmailIgnoreCase(email);
        if (userEntity == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return new EmailTokenUser(userEntity.getEmail(), userEntity.getConfirmationTokenEntity().getToken(), userEntity.isEnabled());

    }
}
