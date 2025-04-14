
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import QuoteListPage from "./pages/QuoteListPage";
import QuoteFormPage from "./pages/QuoteFormPage";
import QuoteDetailsPage from "./pages/QuoteDetailsPage";
import SupportPage from "./pages/SupportPage";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  // Add logging to debug the rendering
  useEffect(() => {
    console.log("App component mounted");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/quotes" element={<QuoteListPage />} />
            <Route path="/quotes/new" element={<QuoteFormPage />} />
            <Route path="/quotes/:id" element={<QuoteDetailsPage />} />
            <Route path="/quotes/:id/edit" element={<QuoteFormPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
