import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { handleWhatsAppClick } from '@/utils/whatsapp';

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
        handleWhatsAppClick(
          "Hi, I'd like to discuss my home interior project.",
          'floating'
        )
      }
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${
        pulse ? 'animate-pulse' : ''
      }`}
      style={{ backgroundColor: '#25D366' }}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white fill-white" />
    </button>
  );
};

export default FloatingWhatsApp;
