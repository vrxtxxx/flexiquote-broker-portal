
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import SupportTicketForm from '../components/support/SupportTicketForm';
import Chatbot from '../components/support/Chatbot';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, TicketPlus } from 'lucide-react';

const SupportPage = () => {
  const [activeTab, setActiveTab] = useState<string>("ticket");

  return (
    <Layout>
      <div className="insurance-container animate-fade-in">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Support Center</h1>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-insurance-yellow/10 border-insurance-yellow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <TicketPlus className="h-5 w-5 mr-2" />
                  Ticket Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Raise a support ticket for issues requiring attention from our specialists.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="bg-insurance-gray-light border-insurance-gray-medium">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Chat Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get immediate assistance with our intelligent support chatbot.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="bg-insurance-gray-light border-insurance-gray-medium">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                  Self-Help
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Browse our knowledge base for frequently asked questions and guides.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="ticket" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ticket" className="text-base">Raise a Ticket</TabsTrigger>
              <TabsTrigger value="chat" className="text-base">Chat Support</TabsTrigger>
            </TabsList>
            <TabsContent value="ticket" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Submit a Support Request</CardTitle>
                  <CardDescription>
                    Please provide details about your issue and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SupportTicketForm />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="chat" className="mt-6">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle>Chat with Support</CardTitle>
                  <CardDescription>
                    Our virtual assistant is here to help you 24/7.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden">
                  <Chatbot />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default SupportPage;
