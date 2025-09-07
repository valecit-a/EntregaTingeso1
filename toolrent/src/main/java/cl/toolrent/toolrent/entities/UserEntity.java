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
    private String password;     // SIN hash (por ahora, simple)

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private Role role;           // ADMIN | EMPLOYEE

    @Column(name = "enabled", nullable = false)
    private boolean enabled = true;

    @Column(name = "fullName")
    private String fullName;

    @Column(name = "email")
    private String email;

    public enum Role { ADMIN, EMPLOYEE }
}
