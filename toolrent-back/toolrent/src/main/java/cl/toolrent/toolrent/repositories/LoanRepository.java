package cl.toolrent.toolrent.repositories;

import cl.toolrent.toolrent.entities.LoanEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface LoanRepository extends JpaRepository<LoanEntity, Long> {

    // Bloqueo por préstamos vencidos
    boolean existsByClientIdAndStatusAndDueDateBefore(String clientId, String status, LocalDate date);

    // Bloqueo por multas/deudas (si las marcas con estado, p.ej. DEVUELTO_CON_MULTA)
    boolean existsByClientIdAndStatus(String clientId, String status);

    // Límite de préstamos activos
    long countByClientIdAndStatus(String clientId, String status);

    // Impedir misma herramienta prestada al mismo cliente simultáneamente
    boolean existsByClientIdAndToolIdAndStatus(String clientId, Long toolId, String status);

    // Utilidades
    List<LoanEntity> findByClientIdAndStatus(String clientId, String status);
    List<LoanEntity> findByToolIdAndStatus(Long toolId, String status);
}
