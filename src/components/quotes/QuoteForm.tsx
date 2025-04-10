import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { calculatePremium } from '@/utils/ratingCalculator';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Default form values
const defaultFormData = {
  insurance_type: 'Fire Insurance',
  full_name: '',
  date_of_birth: '',
  email: '',
  phone: '',
  residential_address: '',
  property_type: 'Single Family Home',
  year_of_construction: new Date().getFullYear() - 10,
  construction_type: 'Brick',
  total_square_area: 2000,
  number_of_rooms: 3,
  number_of_bathrooms: 2,
  number_of_floors: 2,
  is_occupied_full_time: true,
  sum_insured: 250000,
  policy_duration: '1 Year',
  policy_start_date: new Date().toISOString().split('T')[0],
  policy_end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
  renewal_type: 'Automatic',
  automatic_renewal: true,
  fire_safety_measures: [],
  fire_safety_other: '',
  nearby_fire_station: false,
  security_features: [],
  security_features_other: '',
  high_value_items: false,
  premium: 0,
  status: 'draft',
  // These fields will be set during submission
  broker_id: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export default function QuoteForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState(defaultFormData);
  const [premium, setPremium] = useState(0);

  // Fetch quote data if editing
  const { isLoading, error } = useQuery({
    queryKey: ['quote', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: isEditing,
    onSuccess: (data) => {
      if (data) {
        // Format dates for input fields
        const formattedData = {
          ...data,
          policy_start_date: data.policy_start_date ? new Date(data.policy_start_date).toISOString().split('T')[0] : '',
          policy_end_date: data.policy_end_date ? new Date(data.policy_end_date).toISOString().split('T')[0] : '',
          date_of_birth: data.date_of_birth ? new Date(data.date_of_birth).toISOString().split('T')[0] : '',
        };
        setFormData(formattedData);
        setPremium(Number(data.premium) || 0);
      }
    },
    onError: (error) => {
      console.error('Error fetching quote:', error);
      toast({
        title: 'Error',
        description: 'Failed to load quote data. Please try again.',
        variant: 'destructive',
      });
    }
  });

  // Create/update quote mutation
  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!userData.user) throw new Error('You must be logged in to create/update a quote');
      
      const broker_id = userData.user.id;
      
      // Calculate premium using adapter for the ratingCalculator
      const calculatedPremium = calculatePremium({
        policyDetails: {
          coverageAmount: data.sum_insured,
          deductible: 500, // Default deductible
          policyType: data.insurance_type,
          startDate: data.policy_start_date,
          endDate: data.policy_end_date,
          additionalCoverages: []
        },
        propertyDetails: {
          yearBuilt: data.year_of_construction,
          constructionType: data.construction_type,
          propertyType: data.property_type,
          squareFootage: data.total_square_area,
          numberOfStories: data.number_of_floors,
          roofType: 'Standard', // Default
          securityFeatures: data.security_features,
          address: {
            street: data.residential_address,
            city: '',
            state: '',
            zipCode: '',
            country: ''
          }
        },
        customerDetails: {
          firstName: data.full_name.split(' ')[0] || '',
          lastName: data.full_name.split(' ').slice(1).join(' ') || '',
          email: data.email,
          phone: data.phone || '',
          dateOfBirth: data.date_of_birth || '',
          previousClaims: 0, // Default
          creditScore: 700 // Default
        }
      });
      
      const quoteData = {
        ...data,
        broker_id,
        premium: calculatedPremium,
        // Convert dates to ISO strings if they exist
        date_of_birth: data.date_of_birth ? new Date(data.date_of_birth).toISOString() : null,
        policy_start_date: new Date(data.policy_start_date).toISOString(),
        policy_end_date: new Date(data.policy_end_date).toISOString(),
        // Convert array fields if they're strings
        fire_safety_measures: Array.isArray(data.fire_safety_measures) ? data.fire_safety_measures : [],
        security_features: Array.isArray(data.security_features) ? data.security_features : []
      };
      
      if (isEditing) {
        const { data: updateData, error: updateError } = await supabase
          .from('quotes')
          .update(quoteData)
          .eq('id', id)
          .select();
        
        if (updateError) throw updateError;
        return updateData;
      } else {
        const { data: insertData, error: insertError } = await supabase
          .from('quotes')
          .insert(quoteData)
          .select();
        
        if (insertError) throw insertError;
        return insertData;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast({
        title: isEditing ? 'Quote Updated' : 'Quote Created',
        description: isEditing 
          ? 'The quote has been updated successfully.' 
          : 'Your quote has been submitted successfully.',
      });
      navigate('/quotes');
    },
    onError: (error) => {
      console.error('Error saving quote:', error);
      toast({
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'create'} quote: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  // Update premium calculation when relevant fields change
  useEffect(() => {
    try {
      const calculatedPremium = calculatePremium({
        policyDetails: {
          coverageAmount: formData.sum_insured,
          deductible: 500, // Default
          policyType: formData.insurance_type,
          startDate: formData.policy_start_date,
          endDate: formData.policy_end_date,
          additionalCoverages: []
        },
        propertyDetails: {
          yearBuilt: formData.year_of_construction,
          constructionType: formData.construction_type,
          propertyType: formData.property_type,
          squareFootage: formData.total_square_area,
          numberOfStories: formData.number_of_floors,
          roofType: 'Standard', // Default
          securityFeatures: formData.security_features,
          address: {
            street: formData.residential_address,
            city: '',
            state: '',
            zipCode: '',
            country: ''
          }
        },
        customerDetails: {
          firstName: formData.full_name.split(' ')[0] || '',
          lastName: formData.full_name.split(' ').slice(1).join(' ') || '',
          email: formData.email,
          phone: formData.phone || '',
          dateOfBirth: formData.date_of_birth || '',
          previousClaims: 0, // Default
          creditScore: 700 // Default
        }
      });
      setPremium(calculatedPremium);
    } catch (error) {
      console.error("Error calculating premium:", error);
    }
  }, [
    formData.sum_insured,
    formData.insurance_type,
    formData.year_of_construction,
    formData.construction_type,
    formData.property_type
  ]);

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = Array.isArray(prev[field]) ? [...prev[field]] : [];
      
      if (checked) {
        return {
          ...prev,
          [field]: [...currentArray, value]
        };
      } else {
        return {
          ...prev,
          [field]: currentArray.filter(item => item !== value)
        };
      }
    });
  };

  const handleSubmit = (event: React.FormEvent, status: 'draft' | 'submitted' = 'submitted') => {
    event.preventDefault();
    
    // Basic validation
    if (status === 'submitted') {
      if (!formData.full_name || !formData.email || !formData.residential_address) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }
    }
    
    // Update status if submitting
    const submitData = {
      ...formData,
      status
    };
    
    mutation.mutate(submitData);
  };

  if (isLoading) {
    return <div className="flex justify-center py-10">Loading quote data...</div>;
  }

  if (error) {
    return <div className="flex justify-center py-10 text-red-500">Error loading quote. Please try again.</div>;
  }

  // Form options
  const propertyTypes = [
    'Single Family Home',
    'Apartment',
    'Condominium',
    'Townhouse',
    'Mobile Home',
    'Villa',
    'Bungalow',
    'Duplex'
  ];

  const constructionTypes = [
    'Brick',
    'Concrete',
    'Wood Frame',
    'Steel Frame',
    'Stone',
    'Prefabricated',
    'Mixed'
  ];

  const insuranceTypes = [
    'Fire Insurance',
    'Burglary Insurance',
    'Both'
  ];

  const policyDurations = [
    '6 Months',
    '1 Year',
    '2 Years',
    '3 Years',
    '5 Years'
  ];

  const renewalTypes = [
    'Automatic',
    'Manual',
    'Conditional'
  ];

  const fireSecurityOptions = [
    { id: 'smoke-detectors', label: 'Smoke Detectors' },
    { id: 'fire-extinguishers', label: 'Fire Extinguishers' },
    { id: 'sprinkler-system', label: 'Sprinkler System' },
    { id: 'fire-alarm', label: 'Fire Alarm System' },
    { id: 'fire-resistant-materials', label: 'Fire Resistant Materials' },
    { id: 'fire-doors', label: 'Fire Doors' }
  ];

  const securityFeatureOptions = [
    { id: 'alarm', label: 'Alarm System' },
    { id: 'cctv', label: 'CCTV Cameras' },
    { id: 'guard', label: 'Security Guard' },
    { id: 'reinforced-doors', label: 'Reinforced Doors' },
    { id: 'security-windows', label: 'Security Windows' },
    { id: 'access-control', label: 'Access Control System' }
  ];

  return (
    <div className="insurance-container max-w-4xl mx-auto pb-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {isEditing ? 'Edit Insurance Quote' : 'Create New Insurance Quote'}
      </h1>
      
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
      
      <form onSubmit={(e) => handleSubmit(e)}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="property">Property</TabsTrigger>
            <TabsTrigger value="coverage">Coverage</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          {/* Personal Details Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Details</CardTitle>
                <CardDescription>
                  Enter the customer's personal and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="insurance_type">Insurance Type</Label>
                  <Select 
                    value={formData.insurance_type}
                    onValueChange={(value) => handleInputChange('insurance_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select insurance type" />
                    </SelectTrigger>
                    <SelectContent>
                      {insuranceTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input 
                    id="full_name" 
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input 
                      id="date_of_birth" 
                      type="date" 
                      value={formData.date_of_birth || ''}
                      onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      value={formData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="residential_address">Residential Address</Label>
                  <Textarea 
                    id="residential_address" 
                    value={formData.residential_address}
                    onChange={(e) => handleInputChange('residential_address', e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  type="button" 
                  onClick={() => setActiveTab('property')}
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
                  Provide information about the property to be insured
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="property_type">Property Type</Label>
                    <Select 
                      value={formData.property_type || ''}
                      onValueChange={(value) => handleInputChange('property_type', value)}
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
                    <Label htmlFor="construction_type">Construction Type</Label>
                    <Select 
                      value={formData.construction_type || ''}
                      onValueChange={(value) => handleInputChange('construction_type', value)}
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year_of_construction">Year of Construction</Label>
                    <Input 
                      id="year_of_construction" 
                      type="number" 
                      value={formData.year_of_construction || ''}
                      onChange={(e) => handleInputChange('year_of_construction', Number(e.target.value))}
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="total_square_area">Total Square Area (sq ft)</Label>
                    <Input 
                      id="total_square_area" 
                      type="number" 
                      value={formData.total_square_area || ''}
                      onChange={(e) => handleInputChange('total_square_area', Number(e.target.value))}
                      min="100"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="number_of_rooms">Number of Rooms</Label>
                    <Input 
                      id="number_of_rooms" 
                      type="number" 
                      value={formData.number_of_rooms || ''}
                      onChange={(e) => handleInputChange('number_of_rooms', Number(e.target.value))}
                      min="1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="number_of_bathrooms">Number of Bathrooms</Label>
                    <Input 
                      id="number_of_bathrooms" 
                      type="number" 
                      value={formData.number_of_bathrooms || ''}
                      onChange={(e) => handleInputChange('number_of_bathrooms', Number(e.target.value))}
                      min="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="number_of_floors">Number of Floors</Label>
                    <Input 
                      id="number_of_floors" 
                      type="number" 
                      value={formData.number_of_floors || ''}
                      onChange={(e) => handleInputChange('number_of_floors', Number(e.target.value))}
                      min="1"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-4">
                  <Checkbox 
                    id="is_occupied_full_time" 
                    checked={formData.is_occupied_full_time}
                    onCheckedChange={(checked) => handleInputChange('is_occupied_full_time', checked)}
                  />
                  <label
                    htmlFor="is_occupied_full_time"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Property is occupied full-time
                  </label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setActiveTab('personal')}
                >
                  Back: Personal Details
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setActiveTab('coverage')}
                  className="bg-insurance-yellow hover:bg-insurance-yellow-dark text-black"
                >
                  Next: Coverage Details
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Coverage Details Tab */}
          <TabsContent value="coverage">
            <Card>
              <CardHeader>
                <CardTitle>Coverage Details</CardTitle>
                <CardDescription>
                  Specify the coverage amount and policy duration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sum_insured">Sum Insured ($)</Label>
                  <Input 
                    id="sum_insured" 
                    type="number" 
                    value={formData.sum_insured}
                    onChange={(e) => handleInputChange('sum_insured', Number(e.target.value))}
                    min="10000"
                    step="5000"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="policy_duration">Policy Duration</Label>
                    <Select 
                      value={formData.policy_duration}
                      onValueChange={(value) => handleInputChange('policy_duration', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select policy duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {policyDurations.map((duration) => (
                          <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="renewal_type">Renewal Type</Label>
                    <Select 
                      value={formData.renewal_type}
                      onValueChange={(value) => handleInputChange('renewal_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select renewal type" />
                      </SelectTrigger>
                      <SelectContent>
                        {renewalTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="policy_start_date">Policy Start Date</Label>
                    <Input 
                      id="policy_start_date" 
                      type="date" 
                      value={formData.policy_start_date}
                      onChange={(e) => handleInputChange('policy_start_date', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="policy_end_date">Policy End Date</Label>
                    <Input 
                      id="policy_end_date" 
                      type="date" 
                      value={formData.policy_end_date}
                      onChange={(e) => handleInputChange('policy_end_date', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-4">
                  <Checkbox 
                    id="automatic_renewal" 
                    checked={formData.automatic_renewal}
                    onCheckedChange={(checked) => handleInputChange('automatic_renewal', checked)}
                  />
                  <label
                    htmlFor="automatic_renewal"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Enable automatic renewal
                  </label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setActiveTab('property')}
                >
                  Back: Property Details
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setActiveTab('security')}
                  className="bg-insurance-yellow hover:bg-insurance-yellow-dark text-black"
                >
                  Next: Security Features
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Security Features Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Features</CardTitle>
                <CardDescription>
                  Specify the security features and fire safety measures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {(formData.insurance_type === 'Fire Insurance' || formData.insurance_type === 'Both') && (
                  <div className="space-y-4 border-b pb-6">
                    <h3 className="text-lg font-medium">Fire Safety Measures</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {fireSecurityOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`fire-${option.id}`} 
                            checked={(formData.fire_safety_measures || []).includes(option.label)}
                            onCheckedChange={(checked) => handleCheckboxChange('fire_safety_measures', option.label, !!checked)}
                          />
                          <label 
                            htmlFor={`fire-${option.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fire_safety_other">Other Fire Safety Measures</Label>
                      <Textarea 
                        id="fire_safety_other" 
                        value={formData.fire_safety_other || ''}
                        onChange={(e) => handleInputChange('fire_safety_other', e.target.value)}
                        placeholder="Please specify any other fire safety measures"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="nearby_fire_station" 
                        checked={formData.nearby_fire_station || false}
                        onCheckedChange={(checked) => handleInputChange('nearby_fire_station', checked)}
                      />
                      <label
                        htmlFor="nearby_fire_station"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Property is located near a fire station (within 5 miles)
                      </label>
                    </div>
                  </div>
                )}
                
                {(formData.insurance_type === 'Burglary Insurance' || formData.insurance_type === 'Both') && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Burglary Protection</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {securityFeatureOptions.map((feature) => (
                        <div key={feature.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`security-${feature.id}`} 
                            checked={(formData.security_features || []).includes(feature.label)}
                            onCheckedChange={(checked) => handleCheckboxChange('security_features', feature.label, !!checked)}
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="security_features_other">Other Security Features</Label>
                      <Textarea 
                        id="security_features_other" 
                        value={formData.security_features_other || ''}
                        onChange={(e) => handleInputChange('security_features_other', e.target.value)}
                        placeholder="Please specify any other security features"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-4">
                      <Checkbox 
                        id="high_value_items" 
                        checked={formData.high_value_items || false}
                        onCheckedChange={(checked) => handleInputChange('high_value_items', checked)}
                      />
                      <label
                        htmlFor="high_value_items"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Property contains high-value items (jewelry, art, electronics over $5,000)
                      </label>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 p-4 bg-insurance-yellow-light rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Quote Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Insurance Type:</strong> {formData.insurance_type}</p>
                      <p><strong>Sum Insured:</strong> ${formData.sum_insured?.toLocaleString() || 0}</p>
                      <p><strong>Policy Duration:</strong> {formData.policy_duration}</p>
                      <p><strong>Property Type:</strong> {formData.property_type}</p>
                    </div>
                    <div>
                      <p><strong>Construction:</strong> {formData.construction_type}</p>
                      <p><strong>Year Built:</strong> {formData.year_of_construction}</p>
                      <p><strong>Square Area:</strong> {formData.total_square_area} sq ft</p>
                      <p><strong>Client:</strong> {formData.full_name}</p>
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
                  onClick={() => setActiveTab('coverage')}
                >
                  Back: Coverage Details
                </Button>
                <div className="space-x-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={(e) => handleSubmit(e, 'draft')}
                    disabled={mutation.isPending}
                  >
                    Save as Draft
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-insurance-yellow hover:bg-insurance-yellow-dark text-black"
                    disabled={mutation.isPending}
                  >
                    {isEditing ? 'Update Quote' : 'Submit Quote'}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
