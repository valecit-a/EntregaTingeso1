package cl.toolrent.toolrent.services;

import cl.toolrent.toolrent.entities.ClientEntity;
import cl.toolrent.toolrent.entities.LoanEntity;
import cl.toolrent.toolrent.entities.MovementEntity;
import cl.toolrent.toolrent.entities.ToolEntity;
import cl.toolrent.toolrent.repositories.ClientRepository;
import cl.toolrent.toolrent.repositories.LoanRepository;
import cl.toolrent.toolrent.repositories.MovementRepository;
import cl.toolrent.toolrent.repositories.ToolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LoanService {

    private static final int DAILY_FINE = 1000;

    @Autowired private LoanRepository loanRepository;
    @Autowired private MovementRepository movementRepository;
    @Autowired private ClientRepository clientRepository;
    @Autowired private ToolRepository toolRepository;

    public List<LoanEntity> findAll() {
        return loanRepository.findAll();
    }

    public LoanEntity findById(Long loanId) {
        if (loanId == null) return null;
        return loanRepository.findById(loanId).orElse(null);
    }

    public boolean existsById(Long loanId) {
        return loanId != null && loanRepository.existsById(loanId);
    }

    public void deleteById(Long loanId) {
        if (loanId == null || loanId <= 0) return;
        loanRepository.deleteById(loanId);
    }

    public LoanEntity registerLoan(Long clientId, Long toolId, LocalDate startDate, LocalDate dueDate) {
        if (clientId == null || toolId == null || startDate == null || dueDate == null) return null;

        ClientEntity client = clientRepository.findById(clientId).orElse(null);
        if (client == null) return null;

        ToolEntity tool = toolRepository.findById(toolId).orElse(null);
        if (tool == null) return null;

        if ("PRESTADA".equalsIgnoreCase(tool.getStatus())) return null;

        boolean tieneVencidos = loanRepository
                .existsByClientIdAndStatusAndDueDateBefore(clientId, "VIGENTE", LocalDate.now());
        if (tieneVencidos) return null;

        boolean multaPendiente = loanRepository
                .existsByClientIdAndStatus(clientId, "DEVUELTO_CON_MULTA");
        if (multaPendiente) return null;

        LoanEntity loan = new LoanEntity();
        loan.setClientId(clientId);
        loan.setToolId(toolId);
        loan.setStartDate(startDate);
        loan.setDueDate(dueDate);
        loan.setStatus("VIGENTE");
        loan.setFine(0);
        LoanEntity saved = loanRepository.save(loan);

        tool.setStatus("PRESTADA");
        toolRepository.save(tool);

        MovementEntity mov = new MovementEntity(
                null,
                toolId,
                clientId,
                "Prestamo",
                startDate.toString(),
                1,
                "Préstamo registrado"
        );
        movementRepository.save(mov);

        return saved;
    }

    public LoanEntity returnLoan(Long loanId, LocalDate returnDate) {
        if (loanId == null) return null;
        if (returnDate == null) return null;

        LoanEntity loan = loanRepository.findById(loanId).orElse(null);
        if (loan == null) return null;

        if (!"VIGENTE".equalsIgnoreCase(loan.getStatus())) return null;

        long atraso = Math.max(0, ChronoUnit.DAYS.between(loan.getDueDate(), returnDate));
        int fine = (int) (atraso * DAILY_FINE);

        loan.setReturnDate(returnDate);
        loan.setFine(fine);
        loan.setStatus(fine > 0 ? "DEVUELTO_CON_MULTA" : "DEVUELTO");
        LoanEntity updated = loanRepository.save(loan);

        ToolEntity tool = toolRepository.findById(loan.getToolId()).orElse(null);
        if (tool != null) {
            tool.setStatus("DISPONIBLE");
            toolRepository.save(tool);
        }

        MovementEntity mov = new MovementEntity(
                null,
                loan.getToolId(),
                loan.getClientId(),
                "Devolucion",
                returnDate.toString(),
                1,
                fine > 0 ? ("Devolución con multa " + fine) : "Devolución sin multa"
        );
        movementRepository.save(mov);

        return updated;
    }
}
