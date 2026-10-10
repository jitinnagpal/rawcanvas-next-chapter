import { handleWhatsAppClick, WHATSAPP_DEFAULT_MESSAGE } from '@/utils/whatsapp';
import WhatsAppIcon from '@/components/WhatsAppIcon';

// Desktop only; on mobile the sticky bottom bar carries WhatsApp.
const FloatingWhatsApp = () => (
  <button
    onClick={() => handleWhatsAppClick(WHATSAPP_DEFAULT_MESSAGE, 'floating')}
    className="group fixed bottom-6 right-6 z-50 hidden md:flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp shadow-[0_6px_20px_rgba(0,0,0,0.14)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-whatsapp-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp focus-visible:ring-offset-2"
    aria-label="Chat with Mokha Designs on WhatsApp"
    title="Chat on WhatsApp"
  >
    <WhatsAppIcon className="h-7 w-7" tone="white" />
  </button>
);

export default FloatingWhatsApp;
