import { ArrowDown, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-interior.jpg';

const Hero = () => {
  return (
    <section id="home" className="hero-section">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 via-secondary/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container-max px-6">
        <div className="max-w-4xl">
          <div className="glass-card p-8 md:p-12">
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6">
              Transform Your
              <span className="text-gradient block">Space</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Luxury interior design with turnkey solutions. We create beautiful spaces 
              with practical flow and stunning aesthetics.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                <a href="#contact">
                  <Phone className="w-5 h-5 mr-2" />
                  Free Consultation
                </a>
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/20 hover:text-white bg-transparent">
                <Mail className="w-5 h-5 mr-2" />
                View Portfolio
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