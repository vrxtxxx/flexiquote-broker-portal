
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Edit, 
  MoreVertical, 
  FileCheck, 
  Download, 
  CheckSquare2, 
  XCircle, 
  Trash2 
} from 'lucide-react';

export default function QuoteDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch quote data
  const { data: quote, isLoading, error } = useQuery({
    queryKey: ['quote', id],
    queryFn: async () => {
      if (!id) throw new Error('Quote ID is required');
      
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  // Update quote status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      if (!id) throw new Error('Quote ID is required');
      
      const { error } = await supabase
        .from('quotes')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      return status;
    },
    onSuccess: (status) => {
      queryClient.invalidateQueries({ queryKey: ['quote', id] });
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      
      const statusMessages = {
        approved: 'Quote has been approved successfully.',
        rejected: 'Quote has been rejected.',
        bound: 'Quote has been bound to a policy.',
        submitted: 'Quote has been resubmitted.'
      };
      
      toast({
        title: "Status Updated",
        description: statusMessages[status as keyof typeof statusMessages] || `Quote status updated to ${status}.`
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update quote status: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Delete quote mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('Quote ID is required');
      
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast({
        title: "Quote Deleted",
        description: "The quote has been successfully deleted."
      });
      navigate('/quotes');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete quote: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleStatusChange = (status: string) => {
    if (confirm(`Are you sure you want to change the status to ${status}?`)) {
      updateStatusMutation.mutate(status);
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this quote? This action cannot be undone.')) {
      deleteMutation.mutate();
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (value?: number | null) => {
    if (value === undefined || value === null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const statusMap: Record<string, { color: string, label: string }> = {
      draft: { color: 'bg-gray-200 text-gray-800', label: 'Draft' },
      submitted: { color: 'bg-blue-100 text-blue-800', label: 'Submitted' },
      approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
      bound: { color: 'bg-purple-100 text-purple-800', label: 'Bound to Policy' }
    };
    
    const statusInfo = statusMap[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading quote details...</p>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg text-red-500 mb-4">Error loading quote details</p>
        <Button onClick={() => navigate('/quotes')}>Return to Quotes</Button>
      </div>
    );
  }

  return (
    <div className="insurance-container max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Quote Details</h1>
          <p className="text-gray-500">ID: {quote.id}</p>
        </div>
        
        <div className="flex gap-2">
          {quote.status !== 'bound' && (
            <Button 
              variant="outline"
              onClick={() => navigate(`/quotes/${id}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Quote
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreVertical className="h-4 w-4 mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Quote Actions</DropdownMenuLabel>
              
              {quote.status !== 'bound' && (
                <>
                  {quote.status !== 'approved' && (
                    <DropdownMenuItem onClick={() => handleStatusChange('approved')}>
                      <CheckSquare2 className="h-4 w-4 mr-2" />
                      Approve Quote
                    </DropdownMenuItem>
                  )}
                  
                  {quote.status !== 'rejected' && (
                    <DropdownMenuItem onClick={() => handleStatusChange('rejected')}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Quote
                    </DropdownMenuItem>
                  )}
                  
                  {quote.status !== 'bound' && (
                    <DropdownMenuItem onClick={() => handleStatusChange('bound')}>
                      <FileCheck className="h-4 w-4 mr-2" />
                      Bind to Policy
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                </>
              )}
              
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </DropdownMenuItem>
              
              {quote.status !== 'bound' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Quote
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">{quote.full_name}</h2>
            <p className="text-gray-600">{quote.email}</p>
            {quote.phone && <p className="text-gray-600">{quote.phone}</p>}
          </div>
          
          <div className="flex flex-col items-end">
            <div className="flex items-center mb-2">
              <span className="text-gray-600 mr-2">Status:</span>
              {getStatusBadge(quote.status)}
            </div>
            <div className="text-xl font-bold">{formatCurrency(Number(quote.premium))}</div>
            <div className="text-gray-500 text-sm">Annual Premium</div>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="property">Property Details</TabsTrigger>
          <TabsTrigger value="coverage">Coverage</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Quote Overview</CardTitle>
              <CardDescription>Summary of the insurance quote</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableHead className="w-1/3">Full Name</TableHead>
                        <TableCell>{quote.full_name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead>Date of Birth</TableHead>
                        <TableCell>{quote.date_of_birth ? formatDate(quote.date_of_birth) : 'N/A'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableCell>{quote.email}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead>Phone</TableHead>
                        <TableCell>{quote.phone || 'N/A'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead>Address</TableHead>
                        <TableCell className="whitespace-pre-wrap">{quote.residential_address}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Quote Information</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableHead className="w-1/3">Quote ID</TableHead>
                        <TableCell>{quote.id}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead>Insurance Type</TableHead>
                        <TableCell>{quote.insurance_type}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead>Date Created</TableHead>
                        <TableCell>{formatDate(quote.created_at)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead>Last Updated</TableHead>
                        <TableCell>{formatDate(quote.updated_at)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableCell>{getStatusBadge(quote.status)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div className="bg-insurance-yellow-light p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold">Premium</h3>
                    <p className="text-sm text-gray-600">Annual premium for the policy</p>
                  </div>
                  <div className="text-2xl font-bold">{formatCurrency(Number(quote.premium))}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <div className="text-sm text-gray-500">
                Created on {formatDate(quote.created_at)}
              </div>
              {quote.status !== 'bound' && (
                <Button onClick={() => navigate(`/quotes/${id}/edit`)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Quote
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Property Details Tab */}
        <TabsContent value="property">
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
              <CardDescription>Information about the insured property</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHead className="w-1/3">Property Type</TableHead>
                    <TableCell>{quote.property_type || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Construction Type</TableHead>
                    <TableCell>{quote.construction_type || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Year of Construction</TableHead>
                    <TableCell>{quote.year_of_construction || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Total Square Area</TableHead>
                    <TableCell>{quote.total_square_area ? `${quote.total_square_area} sq ft` : 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Number of Rooms</TableHead>
                    <TableCell>{quote.number_of_rooms || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Number of Bathrooms</TableHead>
                    <TableCell>{quote.number_of_bathrooms || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Number of Floors</TableHead>
                    <TableCell>{quote.number_of_floors || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Occupied Full-time</TableHead>
                    <TableCell>{quote.is_occupied_full_time ? 'Yes' : 'No'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Property Address</TableHead>
                    <TableCell className="whitespace-pre-wrap">{quote.residential_address}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Coverage Details Tab */}
        <TabsContent value="coverage">
          <Card>
            <CardHeader>
              <CardTitle>Coverage Details</CardTitle>
              <CardDescription>Policy coverage information</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHead className="w-1/3">Sum Insured</TableHead>
                    <TableCell>{formatCurrency(Number(quote.sum_insured))}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Policy Type</TableHead>
                    <TableCell>{quote.insurance_type}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Policy Duration</TableHead>
                    <TableCell>{quote.policy_duration}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Policy Start Date</TableHead>
                    <TableCell>{formatDate(quote.policy_start_date)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Policy End Date</TableHead>
                    <TableCell>{formatDate(quote.policy_end_date)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Renewal Type</TableHead>
                    <TableCell>{quote.renewal_type}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Automatic Renewal</TableHead>
                    <TableCell>{quote.automatic_renewal ? 'Yes' : 'No'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Annual Premium</TableHead>
                    <TableCell className="font-bold">{formatCurrency(Number(quote.premium))}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Features Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security & Safety Features</CardTitle>
              <CardDescription>Security and fire safety information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {(quote.insurance_type === 'Fire Insurance' || quote.insurance_type === 'Both') && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Fire Safety Measures</h3>
                  <div className="mb-4">
                    {quote.fire_safety_measures && quote.fire_safety_measures.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {quote.fire_safety_measures.map((measure: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-orange-50">
                            {measure}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No fire safety measures specified</p>
                    )}
                  </div>
                  
                  {quote.fire_safety_other && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-1">Additional Fire Safety Measures</h4>
                      <p className="text-gray-700">{quote.fire_safety_other}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Near Fire Station:</span>
                    <span>{quote.nearby_fire_station ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              )}
              
              {(quote.insurance_type === 'Burglary Insurance' || quote.insurance_type === 'Both') && (
                <div className={quote.insurance_type === 'Both' ? 'mt-8 pt-6 border-t' : ''}>
                  <h3 className="text-lg font-semibold mb-3">Security Features</h3>
                  <div className="mb-4">
                    {quote.security_features && quote.security_features.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {quote.security_features.map((feature: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-blue-50">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No security features specified</p>
                    )}
                  </div>
                  
                  {quote.security_features_other && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-1">Additional Security Features</h4>
                      <p className="text-gray-700">{quote.security_features_other}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <span className="font-medium mr-2">High Value Items Present:</span>
                    <span>{quote.high_value_items ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
