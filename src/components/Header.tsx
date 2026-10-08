import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { setGlobalEntryMode } from '@/hooks/useEntryMode';
import { trackEstimateCostClicked } from '@/utils/analytics';

const navItems = [
  { href: '/#work', label: 'Work' },
  { href: '/#approach', label: 'Approach' },
  { href: '/#studio', label: 'Studio' },
  { href: '/#contact', label: 'Contact' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToContact = (e: React.MouseEvent) => {
    setGlobalEntryMode('consult');
    trackEstimateCostClicked();
    setIsMenuOpen(false);
    if (location.pathname === '/') {
      e.preventDefault();
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur border-b border-border' : 'bg-background'
      }`}
    >
      <nav className="container-max flex items-center justify-between gap-6 px-5 md:px-10 h-[76px]">
        <Link to="/" className="flex items-baseline gap-2.5" onClick={() => setIsMenuOpen(false)}>
          <span className="text-[21px] font-semibold tracking-[0.02em] text-foreground">Mokha Designs</span>
          <span className="hidden sm:inline text-[13px] text-muted-foreground">Hyderabad</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-[15px]">
          {navItems.slice(0, 3).map((item) => (
            <a key={item.href} href={item.href} className="text-foreground hover:text-muted-foreground transition-colors">
              {item.label}
            </a>
          ))}
          <a href="/#contact" onClick={goToContact} className="btn-ink !py-2.5 !min-h-0 !text-[15px]">
            Book a design call
          </a>
        </div>

        <button
          className="md:hidden p-2 -mr-2 text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-5 py-6 flex flex-col gap-5 text-[18px]">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-foreground"
                onClick={item.href === '/#contact' ? goToContact : () => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a href="/#contact" onClick={goToContact} className="btn-ink mt-2">
              Book a design call
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
