import React from 'react';
import { Sparkles, Users, Search, X, ShieldCheck, Lock, LogOut } from 'lucide-react';
import { StoreSettings } from '../types';

interface HeaderProps {
  settings: StoreSettings;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAdmin: () => void;
  onOpenVipModal: () => void;
  productsCount: number;
  isAdminAuthenticated: boolean;
  onAdminLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  searchQuery,
  onSearchChange,
  onOpenAdmin,
  onOpenVipModal,
  productsCount,
  isAdminAuthenticated,
  onAdminLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 transition-all">
      {/* Top trust bar */}
      <div className="bg-neutral-900 text-neutral-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Links 100% Seguros & Verificados
            </span>
            <span className="hidden sm:inline text-neutral-600">•</span>
            <span className="hidden sm:inline text-neutral-400">
              Redirecionamento direto para lojas oficiais
            </span>
          </div>

          <div className="flex items-center gap-4 text-neutral-300">
            <button
              id="header-vip-group-btn"
              onClick={onOpenVipModal}
              className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors font-medium cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Grupo VIP de Ofertas</span>
            </button>
            <span className="text-neutral-700">|</span>
            <span className="text-neutral-400 text-[11px]">
              {productsCount} {productsCount === 1 ? 'achadinho ativo' : 'achadinhos ativos'}
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/10">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xl font-bold font-display tracking-tight text-neutral-900">
                {settings.storeName}
              </span>
              <span className="hidden sm:block text-[11px] font-medium text-neutral-500 tracking-wide uppercase">
                Vitrine Oficial de Achadinhos
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <input
                id="search-input"
                type="text"
                placeholder="Buscar por produto, marca ou categoria (ex: aspirador, fone)..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white text-sm text-neutral-900 placeholder:text-neutral-500 rounded-xl border border-neutral-200/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  id="clear-search-btn"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-200/60 transition-colors"
                  aria-label="Limpar busca"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Admin Access / Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {isAdminAuthenticated ? (
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 p-1 rounded-xl">
                <button
                  id="admin-management-btn"
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  title="Abrir Painel Administrativo"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Painel ADM</span>
                </button>
                <button
                  onClick={onAdminLogout}
                  className="p-1.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/50 rounded-lg transition-colors cursor-pointer"
                  title="Sair do modo administrador"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="admin-management-btn"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium border border-neutral-200 transition-all cursor-pointer"
                title="Acesso restrito ao administrador"
              >
                <Lock className="w-3.5 h-3.5 text-neutral-500" />
                <span className="hidden sm:inline">Painel ADM</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
