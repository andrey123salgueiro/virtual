import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Home, 
  Laptop, 
  LayoutGrid, 
  HeartHandshake, 
  Shirt,
  ArrowUpDown,
  Filter,
  Check
} from 'lucide-react';
import { Category, Platform, SortOption } from '../types';
import { CATEGORIES_CONFIG, PLATFORM_CONFIG } from '../utils/helpers';

interface CategoryFilterProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  selectedPlatform: Platform | 'todas';
  onSelectPlatform: (platform: Platform | 'todas') => void;
  sortBy: SortOption;
  onSelectSort: (sort: SortOption) => void;
  onlyFreeShipping: boolean;
  onToggleOnlyFreeShipping: () => void;
  totalFiltered: number;
  totalAll: number;
  onResetFilters: () => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedPlatform,
  onSelectPlatform,
  sortBy,
  onSelectSort,
  onlyFreeShipping,
  onToggleOnlyFreeShipping,
  totalFiltered,
  totalAll,
  onResetFilters,
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-3.5 h-3.5" />;
      case 'Flame': return <Flame className="w-3.5 h-3.5" />;
      case 'Home': return <Home className="w-3.5 h-3.5" />;
      case 'Laptop': return <Laptop className="w-3.5 h-3.5" />;
      case 'LayoutGrid': return <LayoutGrid className="w-3.5 h-3.5" />;
      case 'HeartHandshake': return <HeartHandshake className="w-3.5 h-3.5" />;
      case 'Shirt': return <Shirt className="w-3.5 h-3.5" />;
      default: return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  const platforms: { id: Platform | 'todas'; label: string }[] = [
    { id: 'todas', label: 'Todas as Lojas' },
    { id: 'shopee', label: 'Shopee' },
    { id: 'amazon', label: 'Amazon' },
    { id: 'mercadolivre', label: 'Mercado Livre' },
    { id: 'magalu', label: 'Magalu' },
    { id: 'shein', label: 'SHEIN' },
  ];

  const hasActiveFilters = 
    selectedCategory !== 'todos' || 
    selectedPlatform !== 'todas' || 
    onlyFreeShipping;

  return (
    <section id="catalogo-produtos" className="pt-2 pb-6 space-y-4">
      {/* Category Pills horizontal scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {CATEGORIES_CONFIG.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`cat-filter-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200/90'
              }`}
            >
              {getCategoryIcon(cat.iconName)}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Platform & Sort row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-neutral-200/70">
        {/* Platform tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-neutral-500 font-medium shrink-0 mr-1 hidden md:inline">
            Loja:
          </span>
          {platforms.map((p) => {
            const isSelected = selectedPlatform === p.id;
            return (
              <button
                key={p.id}
                id={`platform-filter-${p.id}`}
                onClick={() => onSelectPlatform(p.id)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border border-transparent'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Secondary options & sorting */}
        <div className="flex items-center gap-2 justify-between sm:justify-end shrink-0">
          {/* Quick toggle: Free Shipping */}
          <button
            id="toggle-shipping-filter"
            onClick={onToggleOnlyFreeShipping}
            className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1 cursor-pointer transition-colors ${
              onlyFreeShipping
                ? 'bg-blue-50 border-blue-300 text-blue-800 font-semibold'
                : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {onlyFreeShipping && <Check className="w-3 h-3 text-blue-600" />}
            <span>Frete Grátis</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSelectSort(e.target.value as SortOption)}
              className="appearance-none pl-7 pr-7 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-800 hover:bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="destaques">Destaques</option>
              <option value="menor-preco">Menor Preço</option>
              <option value="maior-desconto">Maior Desconto (%)</option>
              <option value="recentes">Mais Recentes</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results status banner if filtering */}
      <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
        <span>
          Mostrando <strong className="text-neutral-800">{totalFiltered}</strong> de {totalAll} achadinhos
        </span>
        {hasActiveFilters && (
          <button
            id="reset-filters-btn"
            onClick={onResetFilters}
            className="text-amber-700 hover:text-amber-800 font-medium underline underline-offset-2 cursor-pointer"
          >
            Limpar filtros
          </button>
        )}
      </div>
    </section>
  );
};
