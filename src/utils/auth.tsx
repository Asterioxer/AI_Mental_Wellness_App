import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-b174ec20`;

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  avatar_url?: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  mood: string;
  confidence?: number;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  user: any;
  profile: User;
  access_token: string;
  refresh_token: string;
}

class AuthService {
  private session: AuthSession | null = null;

  constructor() {
    // Try to restore session from localStorage
    this.restoreSession();
  }

  private saveSession(session: AuthSession) {
    this.session = session;
    localStorage.setItem('auth_session', JSON.stringify(session));
  }

  private restoreSession() {
    try {
      const stored = localStorage.getItem('auth_session');
      if (stored) {
        const parsedSession = JSON.parse(stored);
        // Basic validation of session structure
        if (parsedSession && parsedSession.access_token && parsedSession.profile) {
          this.session = parsedSession;
        } else {
          console.warn('Invalid session format, clearing session');
          this.clearSession();
        }
      }
    } catch (error) {
      console.warn('Failed to restore session:', error);
      this.clearSession();
    }
  }

  private clearSession() {
    this.session = null;
    localStorage.removeItem('auth_session');
  }

  private async makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}) {
    if (!this.session?.access_token) {
      throw new Error('No authentication token available');
    }

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.session.access_token}`,
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (response.status === 401) {
        // Token expired, clear session
        this.clearSession();
        throw new Error('Session expired. Please log in again.');
      }

      if (!response.ok) {
        let errorMessage = 'Request failed';
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch {
          // If JSON parsing fails, use default message
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection.');
      }
      throw error;
    }
  }

  async signUp(email: string, password: string, name: string): Promise<{ user: any; profile: User }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password, name }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = 'Signup failed';
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch {
          // If JSON parsing fails, use default message
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return { user: data.user, profile: data.profile };
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Signup timeout. Please check your connection and try again.');
      }
      throw error;
    }
  }

  async signIn(email: string, password: string): Promise<AuthSession> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = 'Sign in failed';
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch {
          // If JSON parsing fails, use default message
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const session: AuthSession = {
        user: data.user,
        profile: data.profile,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      };

      this.saveSession(session);
      return session;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Sign in timeout. Please check your connection and try again.');
      }
      throw error;
    }
  }

  async signOut() {
    this.clearSession();
  }

  getCurrentSession(): AuthSession | null {
    return this.session;
  }

  getCurrentUser(): User | null {
    return this.session?.profile || null;
  }

  isAuthenticated(): boolean {
    return !!this.session?.access_token;
  }

  async getProfile(): Promise<{ user: any; profile: User }> {
    return this.makeAuthenticatedRequest('/profile');
  }

  async updateProfile(updates: Partial<{ name: string; avatar_url: string }>): Promise<User> {
    const data = await this.makeAuthenticatedRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    
    // Update local session
    if (this.session) {
      this.session.profile = { ...this.session.profile, ...data.profile };
      this.saveSession(this.session);
    }
    
    return data.profile;
  }

  async createJournalEntry(content: string, mood: string, confidence?: number): Promise<JournalEntry> {
    const data = await this.makeAuthenticatedRequest('/journal', {
      method: 'POST',
      body: JSON.stringify({ content, mood, confidence }),
    });
    return data.entry;
  }

  async getJournalEntries(limit?: number): Promise<JournalEntry[]> {
    const queryParam = limit ? `?limit=${limit}` : '';
    const data = await this.makeAuthenticatedRequest(`/journal${queryParam}`);
    return data.entries;
  }

  async updateJournalEntry(id: string, content: string, mood: string, confidence?: number): Promise<JournalEntry> {
    const data = await this.makeAuthenticatedRequest(`/journal/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content, mood, confidence }),
    });
    return data.entry;
  }

  async deleteJournalEntry(id: string): Promise<void> {
    await this.makeAuthenticatedRequest(`/journal/${id}`, {
      method: 'DELETE',
    });
  }
}

export const authService = new AuthService();