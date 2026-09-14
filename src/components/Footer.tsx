import React from 'react';
import { ShieldCheck, Sparkles, Heart, ExternalLink } from 'lucide-react';
import { StoreSettings } from '../types';

interface FooterProps {
  settings: StoreSettings;
  onOpenAdmin: () => void;
  onOpenVipModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenAdmin,
  onOpenVipModal,
}) => {
  return (
    <footer className="bg-neutral-900 text-neutral-400 text-xs border-t border-neutral-800 mt-16">
      {/* Top Value Banner */}
      <div className="border-b border-neutral-800/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Links 100% Verificados</h4>
              <p className="text-neutral-400 text-xs mt-0.5">
                Redirecionamento oficial para as maiores lojas do Brasil.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Curadoria Selecionada</h4>
              <p className="text-neutral-400 text-xs mt-0.5">
                Testamos e garimpamos apenas itens bem avaliados.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 text-orange-400 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Sem Custos Extras</h4>
              <p className="text-neutral-400 text-xs mt-0.5">
                Você não paga nada a mais e aproveita os menores preços.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand info */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold font-display text-lg">
              <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 inline-flex items-center justify-center text-white text-xs">
                ★
              </span>
              <span>{settings.storeName}</span>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-lg">
              {settings.tagline}
            </p>
            <div className="p-3.5 rounded-xl bg-neutral-800/60 border border-neutral-700/60 text-[11px] text-neutral-300 leading-relaxed max-w-lg">
              <strong className="text-white block mb-1">Aviso de Afiliado & Transparência:</strong>
              {settings.disclosureText}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="#catalogo-produtos" className="hover:text-white transition-colors">
                  Todos os Achados
                </a>
              </li>
              <li>
                <button 
                  onClick={onOpenVipModal}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  Grupo VIP no WhatsApp
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left flex items-center gap-1"
                >
                  <span>Área do Administrador</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Platforms supported */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Lojas Parceiras Oficiais
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {['Shopee', 'Amazon', 'Mercado Livre', 'Magalu', 'SHEIN'].map((loja) => (
                <span
                  key={loja}
                  className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700"
                >
                  {loja}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-neutral-400 pt-2">
              Todas as marcas registradas pertencem aos seus respectivos proprietários.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-400 text-[11px]">
          <p>© {new Date().getFullYear()} {settings.storeName}. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            <span>Desenvolvido para máxima conversão e segurança do usuário</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
