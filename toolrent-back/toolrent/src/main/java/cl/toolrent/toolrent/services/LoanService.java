package cl.toolrent.toolrent.services;

import cl.toolrent.toolrent.entities.ClientEntity;
import cl.toolrent.toolrent.entities.LoanEntity;
import cl.toolrent.toolrent.entities.ToolEntity;
import cl.toolrent.toolrent.repositories.ClientRepository;
import cl.toolrent.toolrent.repositories.LoanRepository;
import cl.toolrent.toolrent.repositories.ToolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LoanService {

    private static final int DAILY_FINE = 1000;
    private static final int MAX_ACTIVE_LOANS = 5;

    @Autowired private LoanRepository loanRepository;
    @Autowired private ClientRepository clientRepository;
    @Autowired private ToolRepository toolRepository;

    /* ===== lecturas básicas (sin reglas de negocio) ===== */
    public List<LoanEntity> findAll() { return loanRepository.findAll(); }

    public LoanEntity findById(Long loanId) {
        if (loanId == null) return null;
        return loanRepository.findById(loanId).orElse(null);
    }

    public boolean existsById(Long loanId) {
        return loanId != null && loanRepository.existsById(loanId);
    }

    public boolean deleteById(Long loanId) {
        if (loanId == null || !loanRepository.existsById(loanId)) return false;
        loanRepository.deleteById(loanId);
        return true;
    }

    /* ===== crear préstamo ===== */
    @Transactional
    public LoanEntity create(LoanEntity body) {
        if (body == null) throw new IllegalArgumentException("Body vacío");
        return registerLoan(body.getClientId(), body.getToolId(), body.getStartDate(), body.getDueDate());
    }

    @Transactional
    public LoanEntity registerLoan(String clientId, Long toolId, LocalDate startDate, LocalDate dueDate) {
        if (clientId == null || toolId == null || startDate == null || dueDate == null)
            throw new IllegalArgumentException("Parámetros obligatorios faltantes");
        if (dueDate.isBefore(startDate))
            throw new IllegalArgumentException("La fecha pactada de devolución no puede ser anterior a la de entrega");

        ClientEntity client = getClientOrThrow(clientId);
        ToolEntity tool = getToolOrThrow(toolId);

        // Valida reglas de negocio y lanza si falla
        validateBorrowOrThrow(client, tool);

        // Crear y guardar préstamo
        LoanEntity loan = new LoanEntity();
        loan.setClientId(client.getRut());       // clave tal como está en BD (RUT)
        loan.setToolId(tool.getToolId());
        loan.setStartDate(startDate);
        loan.setDueDate(dueDate);
        loan.setStatus("VIGENTE");
        loan.setFine(0);

        LoanEntity saved = loanRepository.save(loan);

        // Reducir stock y actualizar estado herramienta
        updateStockOnBorrow(tool);
        return saved;
    }

    /* ===== registrar devolución ===== */
    @Transactional
    public LoanEntity registerReturn(Long loanId, LocalDate returnDate) {
        if (loanId == null) throw new IllegalArgumentException("loanId obligatorio");
        if (returnDate == null) returnDate = LocalDate.now();

        LoanEntity loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new IllegalArgumentException("Préstamo no encontrado: " + loanId));

        if (!"VIGENTE".equalsIgnoreCase(loan.getStatus()))
            throw new IllegalStateException("El préstamo no está vigente");

        int fine = computeFine(loan.getDueDate(), returnDate);

        loan.setReturnDate(returnDate);
        loan.setFine(fine);
        loan.setStatus(fine > 0 ? "DEVUELTO_CON_MULTA" : "DEVUELTO");
        LoanEntity updated = loanRepository.save(loan);

        ToolEntity tool = toolRepository.findById(loan.getToolId())
                .orElseThrow(() -> new IllegalArgumentException("Herramienta no encontrada: " + loan.getToolId()));
        updateStockOnReturn(tool);

        return updated;
    }

    /* ===== helpers ===== */
    private ClientEntity getClientOrThrow(String clientId) {
        String key = clientId.trim().toUpperCase();
        return clientRepository.findById(key)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no existe: " + key));
    }

    private ToolEntity getToolOrThrow(Long toolId) {
        return toolRepository.findById(toolId)
                .orElseThrow(() -> new IllegalArgumentException("Herramienta no existe: " + toolId));
    }

    private void validateBorrowOrThrow(ClientEntity client, ToolEntity tool) {
        if (client.getStatus() == null || !"ACTIVO".equalsIgnoreCase(client.getStatus()))
            throw new IllegalStateException("Cliente no está ACTIVO");

        if (client.getDebt() != null && client.getDebt() > 0)
            throw new IllegalStateException("Cliente con deudas/multas pendientes");

        Integer stock = tool.getStock();
        if (stock == null || stock <= 0)
            throw new IllegalStateException("Sin stock para la herramienta " + tool.getToolId());

        long activos = loanRepository.countByClientIdAndStatus(client.getRut(), "VIGENTE");
        if (activos >= MAX_ACTIVE_LOANS)
            throw new IllegalStateException("Máximo de préstamos activos alcanzado (" + MAX_ACTIVE_LOANS + ")");

        boolean yaTiene = loanRepository.existsByClientIdAndToolIdAndStatus(client.getRut(), tool.getToolId(), "VIGENTE");
        if (yaTiene)
            throw new IllegalStateException("Cliente ya tiene la misma herramienta en préstamo");

        boolean tieneVencidos = loanRepository.existsByClientIdAndStatusAndDueDateBefore(
                client.getRut(), "VIGENTE", LocalDate.now());
        if (tieneVencidos)
            throw new IllegalStateException("Cliente con préstamo vencido sin regularizar");
    }

    private void updateStockOnBorrow(ToolEntity tool) {
        int nuevo = tool.getStock() - 1;
        if (nuevo < 0) throw new IllegalStateException("Stock insuficiente");
        tool.setStock(nuevo);
        tool.setStatus(nuevo == 0 ? "AGOTADA" : "DISPONIBLE");
        toolRepository.save(tool);
    }

    private void updateStockOnReturn(ToolEntity tool) {
        int nuevo = tool.getStock() + 1;
        tool.setStock(nuevo);
        tool.setStatus("DISPONIBLE");
        toolRepository.save(tool);
    }

    private int computeFine(LocalDate due, LocalDate ret) {
        long atraso = Math.max(0, ChronoUnit.DAYS.between(due, ret));
        return (int) (atraso * DAILY_FINE);
    }
}
