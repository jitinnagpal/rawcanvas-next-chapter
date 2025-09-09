import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin } from 'lucide-react';
import logoImage from '/lovable-uploads/17cdb443-19b9-40e3-8046-4dbbe26e98af.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/rawcanvas.interior/', label: 'Instagram' },
    { icon: Facebook, href: 'https://www.facebook.com/rawcanvasinteriors', label: 'Facebook' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  const quickLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#services', label: 'Services' },
    { href: '#portfolio', label: 'Portfolio' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#contact', label: 'Contact' }
  ];

  const services = [
    'Interior Design',
    'Space Planning',
    'Project Management',
    'Furniture Selection',
    '3D Visualization',
    'Construction Management'
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container-max">
        {/* Main Footer Content */}
        <div className="section-padding">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <img 
                  src={logoImage} 
                  alt="Mokha Designs Logo" 
                  className="h-16 w-auto"
                />
              </div>
              
              <p className="text-secondary-foreground/80 mb-6 max-w-md leading-relaxed">
                Creating beautiful spaces with practical flow and stunning aesthetics. 
                We provide turnkey interior design solutions for residential and commercial projects.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <a href="tel:+919908392200" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                    +91 99083 92200
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <a href="mailto:rawcanvas22@gmail.com" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                    rawcanvas22@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-secondary-foreground/80">Hyderabad, India</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-heading font-semibold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <a 
                      href={link.href} 
                      className="text-secondary-foreground/80 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-heading font-semibold text-lg mb-6">Our Services</h4>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service}>
                    <span className="text-secondary-foreground/80">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-foreground/20 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-secondary-foreground/60 text-sm">
              © {currentYear} Raw Canvas Interiors. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-9 h-9 bg-secondary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
              
              <div className="flex items-center gap-6 text-sm text-secondary-foreground/60">
                <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;