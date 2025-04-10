
package com.insurance.quotemanager.controller;

import com.insurance.quotemanager.dto.QuoteDto;
import com.insurance.quotemanager.service.QuoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/quotes")
@CrossOrigin(origins = "*")
public class QuoteController {
    
    @Autowired
    private QuoteService quoteService;
    
    @GetMapping
    public ResponseEntity<List<QuoteDto>> getAllQuotes(
            @RequestParam(required = false) UUID brokerId,
            @RequestParam(required = false) String status) {
        
        List<QuoteDto> quotes;
        
        if (brokerId != null && status != null) {
            quotes = quoteService.getQuotesByBrokerAndStatus(brokerId, status);
        } else if (brokerId != null) {
            quotes = quoteService.getQuotesByBroker(brokerId);
        } else if (status != null) {
            quotes = quoteService.getQuotesByStatus(status);
        } else {
            quotes = quoteService.getAllQuotes();
        }
        
        return ResponseEntity.ok(quotes);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<QuoteDto> getQuoteById(@PathVariable UUID id) {
        QuoteDto quote = quoteService.getQuoteById(id);
        return ResponseEntity.ok(quote);
    }
    
    @PostMapping
    public ResponseEntity<QuoteDto> createQuote(@RequestBody QuoteDto quoteDto) {
        QuoteDto createdQuote = quoteService.createQuote(quoteDto);
        return new ResponseEntity<>(createdQuote, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<QuoteDto> updateQuote(@PathVariable UUID id, @RequestBody QuoteDto quoteDto) {
        QuoteDto updatedQuote = quoteService.updateQuote(id, quoteDto);
        return ResponseEntity.ok(updatedQuote);
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<QuoteDto> updateQuoteStatus(
            @PathVariable UUID id,
            @RequestParam String status) {
        QuoteDto updatedQuote = quoteService.updateQuoteStatus(id, status);
        return ResponseEntity.ok(updatedQuote);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuote(@PathVariable UUID id) {
        quoteService.deleteQuote(id);
        return ResponseEntity.noContent().build();
    }
}
