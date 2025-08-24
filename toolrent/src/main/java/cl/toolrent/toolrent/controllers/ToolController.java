package cl.toolrent.toolrent.controllers;

import cl.toolrent.toolrent.entities.ToolEntity;
import cl.toolrent.toolrent.services.ToolService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tools")
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


