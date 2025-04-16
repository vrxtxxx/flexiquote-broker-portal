
/**
 * Premium prediction utility that enhances the basic rating calculator
 * with statistical analysis to provide more accurate premium estimations.
 */
import { QuoteFormData } from '@/types';
import { calculatePremium } from './ratingCalculator';

// Adjustment factors based on statistical analysis of historical data
const SEASONAL_ADJUSTMENTS: Record<number, number> = {
  0: 1.05, // January - Winter risks
  1: 1.03, // February
  2: 1.00, // March
  3: 0.98, // April
  4: 0.97, // May
  5: 0.95, // June - Summer discount
  6: 0.96, // July
  7: 0.98, // August
  8: 0.99, // September
  9: 1.00, // October
  10: 1.02, // November
  11: 1.04, // December - Winter risks
};

// Property age impact matrix - more detailed than simple multiplier
const getAdvancedAgeImpact = (yearBuilt: number): number => {
  const currentYear = new Date().getFullYear();
  const age = currentYear - yearBuilt;
  
  // Exponential aging factor with plateau
  if (age <= 5) return 0.88;
  if (age <= 10) return 0.92 + (age - 5) * 0.016;
  if (age <= 20) return 1.0 + (age - 10) * 0.008;
  if (age <= 40) return 1.08 + (age - 20) * 0.006;
  if (age <= 60) return 1.2 + (age - 40) * 0.005;
  return 1.3 + Math.min((age - 60) * 0.002, 0.3); // Cap at 1.6
};

// Regional risk trend analysis
const getRegionalTrend = (state: string, propertyType: string): number => {
  // Simplified regional trends
  const regionTrends: Record<string, Record<string, number>> = {
    'CA': {
      'Single Family Home': 1.08,
      'Apartment': 1.05,
      'Condominium': 1.06,
      'Townhouse': 1.07,
      'Mobile Home': 1.12,
    },
    'FL': {
      'Single Family Home': 1.15,
      'Apartment': 1.10,
      'Condominium': 1.12,
      'Townhouse': 1.13,
      'Mobile Home': 1.25,
    },
    // Default factors for other states
    'default': {
      'Single Family Home': 1.0,
      'Apartment': 0.98,
      'Condominium': 0.99,
      'Townhouse': 1.01,
      'Mobile Home': 1.05,
    }
  };
  
  const stateTrends = regionTrends[state] || regionTrends['default'];
  return stateTrends[propertyType] || 1.0;
};

// Get seasonal adjustment factor
const getSeasonalAdjustment = (date: Date): number => {
  const month = date.getMonth();
  return SEASONAL_ADJUSTMENTS[month] || 1.0;
};

/**
 * Calculate optimized premium with enhanced factors and trends analysis
 */
export function calculateOptimizedPremium(quoteData: QuoteFormData): {
  premium: number;
  baseRate: number;
  adjustments: Record<string, number>;
} {
  // Get base premium from standard calculator
  const basePremium = calculatePremium(quoteData);
  
  // Get current date for seasonal adjustment
  const currentDate = new Date();
  const seasonalFactor = getSeasonalAdjustment(currentDate);
  
  // Get advanced age impact
  const ageImpact = getAdvancedAgeImpact(quoteData.propertyDetails.yearBuilt);
  
  // Get regional trend factor
  const regionalFactor = getRegionalTrend(
    quoteData.propertyDetails.address.state,
    quoteData.propertyDetails.propertyType
  );
  
  // Calculate optimized premium
  const optimizedPremium = basePremium * seasonalFactor * ageImpact * regionalFactor;
  
  // Round to 2 decimal places
  const finalPremium = Math.round(optimizedPremium * 100) / 100;
  
  // Return detailed breakdown for transparency
  return {
    premium: finalPremium,
    baseRate: basePremium,
    adjustments: {
      seasonal: seasonalFactor,
      propertyAge: ageImpact,
      regionalRisk: regionalFactor,
    }
  };
}

/**
 * Get premium range estimation (min/max expected premium)
 */
export function getPremiumRange(quoteData: QuoteFormData): {
  minimumPremium: number;
  maximumPremium: number;
  recommendedPremium: number;
} {
  const { premium } = calculateOptimizedPremium(quoteData);
  
  // Calculate minimum and maximum premium range (±15%)
  const minimumPremium = Math.round((premium * 0.85) * 100) / 100;
  const maximumPremium = Math.round((premium * 1.15) * 100) / 100;
  
  return {
    minimumPremium,
    maximumPremium,
    recommendedPremium: premium
  };
}
