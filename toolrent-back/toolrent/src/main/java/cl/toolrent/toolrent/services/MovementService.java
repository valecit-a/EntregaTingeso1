package cl.toolrent.toolrent.services;

import cl.toolrent.toolrent.entities.MovementEntity;
import cl.toolrent.toolrent.repositories.MovementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MovementService {

    @Autowired
    private MovementRepository movementRepository;

    public MovementEntity create(MovementEntity m) {
        if (m == null) return null;

        if (m.getDateMovement() == null || m.getDateMovement().isBlank()) {
            m.setDateMovement(LocalDateTime.now().toString());
        }
        if (m.getQuantity() <= 0) m.setQuantity(1);
        if (m.getTypeMovement() == null || m.getTypeMovement().isBlank()) m.setTypeMovement("Movimiento");

        // Normaliza IDs si usas RUT/login
        if (m.getClientId() != null) m.setClientId(m.getClientId().trim().replace(".", "").toUpperCase());
        if (m.getUserId() != null)   m.setUserId(m.getUserId().trim().replace(".", "").toUpperCase());

        return movementRepository.save(m);
    }

    public List<MovementEntity> findAll() { return movementRepository.findAll(); }

    public MovementEntity findById(Long id) {
        if (id == null) return null;
        return movementRepository.findById(id).orElse(null);
    }

    public boolean deleteById(Long id) {
        if (id == null || !movementRepository.existsById(id)) return false;
        movementRepository.deleteById(id);
        return true;
    }

    public void deleteAll() { movementRepository.deleteAll(); }

    public List<MovementEntity> findByToolId(Long toolId) { return movementRepository.findByToolId(toolId); }

    public List<MovementEntity> findByClientId(String clientId) {
        if (clientId == null) return List.of();
        return movementRepository.findByClientId(clientId.trim().replace(".", "").toUpperCase());
    }

    public List<MovementEntity> findByUserId(String userId) {
        if (userId == null) return List.of();
        return movementRepository.findByUserId(userId.trim().replace(".", "").toUpperCase());
    }

    public List<MovementEntity> findByTypeMovement(String type) {
        if (type == null) return List.of();
        return movementRepository.findByTypeMovement(type.trim());
    }
}
