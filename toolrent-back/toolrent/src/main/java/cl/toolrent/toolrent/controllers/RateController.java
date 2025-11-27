package cl.toolrent.toolrent.controllers;

import cl.toolrent.toolrent.entities.RateEntity;
import cl.toolrent.toolrent.services.RateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rates")
public class RateController {

    @Autowired
    private RateService rateService;

    @GetMapping
    public ResponseEntity<List<RateEntity>> getAllRates() {
        List<RateEntity> rates = rateService.findAll();
        return new ResponseEntity<>(rates, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RateEntity> getRateById(@PathVariable Long id) {
        RateEntity rate = rateService.findById(id);
        if (rate != null) {
            return new ResponseEntity<>(rate, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<RateEntity> createRate(@RequestBody RateEntity rate) {
        RateEntity createdRate = rateService.create(rate);
        return new ResponseEntity<>(createdRate, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RateEntity> updateRate(@PathVariable Long id, @RequestBody RateEntity rate) {
        RateEntity updatedRate = rateService.update(id, rate);
        if (updatedRate != null) {
            return new ResponseEntity<>(updatedRate, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRate(@PathVariable Long id) {
        boolean deleted = rateService.delete(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}