package cl.toolrent.toolrent.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@Entity
@Table(name = "Movement")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovementEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "movementId")
    private Long movementId;

    @Column(name = "toolId")
    private Long toolId;

    @Column(name = "userId")
    private Long userId;

    @Column(name = "typeMovement")
    private String typeMovement; // Ingreso, Prestamo, Devolucion, Baja, Reparacion

    @Column(name = "dateMovement")
    private String dateMovement; // fecha/hora como String para mantenerlo simple

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "description")
    private String description;
}
