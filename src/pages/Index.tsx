
import Layout from '../components/layout/Layout';
import { motion } from "framer-motion";
import { PlusCircle, FileText, ClipboardList, Users, Settings, Activity, BarChart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

const Index = () => {
  return (
    <Layout>
      <div className="bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold tracking-tight text-insurance-black sm:text-4xl">
              Broker <span className="text-insurance-yellow-dark">Dashboard</span>
            </h1>
            <p className="mt-2 text-lg text-insurance-black-light">
              Manage quotes and policies for your customers
            </p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <Link to="/quotes/new" className="md:col-span-1">
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer bg-insurance-yellow/10">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <PlusCircle className="h-10 w-10 mb-2 text-insurance-yellow-dark" />
                  <p className="font-semibold text-center">New Quote</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/quotes" className="md:col-span-1">
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <FileText className="h-10 w-10 mb-2 text-insurance-black-light" />
                  <p className="font-semibold text-center">Quote List</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/customers" className="md:col-span-1">
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Users className="h-10 w-10 mb-2 text-insurance-black-light" />
                  <p className="font-semibold text-center">Customers</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/settings" className="md:col-span-1">
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Settings className="h-10 w-10 mb-2 text-insurance-black-light" />
                  <p className="font-semibold text-center">Settings</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Quotes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">247</div>
                <p className="text-xs text-gray-500 mt-1">+12% from last month</p>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Active Policies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">156</div>
                <p className="text-xs text-gray-500 mt-1">+8% from last month</p>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">128</div>
                <p className="text-xs text-gray-500 mt-1">+5% from last month</p>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Premium Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$523K</div>
                <p className="text-xs text-gray-500 mt-1">+15% from last month</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity and Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-insurance-yellow-dark" />
                      Recent Activity
                    </CardTitle>
                    <Button variant="link" className="text-insurance-black-light">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: 1, action: "Quote created", customer: "John Smith", time: "2 hours ago", status: "New" },
                      { id: 2, action: "Policy bound", customer: "Sarah Johnson", time: "5 hours ago", status: "Completed" },
                      { id: 3, action: "Quote updated", customer: "Robert Chen", time: "Yesterday", status: "Updated" },
                      { id: 4, action: "Quote submitted", customer: "Maria Garcia", time: "Yesterday", status: "Pending" },
                      { id: 5, action: "Policy renewed", customer: "David Wilson", time: "2 days ago", status: "Completed" },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-insurance-gray-light cursor-pointer">
                        <div>
                          <div className="font-medium">{item.action}</div>
                          <div className="text-xs text-gray-500">{item.customer} • {item.time}</div>
                        </div>
                        <div className="flex items-center">
                          <span 
                            className={`text-xs px-2 py-1 rounded-full ${
                              item.status === "New" ? "bg-blue-100 text-blue-800" :
                              item.status === "Completed" ? "bg-green-100 text-green-800" :
                              item.status === "Updated" ? "bg-yellow-100 text-yellow-800" :
                              "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Performance Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-insurance-yellow-dark" />
                    Performance Overview
                  </CardTitle>
                  <CardDescription>
                    Your recent business performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Quote Conversion Rate</span>
                      <span className="font-medium">68%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-insurance-yellow h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Customer Retention</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-insurance-yellow h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Policy Renewal Rate</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-insurance-yellow h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Quote Processing Time</span>
                      <span className="font-medium">1.3 days</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-insurance-yellow h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
