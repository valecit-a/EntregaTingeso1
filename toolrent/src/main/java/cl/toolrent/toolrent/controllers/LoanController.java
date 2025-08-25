package cl.toolrent.toolrent.controllers;

import cl.toolrent.toolrent.entities.LoanEntity;
import cl.toolrent.toolrent.services.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/loans")
public class LoanController {

    @Autowired
    private LoanService loanService;

    @PostMapping("/register")
    public LoanEntity registerLoan(@RequestParam Long clientId,
                                   @RequestParam Long toolId,
                                   @RequestParam String startDate,
                                   @RequestParam String dueDate) {
        return loanService.registerLoan(
                clientId,
                toolId,
                LocalDate.parse(startDate),
                LocalDate.parse(dueDate)
        );
    }
}

