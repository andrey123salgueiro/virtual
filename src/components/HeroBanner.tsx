import React from 'react';
import { ExternalLink, Flame, ShieldCheck, Tag, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency, calculateDiscount, PLATFORM_CONFIG } from '../utils/helpers';

interface HeroBannerProps {
  featuredProduct?: Product;
  onSelectProduct: (product: Product) => void;
  onBuyDirect: (product: Product) => void;
  onOpenVipModal: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredProduct,
  onSelectProduct,
  onBuyDirect,
  onOpenVipModal,
}) => {
  const discount = featuredProduct
    ? calculateDiscount(featuredProduct.price, featuredProduct.originalPrice)
    : 0;

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent pb-8 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>Garimpados a dedo • Melhores Preços do Brasil</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 font-display tracking-tight leading-[1.15]">
              Achadinhos da WEB que facilitam o seu dia a dia
            </h1>

            <p className="text-neutral-600 text-base sm:text-lg leading-relaxed max-w-2xl">
              Economize tempo e dinheiro. Reunimos os produtos mais virais e bem avaliados da Shopee, Amazon, Mercado Livre e AliExpress com links 100% seguros para você comprar direto na loja oficial.
            </p>

            {/* Trust points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-neutral-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Compra na loja oficial</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Garantia & proteção total</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-700 font-medium">
                <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Ofertas & menores preços</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#catalogo-produtos"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold shadow-sm transition-all"
              >
                <span>Explorar Ofertas</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                id="hero-vip-btn"
                onClick={onOpenVipModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-800 text-sm font-semibold border border-neutral-200/90 shadow-2xs transition-all cursor-pointer"
              >
                <span>Entrar no Grupo VIP</span>
              </button>
            </div>
          </div>

          {/* Right Column: Featured "Achadinho do Dia" Card */}
          {featuredProduct && (
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-white border border-neutral-200/90 shadow-lg shadow-neutral-200/50 p-4 sm:p-5 transition-all hover:shadow-xl">
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600">
                    <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>Destaque do Dia</span>
                  </div>
                  {discount > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-600 text-xs font-extrabold border border-red-200">
                      -{discount}% OFF
                    </span>
                  )}
                </div>

                {/* Image & details row */}
                <div className="grid grid-cols-5 gap-3.5 items-center mb-3.5">
                  <div 
                    onClick={() => onSelectProduct(featuredProduct)}
                    className="col-span-2 aspect-square rounded-xl overflow-hidden bg-neutral-100 cursor-pointer group relative"
                  >
                    <img
                      src={featuredProduct.imageUrl}
                      alt={featuredProduct.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>

                  <div className="col-span-3 space-y-1.5">
                    {/* Platform pill */}
                    <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md border ${PLATFORM_CONFIG[featuredProduct.platform].badgeBg} ${PLATFORM_CONFIG[featuredProduct.platform].badgeText} ${PLATFORM_CONFIG[featuredProduct.platform].badgeBorder}`}>
                      {PLATFORM_CONFIG[featuredProduct.platform].name}
                    </span>

                    <h2 
                      onClick={() => onSelectProduct(featuredProduct)}
                      className="text-sm sm:text-base font-bold text-neutral-900 line-clamp-2 hover:text-amber-600 transition-colors cursor-pointer"
                    >
                      {featuredProduct.title}
                    </h2>

                    {/* Price display */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-extrabold text-neutral-900 font-display">
                        {formatCurrency(featuredProduct.price)}
                      </span>
                      {featuredProduct.originalPrice && featuredProduct.originalPrice > featuredProduct.price && (
                        <span className="text-xs text-neutral-400 line-through">
                          {formatCurrency(featuredProduct.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 line-clamp-2 mb-4">
                  {featuredProduct.shortDescription}
                </p>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="hero-view-details-btn"
                    onClick={() => onSelectProduct(featuredProduct)}
                    className="w-full py-2.5 px-3 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold transition-colors text-center cursor-pointer"
                  >
                    Ver Detalhes
                  </button>

                  <button
                    id="hero-buy-featured-btn"
                    onClick={() => onBuyDirect(featuredProduct)}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-orange-600/20 transition-all cursor-pointer"
                  >
                    <span>Comprar na Loja</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
