package cl.toolrent.toolrent.controllers;

import cl.toolrent.toolrent.entities.MovementEntity;
import cl.toolrent.toolrent.services.MovementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movements")
@CrossOrigin("*")
public class MovementController {

    @Autowired
    private MovementService movementService;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody MovementEntity m) {
        if (m == null) return ResponseEntity.badRequest().body("Body vacío");
        MovementEntity saved = movementService.create(m);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping
    public List<MovementEntity> findAll() { return movementService.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        MovementEntity m = movementService.findById(id);
        if (m == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Movimiento no encontrado");
        return ResponseEntity.ok(m);
    }

    @GetMapping("/tool/{toolId}")
    public List<MovementEntity> findByTool(@PathVariable Long toolId) {
        return movementService.findByToolId(toolId);
    }

    @GetMapping("/client/{clientId}")
    public List<MovementEntity> findByClient(@PathVariable String clientId) {
        return movementService.findByClientId(clientId);
    }

    @GetMapping("/user/{userId}")
    public List<MovementEntity> findByUser(@PathVariable String userId) {
        return movementService.findByUserId(userId);
    }

    @GetMapping("/type/{typeMovement}")
    public List<MovementEntity> findByType(@PathVariable String typeMovement) {
        return movementService.findByTypeMovement(typeMovement);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        boolean ok = movementService.deleteById(id);
        if (!ok) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Movimiento no encontrado");
        return ResponseEntity.ok("Movimiento eliminado");
    }

    @DeleteMapping
    public ResponseEntity<?> deleteAll() {
        movementService.deleteAll();
        return ResponseEntity.ok("Todos los movimientos eliminados");
    }
}
