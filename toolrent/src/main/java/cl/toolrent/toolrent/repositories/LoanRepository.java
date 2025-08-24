package cl.toolrent.toolrent.repositories;

import cl.toolrent.toolrent.entities.LoanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<LoanEntity, Long> {
    List<LoanEntity> findByClientId(Long clientId);
    List<LoanEntity> findByToolId(Long toolId);
    List<LoanEntity> findByStatus(String status);
    // Ejemplo por rango de fechas (si usas LocalDate):
    // List<LoanEntity> findByStartDateBetween(LocalDate start, LocalDate end);
}
