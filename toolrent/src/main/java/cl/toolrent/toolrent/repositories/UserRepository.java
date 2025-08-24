package cl.toolrent.toolrent.repositories;

import cl.toolrent.toolrent.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    UserEntity findByUsername(String username);
    boolean existsByUsername(String username);
    // Si luego quieres roles:
    // List<UserEntity> findByRole(String role);
}

