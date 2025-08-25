package cl.toolrent.toolrent.services;

import cl.toolrent.toolrent.entities.LoanEntity;
import cl.toolrent.toolrent.entities.MovementEntity;
import cl.toolrent.toolrent.repositories.LoanRepository;
import cl.toolrent.toolrent.repositories.MovementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class LoanService {

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private MovementRepository movementRepository;

    public LoanEntity registerLoan(Long clientId, Long toolId, LocalDate startDate, LocalDate dueDate) {
        // Crear préstamo
        LoanEntity loan = new LoanEntity();
        loan.setClientId(clientId);
        loan.setToolId(toolId);
        loan.setStartDate(startDate);
        loan.setDueDate(dueDate);
        loan.setStatus("VIGENTE");
        loan.setFine(0);

        LoanEntity savedLoan = loanRepository.save(loan);

        // Crear movimiento en Kardex
        MovementEntity mov = new MovementEntity(
                null,
                toolId,
                clientId,                          // como userId para registrar quién pidió
                "PRÉSTAMO",                        // tipo de movimiento
                startDate.toString(),              // fecha como String
                1,
                "Préstamo registrado"
        );
        movementRepository.save(mov);

        return savedLoan;
    }
}
