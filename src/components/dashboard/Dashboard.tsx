
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import mockQuotes from '@/data/mockQuotes';
import { ArrowRight, Plus, ArrowUpRight, Activity, FileCheck, AlertTriangle, Clock } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  
  // Count quotes by status
  const quoteStatusCounts = mockQuotes.reduce((acc, quote) => {
    acc[quote.status] = (acc[quote.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const statusData = [
    { name: 'Submitted', value: quoteStatusCounts.submitted || 0, color: '#3b82f6' },
    { name: 'Approved', value: quoteStatusCounts.approved || 0, color: '#22c55e' },
    { name: 'Bound', value: quoteStatusCounts.bound || 0, color: '#8b5cf6' },
    { name: 'Draft', value: quoteStatusCounts.draft || 0, color: '#9ca3af' },
    { name: 'Rejected', value: quoteStatusCounts.rejected || 0, color: '#ef4444' },
  ];
  
  const COLORS = ['#3b82f6', '#22c55e', '#8b5cf6', '#9ca3af', '#ef4444'];
  
  // Mock premium trend data
  const premiumTrendData = [
    { name: 'Mon', premium: 950 },
    { name: 'Tue', premium: 1200 },
    { name: 'Wed', premium: 800 },
    { name: 'Thu', premium: 1500 },
    { name: 'Fri', premium: 1100 },
    { name: 'Sat', premium: 700 },
    { name: 'Sun', premium: 900 },
  ];
  
  // Calculate total quotes and premium
  const totalQuotes = mockQuotes.length;
  const totalPremium = mockQuotes.reduce((total, quote) => total + quote.premium, 0);
  const submittedQuotes = mockQuotes.filter(quote => quote.status === 'submitted').length;
  const boundQuotes = mockQuotes.filter(quote => quote.status === 'bound').length;
  
  // Recent quotes (5 most recent)
  const recentQuotes = [...mockQuotes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'approved':
        return <FileCheck className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'bound':
        return <Activity className="h-5 w-5 text-purple-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="insurance-container">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold">Broker Dashboard</h1>
        <Button 
          className="mt-2 sm:mt-0 bg-insurance-yellow hover:bg-insurance-yellow-dark text-black"
          onClick={() => navigate('/quotes/new')}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Quote
        </Button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalQuotes}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalPremium.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{submittedQuotes}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Bound Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{boundQuotes}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Premium Trend</CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={selectedPeriod === 'week' ? 'bg-insurance-yellow text-black' : ''}
                  onClick={() => setSelectedPeriod('week')}
                >
                  Week
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={selectedPeriod === 'month' ? 'bg-insurance-yellow text-black' : ''}
                  onClick={() => setSelectedPeriod('month')}
                >
                  Month
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={selectedPeriod === 'year' ? 'bg-insurance-yellow text-black' : ''}
                  onClick={() => setSelectedPeriod('year')}
                >
                  Year
                </Button>
              </div>
            </div>
            <CardDescription>Premium amounts for new quotes over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={premiumTrendData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Premium']}
                    cursor={{ fill: 'rgba(255, 214, 0, 0.1)' }}
                  />
                  <Bar dataKey="premium" fill="#FFD600" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quote Status Distribution</CardTitle>
            <CardDescription>Breakdown of quotes by current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Quotes']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Quotes */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Quotes</CardTitle>
            <Button 
              variant="link" 
              className="text-insurance-black-light"
              onClick={() => navigate('/quotes')}
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <CardDescription>The most recently created insurance quotes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentQuotes.map((quote) => (
              <div 
                key={quote.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-insurance-gray-light cursor-pointer"
                onClick={() => navigate(`/quotes/${quote.id}`)}
              >
                <div className="flex items-center">
                  <div className="mr-4">
                    {getStatusIcon(quote.status)}
                  </div>
                  <div>
                    <div className="font-medium">
                      {quote.customerDetails.firstName} {quote.customerDetails.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {quote.propertyDetails.address.city}, {quote.propertyDetails.address.state} • Created {formatDate(quote.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-right mr-4">
                    <div className="font-medium">${quote.premium.toFixed(2)}</div>
                    <div className="text-xs text-gray-500 capitalize">{quote.status}</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="bg-insurance-gray-light">
          <Button 
            className="w-full bg-insurance-yellow hover:bg-insurance-yellow-dark text-black"
            onClick={() => navigate('/quotes/new')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Quote
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
