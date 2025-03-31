
export interface PolicyDetails {
  policyType: string;
  coverageAmount: number;
  startDate: string;
  endDate: string;
  deductible: number;
  additionalCoverages: string[];
}

export interface PropertyDetails {
  propertyType: string;
  constructionType: string;
  yearBuilt: number;
  squareFootage: number;
  numberOfStories: number;
  roofType: string;
  securityFeatures: string[];
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  previousClaims: number;
  creditScore: number;
}

export interface Quote {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'bound';
  premium: number;
  policyDetails: PolicyDetails;
  propertyDetails: PropertyDetails;
  customerDetails: CustomerDetails;
}

export interface QuoteFormData {
  policyDetails: PolicyDetails;
  propertyDetails: PropertyDetails;
  customerDetails: CustomerDetails;
}
