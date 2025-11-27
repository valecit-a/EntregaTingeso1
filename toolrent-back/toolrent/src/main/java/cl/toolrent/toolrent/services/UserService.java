package cl.toolrent.toolrent.services;

import cl.toolrent.toolrent.entities.UserEntity;
import cl.toolrent.toolrent.repositories.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    // inyección por constructor
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public List<UserEntity> findAll() {
        return userRepository.findAll();
    }

    public UserEntity findByUsername(String username) {
        if (username == null) return null;
        return userRepository.findById(username).orElse(null);
    }

    public boolean delete(String username) {
        if (username == null || !userRepository.existsById(username)) return false;
        userRepository.deleteById(username);
        return true;
    }

    /** Crear usuario. Si role es null, por defecto USER o ADMIN si es el primero. */
    public UserEntity create(UserEntity u) {
        if (u == null || u.getUsername() == null || u.getPassword() == null) return null;
        if (userRepository.existsById(u.getUsername())) return null;

        // Hashear contraseña
        u.setPassword(passwordEncoder.encode(u.getPassword()));

        // Si es el primer usuario del sistema, puede ser ADMIN
        List<UserEntity> allUsers = userRepository.findAll();
        if (allUsers.isEmpty()) {
            if (u.getRole() == null) u.setRole(UserEntity.Role.ADMIN);
        } else {
            // No es el primer usuario, rol por defecto USER
            if (u.getRole() == null) u.setRole(UserEntity.Role.USER);
        }
        
        if (u.getFullName() == null) u.setFullName("");
        if (u.getEmail() == null) u.setEmail("");
        u.setEnabled(true);

        return userRepository.save(u);
    }

    /** Actualiza perfil básico: password, fullName, email (no role ni enabled aquí). */
    public UserEntity updateProfile(UserEntity changes) {
        if (changes == null || changes.getUsername() == null) return null;
        UserEntity db = userRepository.findById(changes.getUsername()).orElse(null);
        if (db == null) return null;

        // Si se proporciona nueva contraseña, hashearla
        if (changes.getPassword() != null && !changes.getPassword().isEmpty()) {
            db.setPassword(passwordEncoder.encode(changes.getPassword()));
        }
        if (changes.getFullName() != null) db.setFullName(changes.getFullName());
        if (changes.getEmail() != null) db.setEmail(changes.getEmail());

        return userRepository.save(db);
    }

    public UserEntity changeRole(String username, UserEntity.Role role) {
        if (username == null || role == null) return null;
        UserEntity db = userRepository.findById(username).orElse(null);
        if (db == null) return null;
        db.setRole(role);
        return userRepository.save(db);
    }

    public UserEntity setEnabled(String username, boolean enabled) {
        if (username == null) return null;
        UserEntity db = userRepository.findById(username).orElse(null);
        if (db == null) return null;
        db.setEnabled(enabled);
        return userRepository.save(db);
    }

    /** Método para autenticación - verifica usuario y contraseña */
    public UserEntity authenticate(String username, String password) {
        if (username == null || password == null) return null;
        
        UserEntity user = userRepository.findById(username).orElse(null);
        if (user != null && user.isEnabled()) {
            // Verificar contraseña hasheada
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user;
            }
        }
        return null;
    }

    /** Método para verificar si una contraseña es válida */
    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}
