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
                      filter: 'brightness(0.5) contrast(1.15)',
                      transform: currentSlide === index ? 'scale(1.08)' : 'scale(1)',
                    }}
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
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-8 md:pt-0">
        {/* Decorative line + tagline */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="block w-10 h-px bg-primary/50"></span>
          <p className="text-xs md:text-sm font-body uppercase tracking-[0.35em] text-primary/80">
            Defining Hyderabad's Modern Opulence
          </p>
          <span className="block w-10 h-px bg-primary/50"></span>
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-normal tracking-tight mb-5 leading-[1.15] text-foreground">
          Luxury Interiors — Designed Right,
          <span className="block italic text-primary">Executed Seamlessly</span>
        </h1>
        
        <p className="text-base md:text-lg text-foreground/60 max-w-2xl mx-auto mb-10 leading-relaxed font-body tracking-wide">
          End-to-end interior design for homes that demand both beauty and precision.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
          <Button 
            size="lg" 
            className={`cta-primary-btn px-10 py-4 text-base rounded-full ${showPulse ? 'animate-pulse-glow' : ''}`}
            onClick={handleWhatsApp}
          >
            <WhatsAppIcon className="w-5 h-5" withBubble />
            WhatsApp Us
          </Button>
          
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

        {/* Carousel Dots */}
        <div className="flex justify-center gap-2.5 mb-8">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`rounded-full transition-all duration-500 ${
                currentSlide === index 
                  ? 'w-8 h-2 bg-primary' 
                  : 'w-2 h-2 bg-foreground/30 hover:bg-foreground/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
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
