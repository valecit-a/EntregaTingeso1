package cl.toolrent.toolrent.services;

import cl.toolrent.toolrent.entities.RateEntity;
import cl.toolrent.toolrent.repositories.RateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RateService {

    @Autowired
    private RateRepository rateRepository;

    public List<RateEntity> findAll() {
        return rateRepository.findAll();
    }

    public RateEntity findById(Long id) {
        Optional<RateEntity> rate = rateRepository.findById(id);
        return rate.orElse(null);
    }

    public RateEntity create(RateEntity rate) {
        return rateRepository.save(rate);
    }

    public RateEntity update(Long id, RateEntity rate) {
        if (rateRepository.existsById(id)) {
            rate.setId(id);
            return rateRepository.save(rate);
        }
        return null;
    }

    public boolean delete(Long id) {
        if (rateRepository.existsById(id)) {
            rateRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
