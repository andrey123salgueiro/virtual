import { Platform, Category } from '../types';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function calculateDiscount(price: number, originalPrice?: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export interface PlatformMeta {
  name: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  accentColor: string;
  logoText: string;
}

export const PLATFORM_CONFIG: Record<Platform, PlatformMeta> = {
  shopee: {
    name: 'Shopee',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-700',
    badgeBorder: 'border-orange-200',
    accentColor: '#EE4D2D',
    logoText: 'Shopee',
  },
  amazon: {
    name: 'Amazon',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    accentColor: '#FF9900',
    logoText: 'Amazon',
  },
  mercadolivre: {
    name: 'Mercado Livre',
    badgeBg: 'bg-yellow-50',
    badgeText: 'text-yellow-800',
    badgeBorder: 'border-yellow-200',
    accentColor: '#FFE600',
    logoText: 'Mercado Livre',
  },
  aliexpress: {
    name: 'AliExpress',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-700',
    badgeBorder: 'border-red-200',
    accentColor: '#FF4747',
    logoText: 'AliExpress',
  },
  magalu: {
    name: 'Magazine Luiza',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    accentColor: '#0086FF',
    logoText: 'Magalu',
  },
  shein: {
    name: 'SHEIN',
    badgeBg: 'bg-neutral-100',
    badgeText: 'text-neutral-800',
    badgeBorder: 'border-neutral-300',
    accentColor: '#1A1A1A',
    logoText: 'SHEIN',
  },
  outro: {
    name: 'Loja Parceira',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-200',
    accentColor: '#10B981',
    logoText: 'Loja Parceira',
  },
};

export const CATEGORIES_CONFIG: { id: Category; label: string; iconName: string }[] = [
  { id: 'todos', label: 'Todos os Achados', iconName: 'Sparkles' },
  { id: 'gadgets-virais', label: 'Virais & TikTok', iconName: 'Flame' },
  { id: 'casa-cozinha', label: 'Casa & Cozinha', iconName: 'Home' },
  { id: 'tecnologia', label: 'Tecnologia & Setup', iconName: 'Laptop' },
  { id: 'organizacao', label: 'Organização & Decor', iconName: 'LayoutGrid' },
  { id: 'beleza-saude', label: 'Beleza & Cuidados', iconName: 'HeartHandshake' },
  { id: 'moda-acessorios', label: 'Moda & Acessórios', iconName: 'Shirt' },
];

export function generateWhatsAppShareUrl(title: string, price: number, link: string): string {
  const text = `Olha esse achadinho imperdível que encontrei por ${formatCurrency(price)}: "${title}"!\nConfere aqui a oferta segura: ${link}`;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

export function generateTelegramShareUrl(title: string, price: number, link: string): string {
  const text = `🔥 Achadinho em oferta: ${title} por ${formatCurrency(price)}!\nLink: ${link}`;
  return `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`;
}
