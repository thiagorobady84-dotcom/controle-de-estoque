import React, { useState } from 'react';
import {
  Smartphone,
  Copy,
  Check,
  X,
  QrCode,
  ExternalLink,
  Wifi,
  Sparkles,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ShareOnlineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareOnlineModal: React.FC<ShareOnlineModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, setOperatorName } = useAuth();
  const [copied, setCopied] = useState(false);
  const [editName, setEditName] = useState(userProfile?.name || '');
  const [nameSaved, setNameSaved] = useState(false);

  if (!isOpen) return null;

  // The permanent Cloud Run URL for production sharing
  const onlineUrl = 'https://ais-pre-52lxqand2myfiqrxadidig-343990604188.us-west1.run.app';

  // High quality QR Code image generated via universal API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=12&data=${encodeURIComponent(
    onlineUrl
  )}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(onlineUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (editName.trim()) {
      setOperatorName(editName.trim());
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/90 border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Conectar Outros Aparelhos no Modo Online
              </h3>
              <p className="text-xs text-slate-400">
                Sincronização instantânea em tempo real via Firestore
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Status Badge */}
          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Servidor Online no Google Cloud Run</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
              ATIVO
            </span>
          </div>

          {/* QR Code Card */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <div className="p-3 bg-white rounded-2xl shadow-lg border-4 border-slate-800">
              <img
                src={qrCodeUrl}
                alt="QR Code para abrir no celular"
                className="w-48 h-48 object-contain rounded-lg"
              />
            </div>
            <p className="text-xs font-bold text-white mt-4 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-amber-400" />
              Aponte a câmera do celular para o QR Code acima
            </p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
              Funciona em qualquer aparelho Android ou iPhone conectado à internet.
            </p>
          </div>

          {/* Direct Link Copier */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Ou copie e envie o link direto:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={onlineUrl}
                className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 select-all focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                  copied
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* Device Operator Name Configuration */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-400" />
              Nome do Operador deste Aparelho
            </span>
            <p className="text-[11px] text-slate-400">
              Defina quem está operando este celular/computador para identificar as entradas e saídas no histórico:
            </p>
            <form onSubmit={handleSaveName} className="flex gap-2 pt-1">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Ex: João - Depósito ou Balcão 1"
                className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs rounded-lg transition"
              >
                {nameSaved ? 'Salvo ✓' : 'Salvar'}
              </button>
            </form>
          </div>

          {/* Quick PWA Installation Tips */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Dica de Instalação no Celular:
            </p>
            <p>
              Ao abrir no Chrome ou Safari do celular, toque nos 3 pontinhos do menu e selecione <strong>"Adicionar à tela inicial"</strong>. O sistema cria um ícone na tela do aparelho igual a um aplicativo!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Banco de dados persistente em nuvem</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
