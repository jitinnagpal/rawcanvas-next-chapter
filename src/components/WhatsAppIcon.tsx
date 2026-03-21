import whatsappIcon from '@/assets/whatsapp-icon-white.png';

type WhatsAppIconProps = {
  className?: string;
  alt?: string;
  withBubble?: boolean;
};

const WhatsAppIcon = ({
  className = 'w-5 h-5',
  alt = 'WhatsApp icon',
  withBubble = false,
}: WhatsAppIconProps) => {
  if (withBubble) {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-whatsapp shadow-sm">
        <img src={whatsappIcon} alt={alt} className={className} />
      </span>
    );
  }

  return <img src={whatsappIcon} alt={alt} className={className} />;
};

export default WhatsAppIcon;