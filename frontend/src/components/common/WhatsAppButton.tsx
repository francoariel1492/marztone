import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  url: string;
  label: string;
  variant?: 'inline' | 'floating';
}

export function WhatsAppButton({ url, label, variant = 'inline' }: WhatsAppButtonProps) {
  if (variant === 'floating') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="btn-whatsapp fixed bottom-6 right-6 z-40 !h-14 !w-14 !rounded-full !p-0 shadow-warm"
      >
        <MessageCircle size={26} aria-hidden />
      </a>
    );
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
      <MessageCircle size={18} aria-hidden />
      {label}
    </a>
  );
}
