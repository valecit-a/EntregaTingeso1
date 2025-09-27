package cl.toolrent.toolrent.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@Entity
@Table(name = "Rate")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RateEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rateId")
    private Long rateId;

    @Column(name = "dailyRentalFee")
    private int dailyRentalFee;

    @Column(name = "dailyLateFee")
    private int dailyLateFee;

    @Column(name = "repairFee")
    private int repairFee;
}

