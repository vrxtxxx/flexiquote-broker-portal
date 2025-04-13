
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import Layout from '../components/layout/Layout';
import BrokerDashboard from '../components/dashboard/BrokerDashboard';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Add logging to debug rendering
  useEffect(() => {
    console.log("Index page mounted");
    
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking auth session:', error);
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(!!data.session);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Check initial session
    checkSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-insurance-yellow"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {isAuthenticated ? (
        <div className="animate-fade-in">
          <BrokerDashboard />
        </div>
      ) : (
        <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center p-6 animate-fade-in">
          <div className="max-w-md text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-4">Welcome to <span className="text-insurance-yellow-dark">FlexiQuote</span></h1>
            <p className="mb-8 text-insurance-black-light">
              Please sign in to access your broker dashboard and manage your insurance quotes.
            </p>
            <Link to="/login">
              <Button size="lg" className="bg-insurance-black hover:bg-insurance-black-light">
                Sign in <LogIn className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Index;
