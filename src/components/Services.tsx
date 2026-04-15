import { Palette, Hammer, Sofa, ArrowRight, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { setGlobalEntryMode } from '@/hooks/useEntryMode';
import { handleWhatsAppClick, WHATSAPP_DEFAULT_MESSAGE } from '@/utils/whatsapp';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { useRef, useState, useEffect, useCallback } from 'react';

const Services = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const services = [
    {
      icon: Palette,
      title: 'Interior Designing',
      description: 'Complete interior design solutions from concept to completion. We create spaces that reflect your personality and lifestyle.',
      features: ['Space Planning', 'Color Consultation', '3D Visualization', 'Material Selection'],
      showWhatsAppLink: false,
    },
    {
      icon: Hammer,
      title: 'Contracting',
      description: 'Professional contracting services with reliable execution. We handle all construction and renovation needs.',
      features: ['Project Management', 'Quality Control', 'Timely Delivery', 'Licensed Contractors'],
      showWhatsAppLink: false,
    },
    {
      icon: Sofa,
      title: 'Furnishing',
      description: 'Complete furnishing solutions with curated furniture and decor. We source the perfect pieces for your space.',
      features: ['Furniture Selection', 'Custom Pieces', 'Decor Styling', 'Installation Service'],
      showWhatsAppLink: false,
    }
  ];

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const cardWidth = el.scrollWidth / services.length;
    setActiveIndex(Math.round(scrollLeft / cardWidth));
  }, [services.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / services.length;
    el.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
  };

  const handleEstimateClick = () => {
    setGlobalEntryMode('estimate');
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="section-padding">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Turnkey Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From initial design concepts to final furnishing, we provide comprehensive 
            interior design services that transform your vision into reality.
          </p>
        </div>

        <div
          ref={scrollRef}
          className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide"
        >
          {services.map((service, index) => (
            <div key={index} className="elegant-card group min-w-[85vw] md:min-w-0 snap-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-foreground mb-4">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              <ul className="space-y-3 mb-6">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button variant="ghost" className="w-full justify-between group-hover:bg-primary/5">
                Learn More
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              {service.showWhatsAppLink && (
                <button
                  onClick={() => handleWhatsAppClick(WHATSAPP_DEFAULT_MESSAGE, 'services')}
                  className="whatsapp-inline-link w-full text-left text-sm font-medium mt-2 hover:underline flex items-center gap-1"
                >
                  Ask about this on WhatsApp <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Carousel dots - mobile only */}
        <div className="flex justify-center gap-2.5 mt-6 md:hidden">
          {services.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`rounded-full transition-all duration-500 ${
                activeIndex === index
                  ? 'w-8 h-2 bg-primary'
                  : 'w-2 h-2 bg-foreground/30 hover:bg-foreground/50'
              }`}
              aria-label={`Go to service ${index + 1}`}
            />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <Button 
            size="lg" 
            className="cta-primary-btn w-full sm:w-auto"
            onClick={() => handleWhatsAppClick(WHATSAPP_DEFAULT_MESSAGE, 'services')}
          >
            <WhatsAppIcon className="w-5 h-5" withBubble />
            Chat on WhatsApp
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="cta-secondary-btn w-full sm:w-auto"
            onClick={handleEstimateClick}
          >
            <Calculator className="w-5 h-5 mr-2" />
            Get a Quick Estimate
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;