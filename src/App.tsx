import React, { useState, useEffect, useMemo } from 'react';
import { Product, Category, Platform, SortOption, StoreSettings } from './types';
import { INITIAL_PRODUCTS, DEFAULT_STORE_SETTINGS } from './data/initialProducts';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { RedirectModal } from './components/RedirectModal';
import { AdminModal } from './components/AdminModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { VipGroupModal } from './components/VipGroupModal';
import { Footer } from './components/Footer';
import { calculateDiscount } from './utils/helpers';
import { MessageCircle, ShieldAlert, Sparkles, SlidersHorizontal, PlusCircle, LogOut, ShieldCheck, CloudCheck } from 'lucide-react';
import { 
  subscribeToProducts, 
  subscribeToStoreSettings, 
  saveProductToFirestore, 
  deleteProductFromFirestore, 
  saveStoreSettingsToFirestore,
  seedInitialDataIfEmpty
} from './firebase';

const STORAGE_PRODUCTS_KEY = 'achadinhos_web_products_v1';
const STORAGE_SETTINGS_KEY = 'achadinhos_web_settings_v1';
const STORAGE_AUTH_KEY = 'achadinhos_web_admin_auth_v1';

export default function App() {
  // 1. Persistent Products state
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PRODUCTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading saved products', e);
    }
    return INITIAL_PRODUCTS;
  });

  // 2. Persistent Store Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved settings', e);
    }
    return DEFAULT_STORE_SETTINGS;
  });

  // 3. Admin Authentication state (persisted per session)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_AUTH_KEY) === 'true';
    } catch (e) {
      return false;
    }
  });

  // Firestore Real-time synchronization
  useEffect(() => {
    // Seed default catalog if cloud Firestore is empty
    seedInitialDataIfEmpty(INITIAL_PRODUCTS, DEFAULT_STORE_SETTINGS);

    // Subscribe to live products from cloud
    const unsubscribeProducts = subscribeToProducts((cloudProducts) => {
      if (cloudProducts && cloudProducts.length > 0) {
        setProducts(cloudProducts);
      }
    });

    // Subscribe to live store settings from cloud
    const unsubscribeSettings = subscribeToStoreSettings((cloudSettings) => {
      if (cloudSettings) {
        setSettings(cloudSettings);
      }
    });

    return () => {
      unsubscribeProducts();
      unsubscribeSettings();
    };
  }, []);

  // Save backup changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }, [settings]);

  // 4. Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('todos');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'todas'>('todas');
  const [sortBy, setSortBy] = useState<SortOption>('destaques');
  const [onlyFreeShipping, setOnlyFreeShipping] = useState(false);

  // 5. Modals and Active Views
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [redirectingProduct, setRedirectingProduct] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isVipOpen, setIsVipOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdminModeEnabled, setIsAdminModeEnabled] = useState(false);

  // Filtered & Sorted products computation
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDesc = (p.shortDescription || '').toLowerCase().includes(q);
        const matchesPlatform = p.platform.toLowerCase().includes(q);
        const matchesBadge = (p.badge || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesPlatform && !matchesBadge) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'todos' && p.category !== selectedCategory) {
        return false;
      }

      // Platform
      if (selectedPlatform !== 'todas' && p.platform !== selectedPlatform) {
        return false;
      }

      // Only Free shipping
      if (onlyFreeShipping && !p.freeShipping) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'menor-preco') {
        return a.price - b.price;
      }
      if (sortBy === 'maior-desconto') {
        const discA = calculateDiscount(a.price, a.originalPrice);
        const discB = calculateDiscount(b.price, b.originalPrice);
        return discB - discA;
      }
      if (sortBy === 'recentes') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      // 'destaques': featured first, then highest rating
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (b.rating ?? 0) - (a.rating ?? 0);
    });
  }, [products, searchQuery, selectedCategory, selectedPlatform, sortBy, onlyFreeShipping]);

  // Featured product for the Hero section
  const featuredProduct = useMemo(() => {
    return products.find((p) => p.featured) || products[0];
  }, [products]);

  // Actions
  const handleDirectBuy = (product: Product) => {
    // Open redirection security interstitial
    setRedirectingProduct(product);
  };

  const handleOpenAdminPanel = () => {
    if (isAdminAuthenticated) {
      setIsAdminOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminAuthenticate = (password: string): boolean => {
    const correctPassword = settings.adminPassword || 'admin';
    if (password === correctPassword) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem(STORAGE_AUTH_KEY, 'true');
      } catch (e) {
        console.error(e);
      }
      setIsAdminOpen(true);
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setIsAdminModeEnabled(false);
    try {
      sessionStorage.removeItem(STORAGE_AUTH_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProduct = async (product: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) => (p.id === product.id ? product : p));
      }
      return [product, ...prev];
    });
    setEditingProduct(null);
    try {
      await saveProductToFirestore(product);
    } catch (err) {
      console.error('Error saving product to Firestore:', err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    try {
      await deleteProductFromFirestore(productId);
    } catch (err) {
      console.error('Error deleting product from Firestore:', err);
    }
  };

  const handleResetToDefaults = async () => {
    setProducts(INITIAL_PRODUCTS);
    for (const p of INITIAL_PRODUCTS) {
      try {
        await saveProductToFirestore(p);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleImportProducts = async (imported: Product[]) => {
    setProducts(imported);
    for (const p of imported) {
      try {
        await saveProductToFirestore(p);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSaveSettings = async (newSettings: StoreSettings) => {
    setSettings(newSettings);
    try {
      await saveStoreSettingsToFirestore(newSettings);
    } catch (err) {
      console.error('Error saving settings to Firestore:', err);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('todos');
    setSelectedPlatform('todas');
    setOnlyFreeShipping(false);
    setSortBy('destaques');
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/70 text-neutral-900 font-sans selection:bg-amber-500 selection:text-white">
      {/* 1. Header */}
      <Header
        settings={settings}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAdmin={handleOpenAdminPanel}
        onOpenVipModal={() => setIsVipOpen(true)}
        productsCount={products.length}
        isAdminAuthenticated={isAdminAuthenticated}
        onAdminLogout={handleAdminLogout}
      />

      {/* 2. Hero with Featured Achadinho (when not searching actively) */}
      {!searchQuery && (
        <HeroBanner
          featuredProduct={featuredProduct}
          onSelectProduct={setSelectedProduct}
          onBuyDirect={handleDirectBuy}
          onOpenVipModal={() => setIsVipOpen(true)}
        />
      )}

      {/* 3. Main Catalog Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Admin Bar: ONLY visible when authenticated as admin */}
        {isAdminAuthenticated && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-300 text-xs shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-300" />
              <div className="space-y-0.5">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Sessão de Administrador Ativa
                </span>
                <span className="text-[11px] text-amber-800">
                  Você pode cadastrar produtos novos, modificar produtos existentes ou editar direto na vitrine.
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                id="admin-open-panel-quick"
                onClick={() => {
                  setEditingProduct(null);
                  setIsAdminOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Painel ADM (Adicionar / Modificar)</span>
              </button>

              <button
                id="admin-toggle-quick-edit"
                onClick={() => setIsAdminModeEnabled(!isAdminModeEnabled)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5 border ${
                  isAdminModeEnabled 
                    ? 'bg-amber-200 text-amber-950 border-amber-400' 
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border-neutral-300'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{isAdminModeEnabled ? 'Edição Rápida: Ativada' : 'Ativar Edição nos Cards'}</span>
              </button>

              <button
                id="admin-logout-btn"
                onClick={handleAdminLogout}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-600 hover:text-red-600 border border-neutral-300 font-semibold transition-colors cursor-pointer flex items-center gap-1"
                title="Sair do modo administrador"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedPlatform={selectedPlatform}
          onSelectPlatform={setSelectedPlatform}
          sortBy={sortBy}
          onSelectSort={setSortBy}
          onlyFreeShipping={onlyFreeShipping}
          onToggleOnlyFreeShipping={() => setOnlyFreeShipping(!onlyFreeShipping)}
          totalFiltered={filteredProducts.length}
          totalAll={products.length}
          onResetFilters={handleResetFilters}
        />

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={setSelectedProduct}
                onBuyDirect={handleDirectBuy}
                isAdminMode={isAdminAuthenticated && isAdminModeEnabled}
                onEditProduct={(p) => {
                  setEditingProduct(p);
                  setIsAdminOpen(true);
                }}
                onDeleteProduct={handleDeleteProduct}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-neutral-200/90 my-8 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              Nenhum achadinho encontrado
            </h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Não encontramos nenhum produto com os filtros selecionados. Tente ajustar os termos de busca ou limpar os filtros.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Ver todos os achadinhos
            </button>
          </div>
        )}
      </main>

      {/* 4. Floating WhatsApp VIP Button for High Conversion */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          id="floating-vip-whatsapp-btn"
          onClick={() => setIsVipOpen(true)}
          className="group flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-xl shadow-emerald-600/30 transition-all cursor-pointer"
          title="Receber achadinhos no WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-white text-white" />
          <span className="hidden sm:inline">Grupo VIP de Ofertas</span>
          <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
        </button>
      </div>

      {/* 5. Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={handleOpenAdminPanel}
        onOpenVipModal={() => setIsVipOpen(true)}
      />

      {/* 6. Modals */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuyDirect={handleDirectBuy}
      />

      <RedirectModal
        product={redirectingProduct}
        onClose={() => setRedirectingProduct(null)}
      />

      {/* Admin Login Modal (password protected) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onAuthenticate={handleAdminAuthenticate}
      />

      {/* Admin Panel Modal (only accessible when authenticated) */}
      <AdminModal
        isOpen={isAdminOpen && isAdminAuthenticated}
        onClose={() => {
          setIsAdminOpen(false);
          setEditingProduct(null);
        }}
        products={products}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetToDefaults={handleResetToDefaults}
        onImportProducts={handleImportProducts}
        storeSettings={settings}
        onSaveSettings={handleSaveSettings}
        editingProduct={editingProduct}
      />

      <VipGroupModal
        isOpen={isVipOpen}
        onClose={() => setIsVipOpen(false)}
        settings={settings}
      />
    </div>
  );
}
