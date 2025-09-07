package cl.toolrent.toolrent.controllers;

import cl.toolrent.toolrent.entities.ClientEntity;
import cl.toolrent.toolrent.services.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clients")
@CrossOrigin("*")
public class ClientController {

    @Autowired
    private ClientService clientService;

    // Crear cliente (RUT viene en el body)
    @PostMapping
    public ResponseEntity<?> create(@RequestBody ClientEntity client) {
        ClientEntity saved = clientService.create(client);
        if (saved == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("RUT inválido o ya existente");
        }
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // Listar todos los clientes
    @GetMapping
    public List<ClientEntity> findAll() {
        return clientService.findAll();
    }

    // Buscar cliente por RUT
    @GetMapping("/{rut}")
    public ResponseEntity<?> findByRut(@PathVariable String rut) {
        ClientEntity c = clientService.findById(rut);
        if (c == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cliente no encontrado");
        }
        return ResponseEntity.ok(c);
    }

    // Buscar cliente por email
    @GetMapping("/email/{email}")
    public ResponseEntity<?> findByEmail(@PathVariable String email) {
        ClientEntity c = clientService.findByEmail(email);
        if (c == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Cliente no encontrado con email: " + email);
        }
        return ResponseEntity.ok(c);
    }

    // Eliminar cliente por RUT
    @DeleteMapping("/{rut}")
    public ResponseEntity<String> delete(@PathVariable String rut) {
        boolean deleted = clientService.deleteById(rut);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cliente no encontrado");
        }
        return ResponseEntity.ok("Cliente eliminado con éxito");
    }
}
