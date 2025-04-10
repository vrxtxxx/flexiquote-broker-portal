
package com.insurance.quotemanager.service;

import com.insurance.quotemanager.dto.QuoteDto;
import com.insurance.quotemanager.model.Broker;
import com.insurance.quotemanager.model.Quote;
import com.insurance.quotemanager.repository.BrokerRepository;
import com.insurance.quotemanager.repository.QuoteRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class QuoteService {
    
    @Autowired
    private QuoteRepository quoteRepository;
    
    @Autowired
    private BrokerRepository brokerRepository;
    
    public List<QuoteDto> getAllQuotes() {
        return quoteRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<QuoteDto> getQuotesByBroker(UUID brokerId) {
        return quoteRepository.findByBrokerId(brokerId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<QuoteDto> getQuotesByStatus(String status) {
        return quoteRepository.findByStatus(status).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<QuoteDto> getQuotesByBrokerAndStatus(UUID brokerId, String status) {
        return quoteRepository.findByBrokerIdAndStatus(brokerId, status).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public QuoteDto getQuoteById(UUID id) {
        return quoteRepository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new RuntimeException("Quote not found with id: " + id));
    }
    
    public QuoteDto createQuote(QuoteDto quoteDto) {
        Quote quote = convertToEntity(quoteDto);
        Broker broker = brokerRepository.findById(quoteDto.getBrokerId())
                .orElseThrow(() -> new RuntimeException("Broker not found with id: " + quoteDto.getBrokerId()));
        quote.setBroker(broker);
        Quote savedQuote = quoteRepository.save(quote);
        return convertToDto(savedQuote);
    }
    
    public QuoteDto updateQuote(UUID id, QuoteDto quoteDto) {
        Quote existingQuote = quoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quote not found with id: " + id));
        
        // Update fields but preserve id and created date
        Quote updatedQuote = convertToEntity(quoteDto);
        updatedQuote.setId(existingQuote.getId());
        updatedQuote.setCreatedAt(existingQuote.getCreatedAt());
        
        Broker broker = brokerRepository.findById(quoteDto.getBrokerId())
                .orElseThrow(() -> new RuntimeException("Broker not found with id: " + quoteDto.getBrokerId()));
        updatedQuote.setBroker(broker);
        
        Quote savedQuote = quoteRepository.save(updatedQuote);
        return convertToDto(savedQuote);
    }
    
    public QuoteDto updateQuoteStatus(UUID id, String status) {
        Quote quote = quoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quote not found with id: " + id));
        quote.setStatus(status);
        Quote savedQuote = quoteRepository.save(quote);
        return convertToDto(savedQuote);
    }
    
    public void deleteQuote(UUID id) {
        quoteRepository.deleteById(id);
    }
    
    private QuoteDto convertToDto(Quote quote) {
        QuoteDto quoteDto = new QuoteDto();
        BeanUtils.copyProperties(quote, quoteDto);
        quoteDto.setBrokerId(quote.getBroker().getId());
        return quoteDto;
    }
    
    private Quote convertToEntity(QuoteDto quoteDto) {
        Quote quote = new Quote();
        BeanUtils.copyProperties(quoteDto, quote);
        return quote;
    }
}
