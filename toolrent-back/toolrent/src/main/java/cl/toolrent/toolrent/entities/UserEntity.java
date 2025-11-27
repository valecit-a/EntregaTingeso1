package cl.toolrent.toolrent.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "AppUser")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {

    @Id
    @Column(name = "username", length = 50, nullable = false)
    private String username;     // PK (login)

    @Column(name = "password", nullable = false)
    private String password;     // Con hash BCrypt para seguridad

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private Role role;           // ADMIN | EMPLOYEE | USER

    @Column(name = "enabled", nullable = false)
    private boolean enabled = true;

    @Column(name = "fullName")
    private String fullName;

    @Column(name = "email")
    private String email;

    @Column(name = "rut", length = 12, unique = true)
    private String rut;

    @Column(name = "phone", length = 20)
    private String phone;

    // Getter personalizado para userId (para compatibilidad con frontend)
    public Long getUserId() {
        return (long) username.hashCode(); // ID temporal basado en username
    }

    public enum Role { ADMIN, EMPLOYEE, USER }
}
