package cl.toolrent.toolrent.repositories;

import cl.toolrent.toolrent.entities.ClientEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<ClientEntity, String> {
    ClientEntity findByEmail(String email);
    boolean existsByEmail(String email);
    ClientEntity findByRut(String rut);      // opcional, JpaRepository ya trae findById(rut)
    boolean existsByRut(String rut);         // opcional, JpaRepository ya trae existsById(rut)
}

