/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BatucadaProfile {
  id: string;
  name: string;
  city: string;
  coverUrl: string;
  accessCode: string; // The access code provided by the organizer / mestre
}

export type EventType = 'Ensayo' | 'Clase' | 'Bolo';

export interface BatucadaEvent {
  id: string;
  batucadaId: string; // Reference to parent batucada profile
  title: string;
  type: EventType;
  date: string;
  time: string;
  address: string;
  description: string;
  confirmations: string[]; // List of user names/emails who confirmed "SÍ"
  declined: string[];      // List of user names/emails who confirmed "NO"
}

export interface UrgentAlert {
  id: string;
  batucadaId: string; // Reference to parent batucada profile
  message: string;
  timestamp: string;
  urgent: boolean;
}

export interface VideoResource {
  id: string;
  batucadaId: string; // Reference to parent batucada profile
  title: string;
  url: string;
  category: 'Ritmo' | 'Corte' | 'Coreografía' | 'Otros';
  description?: string;
}

export interface UserRole {
  id: string;
  name: string;
  isCustom: boolean;
}

export interface StudentSession {
  name: string;
  email: string;
  role: string;
  instrument: string;
}

export interface BatucadaMember {
  id: string; // unique ID or email
  batucadaId: string;
  name: string;
  email: string;
  instrument: string;
  role: string;
  joinedAt: string;
}

export interface OrganizerMessage {
  id: string;
  senderBatucadaId: string;
  recipientBatucadaId: string;
  senderName: string;
  recipientName: string;
  message: string;
  timestamp: string;
  isIncoming: boolean;
}

