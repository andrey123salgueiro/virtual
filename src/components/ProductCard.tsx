import React, { useState } from 'react';
import { 
  ExternalLink, 
  Star, 
  Share2, 
  Check, 
  Truck, 
  Edit3, 
  Trash2,
  Eye,
  ShieldCheck
} from 'lucide-react';
import { Product } from '../types';
import { 
  formatCurrency, 
  calculateDiscount, 
  PLATFORM_CONFIG, 
  generateWhatsAppShareUrl 
} from '../utils/helpers';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onBuyDirect: (product: Product) => void;
  isAdminMode?: boolean;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onBuyDirect,
  isAdminMode = false,
  onEditProduct,
  onDeleteProduct,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const discount = calculateDiscount(product.price, product.originalPrice);
  const platform = PLATFORM_CONFIG[product.platform];

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(product.affiliateUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    setShowShareMenu(false);
  };

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = generateWhatsAppShareUrl(product.title, product.price, product.affiliateUrl);
    window.open(shareUrl, '_blank');
    setShowShareMenu(false);
  };

  return (
    <div className="group relative rounded-2xl bg-white border border-neutral-200/90 hover:border-neutral-300 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
      {/* Admin quick controls */}
      {isAdminMode && (
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 bg-neutral-900/90 backdrop-blur-xs p-1 rounded-lg border border-neutral-700">
          <button
            onClick={() => onEditProduct?.(product)}
            className="p-1 text-white hover:text-amber-400 rounded transition-colors"
            title="Editar produto"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeleteProduct?.(product.id)}
            className="p-1 text-white hover:text-red-400 rounded transition-colors"
            title="Excluir produto"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Image Container */}
      <div 
        onClick={() => onSelectProduct(product)}
        className="relative aspect-square w-full bg-neutral-100 overflow-hidden cursor-pointer"
      >
        <img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Badges overlay */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 pointer-events-none">
          {discount > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-red-500 text-white font-black text-xs shadow-xs tracking-tight">
              -{discount}% OFF
            </span>
          )}

          {product.badge && (
            <span className="px-2 py-0.5 rounded-md bg-neutral-900/85 backdrop-blur-xs text-white font-medium text-[11px] shadow-xs">
              {product.badge}
            </span>
          )}
        </div>

        {/* Platform tag on image bottom */}
        <div className="absolute bottom-3 left-3">
          <span className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-md border shadow-2xs ${platform.badgeBg} ${platform.badgeText} ${platform.badgeBorder}`}>
            {platform.name}
          </span>
        </div>

        {/* Quick view button on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectProduct(product);
          }}
          className="absolute inset-0 bg-neutral-900/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
          aria-label="Ver detalhes rápidos"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 text-neutral-900 text-xs font-bold shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-neutral-600" />
            Ver Detalhes
          </span>
        </button>
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating & reviews */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1 text-xs font-semibold text-neutral-700">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating ?? 4.8}</span>
              <span className="text-neutral-400 text-[11px]">
                ({product.reviewsCount ?? 350}+ vendidos)
              </span>
            </div>

            {product.freeShipping && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                <Truck className="w-3 h-3" />
                Frete Grátis
              </span>
            )}
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelectProduct(product)}
            className="text-sm font-bold text-neutral-900 line-clamp-2 leading-snug group-hover:text-amber-600 transition-colors cursor-pointer mb-1.5"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Short description */}
          <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Price display */}
        <div className="pt-2 border-t border-neutral-100">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="block text-[11px] text-neutral-400 line-through leading-tight">
                  de {formatCurrency(product.originalPrice)}
                </span>
              )}
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-extrabold text-neutral-900 font-display leading-tight">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-[11px] text-neutral-500">à vista</span>
              </div>
            </div>

            {/* Share action button */}
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                title="Compartilhar achadinho"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Share dropdown */}
              {showShareMenu && (
                <div className="absolute right-0 bottom-full mb-1 w-44 bg-white rounded-xl shadow-lg border border-neutral-200 p-1.5 z-30 space-y-1">
                  <button
                    onClick={handleWhatsAppShare}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-100 flex items-center justify-between cursor-pointer"
                  >
                    <span>Enviar no WhatsApp</span>
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-100 flex items-center justify-between cursor-pointer"
                  >
                    <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link'}</span>
                    {copiedLink && <Check className="w-3 h-3 text-emerald-600" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Direct Affiliate Action Button */}
        <div className="pt-1">
          <button
            id={`buy-btn-${product.id}`}
            onClick={() => onBuyDirect(product)}
            className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-950 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm hover:shadow transition-all group/btn cursor-pointer"
          >
            <span>Ver Oferta na Loja</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-300 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
          
          <div className="mt-1.5 flex items-center justify-center gap-1 text-[10px] text-neutral-500 font-medium">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Redirecionamento seguro para a {platform.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
