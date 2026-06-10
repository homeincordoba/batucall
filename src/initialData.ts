/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BatucadaProfile, BatucadaEvent, UrgentAlert, VideoResource, UserRole, BatucadaMember, OrganizerMessage } from './types';

export const DEFAULT_BATUCADAS: BatucadaProfile[] = [
  {
    id: "batucada-1",
    name: "Mi Nueva Batucada",
    city: "Mi Ciudad, España",
    coverUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80",
    accessCode: "BATU123"
  }
];

export const DEFAULT_PROFILE: BatucadaProfile = DEFAULT_BATUCADAS[0];

export const BASE_ROLES: UserRole[] = [
  { id: "role-1", name: "Organizador / Director", isCustom: false },
  { id: "role-2", name: "Profesor / Mestre", isCustom: false },
  { id: "role-3", name: "Socio Registrado", isCustom: false },
  { id: "role-4", name: "Alumno / Componente", isCustom: false }
];

export const SUGGESTED_COVERS = [
  {
    name: "Latidos de Samba (Música y Ritmo)",
    url: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Luces de Fiesta (Energía y Show)",
    url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Ritmos de la Calle (Tradición de Carnaval)",
    url: "https://images.unsplash.com/photo-1564186763535-ebb21ec5271a?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Tambores Ancestrales (Percusión Pura)",
    url: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1200&q=80"
  }
];

export const DEFAULT_ALERTS: UrgentAlert[] = [];

export const DEFAULT_EVENTS: BatucadaEvent[] = [];

export const DEFAULT_VIDEOS: VideoResource[] = [];

export const MOTIVATIONAL_PHRASES: string[] = [
  "La unión hace la fuerza, la percusión hace el latido. ¡Dale duro al mazo!",
  "El tempo no se corre, se siente dentro. ¡Escucha siempre a los surdos de marcación!",
  "Un bloque musical unido suena como un único gigante latiendo. ¡Confía en tus compañeros!",
  "La clave de una gran Batucada está en la comunicación visual y la sonrisa compartida. ¡Goza el ritmo!",
  "El silbato del director es ley, pero tu energía vibrando es el auténtico motor de la calle.",
  "La tensión muscular apaga el timbre del tambor. Suelta hombros, sonríe y fluye con el compás.",
  "Mismo pulso, mismo latido, misma pasión. ¡Hoy sonamos el doble de fuerte!"
];

export const PRESET_INSTRUMENTS: string[] = [
  "Surdo de Primera (Marcador)",
  "Surdo de Segunda (Respondedor)",
  "Surdo de Tercera (Cortador / Dobra)",
  "Repique (Repinique)",
  "Caja (Tarol)",
  "Chocalho (Platinelas)",
  "Agogó",
  "Tamborim",
  "Silbato / Dirección"
];

export const DEFAULT_MEMBERS: BatucadaMember[] = [];

export const DEFAULT_ORGANIZER_MESSAGES: OrganizerMessage[] = [];
