
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Quote } from '@/types';
import mockQuotes from '@/data/mockQuotes';
import { ArrowLeft, Download, Printer, FileCheck, Pencil } from 'lucide-react';

export default function QuoteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch the quote from the API
    // For now, we'll use mockQuotes
    const foundQuote = mockQuotes.find(q => q.id === id);
    setQuote(foundQuote || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="insurance-container flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-insurance-yellow border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-lg">Loading quote details...</p>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="insurance-container">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Quote Not Found</h2>
          <p className="mb-6 text-gray-600">The quote you're looking for doesn't exist or has been removed.</p>
          <Button 
            onClick={() => navigate('/quotes')}
            className="bg-insurance-yellow hover:bg-insurance-yellow-dark text-black"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quote List
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getStatusBadgeClass = (status: Quote['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-200 text-gray-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'bound':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBindPolicy = () => {
    // Update quote status
    const updatedQuote = { ...quote, status: 'bound' as const };
    setQuote(updatedQuote);
    
    // In a real app, we would send this update to the API
    
    toast({
      title: "Quote Bound to Policy",
      description: "The quote has been successfully bound to a policy."
    });
  };

  return (
    <div className="insurance-container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <div className="flex items-center mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/quotes')}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Quote #{quote.id}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusBadgeClass(quote.status)}`}>
              {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
            </span>
            <span className="text-gray-500">Created on {formatDate(quote.createdAt)}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          {quote.status !== 'bound' && (
            <>
              <Button
                variant="outline"
                onClick={() => navigate(`/quotes/${quote.id}/edit`)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Quote
              </Button>
              <Button
                className="bg-insurance-yellow hover:bg-insurance-yellow-dark text-black"
                onClick={handleBindPolicy}
              >
                <FileCheck className="mr-2 h-4 w-4" />
                Bind to Policy
              </Button>
            </>
          )}
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-medium">{quote.customerDetails.firstName} {quote.customerDetails.lastName}</p>
            <p className="text-gray-500">{quote.customerDetails.email}</p>
            <p className="text-gray-500">{quote.customerDetails.phone}</p>
            <p className="text-sm text-gray-500 mt-2">DOB: {formatDate(quote.customerDetails.dateOfBirth)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Property</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{quote.propertyDetails.address.street}</p>
            <p className="text-gray-500">
              {quote.propertyDetails.address.city}, {quote.propertyDetails.address.state} {quote.propertyDetails.address.zipCode}
            </p>
            <p className="text-gray-500">{quote.propertyDetails.address.country}</p>
            <p className="text-sm text-gray-500 mt-2">
              {quote.propertyDetails.propertyType} • {quote.propertyDetails.squareFootage} sq ft
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-insurance-yellow-light">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${quote.premium.toFixed(2)}</p>
            <p className="text-gray-600">Annual premium</p>
            <div className="mt-2 text-sm">
              <div className="flex justify-between">
                <span>Policy Type:</span>
                <span className="font-medium">{quote.policyDetails.policyType}</span>
              </div>
              <div className="flex justify-between">
                <span>Coverage:</span>
                <span className="font-medium">${quote.policyDetails.coverageAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Deductible:</span>
                <span className="font-medium">${quote.policyDetails.deductible.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="policy" className="bg-white rounded-lg shadow-md">
        <TabsList className="border-b p-0 bg-transparent">
          <TabsTrigger 
            value="policy" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-insurance-yellow data-[state=active]:shadow-none px-4 py-3"
          >
            Policy Details
          </TabsTrigger>
          <TabsTrigger 
            value="property" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-insurance-yellow data-[state=active]:shadow-none px-4 py-3"
          >
            Property Details
          </TabsTrigger>
          <TabsTrigger 
            value="customer" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-insurance-yellow data-[state=active]:shadow-none px-4 py-3"
          >
            Customer Details
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="policy" className="pt-4 px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Details</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-3">
                  <span className="text-gray-500">Policy Type</span>
                  <span className="col-span-2 font-medium">{quote.policyDetails.policyType}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-gray-500">Coverage Amount</span>
                  <span className="col-span-2 font-medium">${quote.policyDetails.coverageAmount.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-gray-500">Deductible</span>
                  <span className="col-span-2 font-medium">${quote.policyDetails.deductible.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-gray-500">Start Date</span>
                  <span className="col-span-2 font-medium">{formatDate(quote.policyDetails.startDate)}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-gray-500">End Date</span>
                  <span className="col-span-2 font-medium">{formatDate(quote.policyDetails.endDate)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Additional Coverages</h3>
              {quote.policyDetails.additionalCoverages.length > 0 ? (
                <ul className="space-y-2">
                  {quote.policyDetails.additionalCoverages.map((coverage, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-insurance-yellow mr-2"></div>
                      {coverage}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No additional coverages selected.</p>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="property" className="pt-4 px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Property Information</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-3">
                  <span className="text-gray-500">Property Type</span>
                  <span className="col-span-2 font-medium">{quote.propertyDetails.propertyType}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-gray-500">Construction</span>
                  <span className="col-span-2 font-medium">{quote.propertyDetails.constructionType}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-gray-500">Year Built</span>
                  <span className="col-span-2 font-medium">{quote.propertyDetails.yearBuilt}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-gray-500">Square Footage</span>
                  <span className="col-span-2 font-medium">{quote.propertyDetails.squareFootage} sq ft</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-gray-500">Stories</span>
                  <span className="col-span-2 font-medium">{quote.propertyDetails.numberOfStories}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-gray-500">Roof Type</span>
                  <span className="col-span-2 font-medium">{quote.propertyDetails.roofType}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Address</h3>
                <p className="font-medium">{quote.propertyDetails.address.street}</p>
                <p>{quote.propertyDetails.address.city}, {quote.propertyDetails.address.state} {quote.propertyDetails.address.zipCode}</p>
                <p>{quote.propertyDetails.address.country}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Security Features</h3>
                {quote.propertyDetails.securityFeatures.length > 0 ? (
                  <ul className="space-y-2">
                    {quote.propertyDetails.securityFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-insurance-yellow mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No security features specified.</p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="customer" className="pt-4 px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-3">
                  <span className="text-gray-500">Full Name</span>
                  <span className="col-span-2 font-medium">{quote.customerDetails.firstName} {quote.customerDetails.lastName}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-gray-500">Email</span>
                  <span className="col-span-2 font-medium">{quote.customerDetails.email}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-gray-500">Phone</span>
                  <span className="col-span-2 font-medium">{quote.customerDetails.phone}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-gray-500">Date of Birth</span>
                  <span className="col-span-2 font-medium">{formatDate(quote.customerDetails.dateOfBirth)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Risk Profile</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-3">
                  <span className="text-gray-500">Credit Score</span>
                  <span className="col-span-2 font-medium">{quote.customerDetails.creditScore}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-gray-500">Previous Claims</span>
                  <span className="col-span-2 font-medium">{quote.customerDetails.previousClaims}</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
