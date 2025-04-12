import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Save, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for testing purposes
const mockBrokers = [
  { id: 'broker-1', name: 'Acme Insurance' },
  { id: 'broker-2', name: 'Beta Brokers' },
];

const mockQuotes = [
  { id: 'quote-1', brokerId: 'broker-1', insuredName: 'John Doe', propertyAddress: '123 Main St', propertyValue: 250000, premium: 500, status: 'Draft' },
  { id: 'quote-2', brokerId: 'broker-2', insuredName: 'Jane Smith', propertyAddress: '456 Oak Ave', propertyValue: 350000, premium: 700, status: 'Submitted' },
];

type Quote = {
  id?: string;
  brokerId: string;
  insuredName: string;
  propertyAddress: string;
  propertyValue: number;
  premium: number;
  status: string;
};

const QuoteForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Quote>({
    brokerId: '',
    insuredName: '',
    propertyAddress: '',
    propertyValue: 0,
    premium: 0,
    status: 'Draft',
  });

  // Function to calculate premium (mock calculation)
  const calculatePremium = (propertyValue: number) => {
    // Mock premium calculation logic
    return propertyValue * 0.002;
  };

  const calculateAndUpdatePremium = (data: Quote) => {
    const premium = calculatePremium(data.propertyValue);
    setFormData(prevData => ({ ...prevData, premium: premium }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));

    if (name === 'propertyValue') {
      const propertyValue = parseFloat(value);
      const premium = calculatePremium(propertyValue);
      setFormData(prevData => ({ ...prevData, premium: premium }));
    }
  };

  // Fetch quote data if editing
  const { data: quoteData, isLoading } = useQuery({
    queryKey: ['quote', id],
    queryFn: async () => {
      if (!id) return null;
      // API call to fetch quote by ID
      return mockQuotes.find(q => q.id === id);
    },
    enabled: !!id,
    meta: {
      onSuccess: (data) => {
        if (data) {
          // Set form defaults from fetched quote
          setFormData(data);
          calculateAndUpdatePremium(data);
        }
      }
    }
  });

  useEffect(() => {
    if (quoteData) {
      setFormData(quoteData);
    }
  }, [quoteData]);

  const mutation = useMutation({
    mutationFn: (updatedQuote: Quote) => {
      // Here, you would typically make an API call to update the quote
      console.log('Updating quote:', updatedQuote);
      return Promise.resolve(updatedQuote); // Simulate API call
    },
    onSuccess: () => {
      // Invalidate the query to refetch the data
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      // Show a success toast
      toast({
        title: "Quote updated successfully!",
        description: "Your quote has been saved.",
      })
      navigate('/quotes');
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem updating your quote.",
      })
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="insurance-container py-12">
      <Card>
        <CardHeader>
          <CardTitle>{id ? 'Edit Quote' : 'Create New Quote'}</CardTitle>
          <CardDescription>Fill in the details for the insurance quote.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="brokerId">Broker</Label>
              <Input
                type="text"
                id="brokerId"
                name="brokerId"
                value={formData.brokerId}
                onChange={handleChange}
                placeholder="Enter Broker ID"
                required
              />
            </div>
            <div>
              <Label htmlFor="insuredName">Insured Name</Label>
              <Input
                type="text"
                id="insuredName"
                name="insuredName"
                value={formData.insuredName}
                onChange={handleChange}
                placeholder="Enter Insured Name"
                required
              />
            </div>
            <div>
              <Label htmlFor="propertyAddress">Property Address</Label>
              <Input
                type="text"
                id="propertyAddress"
                name="propertyAddress"
                value={formData.propertyAddress}
                onChange={handleChange}
                placeholder="Enter Property Address"
                required
              />
            </div>
            <div>
              <Label htmlFor="propertyValue">Property Value</Label>
              <Input
                type="number"
                id="propertyValue"
                name="propertyValue"
                value={formData.propertyValue}
                onChange={handleChange}
                placeholder="Enter Property Value"
                required
              />
            </div>
            <div>
              <Label htmlFor="premium">Premium</Label>
              <Input
                type="number"
                id="premium"
                name="premium"
                value={formData.premium}
                placeholder="Premium"
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Input
                type="text"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                placeholder="Enter Status"
                required
              />
            </div>
            <CardFooter className="flex justify-between">
              <Link to="/quotes">
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Cancel
                </Button>
              </Link>
              <Button className="gap-2" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Quote</span>
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteForm;
