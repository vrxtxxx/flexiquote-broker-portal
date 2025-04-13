
import { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import BrokerDashboard from '../components/dashboard/BrokerDashboard';

const Index = () => {
  // Add logging to debug rendering
  useEffect(() => {
    console.log("Index page mounted");
  }, []);

  return (
    <Layout>
      <div className="animate-fade-in">
        <BrokerDashboard />
      </div>
    </Layout>
  );
};

export default Index;
