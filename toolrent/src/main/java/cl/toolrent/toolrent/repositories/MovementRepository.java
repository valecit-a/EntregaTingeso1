package cl.toolrent.toolrent.repositories;

import cl.toolrent.toolrent.entities.MovementEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovementRepository extends JpaRepository<MovementEntity, Long> {
    List<MovementEntity> findByToolId(Long toolId);
    List<MovementEntity> findByUserId(Long userId);
    List<MovementEntity> findByTypeMovement(String typeMovement);
    // Si guardas dateMovement como String, evita filtros por fecha aquí.
}

