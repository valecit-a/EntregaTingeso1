package cl.toolrent.toolrent.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@Entity
@Table(name = "Client")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "clientId")
    private Long clientId;

    @Column(name = "nameClient")
    private String name;     // <-- propiedad Java: name

    @Column(name = "emailClient")
    private String email;    // <-- propiedad Java: email

    @Column(name = "phoneClient")
    private String phone;    // <-- propiedad Java: phone

    @Column(name = "statusClient")
    private String status;   // <-- propiedad Java: status
}
