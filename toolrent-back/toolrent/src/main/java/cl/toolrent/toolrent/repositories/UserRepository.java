package cl.toolrent.toolrent.repositories;

import cl.toolrent.toolrent.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, String> {
    boolean existsByUsername(String username);
}
