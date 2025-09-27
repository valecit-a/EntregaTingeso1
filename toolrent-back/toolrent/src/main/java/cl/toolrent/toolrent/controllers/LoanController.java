package cl.toolrent.toolrent.controllers;

import cl.toolrent.toolrent.entities.LoanEntity;
import cl.toolrent.toolrent.services.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/loan")
@CrossOrigin("*")
public class LoanController {

    @Autowired
    private LoanService loanService;

    // RF2.1 Registrar préstamo (RF2.2 y RF2.5 se validan en el service)
    @PostMapping
    public ResponseEntity<?> create(@RequestBody LoanEntity loan) {
        try {
            LoanEntity saved = loanService.create(loan);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    // RF2.3 Registrar devolución (calcula multa RF2.4)
    // Acepta returnDate por query (?returnDate=YYYY-MM-DD) o en JSON body {"returnDate":"YYYY-MM-DD"}.
    // Si no se envía, usa la fecha de hoy.
    @PostMapping("/{id}/return")
    public ResponseEntity<?> registerReturn(@PathVariable Long id,
                                            @RequestParam(value = "returnDate", required = false) String returnDateParam,
                                            @RequestBody(required = false) Map<String, String> body) {
        try {
            LocalDate returnDate = null;
            if (returnDateParam != null && !returnDateParam.isBlank()) {
                returnDate = LocalDate.parse(returnDateParam);
            } else if (body != null && body.get("returnDate") != null && !body.get("returnDate").isBlank()) {
                returnDate = LocalDate.parse(body.get("returnDate"));
            } else {
                returnDate = LocalDate.now();
            }

            LoanEntity updated = loanService.registerReturn(id, returnDate);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    // Listar todos
    @GetMapping
    public List<LoanEntity> findAll() {
        return loanService.findAll();
    }

    // Buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        LoanEntity l = loanService.findById(id);
        if (l == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Préstamo no encontrado");
        }
        return ResponseEntity.ok(l);
    }

    // Eliminar (opcional: solo si no está vigente; si tu service lo valida y lanza IllegalStateException, devolvemos 409)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            boolean deleted = loanService.deleteById(id);
            if (!deleted) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Préstamo no encontrado");
            }
            return ResponseEntity.ok("Préstamo eliminado con éxito");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }
}
