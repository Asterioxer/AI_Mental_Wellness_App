import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { 
  createUser, 
  signInUser, 
  getUserFromToken, 
  createJournalEntry, 
  getUserJournalEntries, 
  updateJournalEntry, 
  deleteJournalEntry,
  updateUserProfile,
  initializeTables
} from './auth.tsx';

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize database tables on startup
initializeTables();

// Health check endpoint
app.get("/make-server-b174ec20/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Authentication routes
app.post('/make-server-b174ec20/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    const result = await createUser(email, password, name);
    
    return c.json({ 
      message: 'User created successfully',
      user: result.user,
      profile: result.profile
    });
  } catch (error: any) {
    console.log('Signup error:', error);
    return c.json({ 
      error: 'Failed to create user', 
      details: error.message 
    }, 400);
  }
});

app.post('/make-server-b174ec20/auth/signin', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const result = await signInUser(email, password);
    
    return c.json({
      message: 'Sign in successful',
      user: result.user,
      profile: result.profile,
      session: result.session
    });
  } catch (error: any) {
    console.log('Sign in error:', error);
    return c.json({ 
      error: 'Invalid credentials', 
      details: error.message 
    }, 401);
  }
});

// Protected routes middleware
const requireAuth = async (c: any, next: any) => {
  try {
    const accessToken = c.req.header('Authorization')?.replace('Bearer ', '');
    
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401);
    }

    const { user, profile } = await getUserFromToken(accessToken);
    c.set('user', user);
    c.set('profile', profile);
    
    await next();
  } catch (error: any) {
    console.log('Auth middleware error:', error);
    return c.json({ error: 'Invalid or expired token' }, 401);
  }
};

// Profile routes
app.get('/make-server-b174ec20/profile', requireAuth, async (c) => {
  const user = c.get('user');
  const profile = c.get('profile');
  
  return c.json({ user, profile });
});

app.put('/make-server-b174ec20/profile', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const updates = await c.req.json();
    
    const updatedProfile = await updateUserProfile(user.id, updates);
    
    return c.json({ 
      message: 'Profile updated successfully',
      profile: updatedProfile 
    });
  } catch (error: any) {
    console.log('Profile update error:', error);
    return c.json({ 
      error: 'Failed to update profile', 
      details: error.message 
    }, 400);
  }
});

// Journal entry routes
app.post('/make-server-b174ec20/journal', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const { content, mood, confidence } = await c.req.json();

    if (!content || !mood) {
      return c.json({ error: 'Content and mood are required' }, 400);
    }

    const entry = await createJournalEntry(user.id, content, mood, confidence);
    
    return c.json({ 
      message: 'Journal entry created successfully',
      entry 
    });
  } catch (error: any) {
    console.log('Journal creation error:', error);
    return c.json({ 
      error: 'Failed to create journal entry', 
      details: error.message 
    }, 400);
  }
});

app.get('/make-server-b174ec20/journal', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : undefined;
    
    const entries = await getUserJournalEntries(user.id, limit);
    
    return c.json({ entries });
  } catch (error: any) {
    console.log('Journal fetch error:', error);
    return c.json({ 
      error: 'Failed to fetch journal entries', 
      details: error.message 
    }, 400);
  }
});

app.put('/make-server-b174ec20/journal/:id', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const entryId = c.req.param('id');
    const { content, mood, confidence } = await c.req.json();

    if (!content || !mood) {
      return c.json({ error: 'Content and mood are required' }, 400);
    }

    const entry = await updateJournalEntry(user.id, entryId, content, mood, confidence);
    
    return c.json({ 
      message: 'Journal entry updated successfully',
      entry 
    });
  } catch (error: any) {
    console.log('Journal update error:', error);
    return c.json({ 
      error: 'Failed to update journal entry', 
      details: error.message 
    }, 400);
  }
});

app.delete('/make-server-b174ec20/journal/:id', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const entryId = c.req.param('id');
    
    await deleteJournalEntry(user.id, entryId);
    
    return c.json({ message: 'Journal entry deleted successfully' });
  } catch (error: any) {
    console.log('Journal deletion error:', error);
    return c.json({ 
      error: 'Failed to delete journal entry', 
      details: error.message 
    }, 400);
  }
});

Deno.serve(app.fetch);