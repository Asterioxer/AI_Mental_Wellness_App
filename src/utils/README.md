# Utils Directory

This directory contains utility functions and helpers for the Serenique app.

## Authentication Removed

Authentication functionality has been removed to simplify the app. 
The app now works purely as a local demo using browser localStorage.

## Files Removed

- `auth.tsx` - Original authentication service
- `offline-auth.tsx` - Offline-first authentication service
- `supabase/` - Backend authentication and database files

The app now works completely offline and stores journal entries locally.