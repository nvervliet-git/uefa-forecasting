package be.uefa.forecasting.repository;

import be.uefa.forecasting.entity.ConfirmationTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConfirmationTokenRepository extends JpaRepository<ConfirmationTokenEntity, Long> {
    ConfirmationTokenEntity findByToken(String token);
}