package be.uefa.forecasting.repository;

import be.uefa.forecasting.entity.GroupMatchesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupMatchesRepository extends JpaRepository<GroupMatchesEntity, Long> {

    List<GroupMatchesEntity> findBySeasonYear(Integer year);
}
