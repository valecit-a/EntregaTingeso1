package cl.toolrent.toolrent.repositories;

import cl.toolrent.toolrent.entities.RateEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RateRepository extends JpaRepository<RateEntity, Long> {
    // Si usas una sola fila de configuración, puedes después usar findFirst() o count()
}

