package cl.toolrent.toolrent.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "Loan")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoanEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "loanId")
    private Long loanId;

    @Column(name = "clientId")
    private String clientId;

    @Column(name = "toolId")
    private Long toolId;

    @Column(name = "startDate")
    private LocalDate startDate;

    @Column(name = "dueDate")
    private LocalDate dueDate;

    @Column(name = "returnDate")
    private LocalDate returnDate;

    @Column(name = "statusLoan")
    private String status;

    @Column(name = "fine")
    private int fine;
}
