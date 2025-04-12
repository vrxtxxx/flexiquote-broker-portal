
import { motion } from "framer-motion";
import { 
  PieChart, 
  LineChart, 
  BarChart3, 
  Users, 
  FileText, 
  Briefcase, 
  AlertCircle, 
  TrendingUp, 
  CheckCircle2, 
  Calendar, 
  Search 
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../ui/table";
import { useState } from "react";

const BrokerDashboard = () => {
  const [dateFilter, setDateFilter] = useState("today");

  // Mock data for the dashboard
  const recentQuotes = [
    { id: "Q-12345", client: "Acme Corp", type: "Fire & Burglary", premium: 1250.00, status: "Pending", date: "2025-04-10" },
    { id: "Q-12346", client: "Globex Inc", type: "Fire & Burglary", premium: 2350.00, status: "Approved", date: "2025-04-09" },
    { id: "Q-12347", client: "Stark Industries", type: "Fire & Burglary", premium: 5750.00, status: "Under Review", date: "2025-04-08" },
    { id: "Q-12348", client: "Wayne Enterprises", type: "Fire & Burglary", premium: 3450.00, status: "Approved", date: "2025-04-07" },
    { id: "Q-12349", client: "LexCorp", type: "Fire & Burglary", premium: 1850.00, status: "Declined", date: "2025-04-06" },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case "Approved": return "text-green-600";
      case "Pending": return "text-yellow-600";
      case "Under Review": return "text-blue-600";
      case "Declined": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Approved": return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "Pending": return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "Under Review": return <Search className="h-4 w-4 text-blue-600" />;
      case "Declined": return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-insurance-black sm:text-3xl">
                Broker Portal Dashboard
              </h1>
              <p className="mt-1 text-sm text-insurance-black-light">
                Welcome back! Here's an overview of your quotes and performance.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
              <Button className="bg-insurance-black text-white hover:bg-insurance-black-light">
                <FileText className="mr-2 h-4 w-4" />
                New Quote
              </Button>
              <Button variant="outline" className="border-insurance-gray-medium">
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
            </div>
          </div>
          
          {/* Date Filter Tabs */}
          <div className="mt-6 border-b border-insurance-gray-medium">
            <div className="flex space-x-6">
              {["today", "week", "month", "quarter"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setDateFilter(filter)}
                  className={`pb-3 px-1 text-sm font-medium ${
                    dateFilter === filter
                      ? "border-b-2 border-insurance-yellow text-insurance-black"
                      : "text-insurance-black-light hover:text-insurance-black"
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <FileText className="mr-2 h-4 w-4 text-insurance-yellow-dark" />
                Total Quotes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" /> 
                12% from last {dateFilter}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <Briefcase className="mr-2 h-4 w-4 text-insurance-yellow-dark" />
                Active Policies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" /> 
                8% from last {dateFilter}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <PieChart className="mr-2 h-4 w-4 text-insurance-yellow-dark" />
                Premium Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$147,250</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" /> 
                15% from last {dateFilter}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <Users className="mr-2 h-4 w-4 text-insurance-yellow-dark" />
                New Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" /> 
                4% from last {dateFilter}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity and Data Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quote Activity Table */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Recent Quotes</CardTitle>
                  <Button variant="link" className="text-insurance-yellow-dark">
                    View All
                  </Button>
                </div>
                <CardDescription>Your recent quote activity</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader className="bg-insurance-gray-light">
                    <TableRow>
                      <TableHead className="w-[120px]">Quote ID</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Premium</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentQuotes.map(quote => (
                      <TableRow key={quote.id} className="hover:bg-insurance-gray-light">
                        <TableCell className="font-medium">{quote.id}</TableCell>
                        <TableCell>{quote.client}</TableCell>
                        <TableCell>${quote.premium.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getStatusIcon(quote.status)}
                            <span className={`ml-1 text-sm ${getStatusColor(quote.status)}`}>
                              {quote.status}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Search className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          {/* Performance Cards */}
          <motion.div 
            className="lg:col-span-1 flex flex-col gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="shadow-sm h-full">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Performance Metrics</CardTitle>
                <CardDescription>Current performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Quote Approval Rate</span>
                    <span className="font-medium">76%</span>
                  </div>
                  <div className="w-full bg-insurance-gray-medium rounded-full h-2">
                    <div className="bg-insurance-yellow-dark h-2 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Client Retention</span>
                    <span className="font-medium">89%</span>
                  </div>
                  <div className="w-full bg-insurance-gray-medium rounded-full h-2">
                    <div className="bg-insurance-yellow-dark h-2 rounded-full" style={{ width: '89%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Response Time</span>
                    <span className="font-medium">2.3 hrs</span>
                  </div>
                  <div className="w-full bg-insurance-gray-medium rounded-full h-2">
                    <div className="bg-insurance-yellow-dark h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Monthly Goal</span>
                    <span className="font-medium">82%</span>
                  </div>
                  <div className="w-full bg-insurance-gray-medium rounded-full h-2">
                    <div className="bg-insurance-yellow-dark h-2 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-insurance-gray-medium">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Detailed Analytics
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        {/* Tasks and Reminders */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  <Calendar className="h-5 w-5 inline mr-2 text-insurance-yellow-dark" />
                  Upcoming Renewals
                </CardTitle>
                <Button variant="link" className="text-insurance-yellow-dark">
                  View Calendar
                </Button>
              </div>
              <CardDescription>Policies due for renewal in the next 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { client: "Acme Corp", policyId: "P-78901", type: "Fire & Burglary", renewalDate: "2025-04-25", premium: 3420 },
                  { client: "Globex Inc", policyId: "P-78902", type: "Fire & Burglary", renewalDate: "2025-05-02", premium: 5680 },
                  { client: "Stark Industries", policyId: "P-78903", type: "Fire & Burglary", renewalDate: "2025-05-08", premium: 12450 }
                ].map((policy, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-insurance-gray-light rounded-lg hover:bg-insurance-gray-medium cursor-pointer">
                    <div>
                      <h4 className="font-medium">{policy.client}</h4>
                      <div className="text-sm text-insurance-black-light">
                        {policy.policyId} • {policy.type}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${policy.premium.toLocaleString()}</div>
                      <div className="text-sm text-insurance-black-light">
                        Renewal: {new Date(policy.renewalDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BrokerDashboard;
