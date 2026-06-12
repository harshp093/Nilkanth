import React from 'react';
import { IconBrandWhatsapp } from '@tabler/icons-react';

const WhatsAppButton: React.FC = () => {
  const phoneNumber = '919408461000';
  const message = 'Hi, I\'m interested in a product from your catalog.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:shadow-[0_0_20px_rgba(37,211,102,0.5)] transition-all duration-300 z-50 flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      <IconBrandWhatsapp size={32} />
      <span className="absolute right-full mr-4 bg-white text-dark text-sm font-medium py-2 px-4 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        Chat with us
      </span>
    </a>
  );
};

export default WhatsAppButton;
