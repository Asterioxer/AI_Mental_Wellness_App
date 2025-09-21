import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { JournalEntryForm } from './journal-entry-form';
import { MoodVisualization } from './mood-visualization';
import { MoodTrendGraph } from './mood-trend-graph';
import { MoodInsightsSummary } from './mood-insights-summary';
import { MoodPatterns } from './mood-patterns';
import { MoodHistory } from './mood-history';
import { ChatbotInterface } from './chatbot-interface';
import { WellnessTips } from './wellness-tips';
import { ProfileSettings } from './profile-settings';
import { MoodStreakTracker } from './mood-streak-tracker';
import { BreathingExercise } from './breathing-exercise';
import { DailyInspiration } from './daily-inspiration';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { BookOpen, TrendingUp, MessageCircle, Lightbulb, User, Sparkles, Home, Settings, Heart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface MoodEntry {
  id: string;
  content: string;
  mood: string;
  timestamp: Date;
  confidence?: number;
}

interface DashboardProps {
  onBackToHome: () => void;
  userInfo?: { name: string; email: string };
  onLogout?: () => void;
  loginType?: 'demo' | 'login';
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onProfileClick?: () => void;
}

// Local storage key for entries
const STORAGE_KEY = 'serenique_journal_entries';

// Generate some sample data for demonstration
const generateSampleData = (): MoodEntry[] => {
  const moods = ['happy', 'sad', 'anxious', 'calm', 'excited', 'neutral'];
  const sampleEntries: MoodEntry[] = [];
  
  for (let i = 0; i < 15; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(i / 2));
    date.setHours(9 + (i % 12), Math.floor(Math.random() * 60));
    
    const mood = moods[Math.floor(Math.random() * moods.length)];
    const contents = {
      happy: [
        "Had such a wonderful day today! Everything just felt right and I'm grateful for all the good things happening.",
        "Spent time with friends and felt so connected. These are the moments that make life beautiful.",
        "Accomplished something I've been working on for weeks. Feeling proud and energized!"
      ],
      sad: [
        "Feeling a bit down today. Not sure why, but everything seems a little harder than usual.",
        "Missing someone special today. These feelings come in waves and that's okay.",
        "Had a difficult conversation that left me feeling drained and emotional."
      ],
      anxious: [
        "Worried about tomorrow's presentation. My mind keeps racing with all the things that could go wrong.",
        "Feeling overwhelmed by everything on my plate. Sometimes it's hard to see how I'll get through it all.",
        "Had some anxious thoughts creeping in. Trying to remind myself that these feelings will pass."
      ],
      calm: [
        "Spent some quiet time in nature today. Feeling peaceful and centered after a good meditation session.",
        "Everything feels balanced right now. Taking time to appreciate this sense of inner quiet.",
        "Had a relaxing evening with a good book. Sometimes the simple pleasures are the most meaningful."
      ],
      excited: [
        "So many exciting things coming up! Feeling energized about new opportunities and adventures ahead.",
        "Just got some amazing news! My energy levels are through the roof and I can't stop smiling.",
        "Starting something new tomorrow and I'm buzzing with anticipation. Bring it on!"
      ],
      neutral: [
        "Today was just a regular day. Nothing particularly exciting or challenging, just steady and normal.",
        "Feeling pretty balanced today. Not high or low, just existing in a comfortable middle space.",
        "Had a typical day with its usual mix of routine activities. Sometimes ordinary is perfectly fine."
      ]
    };
    
    sampleEntries.push({
      id: `sample-${i}`,
      content: contents[mood as keyof typeof contents][Math.floor(Math.random() * 3)],
      mood,
      timestamp: date,
      confidence: 0.7 + Math.random() * 0.25
    });
  }
  
  return sampleEntries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Load entries from localStorage
const loadLocalEntries = (): MoodEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
    }
  } catch (error) {
    console.warn('Error loading local entries:', error);
  }
  return [];
};

// Save entries to localStorage
const saveLocalEntries = (entries: MoodEntry[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.warn('Error saving local entries:', error);
  }
};

export function Dashboard({ onBackToHome, userInfo, onLogout, loginType = 'demo', activeTab = 'journal', onTabChange, onProfileClick }: DashboardProps) {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load entries on component mount
  useEffect(() => {
    const loadEntries = () => {
      setIsLoading(true);
      
      // First try to load from localStorage
      const localEntries = loadLocalEntries();
      
      if (localEntries.length > 0) {
        setEntries(localEntries);
      } else {
        // If no local entries, use sample data for demo
        const sampleData = generateSampleData();
        setEntries(sampleData);
        saveLocalEntries(sampleData);
      }
      
      setIsLoading(false);
    };

    loadEntries();
  }, []);

  const handleNewEntry = (entryData: Omit<MoodEntry, 'id' | 'timestamp'>) => {
    const newEntry: MoodEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...entryData
    };
    
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    saveLocalEntries(updatedEntries);
  };

  const handleDeleteEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    saveLocalEntries(updatedEntries);
  };

  const currentMood = entries.length > 0 ? entries[0].mood : undefined;
  const recentEntry = entries.length > 0 ? entries[0].content : undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <p className="text-muted-foreground">Loading Serenique...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300"
              whileHover={{ 
                rotate: 360,
                scale: 1.1
              }}
              transition={{ duration: 0.8 }}
            >
              <Heart className="w-5 h-5 text-white transition-all duration-300" />
            </motion.div>
            <div>
              <h1 className="font-semibold text-lg gradient-text">Serenique</h1>
              <p className="text-sm text-muted-foreground">AI-Powered Mental Wellness</p>
            </div>
          </motion.div>
        </div>

        {userInfo && (
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-right">
              <p className="text-sm font-medium">{userInfo.name}</p>
              <p className="text-xs text-muted-foreground">{userInfo.email}</p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Avatar 
                className="w-10 h-10 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={onProfileClick}
              >
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userInfo.name}`} alt={userInfo.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                  {userInfo.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Main Dashboard Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-8">
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <TabsList className="glass border-0 shadow-lg p-1 grid w-full max-w-lg grid-cols-6 lg:max-w-2xl lg:grid-cols-6">
              <TabsTrigger value="journal" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 transition-all duration-300">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Journal</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 transition-all duration-300">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Insights</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 transition-all duration-300">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 transition-all duration-300">
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="tips" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 transition-all duration-300">
                <Lightbulb className="w-4 h-4" />
                <span className="hidden sm:inline">Tips</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 transition-all duration-300">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Journal Tab */}
          <TabsContent value="journal" className="space-y-6">
            {/* Welcome Section - Journal Tab Only */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <motion.h1 
                className="text-2xl font-semibold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Welcome back, {userInfo?.name || 'User'}
              </motion.h1>
              <motion.p 
                className="text-muted-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Here's your mental wellness dashboard for today.
              </motion.p>
            </motion.div>

            {/* Quick Overview - Journal Tab Only */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.h3 
                className="font-medium"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Quick Overview
              </motion.h3>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {/* Mood Trend Card */}
                <motion.div 
                  className="glass border-0 shadow-lg p-6 rounded-xl hover-lift"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Mood Trend</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-medium">
                        {(() => {
                          if (entries.length < 2) return "No Data";
                          
                          // Calculate mood trend based on recent vs older entries
                          const moodValues = {
                            'Very Happy': 10, 'Happy': 8, 'Content': 7, 'Good': 6,
                            'Neutral': 5, 'Okay': 4, 'Sad': 3, 'Anxious': 2, 'Stressed': 2, 'Very Sad': 1
                          };
                          
                          const recentEntries = entries.slice(0, Math.ceil(entries.length / 2));
                          const olderEntries = entries.slice(Math.ceil(entries.length / 2));
                          
                          const recentAvg = recentEntries.reduce((sum, entry) => 
                            sum + (moodValues[entry.mood] || 5), 0) / recentEntries.length;
                          const olderAvg = olderEntries.reduce((sum, entry) => 
                            sum + (moodValues[entry.mood] || 5), 0) / olderEntries.length;
                          
                          return recentAvg > olderAvg ? "Upward" : recentAvg < olderAvg ? "Downward" : "Stable";
                        })()}
                      </p>
                      <div className={`flex items-center gap-1 ${(() => {
                        if (entries.length < 2) return "text-muted-foreground";
                        
                        const moodValues = {
                          'Very Happy': 10, 'Happy': 8, 'Content': 7, 'Good': 6,
                          'Neutral': 5, 'Okay': 4, 'Sad': 3, 'Anxious': 2, 'Stressed': 2, 'Very Sad': 1
                        };
                        
                        const recentEntries = entries.slice(0, Math.ceil(entries.length / 2));
                        const olderEntries = entries.slice(Math.ceil(entries.length / 2));
                        
                        const recentAvg = recentEntries.reduce((sum, entry) => 
                          sum + (moodValues[entry.mood] || 5), 0) / recentEntries.length;
                        const olderAvg = olderEntries.reduce((sum, entry) => 
                          sum + (moodValues[entry.mood] || 5), 0) / olderEntries.length;
                        
                        return recentAvg > olderAvg ? "text-green-500" : recentAvg < olderAvg ? "text-red-500" : "text-blue-500";
                      })()}`}>
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <TrendingUp className={`w-4 h-4 ${(() => {
                            if (entries.length < 2) return "";
                            
                            const moodValues = {
                              'Very Happy': 10, 'Happy': 8, 'Content': 7, 'Good': 6,
                              'Neutral': 5, 'Okay': 4, 'Sad': 3, 'Anxious': 2, 'Stressed': 2, 'Very Sad': 1
                            };
                            
                            const recentEntries = entries.slice(0, Math.ceil(entries.length / 2));
                            const olderEntries = entries.slice(Math.ceil(entries.length / 2));
                            
                            const recentAvg = recentEntries.reduce((sum, entry) => 
                              sum + (moodValues[entry.mood] || 5), 0) / recentEntries.length;
                            const olderAvg = olderEntries.reduce((sum, entry) => 
                              sum + (moodValues[entry.mood] || 5), 0) / olderEntries.length;
                            
                            return recentAvg < olderAvg ? "rotate-180" : "";
                          })()}`} />
                        </motion.div>
                        <span className="text-sm">
                          {entries.length < 2 ? "--" : (() => {
                            const moodValues = {
                              'Very Happy': 10, 'Happy': 8, 'Content': 7, 'Good': 6,
                              'Neutral': 5, 'Okay': 4, 'Sad': 3, 'Anxious': 2, 'Stressed': 2, 'Very Sad': 1
                            };
                            
                            const recentEntries = entries.slice(0, Math.ceil(entries.length / 2));
                            const olderEntries = entries.slice(Math.ceil(entries.length / 2));
                            
                            const recentAvg = recentEntries.reduce((sum, entry) => 
                              sum + (moodValues[entry.mood] || 5), 0) / recentEntries.length;
                            const olderAvg = olderEntries.reduce((sum, entry) => 
                              sum + (moodValues[entry.mood] || 5), 0) / olderEntries.length;
                            
                            const change = Math.abs(((recentAvg - olderAvg) / olderAvg) * 100);
                            return `${recentAvg > olderAvg ? "+" : recentAvg < olderAvg ? "-" : ""}${change.toFixed(1)}%`;
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Journal Entries Card */}
                <motion.div 
                  className="glass border-0 shadow-lg p-6 rounded-xl hover-lift"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Journal Entries</p>
                    <div className="space-y-1">
                      <p className="text-xl font-medium">{entries.length} Total</p>
                      <div className="flex items-center gap-1 text-blue-500">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <BookOpen className="w-3 h-3" />
                        </motion.div>
                        <span className="text-xs">
                          {entries.length === 0 ? "Start your journey" : 
                           entries.length === 1 ? "Great start!" : 
                           entries.length < 5 ? "Building habits" : 
                           entries.length < 10 ? "Great progress" : "Amazing dedication!"}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Average Mood Card */}
                <motion.div 
                  className="glass border-0 shadow-lg p-6 rounded-xl hover-lift"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Average Mood</p>
                    <div className="space-y-1">
                      <p className="text-xl font-medium">
                        {entries.length === 0 ? "--" : (() => {
                          const moodValues = {
                            'Very Happy': 10, 'Happy': 8, 'Content': 7, 'Good': 6,
                            'Neutral': 5, 'Okay': 4, 'Sad': 3, 'Anxious': 2, 'Stressed': 2, 'Very Sad': 1
                          };
                          const avgMood = entries.reduce((sum, entry) => 
                            sum + (moodValues[entry.mood] || 5), 0) / entries.length;
                          return `${avgMood.toFixed(1)} / 10`;
                        })()}
                      </p>
                      <div className={`flex items-center gap-1 ${(() => {
                        if (entries.length === 0) return "text-muted-foreground";
                        
                        const moodValues = {
                          'Very Happy': 10, 'Happy': 8, 'Content': 7, 'Good': 6,
                          'Neutral': 5, 'Okay': 4, 'Sad': 3, 'Anxious': 2, 'Stressed': 2, 'Very Sad': 1
                        };
                        const avgMood = entries.reduce((sum, entry) => 
                          sum + (moodValues[entry.mood] || 5), 0) / entries.length;
                        
                        return avgMood >= 7 ? "text-green-500" : avgMood >= 5 ? "text-yellow-500" : "text-orange-500";
                      })()}`}>
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-3 h-3" />
                        </motion.div>
                        <span className="text-xs">
                          {entries.length === 0 ? "No entries yet" : (() => {
                            const moodValues = {
                              'Very Happy': 10, 'Happy': 8, 'Content': 7, 'Good': 6,
                              'Neutral': 5, 'Okay': 4, 'Sad': 3, 'Anxious': 2, 'Stressed': 2, 'Very Sad': 1
                            };
                            const avgMood = entries.reduce((sum, entry) => 
                              sum + (moodValues[entry.mood] || 5), 0) / entries.length;
                            
                            return avgMood >= 8 ? "Excellent" : 
                                   avgMood >= 7 ? "Very good" :
                                   avgMood >= 6 ? "Good" :
                                   avgMood >= 5 ? "Okay" :
                                   avgMood >= 4 ? "Could be better" : "Needs attention";
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Journal Content - 2x2 Grid Layout */}
            <motion.div 
              className="grid gap-6 grid-cols-1 lg:grid-cols-2 grid-rows-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              {/* Row 1, Column 1 - Journal Entry Form */}
              <motion.div 
                className="lg:row-span-1 lg:col-span-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <JournalEntryForm onSubmit={handleNewEntry} />
              </motion.div>

              {/* Row 1, Column 2 - Daily Inspiration */}
              <motion.div 
                className="lg:row-span-1 lg:col-span-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <DailyInspiration />
              </motion.div>

              {/* Row 2, Column 1 - Mood Streak Tracker */}
              <motion.div 
                className="lg:row-span-1 lg:col-span-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <MoodStreakTracker entries={entries} />
              </motion.div>

              {/* Row 2, Column 2 - Breathing Exercise */}
              <motion.div 
                className="lg:row-span-1 lg:col-span-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                <BreathingExercise />
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            {entries.length > 0 ? (
              <div className="space-y-6">
                {/* Page Header */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <motion.h1 
                    className="text-2xl font-semibold"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    Your Mood Insights
                  </motion.h1>
                  <motion.p 
                    className="text-muted-foreground"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    Discover patterns and trends in your emotional wellness journey.
                  </motion.p>
                </motion.div>

                {/* Insights Summary Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <MoodInsightsSummary entries={entries} />
                </motion.div>

                {/* Mood Patterns and Insights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <MoodPatterns entries={entries} />
                </motion.div>

                {/* Charts Grid - Two equal height cards side by side */}
                <motion.div
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  {/* Today's Mood & Distribution */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="h-full"
                  >
                    <div className="grid grid-cols-1 gap-6 h-full">
                      {/* Current Mood Card - Half height */}
                      <Card className="glass border-0 shadow-lg hover-lift">
                        <CardContent className="p-6 flex flex-col justify-center">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-2">Current Mood</p>
                            <motion.div 
                              className="text-4xl mb-3"
                              animate={{ 
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                              }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            >
                              {(() => {
                                const currentMood = entries.length > 0 ? entries[0].mood : 'neutral';
                                const moodEmojis = {
                                  happy: '😊', sad: '😢', angry: '😠', anxious: '😰',
                                  calm: '😌', excited: '🤩', neutral: '😐'
                                };
                                return moodEmojis[currentMood as keyof typeof moodEmojis] || '😐';
                              })()}
                            </motion.div>
                            <Badge className="glass border-0 bg-white/50 dark:bg-transparent">
                              {entries.length > 0 ? entries[0].mood.charAt(0).toUpperCase() + entries[0].mood.slice(1) : 'Neutral'}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Mood Distribution - Half height */}
                      <Card className="glass border-0 shadow-lg hover-lift">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Week Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            {(() => {
                              const moodCounts = entries.slice(0, 7).reduce((acc, entry) => {
                                acc[entry.mood] = (acc[entry.mood] || 0) + 1;
                                return acc;
                              }, {} as Record<string, number>);
                              
                              const topMoods = Object.entries(moodCounts)
                                .sort(([,a], [,b]) => b - a)
                                .slice(0, 3);
                              
                              return topMoods.map(([mood, count]) => (
                                <div key={mood} className="flex items-center justify-between">
                                  <span className="text-sm capitalize">{mood}</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                                        style={{ width: `${(count / Math.max(...Object.values(moodCounts))) * 100}%` }}
                                      />
                                    </div>
                                    <span className="text-xs text-muted-foreground">{count}</span>
                                  </div>
                                </div>
                              ));
                            })()}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>

                  {/* Weekly Activity Bar Chart */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="h-full"
                  >
                    <Card className="glass border-0 shadow-lg hover-lift h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-orange-500" />
                          Journal Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {(() => {
                            const last7Days = Array.from({ length: 7 }, (_, i) => {
                              const date = new Date();
                              date.setDate(date.getDate() - (6 - i));
                              const dayEntries = entries.filter(entry => 
                                entry.timestamp.toDateString() === date.toDateString()
                              );
                              return {
                                day: date.toLocaleDateString('en', { weekday: 'short' }),
                                entries: dayEntries.length
                              };
                            });
                            
                            const maxEntries = Math.max(...last7Days.map(d => d.entries));
                            
                            return last7Days.map((day, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className="text-sm w-8">{day.day}</span>
                                <div className="flex items-center gap-2 flex-1 ml-3">
                                  <div className="w-full h-6 bg-muted rounded-md overflow-hidden">
                                    <motion.div 
                                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-md"
                                      initial={{ width: 0 }}
                                      animate={{ width: maxEntries > 0 ? `${(day.entries / maxEntries) * 100}%` : '0%' }}
                                      transition={{ duration: 0.5, delay: index * 0.1 }}
                                    />
                                  </div>
                                  <span className="text-xs text-muted-foreground min-w-[20px]">{day.entries}</span>
                                </div>
                              </div>
                            ));
                          })()}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>

                {/* Mood Trend Graph - Featured at the end */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <MoodTrendGraph entries={entries} />
                </motion.div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="text-center py-16 glass border-0 shadow-lg">
                  <CardContent>
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">No Insights Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start journaling to see your mood insights and trends!
                    </p>
                    <Button 
                      onClick={() => onTabChange?.('journal')}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Start Journaling
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MoodHistory entries={entries} onDeleteEntry={handleDeleteEntry} />
            </motion.div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ChatbotInterface />
            </motion.div>
          </TabsContent>

          {/* Wellness Tips Tab */}
          <TabsContent value="tips" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <WellnessTips currentMood={currentMood} recentEntry={recentEntry} />
            </motion.div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProfileSettings userInfo={userInfo} onLogout={onLogout} />
            </motion.div>
          </TabsContent>

        </Tabs>
      </motion.div>
    </div>
  );
}