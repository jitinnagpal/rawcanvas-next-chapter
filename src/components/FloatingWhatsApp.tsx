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
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
        pulse ? 'animate-pulse' : ''
      }`}
      style={{ backgroundColor: '#0E6F63', boxShadow: '0 4px 12px rgba(0,0,0,0.18)' }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0A544C')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#0E6F63')}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white fill-white" />
    </button>
  );
};

export default FloatingWhatsApp;
