import { Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
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
                <div className="w-full h-full">
                  <img
                    src={image}
                    alt={`Interior design showcase ${index + 1}`}
                    className="w-full h-full object-cover"
                    style={{ filter: 'brightness(0.55) contrast(1.15)' }}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50"></div>
      </div>

      {/* Content — Centered */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-8 md:pt-0">
        <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-6 leading-tight">
          <span className="text-primary">Defining Hyderabad's</span>
          <span className="block text-foreground">Modern Opulence</span>
        </h1>
        
        <p className="text-lg md:text-xl text-foreground/85 max-w-3xl mx-auto mb-10 leading-relaxed font-body">
          Mokha Designs crafts breathtaking spaces where luxury meets legacy.
          Turnkey interior design with stunning aesthetics and practical flow.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
          {/* Primary CTA - WhatsApp */}
          <Button 
            size="lg" 
            className={`cta-primary-btn px-10 py-4 text-base rounded-full ${showPulse ? 'animate-pulse-glow' : ''}`}
            onClick={handleWhatsApp}
          >
            <WhatsAppIcon className="w-5 h-5" withBubble />
            WhatsApp Us
          </Button>
          
          {/* Secondary CTA - Estimate */}
          <Button 
            size="lg" 
            variant="outline"
            className="cta-secondary-btn-dark px-10 py-4 text-base rounded-full"
            onClick={handleEstimateCostClick}
          >
            <Calculator className="w-5 h-5 mr-2" />
            Get an Estimate
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-8 text-foreground/70 text-sm font-heading tracking-wide uppercase">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            <span>Designing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            <span>Contracting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            <span>Furnishing</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
