
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Quote } from '@/types';
import mockQuotes from '@/data/mockQuotes';
import { Eye, Pencil, MoreHorizontal, Trash2, FileCheck } from 'lucide-react';

export default function QuoteList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filter and sort quotes
  const filteredAndSortedQuotes = quotes
    .filter(quote => {
      // Filter by status
      if (statusFilter !== 'all' && quote.status !== statusFilter) {
        return false;
      }
      
      // Filter by search term
      const searchLower = searchTerm.toLowerCase();
      return (
        searchTerm === '' ||
        quote.customerDetails.firstName.toLowerCase().includes(searchLower) ||
        quote.customerDetails.lastName.toLowerCase().includes(searchLower) ||
        quote.customerDetails.email.toLowerCase().includes(searchLower) ||
        quote.propertyDetails.address.street.toLowerCase().includes(searchLower) ||
        quote.propertyDetails.address.city.toLowerCase().includes(searchLower) ||
        quote.propertyDetails.address.zipCode.includes(searchLower)
      );
    })
    .sort((a, b) => {
      let comparison = 0;
      
      // Sort by selected field
      if (sortBy === 'premium') {
        comparison = a.premium - b.premium;
      } else if (sortBy === 'customerName') {
        const nameA = `${a.customerDetails.lastName}, ${a.customerDetails.firstName}`;
        const nameB = `${b.customerDetails.lastName}, ${b.customerDetails.firstName}`;
        comparison = nameA.localeCompare(nameB);
      } else if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      
      // Apply sort order
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleViewQuote = (quoteId: string) => {
    navigate(`/quotes/${quoteId}`);
  };

  const handleEditQuote = (quoteId: string) => {
    navigate(`/quotes/${quoteId}/edit`);
  };

  const handleDeleteQuote = (quoteId: string) => {
    // In a real application, we would call an API to delete the quote
    setQuotes(quotes.filter(quote => quote.id !== quoteId));
    toast({
      title: "Quote Deleted",
      description: "The quote has been successfully removed."
    });
  };

  const handleBindQuote = (quoteId: string) => {
    // Update quote status to 'bound'
    const updatedQuotes = quotes.map(quote => 
      quote.id === quoteId
        ? { ...quote, status: 'bound' as const }
        : quote
    );
    
    setQuotes(updatedQuotes);
    
    toast({
      title: "Quote Bound",
      description: "The quote has been successfully bound to a policy."
    });
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

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

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
                  <SelectItem value="createdAt">Date Created</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="customerName">Customer Name</SelectItem>
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
            Showing {filteredAndSortedQuotes.length} of {quotes.length} quotes
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
              {filteredAndSortedQuotes.length > 0 ? (
                filteredAndSortedQuotes.map((quote) => (
                  <TableRow key={quote.id} className="hover:bg-insurance-gray-light">
                    <TableCell className="font-medium">{quote.id}</TableCell>
                    <TableCell>
                      {quote.customerDetails.firstName} {quote.customerDetails.lastName}
                      <div className="text-xs text-gray-500">{quote.customerDetails.email}</div>
                    </TableCell>
                    <TableCell>
                      <div>{quote.propertyDetails.address.street}</div>
                      <div className="text-xs text-gray-500">
                        {quote.propertyDetails.address.city}, {quote.propertyDetails.address.state} {quote.propertyDetails.address.zipCode}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">${quote.premium.toFixed(2)}</TableCell>
                    <TableCell>{formatDate(quote.createdAt)}</TableCell>
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
