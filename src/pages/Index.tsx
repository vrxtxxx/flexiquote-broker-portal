
import { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Dashboard from '../components/dashboard/Dashboard';

const Index = () => {
  // Add logging to debug rendering
  useEffect(() => {
    console.log("Index page mounted");
  }, []);

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
};

export default Index;
