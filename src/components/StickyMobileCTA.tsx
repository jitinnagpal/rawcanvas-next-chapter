import { useEffect, useState } from 'react';
import { handleWhatsAppClick, WHATSAPP_DEFAULT_MESSAGE } from '@/utils/whatsapp';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { setGlobalEntryMode } from '@/hooks/useEntryMode';
import { trackEstimateCostClicked } from '@/utils/analytics';

// Phones only. Hidden over the hero (which has its own CTA) and while the
// contact form is on screen, so it never doubles up or covers the form.
const StickyMobileCTA = () => {
  const [pastHero, setPastHero] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const contact = document.getElementById('contact');
    const io = contact
      ? new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting), { threshold: 0.05 })
      : null;
    if (contact && io) io.observe(contact);

    return () => {
      window.removeEventListener('scroll', onScroll);
      io?.disconnect();
    };
  }, []);

  const show = pastHero && !formVisible;

  const handleBook = () => {
    setGlobalEntryMode('consult');
    trackEstimateCostClicked();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      aria-hidden={!show}
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur border-t border-border px-4 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] transition-transform duration-300 ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => handleWhatsAppClick(WHATSAPP_DEFAULT_MESSAGE, 'sticky-bar')}
          tabIndex={show ? 0 : -1}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-foreground/70 text-foreground text-[15px] font-medium min-h-[44px]"
        >
          <WhatsAppIcon className="w-[18px] h-[18px]" />
          WhatsApp
        </button>
        <button
          onClick={handleBook}
          tabIndex={show ? 0 : -1}
          className="flex-1 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[15px] font-medium min-h-[44px]"
        >
          Book a design call
        </button>
      </div>
    </div>
  );
};

export default StickyMobileCTA;
