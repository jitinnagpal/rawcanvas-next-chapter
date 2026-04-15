import { Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef, useEffect, useState, useCallback } from 'react';
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

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

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrentSlide(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on('select', onSelect);
    return () => { api.off('select', onSelect); };
  }, [api, onSelect]);

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
          setApi={setApi}
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index} className="h-full">
                <div className="w-full h-full overflow-hidden">
                  <img
                    src={image}
                    alt={`Interior design showcase ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-[8000ms] ease-out"
                    style={{ 
                      filter: 'brightness(0.35) contrast(1.1)',
                      transform: currentSlide === index ? 'scale(1.08)' : 'scale(1)',
                    }}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-xl mx-auto">
        {/* Tagline */}
        <p className="text-[10px] md:text-xs tracking-[0.35em] text-foreground/70 uppercase font-heading mb-12 md:mb-16">
          Defining Hyderabad's Modern Opulence
        </p>

        {/* Headline */}
        <h1 className="text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl font-body font-medium tracking-tight leading-[1.2] mb-5 text-foreground">
          Luxury Interiors — Designed Right, Executed Seamlessly
        </h1>
        
        {/* Subtext */}
        <p className="text-sm md:text-lg text-foreground/60 max-w-md mx-auto mb-10 leading-relaxed font-body">
          End-to-end interior design for homes that demand both beauty and precision.
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-3 max-w-xs mx-auto mb-12">
          <Button 
            size="lg" 
            variant="outline"
            className="cta-secondary-btn-dark px-8 py-4 text-[13px] rounded-lg font-heading font-medium uppercase tracking-[0.15em]"
            onClick={handleEstimateCostClick}
          >
            Book a Design Consultation
          </Button>

          <Button 
            size="lg" 
            className={`cta-primary-btn px-8 py-4 text-[13px] rounded-lg font-heading font-medium uppercase tracking-[0.15em] ${showPulse ? 'animate-pulse-glow' : ''}`}
            onClick={handleWhatsApp}
          >
            <WhatsAppIcon className="w-5 h-5" withBubble />
            Let's Talk
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="flex justify-center items-center gap-6 pt-8 border-t border-foreground/10">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            <span className="text-sm text-foreground/50 font-heading tracking-wide">Designing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            <span className="text-sm text-foreground/50 font-heading tracking-wide">Contracting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            <span className="text-sm text-foreground/50 font-heading tracking-wide">Furnishing</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
