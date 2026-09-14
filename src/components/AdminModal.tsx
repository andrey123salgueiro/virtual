import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Save, 
  Trash2, 
  RotateCcw, 
  Download, 
  Upload, 
  ExternalLink, 
  Sparkles,
  Layers,
  Settings,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Edit3
} from 'lucide-react';
import { Product, Platform, Category, StoreSettings } from '../types';
import { CATEGORIES_CONFIG, PLATFORM_CONFIG, formatCurrency } from '../utils/helpers';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetToDefaults: () => void;
  onImportProducts: (products: Product[]) => void;
  storeSettings: StoreSettings;
  onSaveSettings: (settings: StoreSettings) => void;
  editingProduct?: Product | null;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  products,
  onSaveProduct,
  onDeleteProduct,
  onResetToDefaults,
  onImportProducts,
  storeSettings,
  onSaveSettings,
  editingProduct,
}) => {
  const [activeTab, setActiveTab] = useState<'add' | 'list' | 'settings'>('add');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state for adding / editing product
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [platform, setPlatform] = useState<Platform>('shopee');
  const [category, setCategory] = useState<Category>('gadgets-virais');
  const [badge, setBadge] = useState('');
  const [freeShipping, setFreeShipping] = useState(true);
  const [featured, setFeatured] = useState(false);

  // Settings form state
  const [sName, setSName] = useState(storeSettings.storeName);
  const [sTagline, setSTagline] = useState(storeSettings.tagline);
  const [sWhatsapp, setSWhatsapp] = useState(storeSettings.whatsappGroupUrl || '');
  const [sInstagram, setSInstagram] = useState(storeSettings.instagramUrl || '');
  const [sPassword, setSPassword] = useState(storeSettings.adminPassword || 'admin');

  // Reset form
  const resetForm = () => {
    setId('');
    setTitle('');
    setShortDescription('');
    setFullDescription('');
    setPrice('');
    setOriginalPrice('');
    setAffiliateUrl('');
    setImageUrl('');
    setPlatform('shopee');
    setCategory('gadgets-virais');
    setBadge('');
    setFreeShipping(true);
    setFeatured(false);
  };

  // Populate when editingProduct changes
  useEffect(() => {
    if (editingProduct) {
      setId(editingProduct.id);
      setTitle(editingProduct.title);
      setShortDescription(editingProduct.shortDescription);
      setFullDescription(editingProduct.fullDescription || '');
      setPrice(editingProduct.price);
      setOriginalPrice(editingProduct.originalPrice || '');
      setAffiliateUrl(editingProduct.affiliateUrl);
      setImageUrl(editingProduct.imageUrl);
      setPlatform(editingProduct.platform);
      setCategory(editingProduct.category);
      setBadge(editingProduct.badge || '');
      setFreeShipping(editingProduct.freeShipping ?? false);
      setFeatured(editingProduct.featured ?? false);
      setActiveTab('add');
    }
  }, [editingProduct]);

  useEffect(() => {
    setSName(storeSettings.storeName);
    setSTagline(storeSettings.tagline);
    setSWhatsapp(storeSettings.whatsappGroupUrl || '');
    setSInstagram(storeSettings.instagramUrl || '');
    setSPassword(storeSettings.adminPassword || 'admin');
  }, [storeSettings]);

  if (!isOpen) return null;

  const showNotification = (type: 'success' | 'error', text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !affiliateUrl.trim() || !imageUrl.trim() || !price || Number(price) <= 0) {
      showNotification('error', 'Preencha o título, preço, link de afiliado e URL da foto.');
      return;
    }

    const newProduct: Product = {
      id: id || `achado-${Date.now()}`,
      title: title.trim(),
      shortDescription: shortDescription.trim() || title.trim(),
      fullDescription: fullDescription.trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      affiliateUrl: affiliateUrl.trim(),
      imageUrl: imageUrl.trim(),
      platform,
      category,
      badge: badge.trim() || undefined,
      freeShipping,
      featured,
      rating: 4.8,
      reviewsCount: Math.floor(Math.random() * 800) + 120,
      createdAt: new Date().toISOString(),
    };

    onSaveProduct(newProduct);
    showNotification('success', id ? 'Alterações salvas no produto com sucesso!' : 'Novo produto adicionado à loja com sucesso!');
    resetForm();
    setActiveTab('list');
  };

  const handleSaveStoreSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      ...storeSettings,
      storeName: sName.trim() || 'Achadinhos da WEB',
      tagline: sTagline.trim(),
      whatsappGroupUrl: sWhatsapp.trim(),
      instagramUrl: sInstagram.trim(),
      adminPassword: sPassword.trim() || 'admin'
    });
    showNotification('success', 'Configurações e senha do ADM salvas com sucesso!');
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `achadinhos-da-web-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('success', 'Backup dos produtos exportado em JSON!');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          onImportProducts(imported);
          showNotification('success', `${imported.length} produtos importados com sucesso!`);
        } else {
          showNotification('error', 'O arquivo não contém uma lista válida de produtos.');
        }
      } catch (err) {
        showNotification('error', 'Erro ao ler arquivo JSON. Verifique o formato.');
      }
    };
    reader.readAsText(file);
  };

  // Sample image presets for quick testing
  const sampleImages = [
    { label: 'Gadget / Tech', url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80' },
    { label: 'Casa & Cozinha', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80' },
    { label: 'Beleza & Cuidados', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80' },
    { label: 'Organização', url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-neutral-900 text-white">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Painel do Administrador • Achadinhos da WEB
              </h3>
              <p className="text-xs text-neutral-500">
                Área exclusiva para adicionar produtos, modificar informações e salvar alterações
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sincronizado na Nuvem (Firebase)</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors cursor-pointer"
              aria-label="Fechar painel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-4 px-6 pt-3 border-b border-neutral-200 bg-white overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              setActiveTab('add');
              if (!editingProduct) resetForm();
            }}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'add'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{id ? 'Modificar Produto' : 'Adicionar Produto Novo'}</span>
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'list'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Gerenciar / Modificar Produtos ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Configurações & Senha</span>
          </button>
        </div>

        {/* Feedback alert */}
        {feedbackMsg && (
          <div className={`mx-6 mt-3 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            feedbackMsg.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Body content based on tab */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB: ADD / EDIT PRODUCT */}
          {activeTab === 'add' && (
            <form onSubmit={handleSubmitProduct} className="space-y-5">
              {id && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4 text-amber-600" />
                    <span>Modificando produto existente: <strong>{title}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-amber-700 hover:text-amber-950 font-bold underline cursor-pointer"
                  >
                    Criar um novo em vez de editar
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2 space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">
                    Nome / Título do Produto *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Mini Aspirador Portátil Sem Fio Recarregável Turbo"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                  />
                </div>

                {/* Affiliate URL */}
                <div className="md:col-span-2 space-y-1">
                  <label className="block text-xs font-bold text-neutral-700 flex items-center justify-between">
                    <span>Seu Link de Afiliado (URL para onde o cliente será redirecionado) *</span>
                    <span className="text-[11px] text-amber-600 font-normal">Onde você recebe suas comissões</span>
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="Ex: https://shopee.com.br/... ou https://amzn.to/..."
                    value={affiliateUrl}
                    onChange={(e) => setAffiliateUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none font-mono text-xs"
                  />
                </div>

                {/* Platform */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">
                    Plataforma Oficial / Loja *
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as Platform)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none bg-white font-medium cursor-pointer"
                  >
                    <option value="shopee">Shopee</option>
                    <option value="amazon">Amazon</option>
                    <option value="mercadolivre">Mercado Livre</option>
                    <option value="magalu">Magazine Luiza (Magalu)</option>
                    <option value="shein">SHEIN</option>
                    <option value="outro">Outra Plataforma</option>
                  </select>
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">
                    Categoria *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none bg-white font-medium cursor-pointer"
                  >
                    {CATEGORIES_CONFIG.filter(c => c.id !== 'todos').map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* Price (Offer) */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">
                    Preço da Oferta (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="Ex: 49.90"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                  />
                </div>

                {/* Original Price */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700 flex items-center justify-between">
                    <span>Preço Original (de R$)</span>
                    <span className="text-[11px] text-neutral-400 font-normal">Para calcular o % de desconto</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="Ex: 89.90 (opcional)"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                  />
                </div>

                {/* Image URL */}
                <div className="md:col-span-2 space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">
                    Link da Imagem / Foto do Produto *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://... Cole o link da foto do produto"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-xs font-mono"
                  />
                  {/* Preset quick buttons */}
                  <div className="flex items-center gap-2 pt-1 overflow-x-auto text-[11px] text-neutral-500">
                    <span>Ou use fotos de teste:</span>
                    {sampleImages.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImageUrl(s.url)}
                        className="px-2 py-0.5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 cursor-pointer shrink-0"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Preview if available */}
                {imageUrl && (
                  <div className="md:col-span-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center gap-4">
                    <img
                      src={imageUrl}
                      alt="Prévia"
                      className="w-16 h-16 rounded-lg object-cover bg-white shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <div className="text-xs text-neutral-600">
                      <p className="font-semibold text-neutral-800">Prévia da imagem</p>
                      <p className="text-neutral-400 text-[11px]">Certifique-se de que a foto apareça nítida.</p>
                    </div>
                  </div>
                )}

                {/* Short Description */}
                <div className="md:col-span-2 space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">
                    Breve Descrição (Destaque do achadinho)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Uma ou duas frases curtas destacando o principal benefício e utilidade do produto..."
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                  />
                </div>

                {/* Badge Tag */}
                <div className="md:col-span-2 space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">
                    Tag / Selo Especial (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Viral no TikTok, Mais Vendido, Super Achado"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                  />
                </div>

                {/* Checkboxes */}
                <div className="md:col-span-2 flex flex-wrap items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-700">
                    <input
                      type="checkbox"
                      checked={freeShipping}
                      onChange={(e) => setFreeShipping(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Possui opção de Frete Grátis na loja</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-700">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Destacar no topo da página ("Achadinho do Dia")</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
                {id && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-semibold hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    Cancelar Edição
                  </button>
                )}

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{id ? 'Salvar Alterações Feitas' : 'Cadastrar e Salvar'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB: LIST & MODIFY ALL PRODUCTS */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
                <p className="text-xs text-neutral-500">
                  Total de <strong className="text-neutral-900">{products.length}</strong> produtos cadastrados. Clique em <strong>Editar</strong> para modificar qualquer produto e salvar.
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleExportJson}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 transition-colors cursor-pointer"
                    title="Baixar cópia de segurança"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exportar Backup</span>
                  </button>

                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 transition-colors cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Importar JSON</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJson}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={() => {
                      if (confirm('Deseja restaurar a lista inicial com os achadinhos pré-configurados?')) {
                        onResetToDefaults();
                        showNotification('success', 'Produtos padrão restaurados!');
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-xs font-semibold text-amber-800 transition-colors cursor-pointer"
                    title="Voltar aos produtos iniciais de exemplo"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restaurar Padrão</span>
                  </button>
                </div>
              </div>

              {/* Products list table / cards */}
              <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-2xl overflow-hidden bg-white">
                {products.map((p) => {
                  const platformConfig = PLATFORM_CONFIG[p.platform];
                  return (
                    <div key={p.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          className="w-12 h-12 rounded-xl object-cover bg-neutral-100 shrink-0"
                        />
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${platformConfig.badgeBg} ${platformConfig.badgeText} ${platformConfig.badgeBorder}`}>
                              {platformConfig.name}
                            </span>
                            {p.featured && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-white">
                                Destaque
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-neutral-900 truncate max-w-md">
                            {p.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-neutral-500">
                            <span className="font-bold text-neutral-900 font-display">
                              {formatCurrency(p.price)}
                            </span>
                            {p.originalPrice && p.originalPrice > p.price && (
                              <span className="text-[11px] text-neutral-400 line-through">
                                {formatCurrency(p.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <a
                          href={p.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                          title="Testar link de afiliado"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => {
                            setId(p.id);
                            setTitle(p.title);
                            setShortDescription(p.shortDescription);
                            setFullDescription(p.fullDescription || '');
                            setPrice(p.price);
                            setOriginalPrice(p.originalPrice || '');
                            setAffiliateUrl(p.affiliateUrl);
                            setImageUrl(p.imageUrl);
                            setPlatform(p.platform);
                            setCategory(p.category);
                            setBadge(p.badge || '');
                            setFreeShipping(p.freeShipping ?? false);
                            setFeatured(p.featured ?? false);
                            setActiveTab('add');
                          }}
                          className="px-3 py-1.5 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Modificar</span>
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Excluir o achadinho "${p.title}"?`)) {
                              onDeleteProduct(p.id);
                              showNotification('success', 'Produto excluído com sucesso.');
                            }
                          }}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Excluir produto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: STORE SETTINGS & ADMIN PASSWORD */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveStoreSettings} className="space-y-4 max-w-xl">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">
                  Nome da Sua Loja de Achados
                </label>
                <input
                  type="text"
                  value={sName}
                  onChange={(e) => setSName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">
                  Frase de Efeito (Tagline)
                </label>
                <input
                  type="text"
                  value={sTagline}
                  onChange={(e) => setSTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                />
              </div>

              {/* Admin Security Password */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                <label className="block text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-amber-600" />
                  <span>Senha de Acesso do Painel ADM</span>
                </label>
                <p className="text-[11px] text-neutral-600">
                  Protege o painel contra visitantes comuns. Digite uma nova senha para proteger seu painel.
                </p>
                <input
                  type="text"
                  required
                  placeholder="Senha do administrador..."
                  value={sPassword}
                  onChange={(e) => setSPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none font-mono bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">
                  Link do seu Grupo VIP de Ofertas no WhatsApp
                </label>
                <input
                  type="url"
                  placeholder="https://chat.whatsapp.com/..."
                  value={sWhatsapp}
                  onChange={(e) => setSWhatsapp(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">
                  Link do Instagram da Loja
                </label>
                <input
                  type="url"
                  placeholder="https://instagram.com/..."
                  value={sInstagram}
                  onChange={(e) => setSInstagram(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none font-mono text-xs"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Configurações e Senha</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
