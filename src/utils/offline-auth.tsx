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

class OfflineAuthService {
  private session: AuthSession | null = null;
  private isOnline: boolean = navigator.onLine;

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('App is back online');
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('App is offline');
    });

    this.restoreSession();
  }

  private restoreSession() {
    try {
      const stored = localStorage.getItem('auth_session');
      if (stored) {
        const parsedSession = JSON.parse(stored);
        if (parsedSession && parsedSession.access_token && parsedSession.profile) {
          this.session = parsedSession;
        } else {
          localStorage.removeItem('auth_session');
        }
      }
    } catch (error) {
      console.warn('Failed to restore session:', error);
      localStorage.removeItem('auth_session');
    }
  }

  private saveSession(session: AuthSession) {
    this.session = session;
    localStorage.setItem('auth_session', JSON.stringify(session));
  }

  private clearSession() {
    this.session = null;
    localStorage.removeItem('auth_session');
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}, timeout: number = 8000): Promise<any> {
    if (!this.isOnline) {
      throw new Error('App is offline. Please check your internet connection.');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `Request failed (${response.status})`;
        try {
          const error = await response.json();
          errorMessage = error.error || error.message || errorMessage;
        } catch {
          // If JSON parsing fails, use default message
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Connection timeout. The server may be unavailable.');
      }
      
      if (error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      
      throw error;
    }
  }

  private async makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.session?.access_token) {
      throw new Error('Not authenticated. Please sign in first.');
    }

    return this.makeRequest(endpoint, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.session.access_token}`,
        ...options.headers,
      },
    });
  }

  async signUp(email: string, password: string, name: string): Promise<{ user: any; profile: User }> {
    try {
      const data = await this.makeRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      }, 15000); // Longer timeout for signup

      return { user: data.user, profile: data.profile };
    } catch (error: any) {
      // Provide more user-friendly error messages
      if (error.message.includes('timeout') || error.message.includes('offline')) {
        throw new Error('Cannot create account - server is unavailable. Please try again later.');
      }
      
      if (error.message.includes('already exists')) {
        throw new Error('An account with this email already exists. Please try signing in instead.');
      }
      
      throw new Error(error.message || 'Account creation failed. Please try again.');
    }
  }

  async signIn(email: string, password: string): Promise<AuthSession> {
    try {
      const data = await this.makeRequest('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }, 15000); // Longer timeout for signin

      const session: AuthSession = {
        user: data.user,
        profile: data.profile,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      };

      this.saveSession(session);
      return session;
    } catch (error: any) {
      if (error.message.includes('timeout') || error.message.includes('offline')) {
        throw new Error('Cannot sign in - server is unavailable. Please try again later.');
      }
      
      if (error.message.includes('Invalid credentials') || error.message.includes('401')) {
        throw new Error('Invalid email or password. Please check your credentials.');
      }
      
      throw new Error(error.message || 'Sign in failed. Please try again.');
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

  isOnlineMode(): boolean {
    return this.isOnline;
  }

  // Demo mode methods - work without network
  async createLocalEntry(content: string, mood: string, confidence?: number): Promise<JournalEntry> {
    const entry: JournalEntry = {
      id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      user_id: this.session?.profile?.id || 'demo-user',
      content,
      mood,
      confidence,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Store locally
    const localEntries = this.getLocalEntries();
    localEntries.unshift(entry);
    localStorage.setItem('local_journal_entries', JSON.stringify(localEntries));

    return entry;
  }

  getLocalEntries(): JournalEntry[] {
    try {
      const stored = localStorage.getItem('local_journal_entries');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  async deleteLocalEntry(id: string): Promise<void> {
    const localEntries = this.getLocalEntries();
    const filtered = localEntries.filter(entry => entry.id !== id);
    localStorage.setItem('local_journal_entries', JSON.stringify(filtered));
  }

  // Online methods - only work when server is available
  async createJournalEntry(content: string, mood: string, confidence?: number): Promise<JournalEntry> {
    if (!this.isOnline) {
      throw new Error('Offline mode - entries are saved locally only.');
    }

    const data = await this.makeAuthenticatedRequest('/journal', {
      method: 'POST',
      body: JSON.stringify({ content, mood, confidence }),
    });
    
    return data.entry;
  }

  async getJournalEntries(limit?: number): Promise<JournalEntry[]> {
    if (!this.isOnline) {
      throw new Error('Offline mode - showing local entries only.');
    }

    const queryParam = limit ? `?limit=${limit}` : '';
    const data = await this.makeAuthenticatedRequest(`/journal${queryParam}`);
    return data.entries;
  }

  async updateJournalEntry(id: string, content: string, mood: string, confidence?: number): Promise<JournalEntry> {
    if (!this.isOnline) {
      throw new Error('Offline mode - cannot sync changes.');
    }

    const data = await this.makeAuthenticatedRequest(`/journal/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content, mood, confidence }),
    });
    
    return data.entry;
  }

  async deleteJournalEntry(id: string): Promise<void> {
    if (!this.isOnline) {
      throw new Error('Offline mode - cannot sync deletion.');
    }

    await this.makeAuthenticatedRequest(`/journal/${id}`, {
      method: 'DELETE',
    });
  }
}

export const offlineAuthService = new OfflineAuthService();