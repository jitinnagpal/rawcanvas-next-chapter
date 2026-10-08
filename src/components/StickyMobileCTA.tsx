import { handleWhatsAppClick, WHATSAPP_DEFAULT_MESSAGE } from '@/utils/whatsapp';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { setGlobalEntryMode } from '@/hooks/useEntryMode';
import { trackEstimateCostClicked } from '@/utils/analytics';

const StickyMobileCTA = () => {
  const handleWhatsApp = () => handleWhatsAppClick(WHATSAPP_DEFAULT_MESSAGE, 'sticky-bar');

  const handleBook = () => {
    setGlobalEntryMode('consult');
    trackEstimateCostClicked();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur border-t border-border px-4 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={handleWhatsApp}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-foreground text-foreground py-3 text-[15px] font-medium min-h-[48px]"
        >
          <WhatsAppIcon className="w-4 h-4" />
          WhatsApp
        </button>
        <button
          onClick={handleBook}
          className="flex-1 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground py-3 text-[15px] font-medium min-h-[48px]"
        >
          Book a design call
        </button>
      </div>
    </div>
  );
};

export default StickyMobileCTA;
