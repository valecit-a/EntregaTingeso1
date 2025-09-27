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

    private int norm(Integer debt) {
        return (debt == null || debt < 0) ? 0 : debt;
    }

    public List<ClientEntity> findAll() {
        return clientRepository.findAll();
    }

    public ClientEntity findById(String rut) {
        if (rut == null) return null;
        return clientRepository.findById(rut).orElse(null);
    }

    public ClientEntity findByEmail(String email) {
        if (email == null) return null;
        return clientRepository.findByEmail(email.trim().toLowerCase());
    }

    public boolean existsById(String rut) {
        return rut != null && clientRepository.existsById(rut);
    }

    public boolean deleteById(String rut) {
        if (rut == null || !clientRepository.existsById(rut)) return false;
        clientRepository.deleteById(rut);
        return true;
    }

    public ClientEntity create(ClientEntity c) {
        if (c == null) return null;
        if (c.getStatus() == null || c.getStatus().trim().isEmpty()) c.setStatus("Activo");
        c.setDebt(norm(c.getDebt()));
        return clientRepository.save(c);
    }

    public ClientEntity update(ClientEntity c) {
        if (c == null || c.getRut() == null) return null;
        c.setDebt(norm(c.getDebt()));
        return clientRepository.save(c);
    }

    public Integer getDebt(String rut) {
        ClientEntity c = findById(rut);
        if (c == null) return null;
        return norm(c.getDebt());
    }

    public ClientEntity increaseDebt(String rut, int amount) {
        if (rut == null || amount <= 0) return null;
        ClientEntity c = findById(rut);
        if (c == null) return null;
        c.setDebt(norm(c.getDebt()) + amount);
        return clientRepository.save(c);
    }

    public ClientEntity payDebt(String rut, int amount) {
        if (rut == null || amount <= 0) return null;
        ClientEntity c = findById(rut);
        if (c == null) return null;
        int newDebt = norm(c.getDebt()) - amount;
        if (newDebt < 0) newDebt = 0;
        c.setDebt(newDebt);
        return clientRepository.save(c);
    }

    public ClientEntity setDebt(String rut, int amount) {
        if (rut == null || amount < 0) return null;
        ClientEntity c = findById(rut);
        if (c == null) return null;
        c.setDebt(amount);
        return clientRepository.save(c);
    }
}

