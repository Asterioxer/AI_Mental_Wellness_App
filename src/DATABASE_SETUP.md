# Serenique - Local Demo Mode

**Note: Authentication and database functionality has been removed to simplify the application.**

The Serenique app now works entirely as a local demo using browser localStorage.

## How It Works Now

The app now operates entirely in local demo mode:

### Data Storage
- All journal entries are stored in browser localStorage
- Data persists between sessions on the same device
- No server or database connection required

### Features Available
- ✅ Full journal entry creation and editing
- ✅ Mood tracking and visualization
- ✅ AI-powered chatbot companion
- ✅ Wellness tips and insights
- ✅ Mood history and analytics
- ✅ Profile and preferences
- ✅ Data export functionality
- ✅ Dark/light mode themes

### What Was Removed
- ❌ User authentication (signup/login)
- ❌ Server-side data storage
- ❌ Multi-user support
- ❌ Data synchronization across devices
- ❌ Cloud backups

## Benefits of Local Demo Mode

1. **Instant Setup**: No configuration or setup required
2. **Privacy**: All data stays on your device
3. **Offline Capable**: Works without internet connection
4. **Fast Performance**: No network latency
5. **Simple Architecture**: Easier to understand and modify

## Data Management

### Export Your Data
Users can export their journal entries as JSON files through the settings page.

### Clear Data
Users can delete all entries or reset the entire app through the settings.

### Sample Data
The app generates realistic sample data on first run to demonstrate all features.

## Technical Implementation

- **Storage**: Browser localStorage API
- **Data Format**: JSON serialization
- **Persistence**: Automatic save on every entry
- **Backup**: Manual export functionality
- **Reset**: Complete data clearing option

This simplified architecture makes the app perfect for demos, prototyping, and personal use without the complexity of authentication and backend infrastructure.