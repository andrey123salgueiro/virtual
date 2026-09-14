import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Star, 
  ShieldCheck, 
  Tag, 
  Truck, 
  Share2, 
  Check, 
  Lock, 
  CreditCard, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Product } from '../types';
import { 
  formatCurrency, 
  calculateDiscount, 
  PLATFORM_CONFIG, 
  generateWhatsAppShareUrl
} from '../utils/helpers';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyDirect: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onBuyDirect,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!product) return null;

  const discount = calculateDiscount(product.price, product.originalPrice);
  const savings = product.originalPrice && product.originalPrice > product.price 
    ? product.originalPrice - product.price 
    : 0;
  const platform = PLATFORM_CONFIG[product.platform];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(product.affiliateUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const url = generateWhatsAppShareUrl(product.title, product.price, product.affiliateUrl);
    window.open(url, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          id="close-product-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-neutral-600 hover:text-neutral-900 shadow-sm border border-neutral-200 transition-colors cursor-pointer"
          aria-label="Fechar janela"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image Column */}
          <div className="relative bg-neutral-100 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-neutral-200">
            <div className="aspect-square w-full max-w-sm rounded-2xl overflow-hidden shadow-sm relative group bg-white">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />

              {discount > 0 && (
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-red-600 text-white font-extrabold text-xs shadow-md">
                  -{discount}% OFF
                </div>
              )}
            </div>

            {/* Platform badge */}
            <div className="mt-4 flex items-center gap-2">
              <span className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-full border ${platform.badgeBg} ${platform.badgeText} ${platform.badgeBorder}`}>
                Loja Oficial: {platform.name}
              </span>
              {product.badge && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-neutral-900 text-white">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Quick Share row */}
            <div className="mt-4 pt-4 border-t border-neutral-200/80 w-full flex items-center justify-center gap-2">
              <span className="text-xs text-neutral-500 font-medium">Compartilhar:</span>
              <button
                onClick={handleShareWhatsApp}
                className="text-xs px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium border border-emerald-200 transition-colors cursor-pointer"
              >
                WhatsApp
              </button>
              <button
                onClick={handleCopyLink}
                className="text-xs px-3 py-1 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 font-medium border border-neutral-200 transition-colors cursor-pointer flex items-center gap-1"
              >
                {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Share2 className="w-3 h-3" />}
                <span>{copiedLink ? 'Copiado!' : 'Copiar Link'}</span>
              </button>
            </div>
          </div>

          {/* Details & CTA Column */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Title & Reviews */}
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700 mb-2">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                  <span>{product.rating ?? 4.9}</span>
                  <span className="text-neutral-400">•</span>
                  <span className="text-neutral-500">{product.reviewsCount ?? 1200}+ avaliações na loja</span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-neutral-900 leading-snug">
                  {product.title}
                </h2>
              </div>

              {/* Price box */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/90 space-y-1">
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-400 line-through">
                      De {formatCurrency(product.originalPrice)}
                    </span>
                    {savings > 0 && (
                      <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        Você economiza {formatCurrency(savings)}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">no link oficial</span>
                </div>

                {product.freeShipping && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium pt-1">
                    <Truck className="w-4 h-4" />
                    <span>Opção de Frete Grátis disponível no aplicativo da loja</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Sobre este achadinho
                </h4>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {product.fullDescription || product.shortDescription}
                </p>
              </div>

              {/* How it works safe box */}
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Compra 100% Segura na Loja Oficial</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Você será redirecionado para a plataforma oficial (<strong className="font-semibold">{platform.name}</strong>). A compra, o pagamento e a entrega são processados diretamente com a segurança e garantia da loja oficial.
                </p>
              </div>
            </div>

            {/* Big CTA */}
            <div className="pt-3">
              <button
                id="modal-direct-buy-btn"
                onClick={() => {
                  onBuyDirect(product);
                  onClose();
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-base font-bold shadow-lg shadow-orange-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Ver Oferta na {platform.name}</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
