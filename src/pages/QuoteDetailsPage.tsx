
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import Layout from '../components/layout/Layout';
import QuoteDetails from '../components/quotes/QuoteDetails';
import { supabase } from '@/integrations/supabase/client';

const QuoteDetailsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is authenticated
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking auth session:', error);
        toast({
          title: 'Authentication Error',
          description: 'Please log in to view quote details.',
          variant: 'destructive',
        });
        navigate('/login');
        return;
      }
      
      if (!data.session) {
        toast({
          title: 'Authentication Required',
          description: 'You must be logged in to access this page.',
          variant: 'destructive',
        });
        navigate('/login');
      }
    };
    
    checkSession();
  }, [navigate, toast]);

  return (
    <Layout>
      <QuoteDetails />
    </Layout>
  );
};

export default QuoteDetailsPage;
