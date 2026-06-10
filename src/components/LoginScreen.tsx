/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Drum, Mail, Lock, Music2, Sparkles, LogIn, ArrowRight } from 'lucide-react';
import { PRESET_INSTRUMENTS } from '../initialData';

interface LoginScreenProps {
  onLogin: (roleType: 'creator' | 'student', studentData?: { name: string; email: string; instrument: string; role: string }) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedFlow, setSelectedFlow] = useState<'creator' | 'student'>('student');
  
  // Interactive mini drum machine simulator
  const [activeDrumId, setActiveDrumId] = useState<number | null>(null);
  const [currentRhythmName, setCurrentRhythmName] = useState<string>("¡Toca un tambor abajo!");
  
  // Custom student creation when logging in manually
  const [studentName, setStudentName] = useState('Juan de Triana');
  const [studentEmail, setStudentEmail] = useState('homeincordoba@gmail.com');
  const [studentInstrument, setStudentInstrument] = useState(PRESET_INSTRUMENTS[0]);
  const [studentRole, setStudentRole] = useState('Alumno / Componente');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleDrumClick = (id: number, name: string, soundFrequency: number) => {
    setActiveDrumId(id);
    setCurrentRhythmName(`🔊 Golpeando: ¡${name.toUpperCase()}!`);
    
    // Play synthetic browser web audio api frequency beep so they hear real sound, highly visual & attractive
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = id === 1 ? 'sine' : id === 2 ? 'triangle' : 'square';
      oscillator.frequency.setValueAtTime(soundFrequency, audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      // Audio context might be blocked or not supported, ignore
    }

    setTimeout(() => {
      setActiveDrumId(null);
    }, 180);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);
    
    setTimeout(() => {
      setIsSubmitting(false);
      if (selectedFlow === 'creator') {
        onLogin('creator');
      } else {
        onLogin('student', {
          name: studentName || 'Invitado Rítmico',
          email: studentEmail || 'usuario@batucada.com',
          instrument: studentInstrument,
          role: studentRole
        });
      }
    }, 800);
  };

  const handleGoogleLogin = () => {
    setIsSubmitting(true);
    setFeedback("Iniciando sesión segura con Google...");
    setTimeout(() => {
      setIsSubmitting(false);
      setFeedback(null);
      // Auto login as Student or Creator depending on choice
      if (selectedFlow === 'creator') {
        onLogin('creator');
      } else {
        onLogin('student', {
          name: "Marta de de Sevilla",
          email: "homeincordoba@gmail.com",
          instrument: "Surdo de Tercera (Cortador / Dobra)",
          role: "Alumno / Componente"
        });
      }
    }, 1000);
  };

  const loadQuickCreator = () => {
    setEmail('mestre.samba@batucada.com');
    setPassword('•••••••••');
    setSelectedFlow('creator');
    // Trigger audio cue
    handleDrumClick(2, "Repique (Mestre)", 330);
  };

  const loadQuickStudent = () => {
    setEmail('homeincordoba@gmail.com');
    setPassword('•••••••••');
    setSelectedFlow('student');
    setStudentName('Usuario Demo Batucada');
    setStudentEmail('homeincordoba@gmail.com');
    setStudentInstrument('Surdo de Primera (Marcador)');
    setStudentRole('Alumno / Componente');
    // Trigger audio cue
    handleDrumClick(1, "Surdos", 110);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background elegant grid visual patterns */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      {/* Radiant vibrant auroras */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-400 rounded-full opacity-10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-400 rounded-full opacity-15 blur-3xl pointer-events-none"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-12">
        <div className="flex justify-center">
          <div className="relative">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-tr from-emerald-600 to-emerald-500 rounded-3xl shadow-xl text-white border border-emerald-400/30 transform hover:rotate-6 transition-transform duration-300">
              <Drum id="app-logo-drum" className="h-10 w-10 animate-bounce" />
            </div>
            <span className="absolute -top-1 -right-2 flex h-4.5 w-4.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-yellow-500 items-center justify-center text-[8px] font-black text-slate-950">!</span>
            </span>
          </div>
        </div>
        
        <h2 className="mt-5 text-center text-4xl font-extrabold text-slate-900 tracking-tight">
          Batu<span className="text-emerald-600 relative inline-block">Call<span className="absolute bottom-1 left-0 right-0 h-1 bg-yellow-400 rounded"></span></span>
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 max-w-xs mx-auto">
          Plataforma premium para organizar ensayos, bolos y dinámicas en tiempo real.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-12">
        
        {/* --- PREMIUM ADDITION: INTERACTIVE DRUM PAD SAMPLER --- */}
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white p-4.5 rounded-t-2xl shadow-md border-b-2 border-yellow-400">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-yellow-300 animate-spin" /> PROBADOR RÍTMICO INTERACTIVO
            </span>
            <span className="text-[10px] bg-emerald-800 text-yellow-300 px-2 py-0.5 rounded font-bold">Web Audio</span>
          </div>
          <p className="text-xs text-emerald-200 mb-3 font-medium">
            ¡Siente la batucada antes de entrar! Haz click en los tambores para probar golpes:
          </p>
          
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 1, name: "Surdo 1º", desc: "Marcación", freq: 100, color: "bg-red-500 text-white hover:bg-red-400" },
              { id: 2, name: "Repique", desc: "Mestre", freq: 380, color: "bg-amber-400 text-slate-950 hover:bg-amber-300" },
              { id: 3, name: "Gogo", desc: "Agogó", freq: 700, color: "bg-sky-500 text-white hover:bg-sky-400" },
              { id: 4, name: "Tamborim", desc: "Corte", freq: 900, color: "bg-purple-500 text-white hover:bg-purple-400" }
            ].map((drum) => (
              <button
                key={drum.id}
                type="button"
                id={`drum-pad-${drum.id}`}
                onClick={() => handleDrumClick(drum.id, drum.name, drum.freq)}
                className={`py-2 px-1 rounded-xl text-center transition-all ${drum.color} ${
                  activeDrumId === drum.id 
                    ? 'ring-4 ring-yellow-400 scale-90 duration-75 shadow-inner' 
                    : 'shadow-md duration-150 transform active:scale-95'
                }`}
              >
                <div className="font-extrabold text-xs">{drum.name}</div>
                <div className="text-[8px] opacity-90 mt-0.5">{drum.desc}</div>
              </button>
            ))}
          </div>

          <div className="mt-3 text-center text-xs font-mono text-yellow-300 h-4 font-semibold">
            {currentRhythmName}
          </div>
        </div>

        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-100 rounded-b-2xl sm:px-10 border-x border-b border-slate-100">
          
          {/* Quick Setup presets */}
          <div className="mb-6 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 text-center">
              Selecciona tu rol demo para ver la app de inmediato:
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                id="preset-btn-creator"
                onClick={loadQuickCreator}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-left transition-all duration-200 ${
                  selectedFlow === 'creator'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <div className="text-xs font-bold flex items-center gap-1">
                  <Music2 className="h-3.5 w-3.5 text-emerald-600" />
                  Mestre (Admin)
                </div>
                <span className="text-[9px] text-slate-500 mt-1 leading-tight text-center">Gestiona agenda, envía alertas y cambia portadas</span>
              </button>

              <button
                type="button"
                id="preset-btn-student"
                onClick={loadQuickStudent}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-left transition-all duration-200 ${
                  selectedFlow === 'student'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <div className="text-xs font-bold flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
                  Alumno / Músico
                </div>
                <span className="text-[9px] text-slate-500 mt-1 leading-tight text-center">Bandeja urgente, da asistencia SÍ/NO y ritmos</span>
              </button>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {/* Toggle internal flow choice */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Modo de Entrada Seleccionado
              </label>
              <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                <button
                  type="button"
                  id="tab-student"
                  onClick={() => setSelectedFlow('student')}
                  className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all duration-150 ${
                    selectedFlow === 'student'
                      ? 'bg-white text-emerald-950 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Regístrate como Alumno
                </button>
                <button
                  type="button"
                  id="tab-creator"
                  onClick={() => setSelectedFlow('creator')}
                  className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-all duration-150 ${
                    selectedFlow === 'creator'
                      ? 'bg-white text-emerald-950 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Crear sala (Mestre)
                </button>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  id="login-email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@batucada.com"
                  className="block w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Contraseña
              </label>
              <div className="relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  id="login-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Extra fields only when selected Alumno and we want to configure our simulated persona */}
            {selectedFlow === 'student' && (
              <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-3 mt-2 animate-fadeIn">
                <span className="block text-xs font-bold text-emerald-950">
                  Configura tu perfil de Alumno para la simulación:
                </span>
                
                <div className="grid grid-cols-1 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Nombre Completo</label>
                    <input 
                      type="text"
                      id="student-name-input"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="ej. Marta de Sevilla" 
                      className="block w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-md bg-white text-slate-950 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Instrumento que tocas</label>
                    <select
                      id="student-instrument-select"
                      value={studentInstrument}
                      onChange={(e) => setStudentInstrument(e.target.value)}
                      className="block w-full text-xs px-2 py-1.5 border border-slate-300 rounded-md bg-white text-slate-950 focus:outline-none"
                    >
                      {PRESET_INSTRUMENTS.map((ins, i) => (
                        <option key={i} value={ins}>{ins}</option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                    <span className="block text-[11px] font-bold text-slate-600 mb-1">Rol de Acceso Inicial</span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-150 text-emerald-800 text-[10px] font-extrabold border border-emerald-300 uppercase">
                        Alumno / Componente
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">Asignado por defecto</span>
                    </div>
                    <span className="text-[9.5px] text-slate-400 block mt-1 leading-normal italic">
                      * El director/mestre reasignará tu rol específico una vez te des de alta en el bloque.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Email Button */}
            <button
              type="submit"
              id="submit-login-btn"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-55"
            >
              {isSubmitting ? (
                <span>Ingresando...</span>
              ) : (
                <>
                  <span>{selectedFlow === 'creator' ? 'Crear Batucada Nueva as Organizador' : 'Acceder al Panel del Alumno'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Google Login Action Divider */}
          <div className="mt-5">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-slate-500">O también puedes</span>
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                id="google-login-btn"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-slate-300 rounded-lg shadow-2xs text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer focus:outline-none transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" width="24" height="24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.06-1.19-.34-1.69-.73z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Entrar con Google</span>
              </button>
            </div>
            
            {feedback && (
              <p className="mt-3 text-center text-xs font-semibold text-emerald-600 animate-pulse">
                {feedback}
              </p>
            )}
          </div>

          <div className="mt-6 p-3.5 bg-yellow-50 rounded-xl border border-yellow-200">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <span className="p-1 bg-emerald-600 text-white rounded-md text-[9px] font-extrabold uppercase">BatuCall Sync</span>
              Persistencia integrada
            </h4>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Los cambios que realices como **Mestre/Organizador** (nuevos ensayos, alertas urgentes, videoteca, o roles) se guardan en el almacenamiento local y se reflejan instantáneamente cuando cambies al **Panel de Alumno**.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
