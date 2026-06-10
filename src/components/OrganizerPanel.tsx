/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Building, MapPin, Calendar, Plus, Trash2, Bell, Video, 
  Sparkles, CheckCircle2, AlertTriangle, Users, Image as ImageIcon, 
  ExternalLink, Clock, PlayCircle, Eye, Info, ChevronRight, Award,
  MessageSquare, Send, CalendarDays, Key, Shuffle, ShieldCheck, HelpCircle, UserCheck, Drum, Pencil
} from 'lucide-react';
import { BatucadaProfile, BatucadaEvent, EventType, UrgentAlert, VideoResource, UserRole, BatucadaMember, OrganizerMessage } from '../types';
import { SUGGESTED_COVERS, PRESET_INSTRUMENTS } from '../initialData';

interface OrganizerPanelProps {
  profile: BatucadaProfile;
  onUpdateProfile: (newProfile: BatucadaProfile) => void;
  roles: UserRole[];
  onCreateRole: (name: string) => void;
  onDeleteRole: (id: string) => void;
  alerts: UrgentAlert[];
  onAddAlert: (message: string, urgent: boolean) => void;
  onDeleteAlert: (id: string) => void;
  events: BatucadaEvent[];
  onAddEvent: (event: Omit<BatucadaEvent, 'id' | 'confirmations' | 'declined' | 'batucadaId'>) => void;
  onEditEvent: (event: BatucadaEvent) => void;
  onDeleteEvent: (id: string) => void;
  videos: VideoResource[];
  onAddVideo: (video: Omit<VideoResource, 'id' | 'batucadaId'>) => void;
  onDeleteVideo: (id: string) => void;
  batucadas: BatucadaProfile[];
  members: BatucadaMember[];
  organizerMessages: OrganizerMessage[];
  onUpdateMemberRole: (memberId: string, newRole: string) => void;
  onSendOrganizerMessage: (recipientBatucadaId: string, messageText: string) => void;
}

export default function OrganizerPanel({
  profile,
  onUpdateProfile,
  roles,
  onCreateRole,
  onDeleteRole,
  alerts,
  onAddAlert,
  onDeleteAlert,
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  videos,
  onAddVideo,
  onDeleteVideo,
  batucadas,
  members,
  organizerMessages,
  onUpdateMemberRole,
  onSendOrganizerMessage
}: OrganizerPanelProps) {
  
  // Tab trigger: 'dashboard' | 'members' | 'alerts' | 'events' | 'videos' | 'settings'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'members' | 'alerts' | 'events' | 'videos' | 'settings'>('dashboard');

  // --- Profile / Settings state ---
  const [profName, setProfName] = useState(profile.name);
  const [profCity, setProfCity] = useState(profile.city);
  const [profCover, setProfCover] = useState(profile.coverUrl);
  const [profAccessCode, setProfAccessCode] = useState(profile.accessCode);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Sync state if active batucada profile changes
  useEffect(() => {
    setProfName(profile.name);
    setProfCity(profile.city);
    setProfCover(profile.coverUrl);
    setProfAccessCode(profile.accessCode);
  }, [profile]);

  // --- Roles state ---
  const [newRoleName, setNewRoleName] = useState('');
  
  // --- Alerts state ---
  const [alertMessage, setAlertMessage] = useState('');
  const [isAlertUrgent, setIsAlertUrgent] = useState(true);

  // --- Events state ---
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState<EventType>('Ensayo');
  const [eventDate, setEventDate] = useState('2026-06-04');
  const [eventTime, setEventTime] = useState('20:00');
  const [eventAddress, setEventAddress] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [isCustomLocation, setIsCustomLocation] = useState(false);

  // Handle start editing an event
  const handleStartEditEvent = (ev: BatucadaEvent) => {
    setEditingEventId(ev.id);
    setEventTitle(ev.title);
    setEventType(ev.type);
    setEventDate(ev.date);
    setEventTime(ev.time);
    setEventAddress(ev.address);
    setEventDescription(ev.description || '');
    setIsCustomLocation(ev.address !== "Local de la Asociación - Calle Metalurgias Nave 12, Sevilla");
    setActiveTab('events');
  };

  // Cancel edit
  const handleCancelEditEvent = () => {
    setEditingEventId(null);
    setEventTitle('');
    setEventType('Ensayo');
    setEventDate('2026-06-04');
    setEventTime('20:00');
    setEventAddress('');
    setEventDescription('');
    setIsCustomLocation(false);
  };

  // --- Videos state ---
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoCategory, setVideoCategory] = useState<'Ritmo' | 'Corte' | 'Coreografía' | 'Otros'>('Ritmo');
  const [videoDesc, setVideoDesc] = useState('');

  // --- Dynamic Chat states ---
  const [selectedChatBatId, setSelectedChatBatId] = useState<string>('batucada-2');
  const [writtenMessage, setWrittenMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // --- Calendar states ---
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(4); // Default to June 4, which has an event

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [organizerMessages, selectedChatBatId, isTyping]);

  // Trigger typing simulation when selecting chat or receiving messages
  const handleSendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!writtenMessage.trim() || !selectedChatBatId) return;
    
    onSendOrganizerMessage(selectedChatBatId, writtenMessage.trim());
    setWrittenMessage('');
    setIsTyping(true);

    // Stop typing state when receiving replies
    setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  };

  // Submit profile changes
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      id: profile.id,
      name: profName,
      city: profCity,
      coverUrl: profCover,
      accessCode: profAccessCode || 'SOL123'
    });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 2500);
  };

  // Generate an easy access code instantly
  const handleGenerateEasyCode = () => {
    const easyPrefixes = ['SAMBA', 'RULO', 'BLOCO', 'FUEGO', 'TAMBOR', 'SOL', 'RUA', 'CADENCIA', 'GOLPE'];
    const randomPrefix = easyPrefixes[Math.floor(Math.random() * easyPrefixes.length)];
    const randomNum = Math.floor(10 + Math.random() * 90); // easy 2 digits
    const easyCode = `${randomPrefix}${randomNum}`;

    setProfAccessCode(easyCode);
    
    // Save immediately
    onUpdateProfile({
      id: profile.id,
      name: profName,
      city: profCity,
      coverUrl: profCover,
      accessCode: easyCode
    });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 2000);
  };

  // Select a preset cover
  const handleSelectPresetCover = (url: string) => {
    setProfCover(url);
    onUpdateProfile({
      id: profile.id,
      name: profName,
      city: profCity,
      coverUrl: url,
      accessCode: profAccessCode || 'SOL123'
    });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 2000);
  };

  // Submit a custom role
  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    onCreateRole(newRoleName.trim());
    setNewRoleName('');
  };

  // Submit Alert
  const handleAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertMessage.trim()) return;
    onAddAlert(alertMessage.trim(), true);
    setAlertMessage('');
  };

  // Submit automated Event
  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAddress = isCustomLocation ? eventAddress.trim() : "Local de la Asociación - Calle Metalurgias Nave 12, Sevilla";
    if (!eventTitle.trim() || !eventDate || !eventTime || (isCustomLocation && !eventAddress.trim())) return;
    
    if (editingEventId) {
      const existing = events.find(ev => ev.id === editingEventId);
      onEditEvent({
        id: editingEventId,
        batucadaId: profile.id || "batucada-1",
        title: eventTitle.trim(),
        type: eventType,
        date: eventDate,
        time: eventTime,
        address: finalAddress,
        description: eventDescription.trim() || "",
        confirmations: existing ? existing.confirmations : [],
        declined: existing ? existing.declined : []
      });
      setEditingEventId(null);
    } else {
      onAddEvent({
        title: eventTitle.trim(),
        type: eventType,
        date: eventDate,
        time: eventTime,
        address: finalAddress,
        description: eventDescription.trim() || "Ensayo general de puesta a punto de ritmo y expresión."
      });
    }
    setEventTitle('');
    setEventAddress('');
    setEventDescription('');
    setIsCustomLocation(false);
  };

  // Submit video
  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim() || !videoUrl.trim()) return;
    onAddVideo({
      title: videoTitle.trim(),
      url: videoUrl.trim(),
      category: videoCategory,
      description: videoDesc.trim()
    });
    setVideoTitle('');
    setVideoUrl('');
    setVideoCategory('Ritmo');
    setVideoDesc('');
  };

  // Render variables for calendar of June 2026:
  // June 1st, 2026 is a Monday. June has 30 days.
  const JuneCalendarDaysCount = 30;
  const filteredEventsForActiveBatucada = events.filter(e => e.batucadaId === profile.id);

  // June 2026 dates helper
  const getEventForDay = (day: number) => {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const dateStr = `2026-06-${dayStr}`;
    return filteredEventsForActiveBatucada.filter(e => e.date === dateStr);
  };

  // Messages log for the active cross-chat partner
  const chatMessagesWithSelectedBatucada = organizerMessages.filter(m => 
    (m.senderBatucadaId === profile.id && m.recipientBatucadaId === selectedChatBatId) ||
    (m.senderBatucadaId === selectedChatBatId && m.recipientBatucadaId === profile.id)
  );

  const selectedChatBatucadaProfile = batucadas.find(b => b.id === selectedChatBatId);

  // Other batucadas list
  const otherBatucadas = batucadas.filter(b => b.id !== profile.id);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* 🚀 COMPOSICIÓN DE CABECERA CON PERFIL ACTIVADO */}
      <div className="relative rounded-3xl overflow-hidden shadow-md border border-slate-200/60 bg-white">
        <div className="h-44 sm:h-52 relative overflow-hidden bg-slate-900">
          <img 
            src={profile.coverUrl} 
            alt="Grupo de Percusión" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider mb-2">
                🥁 Panel del Creador
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-sans text-white">{profile.name}</h1>
              <p className="text-xs text-slate-300 flex items-center gap-1 mt-1 font-semibold">
                <MapPin className="h-4 w-4 text-emerald-400" />
                {profile.city}
              </p>
            </div>

            {/* Access Code Indicator */}
            <div className="bg-emerald-950/70 backdrop-blur-md border border-emerald-500/25 px-4 py-2.5 rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-emerald-500 text-slate-950 rounded-lg shrink-0">
                <Key className="h-4.5 w-4.5" />
              </div>
              <div className="text-xs">
                <span className="text-slate-300 block text-[9px] font-bold uppercase tracking-wider">Código de Entrada</span>
                <span className="font-extrabold text-emerald-300 text-base font-mono">{profile.accessCode}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🛠️ MENÚ LATERAL/TABS INTEGRADADO EN MULTI-SECCIONES */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* SIDEBAR NAVIGATION PANELS */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200/80">
            <span className="block text-xs font-black text-slate-500 uppercase tracking-widest leading-none">Menú del Director</span>
          </div>
          
          <nav className="p-2.5 space-y-1">
            {[
              { id: 'dashboard', name: 'Inicio', icon: Building, color: 'text-emerald-600', badge: 'Chat' },
              { id: 'members', name: 'Músicos', icon: Users, color: 'text-blue-600', badge: `${members.length} Alum` },
              { id: 'alerts', name: 'Mensajes Urgentes', icon: Bell, color: 'text-rose-500', badge: alerts.filter(a => a.batucadaId === profile.id).length.toString() },
              { id: 'events', name: 'Agenda', icon: Calendar, color: 'text-amber-500', badge: filteredEventsForActiveBatucada.length.toString() },
              { id: 'videos', name: 'Videos', icon: Video, color: 'text-sky-500' },
              { id: 'settings', name: 'Ajustes', icon: ImageIcon, color: 'text-slate-600' }
            ].map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`creator-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp className={`h-4.5 w-4.5 ${isActive ? 'text-emerald-700' : tab.color}`} />
                    <span>{tab.name}</span>
                  </div>
                  {tab.badge && (
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${isActive ? 'bg-emerald-200 text-emerald-950' : 'bg-slate-100 text-slate-500'}`}>
                      {tab.badge}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute left-0 w-1 h-3/5 bg-emerald-600 rounded-r-lg top-1/5"></div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* CONTENEDOR MULTI-PANTALLA DINÁMCO DEL SECTOR CREADOR */}
        <div className="lg:col-span-3 space-y-6">

          {/* ==================================== 1. PANTALLA INICIO (CALENDARIO + CHATS CROSS-CREADORES) ==================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* PRESENTACIÓN */}
              <div className="bg-gradient-to-tr from-emerald-800 to-emerald-950 text-white p-5 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-48 opacity-10 bg-[radial-gradient(#fff_1.2px,transparent_1.2px)] [background-size:12px_12px] pointer-events-none"></div>
                <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
                  Muelle de Control de {profile.name}
                </h2>
                <p className="text-xs text-emerald-100/90 leading-relaxed max-w-2xl mt-1.5 font-sans">
                  Bienvenido al centro neurálgico regional. Desde aquí puedes ver las actividades planificadas para el mes, administrar roles de tus músicos en tiempo real y chatear de mestre a mestre con otros directores.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                
                {/* CALENDARIO DE ACTIVIDADES DE JUNIO 2026 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                      <div>
                        <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                          <CalendarDays className="h-4.5 w-4.5 text-emerald-600" />
                          Calendario de Actividades
                        </h3>
                        <p className="text-[10px] text-slate-500 font-medium">Ensayos y actuaciones de este mes (Junio 2026)</p>
                      </div>
                      <span className="text-[10px] bg-slate-100 text-slate-800 font-extrabold px-2.5 py-1 rounded">JUNIO 2026</span>
                    </div>

                    {/* Dias de la semana cabecera */}
                    <div className="grid grid-cols-7 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest gap-2 mb-2">
                      <div>L</div><div>M</div><div>X</div><div>J</div><div>V</div><div>S</div><div>D</div>
                    </div>

                    {/* Grid del calendario */}
                    <div className="grid grid-cols-7 gap-1.5">
                      {Array.from({ length: JuneCalendarDaysCount }).map((_, index) => {
                        const day = index + 1;
                        const dayEvents = getEventForDay(day);
                        const hasEnsayo = dayEvents.some(e => e.type === 'Ensayo');
                        const hasBolo = dayEvents.some(e => e.type === 'Bolo');
                        
                        const isSelected = selectedCalendarDay === day;

                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => setSelectedCalendarDay(day)}
                            className={`p-2 rounded-xl text-center text-xs font-bold transition-all relative flex flex-col items-center justify-between h-12 cursor-pointer ${
                              isSelected 
                                ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 scale-95 shadow-sm' 
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                            }`}
                          >
                            <span>{day}</span>
                            
                            {/* Bullet indicators for events */}
                            <div className="flex gap-1 justify-center mt-1">
                              {hasEnsayo && (
                                <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-green-500'}`} title="Ensayo agendado"></span>
                              )}
                              {hasBolo && (
                                <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white font-black' : 'bg-amber-500 animate-pulse'}`} title="Bolo pactado"></span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Informacion de eventos para el dia seleccionado */}
                  <div className="mt-4 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <span className="block text-[10px] font-black text-emerald-800 uppercase tracking-wider mb-2">
                      Pulse en el calendario: Detalle del día {selectedCalendarDay} de junio
                    </span>
                    {getEventForDay(selectedCalendarDay).length > 0 ? (
                      <div className="space-y-1.5">
                        {getEventForDay(selectedCalendarDay).map((ev) => (
                          <div key={ev.id} className="text-xs bg-white p-2 rounded-lg border border-emerald-100 shadow-3xs flex items-center justify-between gap-1.5">
                            <div>
                              <strong className={`${ev.type === 'Bolo' ? 'text-amber-700' : 'text-green-700'} font-bold`}>
                                [{ev.type}] {ev.title}
                              </strong>
                              <span className="block text-[10px] text-slate-500 mt-0.5">{ev.time} hs - {ev.address}</span>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleStartEditEvent(ev)}
                                className="text-[10px] px-2 py-0.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold rounded-md transition"
                              >
                                Editar
                              </button>
                              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">
                                {ev.confirmations.length} Asist
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500 italic">No hay ningún ensayo ni bolo planificado para este día. Los parches descansan.</p>
                    )}
                  </div>
                </div>

              </div>
            )}

          {/* ==================================== 2. PANTALLA GESTIÓN DE MIEMBROS Y ROLES ==================================== */}
          {activeTab === 'members' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-5 gap-3">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <span className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
                        <Users className="h-4.5 w-4.5" />
                      </span>
                      Gestión de Músicos Autorizados y Roles
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Estatus actual del bloque de ritmos. Los roles los reasigna el director de manera exclusiva.</p>
                  </div>
                  
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 py-1 px-3 rounded-lg self-start sm:self-center">
                    👥 Total: {members.length} Músico{members.length !== 1 && 's'}
                  </span>
                </div>

                {/* Explicacion de no-afectacion de reseteo */}
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-slate-600 leading-relaxed mb-5 flex items-start gap-2">
                  <UserCheck className="h-4.5 w-4.5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-blue-900 block font-bold">Reseteo Seguro Activado:</strong> 
                    Los alumnos mostrados en esta tabla ya están plenamente registrados y autenticados en el simulador. Si decides cambiar o restablecer la contraseña/código de acceso, **su estatus de acceso no se verá afectado** y podrán seguir ensayando sin interrupción.
                  </div>
                </div>

                {/* Tabla de componentes */}
                <div id="members-management-table" className="border border-slate-150 rounded-xl overflow-hidden mb-6 bg-white shadow-3xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-extrabold border-b border-slate-200 uppercase tracking-wider text-[10px]/[12px]">
                        <th className="p-3 pl-4">Músico / Email</th>
                        <th className="p-3">Instrumento de Fila</th>
                        <th className="p-3">Rol del Componente</th>
                        <th className="p-3 text-center">F. Incorporación</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {members.map((mem) => (
                        <tr key={mem.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3 pl-4">
                            <div className="font-extrabold text-slate-900">{mem.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{mem.email}</div>
                          </td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 text-yellow-950 font-bold rounded-lg border border-yellow-200">
                              <Drum className="h-3 w-3 text-yellow-600" />
                              {mem.instrument}
                            </span>
                          </td>
                          <td className="p-3">
                            <select
                              value={mem.role}
                              id={`select-role-for-member-${mem.id}`}
                              onChange={(e) => onUpdateMemberRole(mem.id, e.target.value)}
                              className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 block w-full max-w-[190px] font-bold"
                            >
                              {roles.map((r) => (
                                <option key={r.id} value={r.name}>
                                  {r.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-3 text-center font-mono text-slate-400 text-[10px]">
                            {mem.joinedAt}
                          </td>
                        </tr>
                      ))}

                      {members.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-center py-10 text-slate-400 italic">
                            No hay alumnos registrados actualmente en esta batucada. Los nuevos alumnos aparecerán automáticamente aquí al ingresar su clave.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Subseccion: Roles disponibles o nuevos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div className="space-y-3">
                    <h3 className="text-sm font-extrabold text-slate-900">Listado de Roles del Organigrama</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      La siguiente estructura define los cargos disponibles que puedes asignar a tus alumnos. El rol base Alumno/Componente es el inicial obligatorio.
                    </p>

                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                      {roles.map((role) => (
                        <div 
                          key={role.id}
                          className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-150 text-[11px]"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className={`h-2.5 w-2.5 rounded-full ${role.isCustom ? 'bg-amber-400' : 'bg-slate-400'}`}></span>
                            <span className="font-bold text-slate-800">{role.name}</span>
                          </div>
                          {role.isCustom ? (
                            <button
                              type="button"
                              id={`delete-role-btn-${role.id}`}
                              onClick={() => onDeleteRole(role.id)}
                              className="text-slate-400 hover:text-red-600 transition-colors"
                              title="Borrar cargo rítmico"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            <span className="text-[9px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded uppercase">Obligatorio</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleRoleSubmit} className="p-4 bg-yellow-50/50 rounded-2xl border border-yellow-200/80 space-y-3">
                    <h3 className="text-xs font-bold text-yellow-950 uppercase tracking-widest flex items-center gap-1">
                      <Plus className="h-3.5 w-3.5 text-amber-500" /> Crear Cargo o Rol nuevo para el Bloque
                    </h3>
                    <p className="text-[10px] text-slate-600 leading-relaxed">
                      Añade roles organizativos como Coordinador, Tesorero, Encargado, etc. Podrás asignarlo de inmediato en el desplegable de arriba.
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre del Cargo nuevo</label>
                        <input
                          type="text"
                          id="new-role-input-field"
                          value={newRoleName}
                          onChange={(e) => setNewRoleName(e.target.value)}
                          placeholder="ej. Ayudante de Afinación / Directiva"
                          className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      <button
                        type="submit"
                        id="add-custom-role-submit-btn"
                        className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg text-xs transition-all cursor-pointer"
                      >
                        Crear e Incorporar Rol de Lado
                      </button>
                    </div>
                  </form>
                </div>

              </div>

            </div>
          )}

          {/* ==================================== 3. PANTALLA ALERTAS RADIALES ==================================== */}
          {activeTab === 'alerts' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="p-1.5 bg-rose-50 text-rose-700 rounded-lg">
                    <Bell className="h-4.5 w-4.5" />
                  </span>
                  Mensajes Urgentes
                </h2>
                <span className="text-xs text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-md animate-pulse">Alta Prioridad</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Formulario */}
                <form onSubmit={handleAlertSubmit} className="md:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Publicar aviso en directo</h3>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 leading-snug">Texto o Mensaje del Bulletin</label>
                    <textarea
                      id="alert-message-textarea-active"
                      value={alertMessage}
                      onChange={(e) => setAlertMessage(e.target.value)}
                      rows={4}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                      placeholder="Indica cambios de hora, vestimenta o cancelaciones de última hora..."
                      required
                    ></textarea>
                  </div>

                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-[10px] font-extrabold text-rose-800 flex items-center gap-1.5 leading-snug">
                    <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                    Todos los mensajes enviados desde esta sección serán urgentes.
                  </div>

                  <button
                    type="submit"
                    id="publish-alert-inner-btn"
                    className="w-full py-2.5 px-4 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all cursor-pointer shadow-sm"
                  >
                    ⚠️ Transmitir Alerta Crítica (Aviso Rojo)
                  </button>
                </form>

                {/* Listado */}
                <div className="md:col-span-7 space-y-3">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">Avisos Activos de esta batucada</h3>
                  
                  <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                    {alerts.filter(al => al.batucadaId === profile.id).map((al) => (
                      <div 
                        key={al.id}
                        className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${
                          al.urgent ? 'bg-rose-50/70 border-rose-200' : 'bg-slate-50/60 border-slate-200'
                        }`}
                      >
                        <div className="flex gap-2.5 min-w-0">
                          <div className={`p-1 mt-0.5 rounded shrink-0 ${al.urgent ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-600'}`}>
                            <AlertTriangle className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-900 leading-relaxed">{al.message}</p>
                            <span className="text-[9px] text-slate-400 mt-1 block font-mono">Emitido: {al.timestamp}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          id={`delete-alert-btn-${al.id}`}
                          onClick={() => onDeleteAlert(al.id)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded-md shrink-0 transition-colors"
                          title="Eliminar este aviso de la cartelera"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}

                    {alerts.filter(al => al.batucadaId === profile.id).length === 0 && (
                      <div className="text-center py-10 border border-slate-200 rounded-xl text-[11px] text-slate-400">
                        La cartelera está vacía. No hay ninguna alerta programada para tus alumnos de {profile.name}.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==================================== 4. PANTALLA AGENDA DE BOLOS Y ENSAYOS ==================================== */}
          {activeTab === 'events' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">
                    <Calendar className="h-4.5 w-4.5" />
                  </span>
                  Agenda
                </h2>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-widest bg-slate-50 px-2.5 py-0.5 rounded-md">Asistencia</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Formulario */}
                <form onSubmit={handleEventSubmit} className="lg:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-3.5">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1">
                    <Plus className="h-4 w-4 text-emerald-600" /> {editingEventId ? 'Editar Evento' : 'Nuevo Evento'}
                  </h3>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Título</label>
                    <input
                      type="text"
                      id="event-title-input-el"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      placeholder="ej. Ensayo de ritmo o concierto"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Categoría</label>
                      <select
                        id="event-type-select-el"
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value as any)}
                        className="w-full text-xs px-2 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none"
                      >
                        <option value="Ensayo">🥁 Ensayo</option>
                        <option value="Clase">📖 Clase</option>
                        <option value="Bolo">✨ Bolo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Hora</label>
                      <input
                        type="time"
                        id="event-time-input-el"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Fecha</label>
                      <input
                        type="date"
                        id="event-date-input-el"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1.5">Ubicación de Encuentro</label>
                      
                      {/* TABS SELECTOR (pestañas) */}
                      <div className="grid grid-cols-2 gap-1 mb-2 p-1 bg-slate-200/50 rounded-xl border border-slate-300">
                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomLocation(false);
                            setEventAddress('');
                          }}
                          className={`py-1 px-2 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                            !isCustomLocation
                              ? 'bg-white text-slate-950 shadow-3xs border border-slate-250'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          🏢 Local Principal
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsCustomLocation(true)}
                          className={`py-1 px-2 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                            isCustomLocation
                              ? 'bg-white text-slate-950 shadow-3xs border border-slate-250'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          📍 Lugar distinto
                        </button>
                      </div>

                      {isCustomLocation ? (
                        <div className="space-y-1 animate-fadeIn">
                          <input
                            type="text"
                            id="event-address-input-el"
                            value={eventAddress}
                            onChange={(e) => setEventAddress(e.target.value)}
                            className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white text-slate-950 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            placeholder="ej. Parque de María Luisa, Sevilla"
                            required
                          />
                        </div>
                      ) : (
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[10px] text-slate-700 leading-normal animate-fadeIn">
                          <span className="font-extrabold text-slate-950 block">Local Social de la Asociación</span>
                          Calle Metalurgias, Nave 12, P.I. Calonge, Sevilla
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Descripción</label>
                    <textarea
                      id="event-desc-textarea-el"
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                      rows={2}
                      placeholder="ej. Traer baquetas y agua."
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-905 focus:outline-none"
                    ></textarea>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      id="add-event-submit-inner-btn"
                      className="flex-grow py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      {editingEventId ? '💾 Guardar Cambios' : '🚀 Agendar Evento'}
                    </button>
                    {editingEventId && (
                      <button
                        type="button"
                        onClick={handleCancelEditEvent}
                        className="py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg text-xs transition-colors cursor-pointer animate-fadeIn"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>

                {/* Listado con lista de asistencias */}
                <div className="lg:col-span-7 space-y-4 max-h-[460px] overflow-y-auto pr-1">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">Eventos de esta batucada convocados</h3>
                  
                  {filteredEventsForActiveBatucada.map((ev) => (
                    <div key={ev.id} className="p-4 bg-slate-50 rounded-xl border border-slate-150 relative">
                      <div className="absolute top-4 right-4 flex items-center gap-1">
                        <button
                          type="button"
                          id={`edit-event-${ev.id}`}
                          onClick={() => handleStartEditEvent(ev)}
                          className="text-slate-400 hover:text-amber-600 p-1 rounded transition-colors"
                          title="Editar actividad"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          id={`delete-event-${ev.id}`}
                          onClick={() => onDeleteEvent(ev.id)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors"
                          title="Borrar convocatoria"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex gap-2 mb-2">
                        <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-md border ${
                          ev.type === 'Bolo' 
                            ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse' 
                            : 'bg-green-100 text-green-900 border-green-300'
                        }`}>
                          {ev.type}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-500">{ev.date} - {ev.time} hs</span>
                      </div>

                      <h4 className="text-xs font-black text-slate-950 pr-8">{ev.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-normal"><strong className="font-extrabold text-slate-800">📍 Dirección:</strong> {ev.address}</p>
                      
                      {ev.description && (
                        <p className="text-[10px] text-slate-600 mt-1 pl-2 border-l border-slate-200">{ev.description}</p>
                      )}

                      {/* Lista de quienes confirmaron / declinaron */}
                      <div className="mt-3.5 pt-3 border-t border-slate-200/60 grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[9px] font-black text-green-700 block uppercase mb-1">Confirmados ({ev.confirmations.length})</span>
                          {ev.confirmations.length > 0 ? (
                            <div className="space-y-0.5">
                              {ev.confirmations.map((conf, index) => (
                                <span key={index} className="text-[9px] block text-slate-600 truncate font-medium bg-white px-1 py-0.5 rounded border border-slate-150">✔️ {conf}</span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[9px] text-slate-400 block italic">Nadie confirmado aún</span>
                          )}
                        </div>

                        <div>
                          <span className="text-[9px] font-black text-rose-600 block uppercase mb-1">Declinados ({ev.declined.length})</span>
                          {ev.declined.length > 0 ? (
                            <div className="space-y-0.5">
                              {ev.declined.map((dec, index) => (
                                <span key={index} className="text-[9px] block text-slate-600 truncate font-medium bg-white px-1 py-0.5 rounded border border-slate-150">❌ {dec}</span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[9px] text-slate-400 block italic">Sin declinaciones</span>
                          )}
                        </div>
                      </div>

                    </div>
                  ))}

                  {filteredEventsForActiveBatucada.length === 0 && (
                    <div className="text-center py-10 border border-slate-200 rounded-xl text-slate-400 text-xs">
                      No hay ensayos ni actuaciones registradas actualmente para {profile.name}.
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* ==================================== 5. PANTALLA VIDEOTECA TÉCNICA ==================================== */}
          {activeTab === 'videos' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="p-1.5 bg-sky-50 text-sky-700 rounded-lg">
                    <Video className="h-4.5 w-4.5" />
                  </span>
                  Videoteca / Banco de Ensayos Grabados
                </h2>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-widest bg-slate-50 px-2.5 py-0.5 rounded-md">Canal de Repaso</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Formulario */}
                <form onSubmit={handleVideoSubmit} className="lg:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Subir Vídeo de afinación o técnica</h3>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Título del Vídeo</label>
                    <input
                      type="text"
                      id="video-title-input-inner"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none"
                      placeholder="ej. Ritmo Básico Samba Reggae lento / Parada Teléfono"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Enlace (YouTube / Vimeo / Drive)</label>
                      <input
                        type="url"
                        id="video-url-input-inner"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none"
                        placeholder="https://www.youtube.com/watch?v=..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Categoría del Vídeo</label>
                      <select
                        id="video-category-select-inner"
                        value={videoCategory}
                        onChange={(e) => setVideoCategory(e.target.value as any)}
                        className="w-full text-xs px-2 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none"
                      >
                        <option value="Ritmo">🥁 Ritmo Completo</option>
                        <option value="Corte">🛑 Parada / Corte Técnico</option>
                        <option value="Coreografía">💃 Expresión y Coreografía</option>
                        <option value="Otros">💡 Regulación / Afinación / Consejos</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Notas / Consejos del Mestre</label>
                    <textarea
                      id="video-desc-textarea-inner"
                      value={videoDesc}
                      onChange={(e) => setVideoDesc(e.target.value)}
                      rows={2}
                      placeholder="Petición del profesor. ej: Practicar el tres contra dos en casa del surdo..."
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    id="add-video-submit-inner-btn"
                    className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    Publish Video Tutorial
                  </button>
                </form>

                {/* Listado */}
                <div className="lg:col-span-7 space-y-3">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">Videos del canal de repaso</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-1">
                    {videos.filter(v => v.batucadaId === profile.id).map((v) => (
                      <div key={v.id} className="bg-slate-50 p-3 rounded-xl border border-slate-150 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-1.5 mb-1 bg-white p-1 rounded border border-slate-200">
                            <span className="px-1.5 py-0.5 bg-sky-100 text-sky-800 text-[8px] font-black uppercase rounded">
                              {v.category}
                            </span>
                            <button
                              type="button"
                              id={`delete-video-btn-${v.id}`}
                              onClick={() => onDeleteVideo(v.id)}
                              className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors"
                              title="Borrar video"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="font-sans block text-xs font-black text-slate-900 leading-tight mt-1 truncate-2-lines">{v.title}</span>
                          {v.description && (
                            <p className="text-[10px] text-slate-500 italic mt-0.5 leading-normal">"{v.description}"</p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between mt-3 text-[10px]">
                          <span className="max-w-[120px] truncate block text-[9px] text-slate-400 font-mono">{v.url}</span>
                          <a 
                            href={v.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-600 hover:text-sky-800 font-black flex items-center gap-0.5"
                          >
                            Ir a enlace <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        </div>
                      </div>
                    ))}

                    {videos.filter(v => v.batucadaId === profile.id).length === 0 && (
                      <div className="col-span-2 text-center py-10 border border-slate-200 rounded-xl text-[11px] text-slate-400">
                        No hay videos tutoriales grabados para esta batucada.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==================================== 6. PANTALLA CONFIGURACIÓN Y CONTRASEÑA ==================================== */}
          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6 animate-fadeIn">
              
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="p-1.5 bg-slate-100 text-slate-700 rounded-lg">
                    <Key className="h-4.5 w-4.5" />
                  </span>
                  Ajustes Generales del Bloque y Clave de Ingreso
                </h2>
                <p className="text-xs text-slate-500 mt-1">Personaliza la estética, la ubicación y las credenciales rítmicas del grupo.</p>
              </div>

              {/* CLAVE DE ACCESO CONFIGURATION CON RESETEO FÁCIL */}
              <div id="credential-access-reset-card" className="p-5 rounded-2xl border bg-gradient-to-r from-emerald-800/10 to-transparent border-emerald-500/20 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                
                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-center gap-1.5 text-slate-950 font-black text-sm">
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                    <h4>Clave de Acceso Rápido del Alumnado</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-normal max-w-lg">
                    Los alumnos usan este código al darse de alta en vuestra sala de percusión. Puedes editarlo o resetearlo a un código rítmico fácil aleatorio con un click.
                  </p>
                  
                  <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200/90 w-max mt-2 shadow-3xs">
                    <div className="px-3.5 py-1 bg-emerald-50 text-emerald-800 font-extrabold font-mono text-xs rounded border border-emerald-100 tracking-wider">
                      CÓDIGO DE ENTRADA:
                    </div>
                    <span className="text-base font-black px-3 font-mono text-emerald-700">{profAccessCode}</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3 self-stretch flex flex-col justify-between">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none block">Acción de Reset Directo</span>
                  
                  <button
                    type="button"
                    onClick={handleGenerateEasyCode}
                    id="reset-access-code-quick-btn"
                    className="py-2 px-3 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-extrabold rounded-lg text-xs transition-all flex items-center gap-1 justify-center shadow-3xs cursor-pointer transform active:scale-95"
                    title="Restablece instantáneamente un código fácil y rápido de recordar para tus alumnos"
                  >
                    <Shuffle className="h-4 w-4" />
                    <span>Regenerar Clave Fácil</span>
                  </button>

                  <span className="text-[9px] text-slate-400 font-medium block leading-snug">
                    🛡️ Los músicos ya registrados por email **no perderán su acceso** si cambias el código.
                  </span>
                </div>

              </div>

              {/* FORMULARIO EDITORIAL */}
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Nombre Completo del Bloque</label>
                    <input
                      type="text"
                      id="edit-profile-name"
                      value={profName}
                      onChange={(e) => setProfName(e.target.value)}
                      className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white font-bold leading-normal text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      placeholder="ej. Batucada Samba do Sol"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Ciudad o Región Principal</label>
                    <input
                      type="text"
                      id="edit-profile-city"
                      value={profCity}
                      onChange={(e) => setProfCity(e.target.value)}
                      className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white font-semibold leading-normal text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      placeholder="ej. Sevilla, España"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Clave de Acceso Manual (Editable)</label>
                  <input
                    type="text"
                    id="edit-profile-access-code"
                    value={profAccessCode}
                    onChange={(e) => setProfAccessCode(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white font-mono uppercase tracking-wider font-extrabold text-slate-900 focus:outline-none"
                    placeholder="ej. SOL123"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Fondo de Portada (Enlace URL)</label>
                  <input
                    type="text"
                    id="edit-profile-cover"
                    value={profCover}
                    onChange={(e) => setProfCover(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white font-mono text-[10px] text-slate-700 focus:outline-none"
                    placeholder="URL directa de Unsplash"
                    required
                  />
                </div>

                {/* Preset cover picker */}
                <div>
                  <span className="block text-xs font-bold text-slate-600 mb-2">Selecciona un Temas Estético y Sabor Regional de Fondo</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    {SUGGESTED_COVERS.map((cov, index) => (
                      <button
                        key={index}
                        type="button"
                        id={`select-cover-${index}`}
                        onClick={() => handleSelectPresetCover(cov.url)}
                        className={`text-left p-1.5 rounded-xl border text-xs transition-all relative overflow-hidden flex flex-col justify-between ${
                          profCover === cov.url 
                            ? 'border-emerald-600 bg-emerald-50/70 font-bold text-emerald-950 ring-2 ring-emerald-500/10' 
                            : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="h-10 w-full rounded-md bg-slate-200 mb-1.5 overflow-hidden">
                          <img src={cov.url} alt="preset" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <span className="text-[10px]/[12px] truncate block font-sans font-bold text-slate-750">{cov.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    id="save-profile-btn"
                    className="flex-1 py-2 px-4 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Guardar Perfil del Bloque
                  </button>
                  {profileSuccess && (
                    <span id="profile-success-msg" className="text-xs font-semibold text-emerald-600 animate-pulse flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> ¡Guardado con éxito!
                    </span>
                  )}
                </div>
              </form>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
