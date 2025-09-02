package cl.toolrent.toolrent.controllers;

import cl.toolrent.toolrent.entities.LoanEntity;
import cl.toolrent.toolrent.services.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/loan")
@CrossOrigin("*")
public class LoanController {

    @Autowired
    private LoanService loanService;

    @GetMapping
    public ResponseEntity<List<LoanEntity>> findAll() {
        return ResponseEntity.ok(loanService.findAll());
    }

    @GetMapping("/{loan_id}")
    public ResponseEntity<LoanEntity> findById(@PathVariable Long loan_id) {
        return ResponseEntity.ok(loanService.findById(loan_id));
    }

    @GetMapping("/exists/{loan_id}")
    public ResponseEntity<Boolean> existsById(@PathVariable Long loan_id) {
        return ResponseEntity.ok(loanService.existsById(loan_id));
    }

    @PostMapping("/register")
    public ResponseEntity<LoanEntity> register(@RequestParam Long client_id,
                                               @RequestParam Long tool_id,
                                               @RequestParam String start_date,
                                               @RequestParam String due_date) {
        return ResponseEntity.ok(
                loanService.registerLoan(
                        client_id,
                        tool_id,
                        LocalDate.parse(start_date),
                        LocalDate.parse(due_date)
                )
        );
    }

    @PostMapping("/{loan_id}/return")
    public ResponseEntity<LoanEntity> returnLoan(@PathVariable Long loan_id,
                                                 @RequestParam(required = false) String return_date) {
        LocalDate rd = (return_date == null || return_date.isBlank())
                ? LocalDate.now()
                : LocalDate.parse(return_date);
        return ResponseEntity.ok(loanService.returnLoan(loan_id, rd));
    }

    @DeleteMapping("/{loan_id}")
    public ResponseEntity<Void> delete(@PathVariable Long loan_id) {
        loanService.deleteById(loan_id);
        return ResponseEntity.noContent().build();
    }
}
