package cl.toolrent.toolrent.controllers;

import cl.toolrent.toolrent.entities.ToolEntity;
import cl.toolrent.toolrent.services.ToolService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tools")
@CrossOrigin("*")
public class ToolController {

    private final ToolService toolService;
    public ToolController(ToolService toolService) { this.toolService = toolService; }

    @PostMapping
    public ToolEntity createTool(@RequestBody ToolEntity tool) {
        return toolService.createTool(tool);
    }

    @GetMapping
    public List<ToolEntity> getAllTools() {
        return toolService.getAllTools();
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ToolEntity>> getToolsByCategory(@PathVariable String category) {
        List<ToolEntity> tools = toolService.findByCategory(category);
        if (tools.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(tools);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ToolEntity>> getToolsByStatus(@PathVariable String status) {
        List<ToolEntity> tools = toolService.findByStatus(status);
        if (tools.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(tools);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTool(@PathVariable Long id, @RequestBody ToolEntity tool) {
        ToolEntity existingTool = toolService.findById(id);
        if (existingTool == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Herramienta con ID " + id + " no encontrada");
        }
        
        // Establecer el ID de la herramienta a actualizar
        tool.setToolId(id);
        ToolEntity updatedTool = toolService.update(tool);
        
        if (updatedTool == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al actualizar la herramienta");
        }
        
        return ResponseEntity.ok(updatedTool);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTool(@PathVariable Long id) {
        return toolService.deleteById(id) ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/exists")
    public ResponseEntity<?> getToolIfExists(@PathVariable("id") Long id) {
        ToolEntity tool = toolService.findById(id);

        if (tool != null) {
            return ResponseEntity.ok(tool);} else
            {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("La herramienta con ID " + id + " no existe.");
        }
    }
}


