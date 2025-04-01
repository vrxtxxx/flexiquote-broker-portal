
import { ReactNode, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  // Add logging to debug rendering
  useEffect(() => {
    console.log("Layout component mounted");
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-insurance-gray-light">
        {children}
      </main>
      <Footer />
    </div>
  );
}
