/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Drum, Sparkles, LogOut, ArrowLeftRight, HelpCircle, User, 
  Settings, CheckCircle2, RefreshCw, Layers
} from 'lucide-react';

import { BatucadaProfile, BatucadaEvent, UrgentAlert, VideoResource, UserRole, StudentSession, BatucadaMember, OrganizerMessage } from './types';
import { 
  DEFAULT_PROFILE, BASE_ROLES, DEFAULT_ALERTS, DEFAULT_EVENTS, 
  DEFAULT_VIDEOS, DEFAULT_BATUCADAS, DEFAULT_MEMBERS, DEFAULT_ORGANIZER_MESSAGES
} from './initialData';

import LoginScreen from './components/LoginScreen';
import OrganizerPanel from './components/OrganizerPanel';
import StudentPanel from './components/StudentPanel';
import BatucadaSelector from './components/BatucadaSelector';
import FooterCredits from './components/FooterCredits';

export default function App() {
  
  // --- Persistent States from LocalStorage ---
  const [batucadas, setBatucadas] = useState<BatucadaProfile[]>(() => {
    const raw = localStorage.getItem('batucada_list');
    return raw ? JSON.parse(raw) : DEFAULT_BATUCADAS;
  });

  const [profile, setProfile] = useState<BatucadaProfile>(() => {
    const raw = localStorage.getItem('batucada_profile');
    return raw ? JSON.parse(raw) : DEFAULT_PROFILE;
  });

  const [joinedBatucadaId, setJoinedBatucadaId] = useState<string | null>(() => {
    return localStorage.getItem('joined_batucada_id');
  });

  const [roles, setRoles] = useState<UserRole[]>(() => {
    const raw = localStorage.getItem('batucada_roles');
    return raw ? JSON.parse(raw) : BASE_ROLES;
  });

  const [alerts, setAlerts] = useState<UrgentAlert[]>(() => {
    const raw = localStorage.getItem('batucada_alerts');
    return raw ? JSON.parse(raw) : DEFAULT_ALERTS;
  });

  const [events, setEvents] = useState<BatucadaEvent[]>(() => {
    const raw = localStorage.getItem('batucada_events');
    return raw ? JSON.parse(raw) : DEFAULT_EVENTS;
  });

  const [videos, setVideos] = useState<VideoResource[]>(() => {
    const raw = localStorage.getItem('batucada_videos');
    return raw ? JSON.parse(raw) : DEFAULT_VIDEOS;
  });

  const [members, setMembers] = useState<BatucadaMember[]>(() => {
    const raw = localStorage.getItem('batucada_members');
    return raw ? JSON.parse(raw) : DEFAULT_MEMBERS;
  });

  const [organizerMessages, setOrganizerMessages] = useState<OrganizerMessage[]>(() => {
    const raw = localStorage.getItem('batucada_org_messages');
    return raw ? JSON.parse(raw) : DEFAULT_ORGANIZER_MESSAGES;
  });

  // --- Session login state ---
  const [userSession, setUserSession] = useState<{
    roleType: 'creator' | 'student';
    studentData?: StudentSession;
  } | null>(() => {
    const raw = localStorage.getItem('batucada_session');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (joinedBatucadaId) {
      localStorage.setItem('joined_batucada_id', joinedBatucadaId);
    } else {
      localStorage.removeItem('joined_batucada_id');
    }
  }, [joinedBatucadaId]);

  // Save changes to LocalStorage whenever state updates
  useEffect(() => {
    localStorage.setItem('batucada_list', JSON.stringify(batucadas));
  }, [batucadas]);

  useEffect(() => {
    localStorage.setItem('batucada_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('batucada_roles', JSON.stringify(roles));
  }, [roles]);

  useEffect(() => {
    localStorage.setItem('batucada_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('batucada_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('batucada_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('batucada_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('batucada_org_messages', JSON.stringify(organizerMessages));
  }, [organizerMessages]);

  useEffect(() => {
    if (userSession) {
      localStorage.setItem('batucada_session', JSON.stringify(userSession));
    } else {
      localStorage.removeItem('batucada_session');
    }
  }, [userSession]);


  // --- Event Handling functions ---

  // Handle profile update
  const handleUpdateProfile = (newProfile: BatucadaProfile) => {
    setProfile(newProfile);
    setBatucadas(prev => prev.map(bat => bat.id === newProfile.id ? newProfile : bat));
  };

  // Create custom role
  const handleCreateRole = (roleName: string) => {
    const newRole: UserRole = {
      id: `role-${Date.now()}`,
      name: roleName,
      isCustom: true
    };
    setRoles(prev => [...prev, newRole]);
  };

  // Delete custom role
  const handleDeleteRole = (id: string) => {
    setRoles(prev => prev.filter(r => r.id !== id));
  };

  // Send an alert
  const handleAddAlert = (message: string, urgent: boolean) => {
    const newAlert: UrgentAlert = {
      id: `alert-${Date.now()}`,
      batucadaId: profile.id || "batucada-1",
      message,
      urgent,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + " (Hoy)"
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  // Delete warning alert
  const handleDeleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(al => al.id !== id));
  };

  // Schedule rehearsal or gig
  const handleAddEvent = (newEventData: Omit<BatucadaEvent, 'id' | 'confirmations' | 'declined' | 'batucadaId'>) => {
    const newEvent: BatucadaEvent = {
      ...newEventData,
      id: `event-${Date.now()}`,
      batucadaId: profile.id || "batucada-1",
      confirmations: [],
      declined: []
    };
    setEvents(prev => [newEvent, ...prev]);
  };

  // Delete scheduled event
  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(ev => ev.id !== id));
  };

  // Edit scheduled event
  const handleEditEvent = (updatedEvent: BatucadaEvent) => {
    setEvents(prev => prev.map(ev => ev.id === updatedEvent.id ? updatedEvent : ev));
  };

  // Add video resource
  const handleAddVideo = (newVideoData: Omit<VideoResource, 'id' | 'batucadaId'>) => {
    const newVideo: VideoResource = {
      ...newVideoData,
      id: `video-${Date.now()}`,
      batucadaId: profile.id || "batucada-1"
    };
    setVideos(prev => [newVideo, ...prev]);
  };

  // Delete video tutorial
  const handleDeleteVideo = (id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  // Toggle student event attendance
  const handleToggleAttendance = (eventId: string, email: string, attending: boolean) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev;

      // Filter out existing replies in both lists first
      const nextConf = ev.confirmations.filter(e => e !== email);
      const nextDecl = ev.declined.filter(e => e !== email);

      if (attending) {
        nextConf.push(email);
      } else {
        nextDecl.push(email);
      }

      return {
        ...ev,
        confirmations: nextConf,
        declined: nextDecl
      };
    }));
  };

  // Batucada Selector callback
  const handleSelectBatucada = (selected: BatucadaProfile) => {
    setProfile(selected);
    setJoinedBatucadaId(selected.id);

    // Register student securely to this batucada list of members if not already
    if (userSession && userSession.roleType === 'student' && userSession.studentData) {
      const email = userSession.studentData.email;
      const alreadyListed = members.some(m => m.email.toLowerCase() === email.toLowerCase() && m.batucadaId === selected.id);
      
      if (!alreadyListed) {
        const newPlayer: BatucadaMember = {
          id: `mem-${Date.now()}`,
          batucadaId: selected.id,
          name: userSession.studentData.name,
          email: email,
          instrument: userSession.studentData.instrument || "Repique (Repinique)",
          role: "Alumno / Componente", // Everyone joins in student role initially as required
          joinedAt: new Date().toISOString().split('T')[0]
        };
        setMembers(prev => [...prev, newPlayer]);
      }
    }
  };

  // Callback to let the organizer update any member's role
  const handleUpdateMemberRole = (memberId: string, newRole: string) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
  };

  // Callback to allow cross-organizer chat messages
  const handleSendOrganizerMessage = (recipientBatucadaId: string, messageText: string) => {
    const activeBatucadaId = profile.id;
    const activeMestreName = `Director ${profile.name.replace("Batucada ", "")}`;
    const targetBat = batucadas.find(b => b.id === recipientBatucadaId);
    const recipientMestreName = targetBat ? `Director ${targetBat.name.replace("Batucada ", "")}` : "Mestre";

    const newMsg: OrganizerMessage = {
      id: `msg-${Date.now()}`,
      senderBatucadaId: activeBatucadaId,
      recipientBatucadaId,
      senderName: activeMestreName,
      recipientName: recipientMestreName,
      message: messageText,
      timestamp: "Hoy, " + new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      isIncoming: false
    };

    setOrganizerMessages(prev => [...prev, newMsg]);

    // Live-simulated automated typing and reply!
    setTimeout(() => {
      const answers = [
        "¡Excelente propuesta compañero! Me parece una idea fantástica. Vamos a plantearlo en la junta del bloque.",
        "Hola Lucía, de acuerdo. Nos viene genial el parque de Sevilla para hacer una quedada general este mes.",
        "¡Estupendo mestre! Sí, nosotros usamos mazas de dureza media de fieltro. Le da un sonido gordo y tradicional.",
        "Totalmente de acuerdo, la unión de nuestros tambores dará fuerza a la percusión andaluza. ¡Seguimos planificando!",
        "¡Gracias por contactar! Tomamos nota y te contestamos más despacio a lo largo de esta semana."
      ];
      const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
      
      const replyMsg: OrganizerMessage = {
        id: `msg-reply-${Date.now()}`,
        senderBatucadaId: recipientBatucadaId,
        recipientBatucadaId: activeBatucadaId,
        senderName: recipientMestreName,
        recipientName: activeMestreName,
        message: randomAnswer,
        timestamp: "Hoy, " + new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        isIncoming: true
      };
      setOrganizerMessages(prev => [...prev, replyMsg]);
    }, 1500);
  };

  // Switch session handler
  const handleLogin = (roleType: 'creator' | 'student', studentData?: StudentSession) => {
    setUserSession({
      roleType,
      studentData
    });
    // For direct student login, let them pick batucada. For creator, keep profile.
    if (roleType === 'creator') {
      const defaultBat = batucadas.find(b => b.id === 'batucada-1') || batucadas[0];
      setProfile(defaultBat);
    } else if (roleType === 'student' && studentData) {
      // Force default role initially to Alumno / Componente as required
      studentData.role = "Alumno / Componente";
    }
  };

  // Log out of simulator
  const handleLogout = () => {
    setUserSession(null);
    setJoinedBatucadaId(null);
  };

  // Smart Simulator switcher role toggle
  const toggleSimulatorRole = () => {
    if (!userSession) return;
    if (userSession.roleType === 'creator') {
      const defaultMartaData = {
        name: "Marta de de Sevilla",
        email: "homeincordoba@gmail.com",
        instrument: "Repique (Repinique)",
        role: "Alumno / Componente" // forced initially to Alumno
      };
      setUserSession({
        roleType: 'student',
        studentData: defaultMartaData
      });
      // Pre-set Samba do Sol (batucada-1) for quick simulation bypass, or let select
      setJoinedBatucadaId('batucada-1');
      const defaultBat = batucadas.find(b => b.id === 'batucada-1') || batucadas[0];
      setProfile(defaultBat);

      // Register or verify Marta in members database for batucada-1
      const alreadyListed = members.some(m => m.email.toLowerCase() === defaultMartaData.email.toLowerCase() && m.batucadaId === 'batucada-1');
      if (!alreadyListed) {
        const newPlayer: BatucadaMember = {
          id: "mem-1",
          batucadaId: "batucada-1",
          name: defaultMartaData.name,
          email: defaultMartaData.email,
          instrument: defaultMartaData.instrument,
          role: "Alumno / Componente",
          joinedAt: "2026-05-12"
        };
        setMembers(prev => [...prev, newPlayer]);
      }
    } else {
      setUserSession({
        roleType: 'creator'
      });
      // Set to first batucada to manage
      const firstBat = batucadas[0];
      setProfile(firstBat);
    }
  };

  // Reset demo databases
  const handleResetData = () => {
    if (window.confirm("¿Seguro que deseas restablecer los datos por defecto? Esto borrará tus creaciones.")) {
      localStorage.clear();
      setBatucadas(DEFAULT_BATUCADAS);
      setProfile(DEFAULT_PROFILE);
      setRoles(BASE_ROLES);
      setAlerts(DEFAULT_ALERTS);
      setEvents(DEFAULT_EVENTS);
      setVideos(DEFAULT_VIDEOS);
      setUserSession(null);
      setJoinedBatucadaId(null);
    }
  };

  // Compute active student session with dynamic role from persistent members table
  const activeStudentSession = userSession?.roleType === 'student' && userSession.studentData
    ? {
        ...userSession.studentData,
        role: members.find(m => m.email.toLowerCase() === userSession.studentData?.email.toLowerCase() && m.batucadaId === (joinedBatucadaId || profile.id))?.role || "Alumno / Componente"
      }
    : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans transition-colors">
      
      {/* 🛠️ CABECERA GLOBAL DE SIMULACIÓN - Experto UX Tool */}
      {userSession && (
        <div className="bg-emerald-950 text-white font-mono text-[11px] py-2 px-4 shadow-inner flex flex-col md:flex-row justify-between items-center gap-2 border-b border-emerald-900 z-50">
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-800 rounded-md text-[9px] font-extrabold uppercase border border-emerald-600 animate-pulse">
              <RefreshCw className="h-2.5 w-2.5" /> Sincronización en Directo Activa
            </span>
            <span className="text-slate-300">
              Viendo como: <strong className="text-white">{userSession.roleType === 'creator' ? 'Mestre / Creador' : `${activeStudentSession?.name} [${activeStudentSession?.role}]`}</strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleSimulatorRole}
              id="global-sim-switch-btn"
              className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer transform active:scale-95"
              title="Cambia de perfil de inmediato en un solo clic"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
              <span>Cambiar a Vista de {userSession.roleType === 'creator' ? 'Alumno/Músico' : 'Creador (Mestre)'}</span>
            </button>

            <button
              onClick={handleResetData}
              id="global-reset-btn"
              className="text-slate-400 hover:text-rose-400 transition-colors uppercase text-[9px] font-bold"
              title="Restablecer datos originales"
            >
              Restablecer Base
            </button>
          </div>
        </div>
      )}

      {/* SECCIÓN DEL HEADER INTEGRADO */}
      {userSession && (
        <header className="bg-white border-b border-slate-200/80 sticky top-0 md:relative z-44">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
                <Drum className="h-5 w-5" />
              </span>
              <div>
                <span className="font-extrabold text-slate-900 tracking-tight block text-lg">Batu<span className="text-emerald-600 font-black">Call</span></span>
                <span className="text-[10px] text-slate-500 block leading-tight">Muelle de Baquetaje</span>
              </div>
            </div>

            {/* User Session menu info */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-900">
                  {userSession.roleType === 'creator' ? 'Administrador General' : activeStudentSession?.name}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">
                  {userSession.roleType === 'creator' ? 'Profesor titular' : `${activeStudentSession?.instrument} (${activeStudentSession?.role})`}
                </span>
              </div>

              {/* Cambiar de Batucada button */}
              {userSession.roleType === 'student' && joinedBatucadaId && (
                <button
                  onClick={() => setJoinedBatucadaId(null)}
                  id="header-change-batucada-btn"
                  className="inline-flex items-center justify-center py-2 px-3 rounded-xl text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-all border border-amber-200 hover:border-amber-300 cursor-pointer text-xs font-bold"
                  title="Volver a la selección de batucadas"
                >
                  <Layers className="h-4 w-4 mr-1.5 text-amber-500" />
                  <span className="hidden sm:inline">Cambiar Batucada</span>
                </button>
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                id="header-logout-btn"
                className="inline-flex items-center justify-center p-2.5 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100 cursor-pointer"
                title="Cerrar sesión en la batucada"
              >
                <LogOut className="h-4.5 w-4.5" />
                <span className="hidden sm:inline text-xs font-bold ml-1.5">Salir</span>
              </button>
            </div>

          </div>
        </header>
      )}

      {/* CONTENIDO PRINCIPAL DE PANTALLAS */}
      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
        {!userSession ? (
          <LoginScreen onLogin={handleLogin} />
        ) : userSession.roleType === 'creator' ? (
          <OrganizerPanel
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            roles={roles}
            onCreateRole={handleCreateRole}
            onDeleteRole={handleDeleteRole}
            alerts={alerts}
            onAddAlert={handleAddAlert}
            onDeleteAlert={handleDeleteAlert}
            events={events}
            onAddEvent={handleAddEvent}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            videos={videos}
            onAddVideo={handleAddVideo}
            onDeleteVideo={handleDeleteVideo}
            batucadas={batucadas}
            members={members.filter(m => m.batucadaId === profile.id)}
            organizerMessages={organizerMessages}
            onUpdateMemberRole={handleUpdateMemberRole}
            onSendOrganizerMessage={handleSendOrganizerMessage}
          />
        ) : !joinedBatucadaId ? (
          <BatucadaSelector
            batucadas={batucadas}
            onSelect={handleSelectBatucada}
            onLogout={handleLogout}
            studentName={userSession.studentData?.name || 'Músico'}
          />
        ) : (
          <StudentPanel
            profile={profile}
            session={activeStudentSession!}
            alerts={alerts.filter(a => a.batucadaId === profile.id)}
            events={events.filter(e => e.batucadaId === profile.id)}
            onToggleAttendance={handleToggleAttendance}
            videos={videos.filter(v => v.batucadaId === profile.id)}
          />
        )}
      </main>

      {/* FOOTER DESCRIPTIVO Y DE CREDITO */}
      <FooterCredits />

    </div>
  );
}
