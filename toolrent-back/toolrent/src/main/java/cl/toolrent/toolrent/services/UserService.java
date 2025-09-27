package cl.toolrent.toolrent.services;

import cl.toolrent.toolrent.entities.UserEntity;
import cl.toolrent.toolrent.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    // inyección por constructor (simple)
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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

    /** Crear usuario. Si role es null, por defecto EMPLOYEE. */
    public UserEntity create(UserEntity u) {
        if (u == null || u.getUsername() == null || u.getPassword() == null) return null;
        if (userRepository.existsById(u.getUsername())) return null;

        if (u.getRole() == null) u.setRole(UserEntity.Role.EMPLOYEE);
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

        if (changes.getPassword() != null) db.setPassword(changes.getPassword());
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
}
