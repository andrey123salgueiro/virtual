import React, { useState } from 'react';
import { Lock, X, KeyRound, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (password: string) => boolean;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onAuthenticate,
}) => {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const success = onAuthenticate(password);
    if (success) {
      setPassword('');
      onClose();
    } else {
      setErrorMsg('Senha incorreta. Tente novamente.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-neutral-200 p-6 sm:p-7 text-center space-y-5 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Lock Icon */}
        <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-white flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-7 h-7 text-amber-400" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-neutral-900 font-display">
            Acesso Restrito ao Administrador
          </h3>
          <p className="text-xs text-neutral-500">
            Digite a senha para gerenciar produtos, links e configurações da loja.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-700">
              Senha do ADM
            </label>
            <div className="relative">
              <input
                type="password"
                required
                autoFocus
                placeholder="Digite sua senha..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
              />
              <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-500">
            <span className="font-semibold text-neutral-700">Dica:</span> A senha padrão inicial é <code className="bg-neutral-200 px-1 py-0.5 rounded font-mono font-bold text-neutral-800">admin</code> (você pode alterá-la nas configurações do painel).
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Entrar no Painel</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
