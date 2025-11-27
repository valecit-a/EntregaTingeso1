package cl.toolrent.toolrent.controllers;

import cl.toolrent.toolrent.entities.UserEntity;
import cl.toolrent.toolrent.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    UserService userService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        try {
            String username = credentials.get("username");
            String password = credentials.get("password");

            if (username == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username y password son requeridos"));
            }

            UserEntity user = userService.authenticate(username, password);
            
            if (user != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Login exitoso");
                response.put("user", Map.of(
                    "id", user.getUserId(),
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "fullName", user.getFullName(),
                    "role", user.getRole(),
                    "enabled", user.isEnabled()
                ));
                response.put("token", generateSimpleToken(user.getUsername()));
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "error", "Credenciales inválidas"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Error interno del servidor: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> userData) {
        try {
            String username = userData.get("username");
            String password = userData.get("password");
            String email = userData.get("email");
            String fullName = userData.get("fullName");
            String rut = userData.get("rut");
            String phone = userData.get("phone");
            String roleStr = userData.get("role");

            if (username == null || password == null || email == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Username, password y email son requeridos"
                ));
            }

            // Verificar si el usuario ya existe
            UserEntity existingUser = userService.findByUsername(username);
            if (existingUser != null) {
                return ResponseEntity.status(409).body(Map.of(
                    "success", false,
                    "error", "El usuario ya existe"
                ));
            }

            // Crear nuevo usuario
            UserEntity newUser = new UserEntity();
            newUser.setUsername(username);
            newUser.setPassword(password); // Se hasheará en el service
            newUser.setEmail(email);
            newUser.setFullName(fullName != null ? fullName : username);
            newUser.setRut(rut);
            newUser.setPhone(phone);
            
            // Determinar el rol - por defecto USER, pero permitir otros roles
            UserEntity.Role role = UserEntity.Role.USER;
            if (roleStr != null) {
                try {
                    role = UserEntity.Role.valueOf(roleStr.toUpperCase());
                } catch (IllegalArgumentException e) {
                    // Si el rol no es válido, usar USER por defecto
                    role = UserEntity.Role.USER;
                }
            }
            newUser.setRole(role);
            newUser.setEnabled(true);

            UserEntity createdUser = userService.create(newUser);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Usuario registrado exitosamente");
            response.put("user", Map.of(
                "id", createdUser.getUserId(),
                "username", createdUser.getUsername(),
                "email", createdUser.getEmail(),
                "fullName", createdUser.getFullName(),
                "rut", createdUser.getRut(),
                "phone", createdUser.getPhone(),
                "role", createdUser.getRole(),
                "enabled", createdUser.isEnabled()
            ));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Error al registrar usuario: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        // En un sistema real, aquí invalidarías el token
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Logout exitoso"
        ));
    }

    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestHeader("Authorization") String token) {
        try {
            // Validación simple del token
            if (token != null && token.startsWith("Bearer ")) {
                String tokenValue = token.substring(7);
                String username = validateSimpleToken(tokenValue);
                
                if (username != null) {
                    UserEntity user = userService.findByUsername(username);
                    if (user != null && user.isEnabled()) {
                        return ResponseEntity.ok(Map.of(
                            "success", true,
                            "user", Map.of(
                                "id", user.getUserId(),
                                "username", user.getUsername(),
                                "email", user.getEmail(),
                                "fullName", user.getFullName(),
                                "role", user.getRole(),
                                "enabled", user.isEnabled()
                            )
                        ));
                    }
                }
            }
            
            return ResponseEntity.status(401).body(Map.of(
                "success", false,
                "error", "Token inválido"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Error al validar token: " + e.getMessage()
            ));
        }
    }

    // Token simple para desarrollo (en producción usar JWT)
    private String generateSimpleToken(String username) {
        return username + "_" + System.currentTimeMillis();
    }

    private String validateSimpleToken(String token) {
        try {
            String[] parts = token.split("_");
            if (parts.length == 2) {
                return parts[0]; // Retorna el username
            }
        } catch (Exception e) {
            // Token inválido
        }
        return null;
    }
}