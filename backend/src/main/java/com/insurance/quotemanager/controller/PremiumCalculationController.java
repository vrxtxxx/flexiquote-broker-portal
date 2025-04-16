
package com.insurance.quotemanager.controller;

import com.insurance.quotemanager.dto.QuoteDto;
import com.insurance.quotemanager.dto.PremiumCalculationResultDto;
import com.insurance.quotemanager.service.PremiumCalculationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/premium-calculations")
@CrossOrigin(origins = "*")
public class PremiumCalculationController {
    
    @Autowired
    private PremiumCalculationService premiumCalculationService;
    
    @PostMapping("/estimate")
    public ResponseEntity<PremiumCalculationResultDto> calculatePremium(@RequestBody QuoteDto quoteDto) {
        PremiumCalculationResultDto result = premiumCalculationService.calculatePremium(quoteDto);
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/estimate-range")
    public ResponseEntity<PremiumCalculationResultDto> calculatePremiumRange(@RequestBody QuoteDto quoteDto) {
        PremiumCalculationResultDto result = premiumCalculationService.calculatePremiumRange(quoteDto);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/factors")
    public ResponseEntity<Object> getCalculationFactors() {
        return ResponseEntity.ok(premiumCalculationService.getCalculationFactors());
    }
}
