package be.uefa.forecasting.entity;

import jakarta.persistence.*;

@Entity
@Table(name="USER")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String email;

    private boolean isEnabled;

    @OneToOne(mappedBy = "userEntity")  // Can define 'cascade = CascadeType.ALL' here as well instead of in Product entity
    private ConfirmationTokenEntity confirmationTokenEntity;

    protected UserEntity() {
        // JPA empty constructor
    }

    public UserEntity(String email) {
        this.email = email;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isEnabled() {
        return isEnabled;
    }

    public void setEnabled(boolean enabled) {
        isEnabled = enabled;
    }

    public ConfirmationTokenEntity getConfirmationTokenEntity() {
        return confirmationTokenEntity;
    }

    public void setConfirmationTokenEntity(ConfirmationTokenEntity confirmationTokenEntity) {
        this.confirmationTokenEntity = confirmationTokenEntity;
    }
}
