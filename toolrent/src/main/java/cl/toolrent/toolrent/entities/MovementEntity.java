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

    @Column(name = "toolId", nullable = false)
    private Long toolId;

    // Arrendatario (RUT del cliente si usas RUT como PK)
    @Column(name = "clientId", nullable = false, length = 20)
    private String clientId;

    // Trabajador/usuario del sistema que registra el movimiento
    @Column(name = "userId", nullable = false, length = 20)
    private String userId;

    // Ingreso | Prestamo | Devolucion | Baja | Reparacion
    @Column(name = "typeMovement", nullable = false, length = 20)
    private String typeMovement;

    // Guardado como String (p.ej. "2025-09-07T12:00:00")
    @Column(name = "dateMovement", nullable = false, length = 30)
    private String dateMovement;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name = "description")
    private String description;
}
