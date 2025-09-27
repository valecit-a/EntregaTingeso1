package cl.toolrent.toolrent.repositories;

import cl.toolrent.toolrent.entities.ToolEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ToolRepository extends JpaRepository<ToolEntity, Long> {
    List<ToolEntity> findByCategory(String category);
    List<ToolEntity> findByStatus(String status);
    List<ToolEntity> findByNameContainingIgnoreCase(String name);
    List<ToolEntity> findByReplacementValueGreaterThan(int replacementValue);
}

