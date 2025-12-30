import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Portfolio from '@/components/Portfolio';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { setGlobalEntryMode } from '@/hooks/useEntryMode';

const Index = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const intentParam = searchParams.get('intent');
    
    if (intentParam === 'estimate' || intentParam === 'consultation') {
      setGlobalEntryMode(intentParam === 'estimate' ? 'estimate' : 'consult');
      
      // Scroll to contact section after a brief delay for render
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
