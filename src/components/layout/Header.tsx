
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { Home, List, PlusCircle, LogIn, LogOut, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/');
    }
  };

  return (
    <header className="bg-white border-b border-insurance-gray-medium">
      <div className="insurance-container">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="bg-insurance-yellow rounded-md p-2 mr-2">
                <Home className="h-5 w-5 text-black" />
              </div>
              <span className="text-xl font-bold text-black">FlexiQuote</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="flex items-center text-insurance-black-light hover:text-black">
              <Home className="h-4 w-4 mr-1" />
              <span>Home</span>
            </Link>
            
            {isAuthenticated && (
              <>
                <Link to="/quotes" className="flex items-center text-insurance-black-light hover:text-black">
                  <List className="h-4 w-4 mr-1" />
                  <span>Quote List</span>
                </Link>
                <Link to="/quotes/new" className="flex items-center text-insurance-black-light hover:text-black">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  <span>New Quote</span>
                </Link>
              </>
            )}
            
            {isAuthenticated ? (
              <Button 
                variant="outline" 
                size="sm"
                className="border-insurance-gray-medium text-insurance-black-light hover:bg-insurance-gray-light"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            ) : (
              <Link to="/login">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-insurance-gray-medium text-insurance-black-light hover:bg-insurance-gray-light"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </Button>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-insurance-black-light p-2 rounded-md hover:bg-insurance-gray-light focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-3 pb-4 border-t border-insurance-gray-medium">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="flex items-center px-2 py-2 text-insurance-black-light hover:bg-insurance-gray-light rounded-md"
                onClick={() => setIsOpen(false)}
              >
                <Home className="h-5 w-5 mr-2" />
                <span>Home</span>
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link 
                    to="/quotes" 
                    className="flex items-center px-2 py-2 text-insurance-black-light hover:bg-insurance-gray-light rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    <List className="h-5 w-5 mr-2" />
                    <span>Quote List</span>
                  </Link>
                  <Link 
                    to="/quotes/new" 
                    className="flex items-center px-2 py-2 text-insurance-black-light hover:bg-insurance-gray-light rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    <span>New Quote</span>
                  </Link>
                </>
              )}
              
              {isAuthenticated ? (
                <button 
                  className="flex items-center px-2 py-2 text-insurance-black-light hover:bg-insurance-gray-light rounded-md"
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Logout</span>
                </button>
              ) : (
                <Link 
                  to="/login" 
                  className="flex items-center px-2 py-2 text-insurance-black-light hover:bg-insurance-gray-light rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  <span>Login</span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
