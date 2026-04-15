import { useState, useEffect } from 'react';
import { handleWhatsAppClick, WHATSAPP_DEFAULT_MESSAGE } from '@/utils/whatsapp';
import WhatsAppIcon from '@/components/WhatsAppIcon';

const FloatingWhatsApp = () => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <button
      onClick={() =>
        handleWhatsAppClick(WHATSAPP_DEFAULT_MESSAGE, 'floating')
      }
      className={`fixed bottom-20 md:bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center border border-whatsapp bg-transparent transition-all hover:scale-110 ${
        pulse ? 'animate-pulse' : ''
      }`}
      style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'border-color 200ms ease-in-out, box-shadow 200ms ease-in-out, transform 200ms ease-in-out' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'hsl(var(--whatsapp-hover))')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'hsl(var(--whatsapp))')}
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon className="w-5 h-5" withBubble />
    </button>
  );
};

export default FloatingWhatsApp;
