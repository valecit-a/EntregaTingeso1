package cl.toolrent.toolrent.services;

import cl.toolrent.toolrent.entities.ToolEntity;
import cl.toolrent.toolrent.repositories.ToolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ToolService {

    @Autowired
    private ToolRepository toolRepository;

    public List<ToolEntity> findAll() {
        return toolRepository.findAll();
    }

    public ToolEntity findById(Long toolId) {
        return toolRepository.findById(toolId).orElse(null);
    }

    public ToolEntity save(ToolEntity tool) {
        return toolRepository.save(tool);
    }

    public ToolEntity update(ToolEntity tool) {
        if (tool == null || tool.getToolId() == null) {
            return null;
        }
        return toolRepository.save(tool);
    }

    public boolean deleteById(Long id) {
        if (id == null || id <= 0) return false;
        if (!toolRepository.existsById(id)) return false;
        toolRepository.deleteById(id);
        return true;
    }

    public boolean existsById(Long toolId) {
        return toolRepository.existsById(toolId);
    }

    public ToolEntity createTool(ToolEntity tool) {
        return toolRepository.save(tool);
    }

    public List<ToolEntity> getAllTools() {
        return toolRepository.findAll();
    }

    public List<ToolEntity> findByCategory(String category) {
        if (category == null || category.trim().isEmpty()) {
            return List.of();
        }
        return toolRepository.findByCategory(category.trim());
    }

    public List<ToolEntity> findByStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            return List.of();
        }
        return toolRepository.findByStatus(status.trim());
    }
}
