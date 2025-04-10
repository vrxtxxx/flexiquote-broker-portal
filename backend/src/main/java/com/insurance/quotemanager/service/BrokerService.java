
package com.insurance.quotemanager.service;

import com.insurance.quotemanager.dto.BrokerDto;
import com.insurance.quotemanager.model.Broker;
import com.insurance.quotemanager.repository.BrokerRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BrokerService {
    
    @Autowired
    private BrokerRepository brokerRepository;
    
    public List<BrokerDto> getAllBrokers() {
        return brokerRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public BrokerDto getBrokerById(UUID id) {
        return brokerRepository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new RuntimeException("Broker not found with id: " + id));
    }
    
    public BrokerDto getBrokerByEmail(String email) {
        return brokerRepository.findByEmail(email)
                .map(this::convertToDto)
                .orElseThrow(() -> new RuntimeException("Broker not found with email: " + email));
    }
    
    public BrokerDto createBroker(BrokerDto brokerDto) {
        Broker broker = convertToEntity(brokerDto);
        Broker savedBroker = brokerRepository.save(broker);
        return convertToDto(savedBroker);
    }
    
    public BrokerDto updateBroker(UUID id, BrokerDto brokerDto) {
        if (!brokerRepository.existsById(id)) {
            throw new RuntimeException("Broker not found with id: " + id);
        }
        
        Broker broker = convertToEntity(brokerDto);
        broker.setId(id);
        Broker savedBroker = brokerRepository.save(broker);
        return convertToDto(savedBroker);
    }
    
    public void deleteBroker(UUID id) {
        brokerRepository.deleteById(id);
    }
    
    private BrokerDto convertToDto(Broker broker) {
        BrokerDto brokerDto = new BrokerDto();
        BeanUtils.copyProperties(broker, brokerDto);
        return brokerDto;
    }
    
    private Broker convertToEntity(BrokerDto brokerDto) {
        Broker broker = new Broker();
        BeanUtils.copyProperties(brokerDto, broker);
        return broker;
    }
}
