
import { motion } from "framer-motion";
import { PlusCircle, FileText, ClipboardList, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

const BrokerDashboard = () => {
  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-insurance-black sm:text-4xl">
            Welcome to <span className="text-insurance-yellow-dark">FlexiQuote</span> Broker Portal
          </h1>
          <p className="mt-4 text-lg leading-8 text-insurance-black-light">
            Manage your domestic fire and burglary policy quotes with ease
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <Link to="/quotes/new">
            <Button size="lg" className="group bg-insurance-black text-white hover:bg-insurance-black-light w-full md:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create New Quote
            </Button>
          </Link>
          <Link to="/quotes">
            <Button size="lg" variant="outline" className="group text-insurance-black border-insurance-gray-medium hover:bg-insurance-gray-light w-full md:w-auto">
              <ClipboardList className="mr-2 h-5 w-5" />
              View All Quotes
            </Button>
          </Link>
        </motion.div>

        {/* Dashboard Cards */}
        <motion.div 
          className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, staggerChildren: 0.1 }}
        >
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-insurance-yellow-dark" />
                Recent Quotes
              </CardTitle>
              <CardDescription>View and manage your recent quotes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-insurance-black-light">
                Access your most recently created quotes, check their status, and make updates as needed.
              </p>
              <div className="mt-4">
                <Link to="/quotes">
                  <Button variant="link" className="p-0 text-insurance-yellow-dark hover:text-insurance-black">
                    View Recent Quotes →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClipboardList className="h-5 w-5 mr-2 text-insurance-yellow-dark" />
                Quote Management
              </CardTitle>
              <CardDescription>Organize and track your submitted quotes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-insurance-black-light">
                Filter quotes by status, search for specific clients, and track the progress of your submissions.
              </p>
              <div className="mt-4">
                <Link to="/quotes">
                  <Button variant="link" className="p-0 text-insurance-yellow-dark hover:text-insurance-black">
                    Manage Quotes →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-insurance-yellow-dark" />
                Tools & Resources
              </CardTitle>
              <CardDescription>Access broker-specific tools</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-insurance-black-light">
                Use our premium calculator, access policy documents, and find resources to help streamline your workflow.
              </p>
              <div className="mt-4">
                <Link to="/quotes/new">
                  <Button variant="link" className="p-0 text-insurance-yellow-dark hover:text-insurance-black">
                    Access Tools →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-20 rounded-2xl bg-insurance-gray-light p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-insurance-black">Ready to start quoting?</h2>
          <p className="mt-2 text-insurance-black-light">
            Create comprehensive domestic fire and burglary policy quotes for your clients in minutes.
          </p>
          <div className="mt-6">
            <Link to="/quotes/new">
              <Button size="lg" className="bg-insurance-yellow text-insurance-black hover:bg-insurance-yellow-dark">
                Create New Quote
                <PlusCircle className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BrokerDashboard;
