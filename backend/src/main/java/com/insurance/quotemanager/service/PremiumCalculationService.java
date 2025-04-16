
package com.insurance.quotemanager.service;

import com.insurance.quotemanager.dto.QuoteDto;
import com.insurance.quotemanager.dto.PremiumCalculationResultDto;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
public class PremiumCalculationService {

    // Base premium rates for different property types
    private static final Map<String, Double> BASE_RATES = Map.of(
        "Single Family Home", 500.0,
        "Apartment", 350.0,
        "Condominium", 400.0,
        "Townhouse", 450.0,
        "Mobile Home", 600.0
    );
    
    // Seasonal adjustments by month (0-based index)
    private static final Map<Integer, Double> SEASONAL_ADJUSTMENTS = Map.of(
        0, 1.05, // January - Winter risks
        1, 1.03, // February
        2, 1.00, // March
        3, 0.98, // April
        4, 0.97, // May
        5, 0.95, // June - Summer discount
        6, 0.96, // July
        7, 0.98, // August
        8, 0.99, // September
        9, 1.00, // October
        10, 1.02, // November
        11, 1.04  // December - Winter risks
    );
    
    // Regional risk factors by state
    private static final Map<String, Map<String, Double>> REGIONAL_FACTORS = new HashMap<>();
    
    static {
        // Initialize regional factors
        Map<String, Double> caFactors = new HashMap<>();
        caFactors.put("Single Family Home", 1.08);
        caFactors.put("Apartment", 1.05);
        caFactors.put("Condominium", 1.06);
        caFactors.put("Townhouse", 1.07);
        caFactors.put("Mobile Home", 1.12);
        REGIONAL_FACTORS.put("CA", caFactors);
        
        Map<String, Double> flFactors = new HashMap<>();
        flFactors.put("Single Family Home", 1.15);
        flFactors.put("Apartment", 1.10);
        flFactors.put("Condominium", 1.12);
        flFactors.put("Townhouse", 1.13);
        flFactors.put("Mobile Home", 1.25);
        REGIONAL_FACTORS.put("FL", flFactors);
        
        // Default factors
        Map<String, Double> defaultFactors = new HashMap<>();
        defaultFactors.put("Single Family Home", 1.0);
        defaultFactors.put("Apartment", 0.98);
        defaultFactors.put("Condominium", 0.99);
        defaultFactors.put("Townhouse", 1.01);
        defaultFactors.put("Mobile Home", 1.05);
        REGIONAL_FACTORS.put("default", defaultFactors);
    }
    
    public PremiumCalculationResultDto calculatePremium(QuoteDto quoteDto) {
        double basePremium = calculateBasePremium(quoteDto);
        
        // Get current date for seasonal adjustment
        int currentMonth = LocalDate.now().getMonthValue() - 1; // 0-based index
        double seasonalFactor = SEASONAL_ADJUSTMENTS.getOrDefault(currentMonth, 1.0);
        
        // Get advanced age impact
        double ageImpact = getAdvancedAgeImpact(quoteDto.getPropertyDetails().getYearBuilt());
        
        // Get regional trend factor
        double regionalFactor = getRegionalFactor(
            quoteDto.getPropertyDetails().getAddress().getState(),
            quoteDto.getPropertyDetails().getPropertyType()
        );
        
        // Calculate optimized premium
        double optimizedPremium = basePremium * seasonalFactor * ageImpact * regionalFactor;
        
        // Round to 2 decimal places
        double finalPremium = Math.round(optimizedPremium * 100.0) / 100.0;
        
        // Create result DTO
        PremiumCalculationResultDto result = new PremiumCalculationResultDto();
        result.setPremium(finalPremium);
        result.setBaseRate(basePremium);
        
        Map<String, Double> adjustments = new HashMap<>();
        adjustments.put("seasonal", seasonalFactor);
        adjustments.put("propertyAge", ageImpact);
        adjustments.put("regionalRisk", regionalFactor);
        result.setAdjustments(adjustments);
        
        return result;
    }
    
    public PremiumCalculationResultDto calculatePremiumRange(QuoteDto quoteDto) {
        PremiumCalculationResultDto baseResult = calculatePremium(quoteDto);
        double premium = baseResult.getPremium();
        
        // Calculate minimum and maximum premium range (±15%)
        double minimumPremium = Math.round((premium * 0.85) * 100.0) / 100.0;
        double maximumPremium = Math.round((premium * 1.15) * 100.0) / 100.0;
        
        baseResult.setMinimumPremium(minimumPremium);
        baseResult.setMaximumPremium(maximumPremium);
        baseResult.setRecommendedPremium(premium);
        
        return baseResult;
    }
    
    public Map<String, Object> getCalculationFactors() {
        Map<String, Object> factors = new HashMap<>();
        factors.put("baseRates", BASE_RATES);
        factors.put("seasonalAdjustments", SEASONAL_ADJUSTMENTS);
        factors.put("regionalFactors", REGIONAL_FACTORS);
        return factors;
    }
    
    private double calculateBasePremium(QuoteDto quoteDto) {
        // Simplified base calculation - in a real implementation, this would be more complex
        String propertyType = quoteDto.getPropertyDetails().getPropertyType();
        double basePremium = BASE_RATES.getOrDefault(propertyType, 500.0);
        
        // Adjust for coverage amount
        double coverageAmount = quoteDto.getPolicyDetails().getCoverageAmount();
        basePremium = basePremium * (1 + (coverageAmount / 200000.0));
        
        return basePremium;
    }
    
    private double getAdvancedAgeImpact(int yearBuilt) {
        int currentYear = LocalDate.now().getYear();
        int age = currentYear - yearBuilt;
        
        // Exponential aging factor with plateau
        if (age <= 5) return 0.88;
        if (age <= 10) return 0.92 + (age - 5) * 0.016;
        if (age <= 20) return 1.0 + (age - 10) * 0.008;
        if (age <= 40) return 1.08 + (age - 20) * 0.006;
        if (age <= 60) return 1.2 + (age - 40) * 0.005;
        return 1.3 + Math.min((age - 60) * 0.002, 0.3); // Cap at 1.6
    }
    
    private double getRegionalFactor(String state, String propertyType) {
        Map<String, Double> stateFactors = REGIONAL_FACTORS.getOrDefault(state, REGIONAL_FACTORS.get("default"));
        return stateFactors.getOrDefault(propertyType, 1.0);
    }
}
