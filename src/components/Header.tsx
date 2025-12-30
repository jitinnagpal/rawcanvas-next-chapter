import { useState, useEffect } from 'react';
import { Menu, X, Phone, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { setGlobalEntryMode } from '@/hooks/useEntryMode';
import { trackTopCtaClicked } from '@/utils/analytics';

const logoImage = '/lovable-uploads/999fcb58-9950-43a9-8aaa-df494205944f.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#services', label: 'Services' },
    { href: '#portfolio', label: 'Portfolio' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#contact', label: 'Contact' }
  ];

  const handleEstimateCostClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setGlobalEntryMode('estimate');
    trackTopCtaClicked('estimate_cost');
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleFreeConsultationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setGlobalEntryMode('consult');
    trackTopCtaClicked('free_consultation');
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <nav className="container-max">
        <div className="flex items-center justify-between h-20 px-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src={logoImage} 
              alt="Mokha Designs Logo" 
              className="h-16 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button 
              size="sm" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
              onClick={handleEstimateCostClick}
            >
              <Calculator className="w-4 h-4 mr-2" />
              Get a Cost Preview
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-primary/40 text-primary bg-transparent hover:bg-primary/10 hover:text-primary"
              onClick={handleFreeConsultationClick}
            >
              <Phone className="w-4 h-4 mr-2" />
              Talk to a Designer
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border">
            <div className="px-6 py-4 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block text-foreground hover:text-primary transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 mt-4">
                <Button 
                  size="sm" 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                  onClick={handleEstimateCostClick}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Get a Cost Preview
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-primary/40 text-primary bg-transparent hover:bg-primary/10 hover:text-primary"
                  onClick={handleFreeConsultationClick}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Talk to a Designer
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
