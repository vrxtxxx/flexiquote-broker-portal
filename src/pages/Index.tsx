
import Layout from '../components/layout/Layout';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import StatsSection from '../components/landing/StatsSection';
import CtaSection from '../components/landing/CtaSection';

const Index = () => {
  return (
    <Layout>
      <div className="animate-fade-in">
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <CtaSection />
      </div>
    </Layout>
  );
};

export default Index;
