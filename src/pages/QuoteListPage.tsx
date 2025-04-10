
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import Layout from '../components/layout/Layout';
import QuoteList from '../components/quotes/QuoteList';
import { supabase } from '@/integrations/supabase/client';

const QuoteListPage = () => {
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
          description: 'Please log in to view quotes.',
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
      <QuoteList />
    </Layout>
  );
};

export default QuoteListPage;
