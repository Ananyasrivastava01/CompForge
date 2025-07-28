import { create } from 'zustand';
import { Session, Component, CreateSessionRequest, UpdateSessionRequest } from '@/types/session';
import { apiClient } from '@/lib/api';

interface SessionStore {
  sessions: Session[];
  currentSession: Session | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadSessions: () => Promise<void>;
  createSession: (data: CreateSessionRequest) => Promise<void>;
  updateSession: (sessionId: string, updates: UpdateSessionRequest) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  setCurrentSession: (session: Session | null) => void;
  updateCurrentComponent: (component: Partial<Component>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessions: [],
  currentSession: null,
  isLoading: false,
  error: null,

  loadSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const sessions = await apiClient.get<Session[]>('/sessions');
      set({ sessions, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to load sessions',
        isLoading: false,
      });
    }
  },

  createSession: async (data: CreateSessionRequest) => {
    set({ isLoading: true, error: null });
    try {
      const newSession = await apiClient.post<Session>('/sessions', data);
      set((state) => ({
        sessions: [...state.sessions, newSession],
        currentSession: newSession,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create session',
        isLoading: false,
      });
      throw error;
    }
  },

  updateSession: async (sessionId: string, updates: UpdateSessionRequest) => {
    set({ isLoading: true, error: null });
    try {
      const updatedSession = await apiClient.patch<Session>(`/sessions/${sessionId}`, updates);
      set((state) => ({
        sessions: state.sessions.map(s => s.id === sessionId ? updatedSession : s),
        currentSession: state.currentSession?.id === sessionId ? updatedSession : state.currentSession,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update session',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteSession: async (sessionId: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/sessions/${sessionId}`);
      set((state) => ({
        sessions: state.sessions.filter(s => s.id !== sessionId),
        currentSession: state.currentSession?.id === sessionId ? null : state.currentSession,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete session',
        isLoading: false,
      });
    }
  },

  setCurrentSession: (session: Session | null) => {
    set({ currentSession: session });
  },

  updateCurrentComponent: (component: Partial<Component>) => {
    set((state) => ({
      currentSession: state.currentSession ? {
        ...state.currentSession,
        currentComponent: {
          ...state.currentSession.currentComponent,
          ...component,
        },
      } : null,
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
})); 