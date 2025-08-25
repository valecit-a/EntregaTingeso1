package cl.toolrent.toolrent.repositories;

import cl.toolrent.toolrent.entities.LoanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<LoanEntity, Long> {

    List<LoanEntity> findByClientId(Long clientId);
    List<LoanEntity> findByToolId(Long toolId);
    List<LoanEntity> findByStatus(String status);


    List<LoanEntity> findByClientIdAndStatusAndDueDateBefore(Long clientId, String status, LocalDate date);

    List<LoanEntity> findByClientIdAndStatus(Long clientId, String status);

    List<LoanEntity> findByToolIdAndStatus(Long toolId, String status);

}
