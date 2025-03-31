
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  QuoteFormData, 
  PolicyDetails, 
  PropertyDetails, 
  CustomerDetails 
} from '@/types';
import { calculatePremium } from '@/utils/ratingCalculator';
import { useNavigate } from 'react-router-dom';

const defaultPolicyDetails: PolicyDetails = {
  policyType: 'Home Insurance',
  coverageAmount: 250000,
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
  deductible: 500,
  additionalCoverages: []
};

const defaultPropertyDetails: PropertyDetails = {
  propertyType: 'Single Family Home',
  constructionType: 'Brick',
  yearBuilt: 2010,
  squareFootage: 2000,
  numberOfStories: 2,
  roofType: 'Asphalt Shingle',
  securityFeatures: [],
  address: {
    street: '',
    city: '',
    state: 'NY',
    zipCode: '',
    country: 'USA'
  }
};

const defaultCustomerDetails: CustomerDetails = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '1990-01-01',
  previousClaims: 0,
  creditScore: 700
};

export default function QuoteForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('policy');
  const [premium, setPremium] = useState(0);
  const [formData, setFormData] = useState<QuoteFormData>({
    policyDetails: defaultPolicyDetails,
    propertyDetails: defaultPropertyDetails,
    customerDetails: defaultCustomerDetails
  });

  const propertyTypes = [
    'Single Family Home',
    'Apartment',
    'Condominium',
    'Townhouse',
    'Mobile Home'
  ];

  const constructionTypes = [
    'Brick',
    'Concrete',
    'Steel Frame',
    'Wood Frame',
    'Stone'
  ];

  const roofTypes = [
    'Asphalt Shingle',
    'Metal',
    'Tile',
    'Slate',
    'Flat',
    'Wood Shake'
  ];

  const securityFeatureOptions = [
    { id: 'alarm', label: 'Alarm System' },
    { id: 'smoke', label: 'Smoke Detectors' },
    { id: 'fire', label: 'Fire Alarm' },
    { id: 'guard', label: 'Security Guard' },
    { id: 'cctv', label: 'CCTV' },
    { id: 'doorman', label: 'Doorman' },
    { id: 'keycard', label: 'Key Card Access' }
  ];

  const coverageOptions = [
    { id: 'flood', label: 'Flood Protection' },
    { id: 'earthquake', label: 'Earthquake Coverage' },
    { id: 'theft', label: 'Theft Protection' },
    { id: 'fire', label: 'Fire Protection' },
    { id: 'water', label: 'Water Damage' },
    { id: 'jewelry', label: 'Jewelry Coverage' }
  ];

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  // Calculate premium whenever form data changes
  useEffect(() => {
    // Only calculate if all required fields are filled
    if (
      formData.policyDetails.coverageAmount &&
      formData.propertyDetails.propertyType &&
      formData.propertyDetails.constructionType &&
      formData.propertyDetails.yearBuilt &&
      formData.customerDetails.creditScore
    ) {
      try {
        const calculatedPremium = calculatePremium(formData);
        setPremium(calculatedPremium);
      } catch (error) {
        console.error("Error calculating premium:", error);
      }
    }
  }, [formData]);

  const handlePolicyChange = (field: keyof PolicyDetails, value: any) => {
    setFormData({
      ...formData,
      policyDetails: {
        ...formData.policyDetails,
        [field]: value
      }
    });
  };

  const handlePropertyChange = (field: keyof PropertyDetails, value: any) => {
    if (field !== 'address') {
      setFormData({
        ...formData,
        propertyDetails: {
          ...formData.propertyDetails,
          [field]: value
        }
      });
    }
  };

  const handleAddressChange = (field: keyof PropertyDetails['address'], value: string) => {
    setFormData({
      ...formData,
      propertyDetails: {
        ...formData.propertyDetails,
        address: {
          ...formData.propertyDetails.address,
          [field]: value
        }
      }
    });
  };

  const handleCustomerChange = (field: keyof CustomerDetails, value: any) => {
    setFormData({
      ...formData,
      customerDetails: {
        ...formData.customerDetails,
        [field]: value
      }
    });
  };

  const handleSecurityFeatureChange = (checked: boolean, label: string) => {
    const updatedFeatures = checked
      ? [...formData.propertyDetails.securityFeatures, label]
      : formData.propertyDetails.securityFeatures.filter(feature => feature !== label);

    setFormData({
      ...formData,
      propertyDetails: {
        ...formData.propertyDetails,
        securityFeatures: updatedFeatures
      }
    });
  };

  const handleCoverageChange = (checked: boolean, label: string) => {
    const updatedCoverages = checked
      ? [...formData.policyDetails.additionalCoverages, label]
      : formData.policyDetails.additionalCoverages.filter(coverage => coverage !== label);

    setFormData({
      ...formData,
      policyDetails: {
        ...formData.policyDetails,
        additionalCoverages: updatedCoverages
      }
    });
  };

  const handleNext = () => {
    if (activeTab === 'policy') {
      setActiveTab('property');
    } else if (activeTab === 'property') {
      setActiveTab('customer');
    }
  };

  const handleBack = () => {
    if (activeTab === 'customer') {
      setActiveTab('property');
    } else if (activeTab === 'property') {
      setActiveTab('policy');
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Basic validation
    if (
      !formData.customerDetails.firstName || 
      !formData.customerDetails.lastName || 
      !formData.customerDetails.email ||
      !formData.propertyDetails.address.street ||
      !formData.propertyDetails.address.city ||
      !formData.propertyDetails.address.zipCode
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, we would save to the backend here
    toast({
      title: "Quote Submitted",
      description: `Your quote has been successfully submitted with a premium of $${premium.toFixed(2)}.`
    });
    
    // Navigate to quote list
    navigate('/quotes');
  };

  return (
    <div className="insurance-container max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Create New Insurance Quote</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Premium Estimate</h2>
        <div className="flex items-center justify-between bg-insurance-yellow-light p-4 rounded-md">
          <span className="text-lg font-medium">Estimated Annual Premium:</span>
          <span className="text-2xl font-bold">${premium.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          This is an estimate based on the information provided. The final premium may vary.
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="policy">Policy Details</TabsTrigger>
            <TabsTrigger value="property">Property Details</TabsTrigger>
            <TabsTrigger value="customer">Customer Details</TabsTrigger>
          </TabsList>
          
          {/* Policy Details Tab */}
          <TabsContent value="policy">
            <Card>
              <CardHeader>
                <CardTitle>Policy Details</CardTitle>
                <CardDescription>
                  Enter the details about the insurance policy you want to create.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="policyType">Policy Type</Label>
                    <Select 
                      value={formData.policyDetails.policyType}
                      onValueChange={(value) => handlePolicyChange('policyType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select policy type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Home Insurance">Home Insurance</SelectItem>
                        <SelectItem value="Fire Insurance">Fire Insurance</SelectItem>
                        <SelectItem value="Burglary Insurance">Burglary Insurance</SelectItem>
                        <SelectItem value="Combined Policy">Combined Policy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="coverageAmount">Coverage Amount ($)</Label>
                    <Input 
                      id="coverageAmount" 
                      type="number" 
                      value={formData.policyDetails.coverageAmount}
                      onChange={(e) => handlePolicyChange('coverageAmount', Number(e.target.value))}
                      min="50000"
                      step="10000"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Policy Start Date</Label>
                    <Input 
                      id="startDate" 
                      type="date" 
                      value={formData.policyDetails.startDate}
                      onChange={(e) => handlePolicyChange('startDate', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Policy End Date</Label>
                    <Input 
                      id="endDate" 
                      type="date" 
                      value={formData.policyDetails.endDate}
                      onChange={(e) => handlePolicyChange('endDate', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deductible">Deductible Amount ($)</Label>
                  <Select 
                    value={formData.policyDetails.deductible.toString()}
                    onValueChange={(value) => handlePolicyChange('deductible', Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select deductible amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="250">$250</SelectItem>
                      <SelectItem value="500">$500</SelectItem>
                      <SelectItem value="750">$750</SelectItem>
                      <SelectItem value="1000">$1,000</SelectItem>
                      <SelectItem value="1500">$1,500</SelectItem>
                      <SelectItem value="2000">$2,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Additional Coverages</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {coverageOptions.map((coverage) => (
                      <div key={coverage.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`coverage-${coverage.id}`} 
                          checked={formData.policyDetails.additionalCoverages.includes(coverage.label)}
                          onCheckedChange={(checked) => handleCoverageChange(checked as boolean, coverage.label)}
                        />
                        <label 
                          htmlFor={`coverage-${coverage.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {coverage.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  type="button" 
                  onClick={handleNext}
                  className="bg-insurance-yellow hover:bg-insurance-yellow-dark text-black"
                >
                  Next: Property Details
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Property Details Tab */}
          <TabsContent value="property">
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
                <CardDescription>
                  Provide information about the property to be insured.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type</Label>
                    <Select 
                      value={formData.propertyDetails.propertyType}
                      onValueChange={(value) => handlePropertyChange('propertyType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="constructionType">Construction Type</Label>
                    <Select 
                      value={formData.propertyDetails.constructionType}
                      onValueChange={(value) => handlePropertyChange('constructionType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select construction type" />
                      </SelectTrigger>
                      <SelectContent>
                        {constructionTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yearBuilt">Year Built</Label>
                    <Input 
                      id="yearBuilt" 
                      type="number" 
                      value={formData.propertyDetails.yearBuilt}
                      onChange={(e) => handlePropertyChange('yearBuilt', Number(e.target.value))}
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="squareFootage">Square Footage</Label>
                    <Input 
                      id="squareFootage" 
                      type="number" 
                      value={formData.propertyDetails.squareFootage}
                      onChange={(e) => handlePropertyChange('squareFootage', Number(e.target.value))}
                      min="100"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="numberOfStories">Number of Stories</Label>
                    <Input 
                      id="numberOfStories" 
                      type="number" 
                      value={formData.propertyDetails.numberOfStories}
                      onChange={(e) => handlePropertyChange('numberOfStories', Number(e.target.value))}
                      min="1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="roofType">Roof Type</Label>
                  <Select 
                    value={formData.propertyDetails.roofType}
                    onValueChange={(value) => handlePropertyChange('roofType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select roof type" />
                    </SelectTrigger>
                    <SelectContent>
                      {roofTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Security Features</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {securityFeatureOptions.map((feature) => (
                      <div key={feature.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`security-${feature.id}`} 
                          checked={formData.propertyDetails.securityFeatures.includes(feature.label)}
                          onCheckedChange={(checked) => handleSecurityFeatureChange(checked as boolean, feature.label)}
                        />
                        <label 
                          htmlFor={`security-${feature.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {feature.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Property Address</Label>
                  <div className="grid grid-cols-1 gap-4">
                    <Input 
                      placeholder="Street Address" 
                      value={formData.propertyDetails.address.street}
                      onChange={(e) => handleAddressChange('street', e.target.value)}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Input 
                        placeholder="City" 
                        value={formData.propertyDetails.address.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                      />
                      
                      <Select 
                        value={formData.propertyDetails.address.state}
                        onValueChange={(value) => handleAddressChange('state', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="State" />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Input 
                        placeholder="Zip Code" 
                        value={formData.propertyDetails.address.zipCode}
                        onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                      />
                      
                      <Input 
                        placeholder="Country" 
                        value={formData.propertyDetails.address.country}
                        onChange={(e) => handleAddressChange('country', e.target.value)}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleBack}
                >
                  Back: Policy Details
                </Button>
                <Button 
                  type="button" 
                  onClick={handleNext}
                  className="bg-insurance-yellow hover:bg-insurance-yellow-dark text-black"
                >
                  Next: Customer Details
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Customer Details Tab */}
          <TabsContent value="customer">
            <Card>
              <CardHeader>
                <CardTitle>Customer Details</CardTitle>
                <CardDescription>
                  Provide information about the customer requesting the quote.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={formData.customerDetails.firstName}
                      onChange={(e) => handleCustomerChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={formData.customerDetails.lastName}
                      onChange={(e) => handleCustomerChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.customerDetails.email}
                      onChange={(e) => handleCustomerChange('email', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      value={formData.customerDetails.phone}
                      onChange={(e) => handleCustomerChange('phone', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input 
                      id="dateOfBirth" 
                      type="date" 
                      value={formData.customerDetails.dateOfBirth}
                      onChange={(e) => handleCustomerChange('dateOfBirth', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="previousClaims">Previous Claims</Label>
                    <Input 
                      id="previousClaims" 
                      type="number" 
                      value={formData.customerDetails.previousClaims}
                      onChange={(e) => handleCustomerChange('previousClaims', Number(e.target.value))}
                      min="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="creditScore">Credit Score</Label>
                    <Input 
                      id="creditScore" 
                      type="number" 
                      value={formData.customerDetails.creditScore}
                      onChange={(e) => handleCustomerChange('creditScore', Number(e.target.value))}
                      min="300"
                      max="850"
                    />
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-insurance-yellow-light rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Quote Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Policy Type:</strong> {formData.policyDetails.policyType}</p>
                      <p><strong>Coverage Amount:</strong> ${formData.policyDetails.coverageAmount.toLocaleString()}</p>
                      <p><strong>Deductible:</strong> ${formData.policyDetails.deductible.toLocaleString()}</p>
                      <p><strong>Property Type:</strong> {formData.propertyDetails.propertyType}</p>
                    </div>
                    <div>
                      <p><strong>Construction:</strong> {formData.propertyDetails.constructionType}</p>
                      <p><strong>Year Built:</strong> {formData.propertyDetails.yearBuilt}</p>
                      <p><strong>Square Footage:</strong> {formData.propertyDetails.squareFootage} sq ft</p>
                      <p><strong>State:</strong> {formData.propertyDetails.address.state}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-4">
                    <span className="text-lg font-medium">Estimated Annual Premium:</span>
                    <span className="text-2xl font-bold">${premium.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleBack}
                >
                  Back: Property Details
                </Button>
                <Button 
                  type="submit"
                  className="bg-insurance-yellow hover:bg-insurance-yellow-dark text-black"
                >
                  Submit Quote
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
