import { Palette, Hammer, Sofa, ArrowRight, Calculator, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { setGlobalEntryMode } from '@/hooks/useEntryMode';

const Services = () => {
  const services = [
    {
      icon: Palette,
      title: 'Interior Designing',
      description: 'Complete interior design solutions from concept to completion. We create spaces that reflect your personality and lifestyle.',
      features: ['Space Planning', 'Color Consultation', '3D Visualization', 'Material Selection']
    },
    {
      icon: Hammer,
      title: 'Contracting',
      description: 'Professional contracting services with reliable execution. We handle all construction and renovation needs.',
      features: ['Project Management', 'Quality Control', 'Timely Delivery', 'Licensed Contractors']
    },
    {
      icon: Sofa,
      title: 'Furnishing',
      description: 'Complete furnishing solutions with curated furniture and decor. We source the perfect pieces for your space.',
      features: ['Furniture Selection', 'Custom Pieces', 'Decor Styling', 'Installation Service']
    }
  ];

  const handleEstimateClick = () => {
    setGlobalEntryMode('estimate');
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleConsultClick = () => {
    setGlobalEntryMode('consult');
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

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="elegant-card group">
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
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
            onClick={handleEstimateClick}
          >
            <Calculator className="w-5 h-5 mr-2" />
            Get a Quick Estimate
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto"
            onClick={handleConsultClick}
          >
            <Phone className="w-5 h-5 mr-2" />
            Talk to a Designer
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;