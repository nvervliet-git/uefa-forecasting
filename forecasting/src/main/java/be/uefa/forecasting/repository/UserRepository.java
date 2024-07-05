package be.uefa.forecasting.repository;

import be.uefa.forecasting.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    UserEntity findByEmailIgnoreCase(String email);

    Boolean existsByEmailIgnoreCase(String email);
}
