package cl.toolrent.toolrent.repositories;

import cl.toolrent.toolrent.entities.MovementEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovementRepository extends JpaRepository<MovementEntity, Long> {
    List<MovementEntity> findByToolId(Long toolId);
    List<MovementEntity> findByClientId(String clientId);
    List<MovementEntity> findByUserId(String userId);
    List<MovementEntity> findByTypeMovement(String typeMovement);
}

