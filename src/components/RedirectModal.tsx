import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  X
} from 'lucide-react';
import { Product } from '../types';
import { formatCurrency, PLATFORM_CONFIG } from '../utils/helpers';

interface RedirectModalProps {
  product: Product | null;
  onClose: () => void;
}

export const RedirectModal: React.FC<RedirectModalProps> = ({
  product,
  onClose,
}) => {
  const [countdown, setCountdown] = useState(2);
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    if (!product) return;
    setCountdown(2);
    setHasOpened(false);

    // Countdown interval
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [product]);

  useEffect(() => {
    if (countdown === 0 && product && !hasOpened) {
      setHasOpened(true);
      window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
    }
  }, [countdown, product, hasOpened]);

  if (!product) return null;

  const platform = PLATFORM_CONFIG[product.platform];

  const handleManualOpen = () => {
    window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-neutral-900/75 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-200 p-6 sm:p-7 text-center space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Pulsing Security Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/80 shadow-xs">
          <ShieldCheck className="w-9 h-9" />
        </div>

        {/* Heading */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 inline-flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Redirecionamento 100% Seguro
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-neutral-900 font-display">
            Você está indo para a {platform.name}
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Sua compra, dados e garantia são processados diretamente no site ou aplicativo oficial com total segurança.
          </p>
        </div>

        {/* Mini Product Preview */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-left">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-14 h-14 rounded-xl object-cover bg-white shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">
              {product.title}
            </h4>
            <div className="flex items-center justify-between gap-2 mt-0.5">
              <span className="text-sm font-extrabold text-neutral-900 font-display">
                {formatCurrency(product.price)}
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${platform.badgeBg} ${platform.badgeText} ${platform.badgeBorder}`}>
                {platform.name}
              </span>
            </div>
          </div>
        </div>

        {/* Security checks bullet points */}
        <div className="text-left bg-neutral-50/70 p-3 rounded-xl border border-neutral-200/60 space-y-1.5 text-xs text-neutral-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Link direto e oficial verificado pelo Achadinhos da WEB</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Preço promocional e cupom aplicáveis na finalização</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Pagamento via Pix, Cartão ou Boleto no site oficial</span>
          </div>
        </div>

        {/* Countdown & Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            id="redirect-now-btn"
            onClick={handleManualOpen}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Acessar {platform.name} Agora</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-neutral-400">
            {countdown > 0 
              ? `Abrindo automaticamente em ${countdown} segundos...` 
              : 'Se a aba não abriu, clique no botão acima.'}
          </p>
        </div>
      </div>
    </div>
  );
};
