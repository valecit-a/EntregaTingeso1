package cl.toolrent.toolrent.controllers;

import cl.toolrent.toolrent.entities.UserEntity;
import cl.toolrent.toolrent.repositories.UserRepository;
import cl.toolrent.toolrent.services.UserService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    public UserController(UserService userService,
                          UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    // Helper: ¿quién llama es ADMIN? (usa header X-User con username)
    private boolean isAdmin(String requester) {
        if (requester == null || requester.isBlank()) return false;
        return userRepository.findById(requester.trim())
                .map(u -> u.isEnabled() && u.getRole() == UserEntity.Role.ADMIN)
                .orElse(false);
    }

    /** Crear usuario
     *  - Si no hay usuarios, bootstrap: permite cualquier rol.
     *  - Si ya hay usuarios y el requester NO es admin, fuerza EMPLOYEE. */
    @PostMapping
    public ResponseEntity<?> create(@RequestHeader(value = "X-User", required = false) String requester,
                                    @RequestBody UserEntity u) {
        boolean bootstrap = userService.findAll().isEmpty();
        if (!bootstrap && !isAdmin(requester)) {
            u.setRole(UserEntity.Role.EMPLOYEE);
        }

        UserEntity saved = userService.create(u);
        if (saved == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Datos inválidos o usuario ya existe");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public List<UserEntity> findAll() {
        return userService.findAll();
    }

    @GetMapping("/{username}")
    public ResponseEntity<?> find(@PathVariable String username) {
        UserEntity u = userService.findByUsername(username);
        return (u == null) ? ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado")
                : ResponseEntity.ok(u);
    }

    /** Actualizar perfil (password, fullName, email) */
    @PutMapping
    public ResponseEntity<?> update(@RequestBody UserEntity u) {
        if (u == null || u.getUsername() == null) {
            return ResponseEntity.badRequest().body("username requerido");
        }
        UserEntity up = userService.updateProfile(u);
        return (up == null) ? ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado")
                : ResponseEntity.ok(up);
    }

    /** Cambiar rol (solo ADMIN vía X-User) */
    @PutMapping("/{username}/role")
    public ResponseEntity<?> changeRole(@RequestHeader(value = "X-User", required = false) String requester,
                                        @PathVariable String username,
                                        @RequestParam UserEntity.Role role) {
        if (!isAdmin(requester)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo un ADMIN puede cambiar roles");
        }
        UserEntity up = userService.changeRole(username, role);
        return (up == null) ? ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado")
                : ResponseEntity.ok(up);
    }

    /** Habilitar/Deshabilitar (solo ADMIN) */
    @PutMapping("/{username}/enabled")
    public ResponseEntity<?> enabled(@RequestHeader(value = "X-User", required = false) String requester,
                                     @PathVariable String username,
                                     @RequestParam boolean enabled) {
        if (!isAdmin(requester)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo un ADMIN puede habilitar/deshabilitar");
        }
        UserEntity up = userService.setEnabled(username, enabled);
        return (up == null) ? ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado")
                : ResponseEntity.ok(up);
    }

    /** Eliminar (solo ADMIN) */
    @DeleteMapping("/{username}")
    public ResponseEntity<?> delete(@RequestHeader(value = "X-User", required = false) String requester,
                                    @PathVariable String username) {
        if (!isAdmin(requester)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo un ADMIN puede eliminar usuarios");
        }
        boolean ok = userService.delete(username);
        return ok ? ResponseEntity.ok("Usuario eliminado")
                : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
    }
}
