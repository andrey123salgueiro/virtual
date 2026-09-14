export type Platform = 'shopee' | 'amazon' | 'mercadolivre' | 'aliexpress' | 'magalu' | 'shein' | 'outro';

export type Category = 
  | 'todos'
  | 'casa-cozinha'
  | 'tecnologia'
  | 'beleza-saude'
  | 'organizacao'
  | 'gadgets-virais'
  | 'moda-acessorios';

export interface Product {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  price: number;
  originalPrice?: number;
  affiliateUrl: string;
  imageUrl: string;
  additionalImages?: string[];
  platform: Platform;
  category: Category;
  rating?: number;
  reviewsCount?: number;
  badge?: string; // e.g., "Mais Vendido", "Viral TikTok", "Menor Preço", "Super Desconto"
  couponCode?: string;
  freeShipping?: boolean;
  featured?: boolean;
  createdAt: string;
}

export type SortOption = 'destaques' | 'menor-preco' | 'maior-desconto' | 'recentes';

export interface StoreSettings {
  storeName: string;
  tagline: string;
  whatsappGroupUrl?: string;
  telegramGroupUrl?: string;
  instagramUrl?: string;
  disclosureText: string;
  adminPassword?: string;
}
