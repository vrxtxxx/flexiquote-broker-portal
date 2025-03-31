
import { QuoteFormData } from '@/types';

// Base premium rates for different property types
const BASE_RATES = {
  'Single Family Home': 500,
  'Apartment': 350,
  'Condominium': 400,
  'Townhouse': 450,
  'Mobile Home': 600,
};

// Multipliers for different construction types
const CONSTRUCTION_MULTIPLIERS = {
  'Brick': 0.9,
  'Concrete': 0.85,
  'Steel Frame': 0.95,
  'Wood Frame': 1.2,
  'Stone': 0.95,
};

// Age of property affects premium
function getAgeMultiplier(yearBuilt: number): number {
  const currentYear = new Date().getFullYear();
  const age = currentYear - yearBuilt;
  
  if (age <= 5) return 0.9;
  if (age <= 10) return 1.0;
  if (age <= 20) return 1.1;
  if (age <= 30) return 1.2;
  if (age <= 50) return 1.3;
  return 1.5;
}

// Coverage amount affects premium
function getCoverageMultiplier(coverageAmount: number): number {
  if (coverageAmount <= 100000) return 0.8;
  if (coverageAmount <= 200000) return 0.9;
  if (coverageAmount <= 300000) return 1.0;
  if (coverageAmount <= 400000) return 1.1;
  if (coverageAmount <= 500000) return 1.2;
  return 1.3;
}

// Deductible affects premium (higher deductible = lower premium)
function getDeductibleMultiplier(deductible: number): number {
  if (deductible >= 2000) return 0.8;
  if (deductible >= 1500) return 0.85;
  if (deductible >= 1000) return 0.9;
  if (deductible >= 750) return 0.95;
  if (deductible >= 500) return 1.0;
  return 1.1;
}

// Credit score affects premium
function getCreditScoreMultiplier(creditScore: number): number {
  if (creditScore >= 750) return 0.85;
  if (creditScore >= 700) return 0.9;
  if (creditScore >= 650) return 1.0;
  if (creditScore >= 600) return 1.1;
  if (creditScore >= 550) return 1.2;
  return 1.3;
}

// Previous claims affect premium
function getClaimsMultiplier(previousClaims: number): number {
  if (previousClaims === 0) return 0.9;
  if (previousClaims === 1) return 1.0;
  if (previousClaims === 2) return 1.15;
  if (previousClaims === 3) return 1.3;
  return 1.5;
}

// Additional coverages add to the premium
function getAdditionalCoverageMultiplier(additionalCoverages: string[]): number {
  let multiplier = 1.0;
  
  if (additionalCoverages.includes('Flood Protection')) multiplier += 0.15;
  if (additionalCoverages.includes('Earthquake Coverage')) multiplier += 0.2;
  if (additionalCoverages.includes('Theft Protection')) multiplier += 0.1;
  if (additionalCoverages.includes('Fire Protection')) multiplier += 0.05;
  if (additionalCoverages.includes('Water Damage')) multiplier += 0.1;
  if (additionalCoverages.includes('Jewelry Coverage')) multiplier += 0.1;
  
  return multiplier;
}

// Security features reduce premium
function getSecurityFeatureDiscount(securityFeatures: string[]): number {
  let discount = 0;
  
  if (securityFeatures.includes('Alarm System')) discount += 0.05;
  if (securityFeatures.includes('Smoke Detectors')) discount += 0.03;
  if (securityFeatures.includes('Fire Alarm')) discount += 0.03;
  if (securityFeatures.includes('Security Guard')) discount += 0.07;
  if (securityFeatures.includes('CCTV')) discount += 0.04;
  if (securityFeatures.includes('Doorman')) discount += 0.05;
  if (securityFeatures.includes('Key Card Access')) discount += 0.03;
  
  // Cap the maximum discount at 20%
  return Math.min(discount, 0.2);
}

// State-specific multipliers
function getStateMultiplier(state: string): number {
  const stateMultipliers: Record<string, number> = {
    'CA': 1.2,  // California has higher rates due to fire risk
    'FL': 1.3,  // Florida has higher rates due to hurricane risk
    'NY': 1.15, // New York has higher rates due to property values
    'TX': 1.1,  // Texas has higher rates due to various risks
    'IL': 1.05, // Illinois
    'WA': 1.0,  // Washington
    'MI': 1.0,  // Michigan
    // Add more states as needed
  };
  
  return stateMultipliers[state] || 1.0; // Default multiplier if state not found
}

export function calculatePremium(quoteData: QuoteFormData): number {
  const { policyDetails, propertyDetails, customerDetails } = quoteData;
  
  // Get the base rate for the property type
  const baseRate = BASE_RATES[propertyDetails.propertyType as keyof typeof BASE_RATES] || 500;
  
  // Apply all multipliers and factors
  const constructionMultiplier = CONSTRUCTION_MULTIPLIERS[propertyDetails.constructionType as keyof typeof CONSTRUCTION_MULTIPLIERS] || 1.0;
  const ageMultiplier = getAgeMultiplier(propertyDetails.yearBuilt);
  const coverageMultiplier = getCoverageMultiplier(policyDetails.coverageAmount);
  const deductibleMultiplier = getDeductibleMultiplier(policyDetails.deductible);
  const creditScoreMultiplier = getCreditScoreMultiplier(customerDetails.creditScore);
  const claimsMultiplier = getClaimsMultiplier(customerDetails.previousClaims);
  const additionalCoverageMultiplier = getAdditionalCoverageMultiplier(policyDetails.additionalCoverages);
  const securityDiscount = getSecurityFeatureDiscount(propertyDetails.securityFeatures);
  const stateMultiplier = getStateMultiplier(propertyDetails.address.state);
  
  // Size factor - larger properties cost more to insure
  const sizeFactor = 1 + (propertyDetails.squareFootage / 10000);
  
  // Calculate the premium
  let premium = baseRate;
  premium *= constructionMultiplier;
  premium *= ageMultiplier;
  premium *= coverageMultiplier;
  premium *= deductibleMultiplier;
  premium *= creditScoreMultiplier;
  premium *= claimsMultiplier;
  premium *= additionalCoverageMultiplier;
  premium *= (1 - securityDiscount); // Apply security discount
  premium *= stateMultiplier;
  premium *= sizeFactor;
  
  // Round to 2 decimal places
  return Math.round(premium * 100) / 100;
}
