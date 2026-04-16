import { Calculator } from 'lucide-react';
import { handleWhatsAppClick, WHATSAPP_DEFAULT_MESSAGE } from '@/utils/whatsapp';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { setGlobalEntryMode } from '@/hooks/useEntryMode';
import { trackEstimateCostClicked } from '@/utils/analytics';

const StickyMobileCTA = () => {
  const handleWhatsApp = () => {
    handleWhatsAppClick(WHATSAPP_DEFAULT_MESSAGE, 'sticky-bar');
  };

  const handleEstimate = () => {
    setGlobalEntryMode('estimate');
    trackEstimateCostClicked();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden sticky-cta-bar py-3 px-4">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handleWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 bg-background/90 text-foreground font-sans font-semibold tracking-wide py-3 px-4 rounded-full text-sm"
        >
          <WhatsAppIcon className="w-4 h-4" />
          Let's Talk
        </button>
        <button
          onClick={handleEstimate}
          className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background font-sans font-semibold tracking-wide py-3 px-4 rounded-full text-sm"
        >
          <Calculator className="w-4 h-4" />
          Book a Design Call
        </button>
      </div>
    </div>
  );
};

export default StickyMobileCTA;
