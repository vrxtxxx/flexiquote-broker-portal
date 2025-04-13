
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-insurance-yellow-light p-4">
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-insurance-yellow"
            style={{
              width: Math.random() * 30 + 10,
              height: Math.random() * 30 + 10,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.8,
              delay: Math.random() * 0.5,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: Math.random() * 5 + 5,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        <Link to="/" className="flex items-center justify-center mb-8">
          <div className="bg-insurance-yellow rounded-md p-2 mr-2">
            <LogIn className="h-5 w-5 text-black" />
          </div>
          <span className="text-2xl font-bold text-insurance-black">FlexiQuote</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-insurance-gray-medium">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Sign in</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="email" 
                      placeholder="Email" 
                      className="pl-10" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Password" 
                      className="pl-10" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-insurance-black hover:bg-insurance-black-light" disabled={isLoading}>
                  {isLoading ? (
                    <motion.div
                      className="h-5 w-5 border-2 border-t-transparent border-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <>
                      Sign in <LogIn className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-muted-foreground">
                <a href="#" className="underline underline-offset-4 hover:text-primary">
                  Forgot your password?
                </a>
              </div>
              <div className="text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="underline underline-offset-4 hover:text-primary">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
