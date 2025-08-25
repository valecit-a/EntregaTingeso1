package cl.toolrent.toolrent.services;

import cl.toolrent.toolrent.entities.ClientEntity;
import cl.toolrent.toolrent.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;


    public ClientEntity create(ClientEntity c) {
        if (c == null) return null;
        if (c.getStatus() == null || c.getStatus().trim().isEmpty()) {
            c.setStatus("Activo");
        }
        return clientRepository.save(c);
    }


    public List<ClientEntity> findAll() {
        return clientRepository.findAll();
    }


    public ClientEntity findById(Long id) {
        return clientRepository.findById(id).orElse(null);
    }


    public ClientEntity findByEmail(String email) {
        if (email == null) return null;
        return clientRepository.findByEmail(email);
    }


    public boolean deleteById(Long id) {
        if (id == null || !clientRepository.existsById(id)) return false;
        clientRepository.deleteById(id);
        return true;
    }

    
    public boolean existsById(Long id) {
        return id != null && clientRepository.existsById(id);
    }
}

