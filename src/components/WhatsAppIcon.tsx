import whatsappIcon from '@/assets/whatsapp-icon-green.png';

type WhatsAppIconProps = {
  className?: string;
  alt?: string;
};

const WhatsAppIcon = ({ className = 'w-5 h-5', alt = 'WhatsApp icon' }: WhatsAppIconProps) => {
  return <img src={whatsappIcon} alt={alt} className={className} />;
};

export default WhatsAppIcon;