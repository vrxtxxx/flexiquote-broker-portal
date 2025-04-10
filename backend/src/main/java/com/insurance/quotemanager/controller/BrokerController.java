
package com.insurance.quotemanager.controller;

import com.insurance.quotemanager.dto.BrokerDto;
import com.insurance.quotemanager.service.BrokerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/brokers")
@CrossOrigin(origins = "*")
public class BrokerController {
    
    @Autowired
    private BrokerService brokerService;
    
    @GetMapping
    public ResponseEntity<List<BrokerDto>> getAllBrokers() {
        List<BrokerDto> brokers = brokerService.getAllBrokers();
        return ResponseEntity.ok(brokers);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BrokerDto> getBrokerById(@PathVariable UUID id) {
        BrokerDto broker = brokerService.getBrokerById(id);
        return ResponseEntity.ok(broker);
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<BrokerDto> getBrokerByEmail(@PathVariable String email) {
        BrokerDto broker = brokerService.getBrokerByEmail(email);
        return ResponseEntity.ok(broker);
    }
    
    @PostMapping
    public ResponseEntity<BrokerDto> createBroker(@RequestBody BrokerDto brokerDto) {
        BrokerDto createdBroker = brokerService.createBroker(brokerDto);
        return new ResponseEntity<>(createdBroker, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<BrokerDto> updateBroker(@PathVariable UUID id, @RequestBody BrokerDto brokerDto) {
        BrokerDto updatedBroker = brokerService.updateBroker(id, brokerDto);
        return ResponseEntity.ok(updatedBroker);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBroker(@PathVariable UUID id) {
        brokerService.deleteBroker(id);
        return ResponseEntity.noContent().build();
    }
}
