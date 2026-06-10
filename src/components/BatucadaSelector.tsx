import React, { useState } from 'react';
import { 
  Building, MapPin, Key, ArrowRight, Sparkles, CheckCircle2, 
  X, AlertCircle, Drum, Music
} from 'lucide-react';
import { BatucadaProfile } from '../types';

interface BatucadaSelectorProps {
  batucadas: BatucadaProfile[];
  onSelect: (batucada: BatucadaProfile) => void;
  onLogout: () => void;
  studentName: string;
}

export default function BatucadaSelector({
  batucadas,
  onSelect,
  onLogout,
  studentName
}: BatucadaSelectorProps) {
  const [selectedBatucada, setSelectedBatucada] = useState<BatucadaProfile | null>(null);
  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleOpenAuth = (batucada: BatucadaProfile) => {
    setSelectedBatucada(batucada);
    setInputCode('');
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleCloseAuth = () => {
    setSelectedBatucada(null);
    setInputCode('');
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleSubmitCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatucada) return;

    setIsVerifying(true);
    setErrorMsg(null);

    // Play visual feedback timer
    setTimeout(() => {
      setIsVerifying(false);
      const isCorrect = inputCode.trim().toUpperCase() === selectedBatucada.accessCode.toUpperCase();

      if (isCorrect) {
        setSuccessMsg("¡Acceso concedido! Entrando al bloque...");
        
        // Play synthetic congratulatory sound
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc1 = audioCtx.createOscillator();
          const osc2 = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5

          gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(audioCtx.destination);

          osc1.start();
          osc2.start();
          osc1.stop(audioCtx.currentTime + 0.45);
          osc2.stop(audioCtx.currentTime + 0.45);
        } catch (_) {}

        setTimeout(() => {
          onSelect(selectedBatucada);
        }, 1200);
      } else {
        setErrorMsg("Código de acceso incorrecto. Por favor, pídeselo a tu mestre.");
        
        // Error audio
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(130.81, audioCtx.currentTime); // C3
          gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.35);
        } catch (_) {}
      }
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 space-y-8 animate-fadeIn">
      {/* Saludo inicial rítmico */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-3xl p-6 shadow-md border-b-4 border-yellow-400 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform translate-x-10 -translate-y-10 scale-150">
          <Drum className="h-40 w-40 animate-pulse text-yellow-300" />
        </div>
        
        <div className="relative z-10 space-y-2">
          <span className="text-[10px] bg-yellow-400 text-slate-950 font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
            Modo Alumno Activo
          </span>
          <h1 className="text-2.5xl md:text-3.5xl font-extrabold tracking-tight">
            ¡Hola, <span className="text-yellow-300">{studentName}</span>!
          </h1>
          <p className="text-sm text-emerald-100 max-w-2xl leading-relaxed">
            Para ver tu agenda, alertas de desfiles, videoteca técnica y confirmar asistencia de ensayos, por favor <strong className="text-white">selecciona el bloque/batucada</strong> al que perteneces e ingresa su código de mestre.
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
              <Building className="h-5 w-5" />
            </span>
            Listado de Batucadas registradas en el sistema
          </h2>
          <span className="text-xs text-slate-500 font-medium">{batucadas.length} bloques listados</span>
        </div>

        {/* Grid de Batucadas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {batucadas.map((bat) => (
            <div 
              key={bat.id}
              onClick={() => handleOpenAuth(bat)}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/80 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="h-32 bg-slate-100 relative overflow-hidden">
                  <img 
                    src={bat.coverUrl} 
                    alt={bat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent"></div>
                  <span className="absolute top-2.5 right-2.5 bg-emerald-600/90 backdrop-blur-md text-white font-bold text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Activa
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors tracking-tight line-clamp-1">
                    {bat.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {bat.city}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between group-hover:bg-emerald-50/30 transition-colors">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Unirse ahora</span>
                <span className="inline-flex items-center justify-center p-1.5 bg-slate-200 rounded-full text-slate-600 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={onLogout}
          className="text-xs text-slate-500 hover:text-slate-700 underline font-semibold transition-colors"
        >
          Volver a la selección de rol principal (Simulador)
        </button>
      </div>

      {/* MODAL DE AUTENTICACIÓN / CÓDIGO DE ACCESO */}
      {selectedBatucada && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md border border-slate-100 overflow-hidden relative">
            
            {/* Header del modal */}
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between border-b-2 border-yellow-400">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-800 rounded-xl text-yellow-300">
                  <Key className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-wider">
                    Clave de Acceso requerida
                  </h3>
                  <span className="text-[10px] text-emerald-300 font-medium">Validación de bloque de percusión</span>
                </div>
              </div>
              <button 
                onClick={handleCloseAuth}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cuerpo del modal */}
            <form onSubmit={handleSubmitCode} className="p-6 space-y-4">
              <div className="text-center space-y-1.5 pb-2 border-b border-slate-100">
                <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                  <Music className="h-6 w-6" />
                </div>
                <h4 className="font-extrabold text-slate-800 text-base">{selectedBatucada.name}</h4>
                <p className="text-xs text-slate-500">Introduce el código facilitado por tu **Mestre / Director**:</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Código de Acceso</label>
                <input 
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="ej. SOL123"
                  className="w-full text-center font-mono tracking-widest text-lg font-extrabold uppercase px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                  autoFocus
                />
              </div>

              {/* Informative Demo helper so users can test successfully */}
              <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-center">
                <span className="text-[10px] text-amber-800 font-semibold block leading-tight">
                  💡 Pista Demo del de acceso para {selectedBatucada.name}: <strong className="font-bold underline text-amber-950">{selectedBatucada.accessCode}</strong>
                </span>
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-rose-50 text-rose-700 rounded-xl text-xs font-medium flex items-center gap-2 border border-rose-200 animate-shake">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-2 border border-emerald-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 animate-bounce" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseAuth}
                  className="flex-1 py-2.5 px-4 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isVerifying || !!successMsg}
                  className="flex-1 py-2.5 px-4 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  {isVerifying ? (
                    <span className="animate-pulse">Verificando...</span>
                  ) : (
                    <span>Validar Código</span>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
