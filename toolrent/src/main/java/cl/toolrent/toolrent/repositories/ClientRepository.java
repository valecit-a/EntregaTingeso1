package cl.toolrent.toolrent.repositories;

import cl.toolrent.toolrent.entities.ClientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<ClientEntity, Long> {

    // OJO: usar las PROPIEDADES de ClientEntity:
    // private String name;
    // private String email;
    // private String phone;
    // private String status;

    List<ClientEntity> findByNameContainingIgnoreCase(String name);

    ClientEntity findByEmail(String email);

    List<ClientEntity> findByStatus(String status);
}
