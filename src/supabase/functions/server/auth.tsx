import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

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

export async function createUser(email: string, password: string, name: string) {
  try {
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true // Auto-confirm since email server isn't configured
    });

    if (authError) {
      console.log('Auth creation error:', authError);
      throw authError;
    }

    // Create user profile in our custom table
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert([
        {
          id: authData.user.id,
          email: email,
          name: name,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (profileError) {
      console.log('Profile creation error:', profileError);
      // If profile creation fails, we should clean up the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    return { user: authData.user, profile: profileData };
  } catch (error) {
    console.log('User creation error:', error);
    throw error;
  }
}

export async function signInUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.log('Sign in error:', error);
      throw error;
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.log('Profile fetch error:', profileError);
      throw profileError;
    }

    return { user: data.user, profile, session: data.session };
  } catch (error) {
    console.log('Sign in error:', error);
    throw error;
  }
}

export async function getUserFromToken(accessToken: string) {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      throw new Error('Invalid token');
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.log('Profile fetch error:', profileError);
      throw profileError;
    }

    return { user, profile };
  } catch (error) {
    console.log('Token validation error:', error);
    throw error;
  }
}

export async function createJournalEntry(
  userId: string,
  content: string,
  mood: string,
  confidence?: number
) {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert([
        {
          user_id: userId,
          content,
          mood,
          confidence,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.log('Journal entry creation error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.log('Journal entry creation error:', error);
    throw error;
  }
}

export async function getUserJournalEntries(userId: string, limit?: number) {
  try {
    let query = supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.log('Journal entries fetch error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.log('Journal entries fetch error:', error);
    throw error;
  }
}

export async function updateJournalEntry(
  userId: string,
  entryId: string,
  content: string,
  mood: string,
  confidence?: number
) {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .update({
        content,
        mood,
        confidence,
        updated_at: new Date().toISOString()
      })
      .eq('id', entryId)
      .eq('user_id', userId) // Ensure user can only update their own entries
      .select()
      .single();

    if (error) {
      console.log('Journal entry update error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.log('Journal entry update error:', error);
    throw error;
  }
}

export async function deleteJournalEntry(userId: string, entryId: string) {
  try {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', entryId)
      .eq('user_id', userId); // Ensure user can only delete their own entries

    if (error) {
      console.log('Journal entry deletion error:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.log('Journal entry deletion error:', error);
    throw error;
  }
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<{ name: string; avatar_url: string }>
) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.log('Profile update error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.log('Profile update error:', error);
    throw error;
  }
}

// Initialize database tables if they don't exist
export async function initializeTables() {
  try {
    // Tables should be created by running the migrations.sql file in the Supabase dashboard
    // This is just a placeholder for any initialization logic
    console.log('Database tables initialization check complete');
    
    // You can add any startup logic here, like seeding data, checking connections, etc.
  } catch (error) {
    console.log('Database initialization error:', error);
  }
}