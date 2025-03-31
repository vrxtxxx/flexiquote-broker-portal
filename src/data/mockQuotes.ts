
import { Quote } from '@/types';

const mockQuotes: Quote[] = [
  {
    id: '1',
    createdAt: '2023-06-15T10:30:00Z',
    updatedAt: '2023-06-15T10:30:00Z',
    status: 'submitted',
    premium: 1250.75,
    policyDetails: {
      policyType: 'Home Insurance',
      coverageAmount: 250000,
      startDate: '2023-07-01',
      endDate: '2024-07-01',
      deductible: 500,
      additionalCoverages: ['Flood Protection', 'Jewelry Coverage']
    },
    propertyDetails: {
      propertyType: 'Single Family Home',
      constructionType: 'Brick',
      yearBuilt: 2010,
      squareFootage: 2000,
      numberOfStories: 2,
      roofType: 'Asphalt Shingle',
      securityFeatures: ['Alarm System', 'Smoke Detectors'],
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      }
    },
    customerDetails: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '555-123-4567',
      dateOfBirth: '1985-05-15',
      previousClaims: 0,
      creditScore: 720
    }
  },
  {
    id: '2',
    createdAt: '2023-06-10T14:45:00Z',
    updatedAt: '2023-06-12T09:15:00Z',
    status: 'approved',
    premium: 875.50,
    policyDetails: {
      policyType: 'Home Insurance',
      coverageAmount: 180000,
      startDate: '2023-07-15',
      endDate: '2024-07-15',
      deductible: 1000,
      additionalCoverages: ['Fire Protection']
    },
    propertyDetails: {
      propertyType: 'Apartment',
      constructionType: 'Concrete',
      yearBuilt: 2015,
      squareFootage: 1200,
      numberOfStories: 1,
      roofType: 'Flat',
      securityFeatures: ['Security Guard', 'CCTV'],
      address: {
        street: '456 Park Ave',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA'
      }
    },
    customerDetails: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '555-987-6543',
      dateOfBirth: '1990-08-22',
      previousClaims: 1,
      creditScore: 680
    }
  },
  {
    id: '3',
    createdAt: '2023-06-08T11:20:00Z',
    updatedAt: '2023-06-08T11:20:00Z',
    status: 'draft',
    premium: 0,
    policyDetails: {
      policyType: 'Home Insurance',
      coverageAmount: 320000,
      startDate: '2023-08-01',
      endDate: '2024-08-01',
      deductible: 750,
      additionalCoverages: []
    },
    propertyDetails: {
      propertyType: 'Townhouse',
      constructionType: 'Wood Frame',
      yearBuilt: 2005,
      squareFootage: 1600,
      numberOfStories: 2,
      roofType: 'Metal',
      securityFeatures: [],
      address: {
        street: '789 Oak Rd',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94107',
        country: 'USA'
      }
    },
    customerDetails: {
      firstName: 'Robert',
      lastName: 'Johnson',
      email: 'robert.johnson@example.com',
      phone: '555-456-7890',
      dateOfBirth: '1978-12-03',
      previousClaims: 2,
      creditScore: 650
    }
  },
  {
    id: '4',
    createdAt: '2023-06-05T16:00:00Z',
    updatedAt: '2023-06-14T13:25:00Z',
    status: 'bound',
    premium: 1450.25,
    policyDetails: {
      policyType: 'Home Insurance',
      coverageAmount: 275000,
      startDate: '2023-07-01',
      endDate: '2024-07-01',
      deductible: 500,
      additionalCoverages: ['Theft Protection', 'Water Damage']
    },
    propertyDetails: {
      propertyType: 'Condominium',
      constructionType: 'Steel Frame',
      yearBuilt: 2018,
      squareFootage: 1800,
      numberOfStories: 1,
      roofType: 'Tile',
      securityFeatures: ['Doorman', 'Key Card Access'],
      address: {
        street: '101 River View',
        city: 'Miami',
        state: 'FL',
        zipCode: '33101',
        country: 'USA'
      }
    },
    customerDetails: {
      firstName: 'Maria',
      lastName: 'Garcia',
      email: 'maria.garcia@example.com',
      phone: '555-789-0123',
      dateOfBirth: '1982-04-27',
      previousClaims: 0,
      creditScore: 750
    }
  },
  {
    id: '5',
    createdAt: '2023-06-01T09:10:00Z',
    updatedAt: '2023-06-11T17:45:00Z',
    status: 'rejected',
    premium: 1680.00,
    policyDetails: {
      policyType: 'Home Insurance',
      coverageAmount: 400000,
      startDate: '2023-07-15',
      endDate: '2024-07-15',
      deductible: 1000,
      additionalCoverages: ['Flood Protection', 'Earthquake Coverage']
    },
    propertyDetails: {
      propertyType: 'Single Family Home',
      constructionType: 'Wood Frame',
      yearBuilt: 1985,
      squareFootage: 2500,
      numberOfStories: 2,
      roofType: 'Asphalt Shingle',
      securityFeatures: ['Fire Alarm', 'Smoke Detectors'],
      address: {
        street: '222 Maple Dr',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
        country: 'USA'
      }
    },
    customerDetails: {
      firstName: 'David',
      lastName: 'Wilson',
      email: 'david.wilson@example.com',
      phone: '555-321-6547',
      dateOfBirth: '1975-09-18',
      previousClaims: 3,
      creditScore: 620
    }
  }
];

export default mockQuotes;
