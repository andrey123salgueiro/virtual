import React from 'react';
import { 
  X, 
  Users, 
  CheckCircle2, 
  ExternalLink, 
  Bell, 
  Sparkles,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { StoreSettings } from '../types';

interface VipGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
}

export const VipGroupModal: React.FC<VipGroupModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto p-6 sm:p-7 text-center space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <Users className="w-8 h-8" />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Grupo VIP Gratuito
          </span>
          <h3 className="text-xl font-bold text-neutral-900 font-display">
            Receba Achadinhos & Ofertas no WhatsApp
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed max-w-sm mx-auto">
            Algumas promoções duram apenas poucas horas ou têm estoques limitados. No nosso grupo você recebe o aviso antes de esgotar!
          </p>
        </div>

        {/* Perks */}
        <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 text-left space-y-2 text-xs text-neutral-700">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Erros de preço e descontos de até 80%</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Destaques de produtos com Frete Grátis</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Grupo silencioso (apenas ofertas verificadas)</span>
          </div>
        </div>

        {/* Direct Link Buttons */}
        <div className="space-y-2.5 pt-1">
          <a
            href={settings.whatsappGroupUrl || 'https://chat.whatsapp.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Entrar no Grupo do WhatsApp</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
