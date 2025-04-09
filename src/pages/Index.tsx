
import { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import StatsSection from '../components/landing/StatsSection';
import CtaSection from '../components/landing/CtaSection';

const Index = () => {
  // Add logging to debug rendering
  useEffect(() => {
    console.log("Index page mounted");
  }, []);

  return (
    <Layout>
      <div className="animate-fade-in">
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <TestimonialsSection />
        <CtaSection />
      </div>
    </Layout>
  );
};

export default Index;
