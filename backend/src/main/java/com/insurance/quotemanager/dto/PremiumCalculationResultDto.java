
package com.insurance.quotemanager.dto;

import lombok.Data;
import java.util.Map;

@Data
public class PremiumCalculationResultDto {
    private double premium;
    private double baseRate;
    private Map<String, Double> adjustments;
    
    // For premium range
    private Double minimumPremium;
    private Double maximumPremium;
    private Double recommendedPremium;
}
