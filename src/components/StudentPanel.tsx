/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Check, X, Drum, MapPin, Calendar, Clock, Video, Play, ExternalLink, 
  Flame, Award, RotateCcw, Volume2, Star, Sparkles, Smile, MessageSquare, Users, User, Send
} from 'lucide-react';
import { BatucadaProfile, BatucadaEvent, UrgentAlert, VideoResource, StudentSession } from '../types';
import { MOTIVATIONAL_PHRASES } from '../initialData';

interface StudentPanelProps {
  profile: BatucadaProfile;
  session: StudentSession;
  alerts: UrgentAlert[];
  events: BatucadaEvent[];
  onToggleAttendance: (eventId: string, email: string, attending: boolean) => void;
  videos: VideoResource[];
}

export default function StudentPanel({
  profile,
  session,
  alerts,
  events,
  onToggleAttendance,
  videos
}: StudentPanelProps) {
  
  // States for gamification
  const [currentPhrase, setCurrentPhrase] = useState(MOTIVATIONAL_PHRASES[0]);
  const [isRotating, setIsRotating] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'All' | 'Ritmo' | 'Corte' | 'Coreografía'>('All');
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);

  // WhatsApp-style BatuChat Integration state
  const [activeChatId, setActiveChatId] = useState<string>('group');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('batu_pm');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return [
      { id: 'pm-group-1', senderEmail: 'director@batucall.com', senderName: 'Diego Organizador', receiverEmail: 'group', text: '¡Buenas tamboreros! Acabo de agendar la clase técnica en el calendario. ¡Pasad a confirmar asistencia por favor! 🥁', timestamp: 'Ayer, 18:20 hs' },
      { id: 'pm-group-2', senderEmail: 'profesor@batucall.com', senderName: 'Isabel Profesora', receiverEmail: 'group', text: '¡Perfecto equipo! Yo prepararé las baquetas de repuesto.', timestamp: 'Ayer, 19:15 hs' },
      { id: 'pm-1', senderEmail: 'director@batucall.com', senderName: 'Diego Organizador', receiverEmail: 'alumno@batucall.com', text: '¡Excelente ensayo Marta! Tu tempo con el repique guión ha sido sencillamente impecable. Sigamos este compás.', timestamp: 'Ayer, 21:05 hs' },
      { id: 'pm-2', senderEmail: 'carlos@batucall.com', senderName: 'Carlos Redoblante', receiverEmail: 'alumno@batucall.com', text: 'Marta, ¿llevas tú la correa de repuesto al ensayo del jueves? Se me ha descosido la mía.', timestamp: 'Hoy, 09:12 hs' }
    ];
  });

  const [companions] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('batu_members');
      if (stored) {
        const decoded = JSON.parse(stored);
        return decoded.filter((m: any) => m.email.toLowerCase() !== session.email.toLowerCase());
      }
    } catch(e) {}
    return [];
  });

  const viewportRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messaging viewport
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [chatMessages, activeChatId]);

  const handleSendReactMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const timeStr = 'Hoy, ' + new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + ' hs';
    const newMsg = {
      id: `whatsapp-react-${Date.now()}`,
      senderEmail: session.email,
      senderName: session.name || 'Marta Alumna',
      receiverEmail: activeChatId,
      text: inputMessage.trim(),
      timestamp: timeStr
    };

    const updated = [...chatMessages, newMsg];
    setChatMessages(updated);
    localStorage.setItem('batu_pm', JSON.stringify(updated));
    setInputMessage('');
    
    // Dispatch custom event to sync with the main index.html core if running simultaneously
    window.dispatchEvent(new Event('storage'));
  };

  // Sync state from local storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem('batu_pm');
        if (stored) {
          setChatMessages(JSON.parse(stored));
        }
      } catch (e) {}
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Rotate stick: changes the phrase & gives visual feedback
  const handleRotateStick = () => {
    setIsRotating(true);
    setTimeout(() => {
      const remainingArr = MOTIVATIONAL_PHRASES.filter(p => p !== currentPhrase);
      const randomItem = remainingArr[Math.floor(Math.random() * remainingArr.length)];
      setCurrentPhrase(randomItem);
      setIsRotating(false);
    }, 450);
  };

  // Filter video collection list
  const filteredVideos = activeCategoryFilter === 'All' 
    ? videos 
    : videos.filter(v => v.category === activeCategoryFilter);

  // Calculate the user's specific performance attendance rating
  const confirmedEventsCount = events.filter(e => e.confirmations.includes(session.email)).length;
  const totalEventsCount = events.length;
  const energyFactor = totalEventsCount > 0 
    ? Math.round((confirmedEventsCount / totalEventsCount) * 100) 
    : 100;

  return (
    <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto">
      
      {/* 1. SECCIÓN DE BIENVENIDA Y DETALLES DEL GRUPO (BANNER) */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-white">
        <div className="h-48 sm:h-56 relative overflow-hidden bg-slate-900">
          <img 
            src={profile.coverUrl} 
            alt="Grupo de Percusión" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-50" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider mb-2">
                🟢 Miembro Activo
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{profile.name}</h1>
              <p className="text-xs text-slate-300 flex items-center gap-1 mt-1 font-semibold">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                {profile.city}
              </p>
            </div>

            {/* Profile badge */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-xl flex items-center gap-3">
              <div className="p-2 bg-yellow-400 text-yellow-950 rounded-lg shrink-0">
                <Drum className="h-5 w-5 animate-pulse" />
              </div>
              <div className="text-xs">
                <span className="text-slate-300 block text-[9px] font-bold uppercase tracking-wider">Tu Instrumento</span>
                <span className="font-extrabold text-white text-sm">{session.instrument}</span>
                <span className="text-[10px] text-emerald-300 block font-medium mt-0.5">Rol: {session.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BANDEJA DE AVISOS Y ALERTAS (URGENTE DE MESTRE) */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 animate-spin" /> Tablón de Mensajes Urgentes
          </span>
          <div className="grid grid-cols-1 gap-2.5">
            {alerts.slice(0, 2).map((al) => (
              <div 
                key={al.id}
                id={`student-alert-banner-${al.id}`}
                className={`p-4 rounded-xl border relative overflow-hidden transition-all duration-300 ${
                  al.urgent 
                    ? 'border-rose-400 bg-rose-50/70 text-rose-950 shadow-sm shadow-rose-50' 
                    : 'border-amber-300 bg-amber-50/30 text-slate-800'
                }`}
              >
                {al.urgent && (
                  <div className="absolute top-0 right-0 h-1.5 w-full bg-rose-500 animate-pulse"></div>
                )}
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${al.urgent ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                    <Flame className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 block">PUBLICADO POR EL MESTRE</span>
                    <p className="text-xs font-semibold leading-relaxed mt-1">{al.message}</p>
                    <span className="text-[9px] text-slate-500 block mt-1.5 font-medium">Emitido {al.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GRID PRINCIPAL: CALENDARIO E INFORMACIÓN GAMIFICADA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* 3. CALENDARIO CON CONFIRMACIÓN DE ASISTENCIA */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Calendar className="h-4.5 w-4.5 text-emerald-600" />
                Calendario de Ensayos y Actuaciones Bolos
              </h2>
              <p className="text-xs text-slate-500">Confirma tu asistencia con tiempo para ayudar a organizar el bloque.</p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 font-bold shrink-0">
              {events.length} Eventos a la Vista
            </span>
          </div>

          <div className="space-y-4">
            {events.map((ev) => {
              const isConfirmed = ev.confirmations.includes(session.email);
              const isDeclined = ev.declined.includes(session.email);
              const totalAttendanceCount = ev.confirmations.length;

              return (
                <div 
                  key={ev.id}
                  id={`event-row-${ev.id}`}
                  className={`p-4 rounded-xl border transition-all ${
                    isConfirmed 
                      ? 'bg-emerald-50/20 border-emerald-300' 
                      : isDeclined 
                      ? 'bg-rose-50/10 border-slate-200 opacity-80' 
                      : 'bg-slate-50/50 border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                          ev.type === 'Bolo' 
                            ? 'bg-purple-100 text-purple-900 border border-purple-200' 
                            : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}>
                          {ev.type === 'Bolo' ? '✨ ACTUACIÓN / BOLO' : '🥁 ENSAYO GRL'}
                        </span>
                        
                        <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded border border-slate-100">
                          <Clock className="h-3 w-3 text-slate-400" />
                          {ev.date} • {ev.time} h
                        </span>
                      </div>

                      <h3 className="text-sm font-extrabold text-slate-900">{ev.title}</h3>

                      <p className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{ev.address}</span>
                      </p>

                      <p className="text-xs text-slate-500 pt-1.5 italic font-medium">
                        "{ev.description}"
                      </p>
                    </div>

                    {/* CONFIRMATION SWITCH BUTTONS */}
                    <div className="flex flex-col sm:items-end justify-center shrink-0 space-y-2">
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">
                        ¿Asistirás a esta cita?
                      </span>
                      
                      <div className="flex gap-2.5">
                        {/* Yes Button */}
                        <button
                          type="button"
                          id={`btn-yes-${ev.id}`}
                          onClick={() => onToggleAttendance(ev.id, session.email, true)}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg cursor-pointer border transition-all ${
                            isConfirmed 
                              ? 'bg-emerald-600 border-emerald-500 text-white shadow-xs shadow-emerald-100' 
                              : 'bg-white border-slate-300 hover:border-emerald-400 text-slate-700 hover:bg-emerald-50/50'
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Sí asistiré</span>
                        </button>

                        {/* No Button */}
                        <button
                          type="button"
                          id={`btn-no-${ev.id}`}
                          onClick={() => onToggleAttendance(ev.id, session.email, false)}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg cursor-pointer border transition-all ${
                            isDeclined 
                              ? 'bg-rose-600 border-rose-500 text-white shadow-xs' 
                              : 'bg-white border-slate-300 hover:border-rose-400 text-slate-700 hover:bg-rose-50/50'
                          }`}
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>No asistiré</span>
                        </button>
                      </div>

                      {/* Display current responses count */}
                      <span className="text-[11px] text-slate-500 font-medium">
                        {isConfirmed ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1 justify-end">
                            ¡Ya estás anotado! ({totalAttendanceCount} apuntados)
                          </span>
                        ) : isDeclined ? (
                          <span className="text-rose-700 font-medium justify-end block text-right">
                            Faltas, anotamos tu aviso de ausencia
                          </span>
                        ) : (
                          <span className="text-slate-500 italic flex items-center gap-1 justify-end">
                            Pendiente de respuesta
                          </span>
                        )}
                      </span>
                    </div>

                  </div>
                </div>
              );
            })}

            {events.length === 0 && (
              <div className="text-center py-10 border border-slate-200 rounded-xl text-slate-400 text-xs italic">
                Sin eventos por confirmar de momento. ¡Mantente atento al silbato del Mestre!
              </div>
            )}
          </div>
        </div>

        {/* 5. GAMIFICACIÓN - ESPÍRITU DE BLOQUE WIDGET */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-indigo-50 to-emerald-50/30 p-5 rounded-2xl border border-slate-100 shadow-2xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest flex items-center gap-1">
                <Flame className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
                Espíritu de Bloque
              </h3>
              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-950 rounded uppercase">Batuke-Meter</span>
            </div>

            {/* Medidor de Energía */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-semibold">Tu Nivel de Batería / Compromiso:</span>
                <span className="font-extrabold text-slate-900">{energyFactor}%</span>
              </div>
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden p-0.5">
                <div 
                  id="energy-meter-fill"
                  className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-emerald-600 transition-all duration-500 ease-out"
                  style={{ width: `${energyFactor}%` }}
                ></div>
              </div>
              <span className="text-[10px] text-slate-500 block text-right italic">
                {energyFactor >= 80 
                  ? "🔥 ¡Maza de Oro! Tu compromiso guía al bloque." 
                  : energyFactor >= 50 
                  ? "👍 ¡Compromiso Saludable! Sigues sumando potencia." 
                  : "⚠️ ¡Atención! El mestre te necesita en los ensayos."}
              </span>
            </div>

            {/* Frase Motivacional rítmica */}
            <div className="p-4 bg-white/95 rounded-xl border border-slate-100 space-y-3.5 shadow-3xs">
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">
                <span>Latido Diario</span>
                <Smile className="h-3.5 w-3.5 text-amber-500" />
              </div>
              <blockquote className="text-xs font-medium text-slate-700 leading-relaxed italic">
                "{currentPhrase}"
              </blockquote>
              
              <button
                type="button"
                id="rotate-stick-btn"
                onClick={handleRotateStick}
                disabled={isRotating}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer focus:outline-none"
              >
                <RotateCcw className={`h-3.5 w-3.5 text-yellow-300 ${isRotating ? 'animate-spin' : ''}`} />
                <span>Girar Baqueta (Cambiar Mantra)</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 4. WHATSAPP-STYLE BATUCHAT IN REACT */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-premium flex flex-col h-[450px]" id="student-whatsapp-react-container">
        {/* Header */}
        <div className="bg-emerald-600 text-white px-4 py-3 flex items-center justify-between border-b border-emerald-700 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-500 rounded-lg text-white">
              <MessageSquare className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-wide">BatuChat - Sala de Comunicación</h3>
              <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                <span className="h-1.5 w-1.5 bg-emerald-300 rounded-full animate-ping"></span>
                Conexión rítmica en tiempo real
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[9px] font-mono tracking-wider font-bold bg-emerald-800 px-2.5 py-0.5 rounded">
            WHATSAPP MODE
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex flex-1 min-h-0">
          {/* Side Chats List (1/3 Width) */}
          <div className="w-1/3 border-r border-slate-200 flex flex-col bg-slate-50 min-h-0 shrink-0">
            <div className="p-2 border-b border-slate-200 bg-slate-100 shrink-0">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Chats</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 p-1.5">
              {/* General Group chat row */}
              <button
                type="button"
                onClick={() => setActiveChatId('group')}
                className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                  activeChatId === 'group' ? 'bg-emerald-50 border border-emerald-200 shadow-3xs' : 'hover:bg-slate-100'
                }`}
              >
                <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs shrink-0">
                  <Users className="h-4 w-4" />
                </div>
                <div className="min-w-0 leading-tight">
                  <span className="text-xs font-black text-slate-900 block truncate">Grupo General</span>
                  <span className="text-[9.5px] text-slate-500 block truncate">
                    {(() => {
                      const groupMsgs = chatMessages.filter(m => m.receiverEmail === 'group');
                      const txt = groupMsgs.length > 0 ? groupMsgs[groupMsgs.length - 1].text : '¡Hola compañeros!';
                      return txt.length > 22 ? txt.substring(0, 22) + '...' : txt;
                    })()}
                  </span>
                </div>
              </button>

              {/* Individual member threads */}
              {companions.map((com) => {
                const companionMsgs = chatMessages.filter(pm => 
                  (pm.senderEmail.toLowerCase() === session.email.toLowerCase() && pm.receiverEmail.toLowerCase() === com.email.toLowerCase()) ||
                  (pm.senderEmail.toLowerCase() === com.email.toLowerCase() && pm.receiverEmail.toLowerCase() === session.email.toLowerCase())
                );

                const isThreadSelected = activeChatId.toLowerCase() === com.email.toLowerCase();
                if (companionMsgs.length > 0 || isThreadSelected) {
                  const lastText = companionMsgs.length > 0 ? companionMsgs[companionMsgs.length - 1].text : 'Escribe un mensaje privado...';
                  return (
                    <button
                      key={com.email}
                      type="button"
                      onClick={() => setActiveChatId(com.email)}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                        isThreadSelected ? 'bg-indigo-50 border border-indigo-200 shadow-3xs' : 'hover:bg-slate-100'
                      }`}
                    >
                      <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-extrabold text-xs shrink-0">
                        <span>{com.name.charAt(0)}</span>
                      </div>
                      <div className="min-w-0 leading-tight">
                        <span className="text-xs font-extrabold text-slate-900 block truncate">{com.name}</span>
                        <span className="text-[9px] text-slate-400 block truncate font-mono">{com.role}</span>
                        <span className="text-[9.5px] text-slate-500 block truncate italic">{lastText.length > 22 ? lastText.substring(0, 22) + '...' : lastText}</span>
                      </div>
                    </button>
                  );
                }
                return null;
              })}
            </div>
          </div>

          {/* Chat active conversation thread (2/3 Width) */}
          <div className="flex-1 flex flex-col bg-slate-150 min-h-0 relative">
            <div className="bg-white px-4 py-2 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="p-1.5 bg-slate-100 rounded-full text-emerald-600 shrink-0">
                  {activeChatId === 'group' ? (
                    <Users className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </span>
                <div className="leading-tight min-w-0">
                  <span className="text-xs font-black text-slate-900 block truncate">
                    {activeChatId === 'group' ? 'Grupo General' : companions.find(c => c.email.toLowerCase() === activeChatId.toLowerCase())?.name || 'Compañero'}
                  </span>
                  <span className="text-[9px] text-slate-500 block truncate font-medium">
                    {activeChatId === 'group' ? 'Historial del canal del bloque' : 'Conversación Privada Directa'}
                  </span>
                </div>
              </div>

              {/* Start new threads helper drop-down */}
              <div className="relative shrink-0">
                <select
                  aria-label="Seleccionar compañero para chatear"
                  onChange={(e) => {
                    if (e.target.value) {
                      setActiveChatId(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="text-[9px] px-1.5 py-1 rounded border border-slate-300 bg-white text-slate-700 font-bold max-w-[130px] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">💬 Nuevo Chat...</option>
                  {companions.map((com) => (
                    <option key={com.email} value={com.email}>
                      {com.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Scrolling Viewport Bubbles */}
            <div 
              ref={viewportRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col bg-slate-100"
              style={{
                backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`,
                backgroundRepeat: 'repeat',
                filter: 'saturate(0.85)'
              }}
            >
              {(() => {
                const filtered = activeChatId === 'group'
                  ? chatMessages.filter(pm => pm.receiverEmail === 'group')
                  : chatMessages.filter(pm => 
                      (pm.senderEmail.toLowerCase() === session.email.toLowerCase() && pm.receiverEmail.toLowerCase() === activeChatId.toLowerCase()) ||
                      (pm.senderEmail.toLowerCase() === activeChatId.toLowerCase() && pm.receiverEmail.toLowerCase() === session.email.toLowerCase())
                    );
                
                if (filtered.length === 0) {
                  return (
                    <div className="my-auto text-center py-10 px-4 bg-white/95 backdrop-blur-xs rounded-2xl border border-slate-200 max-w-[280px] mx-auto space-y-1">
                      <p className="text-xs font-bold text-slate-800">¡Empieza este chat rítmico!</p>
                      <p className="text-[10px] text-slate-500 italic">Los mensajes privados entre compañeros de fila son completamente personales.</p>
                    </div>
                  );
                }

                return filtered.map((pm) => {
                  const isMe = pm.senderEmail.toLowerCase() === session.email.toLowerCase();
                  return (
                    <div
                      key={pm.id}
                      className={`flex flex-col max-w-[80%] rounded-2xl px-3 py-2 shadow-3xs text-xs relative ${
                        isMe 
                          ? 'self-end bg-emerald-100 border border-emerald-200 text-slate-900 rounded-br-none ml-auto' 
                          : 'self-start bg-white border border-slate-150 text-slate-900 rounded-bl-none mr-auto'
                      }`}
                    >
                      <span className={`text-[9px] font-black uppercase tracking-wider mb-0.5 select-none ${isMe ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {isMe ? 'Tú' : pm.senderName}
                      </span>
                      <p className="leading-relaxed break-words font-medium text-slate-800">{pm.text}</p>
                      <span className="text-[8px] text-slate-400 block text-right mt-1 font-mono">{pm.timestamp}</span>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Composer bar */}
            <form onSubmit={handleSendReactMsg} className="p-2 bg-white border-t border-slate-200 flex gap-2 shrink-0 items-center">
              <input
                type="text"
                value={inputMessage}
                aria-label="Mensaje para enviar"
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Escribe un mensaje aquí..."
                className="flex-grow text-xs px-3 py-1.5 bg-slate-150 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
              />
              <button
                type="submit"
                aria-label="Enviar mensaje"
                className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition duration-150 flex items-center justify-center cursor-pointer shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 4. VIDEOTECA DE RITMOS Y CORTES */}
      <div id="student-videoteca" className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Video className="h-4.5 w-4.5 text-sky-600" />
              Canal de Estudio y Videoteca del Bloque
            </h2>
            <p className="text-xs text-slate-500">Estudia las llamadas del mestre, coreografías y técnicas de baquetas.</p>
          </div>

          {/* Filter Categories */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 self-start text-xs font-bold">
            {['All', 'Ritmo', 'Corte', 'Coreografía'].map((cat) => (
              <button
                key={cat}
                type="button"
                id={`cat-filter-${cat}`}
                onClick={() => setActiveCategoryFilter(cat as any)}
                className={`px-3 py-1 rounded transition-all text-[11px] ${
                  activeCategoryFilter === cat 
                    ? 'bg-white text-sky-950 shadow-xs font-extrabold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'All' ? 'Todos' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredVideos.map((vid) => (
            <div 
              key={vid.id}
              className="bg-slate-50 hover:bg-slate-100/50 rounded-xl overflow-hidden border border-slate-250 flex flex-col justify-between p-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                    vid.category === 'Corte' 
                      ? 'bg-rose-100 text-rose-800' 
                      : vid.category === 'Coreografía'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-sky-100 text-sky-800'
                  }`}>
                    {vid.category}
                  </span>
                  
                  <span className="text-[10px] text-slate-400 font-mono">ID: {vid.id}</span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 line-clamp-2 min-h-[32px]">{vid.title}</h3>
                
                {vid.description && (
                  <p className="text-[11px] text-slate-600 mt-1 lines-2 italic line-clamp-2">
                    "{vid.description}"
                  </p>
                )}
              </div>

              {/* Simulated embedded micro player */}
              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  id={`play-test-btn-${vid.id}`}
                  onClick={() => setSelectedVideoUrl(selectedVideoUrl === vid.url ? null : vid.url)}
                  className="w-full py-1.5 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition"
                >
                  <Play className="h-3 w-3 text-emerald-400 fill-emerald-400" />
                  <span>{selectedVideoUrl === vid.url ? "Esconder Tutorial" : "Simular Reproducción"}</span>
                </button>
                
                {selectedVideoUrl === vid.url && (
                  <div className="p-3 bg-slate-900 text-white rounded-lg text-center animate-fadeIn space-y-1">
                    <Volume2 className="h-5 w-5 mx-auto text-emerald-400 animate-bounce" />
                    <span className="text-[10px] font-semibold block text-slate-300">PRODUCIENDO RITMO EN BUCLE...</span>
                    <a 
                      href={vid.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[9px] text-sky-300 hover:underline flex items-center justify-center gap-1"
                    >
                      Ver en YouTube original <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredVideos.length === 0 && (
            <div className="col-span-3 text-center py-10 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
              Upps, no hemos encontrado vídeos en la categoría de "{activeCategoryFilter}".
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
