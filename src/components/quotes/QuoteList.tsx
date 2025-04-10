
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Eye, Pencil, MoreHorizontal, Trash2, FileCheck } from 'lucide-react';

export default function QuoteList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  // Fetch quotes
  const { data: quotes = [], isLoading, error } = useQuery({
    queryKey: ['quotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order(sortBy, { ascending: sortOrder === 'asc' });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Delete quote mutation
  const deleteMutation = useMutation({
    mutationFn: async (quoteId: string) => {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', quoteId);
      
      if (error) throw error;
      return quoteId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast({
        title: "Quote Deleted",
        description: "The quote has been successfully removed."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete quote: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Update quote status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ quoteId, status }: { quoteId: string, status: string }) => {
      const { error } = await supabase
        .from('quotes')
        .update({ status })
        .eq('id', quoteId);
      
      if (error) throw error;
      return { quoteId, status };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast({
        title: "Status Updated",
        description: `The quote has been ${data.status === 'bound' ? 'bound to a policy' : 'updated'}.`
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

  // Filter and sort quotes
  const filteredQuotes = quotes.filter(quote => {
    // Filter by status
    if (statusFilter !== 'all' && quote.status !== statusFilter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        quote.full_name?.toLowerCase().includes(searchLower) ||
        quote.email?.toLowerCase().includes(searchLower) ||
        quote.residential_address?.toLowerCase().includes(searchLower) ||
        quote.id?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const handleViewQuote = (quoteId: string) => {
    navigate(`/quotes/${quoteId}`);
  };

  const handleEditQuote = (quoteId: string) => {
    navigate(`/quotes/${quoteId}/edit`);
  };

  const handleDeleteQuote = (quoteId: string) => {
    if (confirm("Are you sure you want to delete this quote?")) {
      deleteMutation.mutate(quoteId);
    }
  };

  const handleBindQuote = (quoteId: string) => {
    updateStatusMutation.mutate({ quoteId, status: 'bound' });
  };

  const getStatusBadgeClass = (status: string) => {
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

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading quotes...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error loading quotes: {(error as Error).message}</div>;
  }

  return (
    <div className="insurance-container">
      <h1 className="text-3xl font-bold mb-6">Quote List</h1>
      
      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="w-full md:w-1/3">
            <Input
              placeholder="Search quotes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-40">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="bound">Bound</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-40">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Date Created</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="full_name">Customer Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-40">
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-4">
          <p className="text-sm text-gray-500">
            Showing {filteredQuotes.length} of {quotes.length} quotes
          </p>
          <Button 
            className="bg-insurance-yellow hover:bg-insurance-yellow-dark text-black"
            onClick={() => navigate('/quotes/new')}
          >
            Create New Quote
          </Button>
        </div>
      </div>
      
      {/* Quotes Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Property Address</TableHead>
                <TableHead>Premium</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotes.length > 0 ? (
                filteredQuotes.map((quote) => (
                  <TableRow key={quote.id} className="hover:bg-insurance-gray-light">
                    <TableCell className="font-medium">{quote.id.slice(0, 8)}</TableCell>
                    <TableCell>
                      {quote.full_name}
                      <div className="text-xs text-gray-500">{quote.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">{quote.residential_address}</div>
                    </TableCell>
                    <TableCell className="font-medium">${Number(quote.premium).toFixed(2)}</TableCell>
                    <TableCell>{formatDate(quote.created_at)}</TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(quote.status)}`}>
                        {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewQuote(quote.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          
                          {quote.status !== 'bound' && (
                            <>
                              <DropdownMenuItem onClick={() => handleEditQuote(quote.id)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Edit Quote</span>
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator />
                              
                              <DropdownMenuItem onClick={() => handleBindQuote(quote.id)}>
                                <FileCheck className="mr-2 h-4 w-4" />
                                <span>Bind to Policy</span>
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem
                                onClick={() => handleDeleteQuote(quote.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    {searchTerm || statusFilter !== 'all' ? (
                      <div>
                        <p className="text-lg font-medium">No matching quotes found</p>
                        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg font-medium">No quotes available</p>
                        <Button 
                          className="mt-2 bg-insurance-yellow hover:bg-insurance-yellow-dark text-black"
                          onClick={() => navigate('/quotes/new')}
                        >
                          Create New Quote
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
