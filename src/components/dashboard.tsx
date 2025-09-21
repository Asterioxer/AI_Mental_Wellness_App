import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { JournalEntryForm } from './journal-entry-form';
import { MoodVisualization } from './mood-visualization';
import { MoodTrendGraph } from './mood-trend-graph';
import { MoodInsightsSummary } from './mood-insights-summary';
import { MoodPatterns } from './mood-patterns';
import { MoodHistory } from './mood-history';
import { TransformersAIChat } from './transformers-ai-chat';
import { ProfileSettings } from './profile-settings';
import { ProfileDropdown } from './profile-dropdown';
import { MoodStreakTracker } from './mood-streak-tracker';
import { BreathingExercise } from './breathing-exercise';
import { DailyInspiration } from './daily-inspiration';
import { WellnessResourceCenter } from './wellness-resource-center';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
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
  // Calendar state hooks moved to top level to follow Rules of Hooks
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [hoveredEntries, setHoveredEntries] = useState<MoodEntry[]>([]);
  const [clickedDate, setClickedDate] = useState<Date | null>(null);
  const [clickedEntries, setClickedEntries] = useState<MoodEntry[]>([]);

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
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 32 32" 
                fill="none" 
                className="transition-all duration-300"
              >
                {/* Serenique Logo - Mind Garden: Representing growth, mental wellness, and serenity */}
                
                {/* Main trunk/stem - representing foundation and strength */}
                <path 
                  d="M16 28C16 28 14 24 14 20C14 18 15 16 16 16C17 16 18 18 18 20C18 24 16 28 16 28Z" 
                  fill="rgba(255,255,255,0.9)"
                  strokeWidth="0.5"
                  stroke="rgba(255,255,255,0.6)"
                />
                
                {/* Left branch system - representing neural pathways and growth */}
                <path 
                  d="M16 16C16 16 12 14 10 12C8 10 8 8 10 8C12 8 14 10 16 12" 
                  fill="none"
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                
                {/* Right branch system - representing balance and harmony */}
                <path 
                  d="M16 16C16 16 20 14 22 12C24 10 24 8 22 8C20 8 18 10 16 12" 
                  fill="none"
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                
                {/* Central growth point - representing mindfulness and core strength */}
                <circle 
                  cx="16" 
                  cy="16" 
                  r="2" 
                  fill="rgba(255,255,255,0.9)"
                />
                
                {/* Left leaf/mind node - representing thoughts and emotions */}
                <circle 
                  cx="10" 
                  cy="8" 
                  r="1.5" 
                  fill="rgba(255,255,255,0.7)"
                />
                
                {/* Right leaf/mind node - representing balance and wellness */}
                <circle 
                  cx="22" 
                  cy="8" 
                  r="1.5" 
                  fill="rgba(255,255,255,0.7)"
                />
                
                {/* Flowing energy lines - representing serenity and inner peace */}
                <path 
                  d="M8 10C8 10 6 12 6 14C6 16 8 16 10 14" 
                  fill="none"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                
                <path 
                  d="M24 10C24 10 26 12 26 14C26 16 24 16 22 14" 
                  fill="none"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                
                {/* Top growth elements - representing aspiration and hope */}
                <path 
                  d="M14 6C14 6 15 4 16 4C17 4 18 6 18 6" 
                  fill="none"
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
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
            <ProfileDropdown
              userInfo={userInfo}
              onSettingsClick={() => onTabChange?.('settings')}
              onLogout={onLogout || (() => {})}
            />
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
            <TabsList className="glass border-0 shadow-lg p-1 grid w-full max-w-lg grid-cols-5 lg:max-w-xl lg:grid-cols-5">
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
                          Journal Calendar
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {(() => {
                          const today = new Date();
                          const year = currentDate.getFullYear();
                          const month = currentDate.getMonth();
                          
                          // Get first day of the month and calculate calendar grid
                          const firstDay = new Date(year, month, 1);
                          const lastDay = new Date(year, month + 1, 0);
                          const startingDayOfWeek = firstDay.getDay();
                          const daysInMonth = lastDay.getDate();
                          
                          // Create calendar grid
                          const calendarDays = [];
                          
                          // Add empty cells for days before the first day of the month
                          for (let i = 0; i < startingDayOfWeek; i++) {
                            calendarDays.push(null);
                          }
                          
                          // Add days of the month
                          for (let day = 1; day <= daysInMonth; day++) {
                            calendarDays.push(new Date(year, month, day));
                          }
                          
                          const handleDateHover = (date: Date | null) => {
                            // Only set hover state if no date is clicked
                            if (!clickedDate) {
                              setHoveredDate(date);
                              if (date) {
                                const dayEntries = entries.filter(entry => 
                                  entry.timestamp.toDateString() === date.toDateString()
                                );
                                setHoveredEntries(dayEntries);
                              } else {
                                setHoveredEntries([]);
                              }
                            }
                          };

                          const handleDateClick = (date: Date | null) => {
                            if (date) {
                              const dayEntries = entries.filter(entry => 
                                entry.timestamp.toDateString() === date.toDateString()
                              );
                              setClickedDate(date);
                              setClickedEntries(dayEntries);
                              // Clear hover state when clicking
                              setHoveredDate(null);
                              setHoveredEntries([]);
                            } else {
                              setClickedDate(null);
                              setClickedEntries([]);
                            }
                          };
                          
                          const navigateMonth = (direction: 'prev' | 'next') => {
                            const newDate = new Date(currentDate);
                            if (direction === 'prev') {
                              newDate.setMonth(month - 1);
                            } else {
                              newDate.setMonth(month + 1);
                            }
                            setCurrentDate(newDate);
                          };

                          // Calculate mood distribution for hovered date
                          const getMoodDistribution = (dateEntries: any[]) => {
                            const moodCounts = dateEntries.reduce((acc, entry) => {
                              acc[entry.mood] = (acc[entry.mood] || 0) + 1;
                              return acc;
                            }, {} as Record<string, number>);

                            const moodData = [
                              { mood: 'happy', emoji: '😊', color: 'bg-yellow-400', count: moodCounts.happy || 0 },
                              { mood: 'sad', emoji: '😢', color: 'bg-blue-400', count: moodCounts.sad || 0 },
                              { mood: 'angry', emoji: '😠', color: 'bg-red-400', count: moodCounts.angry || 0 },
                              { mood: 'anxious', emoji: '😰', color: 'bg-purple-400', count: moodCounts.anxious || 0 },
                              { mood: 'calm', emoji: '😌', color: 'bg-green-400', count: moodCounts.calm || 0 },
                              { mood: 'excited', emoji: '🤩', color: 'bg-pink-400', count: moodCounts.excited || 0 },
                              { mood: 'neutral', emoji: '😐', color: 'bg-gray-400', count: moodCounts.neutral || 0 }
                            ].filter(item => item.count > 0);

                            return moodData;
                          };
                          
                          return (
                            <div className="space-y-4">
                              {/* Calendar Header */}
                              <div className="flex items-center justify-between">
                                <button
                                  onClick={() => navigateMonth('prev')}
                                  className="p-1 hover:bg-muted rounded-md transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                  </svg>
                                </button>
                                <h3 className="text-lg font-medium">
                                  {currentDate.toLocaleDateString('en', { month: 'long', year: 'numeric' })}
                                </h3>
                                <button
                                  onClick={() => navigateMonth('next')}
                                  className="p-1 hover:bg-muted rounded-md transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                              </div>
                              
                              {/* Day Labels */}
                              <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground font-medium">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                                  <div key={`day-${index}-${day}`} className="p-2">{day}</div>
                                ))}
                              </div>
                              
                              {/* Calendar Grid */}
                              <div className="grid grid-cols-7 gap-1">
                                {calendarDays.map((date, index) => {
                                  if (!date) {
                                    return <div key={index} className="p-2 h-8"></div>;
                                  }
                                  
                                  const isToday = date.toDateString() === today.toDateString();
                                  const hasEntries = entries.some(entry => 
                                    entry.timestamp.toDateString() === date.toDateString()
                                  );
                                  const entryCount = entries.filter(entry => 
                                    entry.timestamp.toDateString() === date.toDateString()
                                  ).length;
                                  
                                  return (
                                    <motion.div
                                      key={date.getTime()}
                                      className={`
                                        relative p-2 h-8 text-center text-sm cursor-pointer transition-all duration-200
                                        hover:bg-muted rounded-md
                                        ${isToday ? 'bg-blue-500 text-white rounded-full' : ''}
                                        ${hasEntries ? 'font-medium' : ''}
                                        ${clickedDate && clickedDate.toDateString() === date.toDateString() ? 'bg-purple-500 text-white rounded-full' : ''}
                                      `}
                                      onMouseEnter={() => handleDateHover(date)}
                                      onMouseLeave={() => handleDateHover(null)}
                                      onClick={() => handleDateClick(date)}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      {date.getDate()}
                                      {hasEntries && (
                                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full text-xs flex items-center justify-center">
                                        </div>
                                      )}
                                    </motion.div>
                                  );
                                })}
                              </div>
                              
                              {/* Enhanced Tooltip with Mood Distribution */}
                              <AnimatePresence>
                                {((hoveredDate && hoveredEntries.length > 0 && !clickedDate) || 
                                  (clickedDate && clickedEntries.length > 0)) && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="mt-4 p-4 glass rounded-lg border-0 relative"
                                  >
                                    {/* Close button for clicked state */}
                                    {clickedDate && (
                                      <button
                                        onClick={() => handleDateClick(null)}
                                        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                                      >
                                        ✕
                                      </button>
                                    )}
                                    
                                    <div className="text-sm font-medium mb-3">
                                      {(clickedDate || hoveredDate)?.toLocaleDateString('en', { 
                                        weekday: 'long', 
                                        month: 'long', 
                                        day: 'numeric' 
                                      })}
                                      {clickedDate && <span className="ml-2 text-xs text-purple-400">(Pinned)</span>}
                                    </div>
                                    
                                    {/* Mood Distribution Section */}
                                    <div>
                                      <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                        <TrendingUp className="w-3 h-3" />
                                        Daily Mood Breakdown
                                      </div>
                                      <div className="grid grid-cols-4 gap-2">
                                        {getMoodDistribution(clickedDate ? clickedEntries : hoveredEntries).map((moodItem) => (
                                          <motion.div
                                            key={moodItem.mood}
                                            className="flex flex-col items-center p-2 glass rounded-md"
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.2 }}
                                            whileHover={{ scale: 1.05 }}
                                          >
                                            <div className="text-lg mb-1">{moodItem.emoji}</div>
                                            <div className="text-xs font-medium capitalize text-center">{moodItem.mood}</div>
                                            <div className="flex items-center gap-1 mt-1">
                                              <div className={`w-2 h-2 rounded-full ${moodItem.color}`}></div>
                                              <span className="text-xs font-medium">{moodItem.count}</span>
                                            </div>
                                          </motion.div>
                                        ))}
                                      </div>
                                      
                                      {/* Mood Intensity Bar */}
                                      <div className="mt-3">
                                        <div className="text-xs text-muted-foreground mb-1">
                                          Total Entries: {clickedDate ? clickedEntries.length : hoveredEntries.length}
                                        </div>
                                        <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-muted">
                                          {getMoodDistribution(clickedDate ? clickedEntries : hoveredEntries).map((moodItem, index) => {
                                            const entryCount = clickedDate ? clickedEntries.length : hoveredEntries.length;
                                            const percentage = (moodItem.count / entryCount) * 100;
                                            return (
                                              <motion.div
                                                key={moodItem.mood}
                                                className={moodItem.color}
                                                style={{ width: `${percentage}%` }}
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                              />
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })()}
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
              <TransformersAIChat 
                currentMood={currentMood} 
                recentEntry={recentEntry}
                onMoodUpdate={(mood, confidence) => {
                  // Update mood if AI detects significant change
                  if (confidence > 0.8) {
                    setCurrentMood(mood);
                  }
                }}
              />
            </motion.div>
          </TabsContent>

          {/* Wellness Tips Tab */}
          <TabsContent value="tips" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <WellnessResourceCenter 
                currentMood={currentMood}
              />
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