import { ArrowDown, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef, useEffect, useState } from 'react';
import { useEntryMode } from '@/hooks/useEntryMode';
import { trackEstimateCostClicked } from '@/utils/analytics';
import { handleWhatsAppClick, WHATSAPP_DEFAULT_MESSAGE } from '@/utils/whatsapp';
import WhatsAppIcon from '@/components/WhatsAppIcon';

const Hero = () => {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );
  const { setEntryMode } = useEntryMode();
  const [showPulse, setShowPulse] = useState(true);

  const images = [
    '/images/hero-new-1.jpg',
    '/images/hero-new-2.jpg',
    '/images/hero-new-3.jpg',
    '/images/hero-new-4.jpg',
    '/images/hero-new-5.jpg'
  ];

  // Stop pulse animation after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleEstimateCostClick = () => {
    setEntryMode('estimate');
    trackEstimateCostClicked();
    
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      // Auto-focus first field after scroll
      setTimeout(() => {
        const firstInput = contactSection.querySelector('input[name="name"]') as HTMLInputElement;
        if (firstInput) firstInput.focus();
      }, 800);
    }
  };

  const handleWhatsApp = () => {
    handleWhatsAppClick(WHATSAPP_DEFAULT_MESSAGE, 'hero');
  };

  return (
    <section id="home" className="hero-section">
      {/* Background Image Carousel */}
      <div className="absolute inset-0">
        <Carousel 
          className="w-full h-full" 
          opts={{ loop: true }}
          plugins={[plugin.current]}
        >
          <CarouselContent>
            {images.map((image, index) => (
                <CarouselItem key={index} className="h-full">
                  <div className="w-full h-full flex items-center justify-center bg-secondary">
                    <img
                      src={image}
                      alt={`Interior design showcase ${index + 1}`}
                      className="w-auto h-auto max-w-full max-h-full object-contain transition-opacity duration-1000"
                    />
                  </div>
                </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 via-secondary/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container-max px-6">
        <div className="max-w-4xl">
          <div className="glass-card p-8 md:p-12">
            <h1 className="text-4xl md:text-7xl font-heading font-bold text-white mb-6">
              Transform Your Space
              <span className="block">with <span className="text-gradient">Mokha Designs</span></span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Luxury interior design with turnkey solutions. We create beautiful spaces 
              with practical flow and stunning aesthetics.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              {/* Primary CTA - Chat on WhatsApp */}
              <Button 
                size="lg" 
                className={`cta-primary-btn font-semibold px-6 py-3 ${showPulse ? 'animate-pulse-glow' : ''}`}
                onClick={handleWhatsApp}
              >
                <WhatsAppIcon className="w-5 h-5" withBubble />
                Chat on WhatsApp
              </Button>
              
              {/* Secondary CTA - Get a Quick Estimate */}
              <Button 
                size="lg" 
                variant="outline"
                className="cta-secondary-btn-dark font-semibold"
                onClick={handleEstimateCostClick}
              >
                <Calculator className="w-5 h-5 mr-2" />
                Get a Quick Estimate
              </Button>
              <p className="text-white/60 text-xs sm:hidden mt-[-8px]">Get design ideas, budget & timeline in minutes</p>
              
              {/* Tertiary CTA - View Portfolio */}
              <Button 
                asChild 
                variant="ghost" 
                size="lg" 
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <a href="#portfolio">
                  View Portfolio →
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Designing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Contracting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Furnishing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
        <ArrowDown className="w-6 h-6" />
      </div>
    </section>
  );
};

export default Hero;