package be.uefa.forecasting.service.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

class EmailTokenUser implements UserDetails {

    private final String email;
    private final String token;
    private final boolean enabled;

    public EmailTokenUser(String email, String token, boolean enabled) {
        this.email = email;
        this.token = token;
        this.enabled = enabled;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }

    @Override
    public String getPassword() {
        return this.token;
    }

    @Override
    public String getUsername() {
        return this.getToken();
    }

    @Override
    public boolean isEnabled() {
        return this.enabled;
    }

    public String getEmail() {
        return this.email;
    }

    public String getToken() {
        return this.token;
    }
}
