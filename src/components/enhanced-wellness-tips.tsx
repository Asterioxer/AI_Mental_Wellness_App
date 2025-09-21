import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Lightbulb, Heart, Brain, Smile, RefreshCw, Zap, Trophy, Star, 
  CheckCircle, Target, Calendar, Users, Bookmark, Share2, 
  PlayCircle, PauseCircle, Timer, Gift, TrendingUp, Award,
  Flame, Clock, ChevronRight, MessageSquare
} from 'lucide-react';

interface EnhancedWellnessTipsProps {
  currentMood?: string;
  recentEntry?: string;
  userProgress?: {
    completedTips: number;
    streak: number;
    totalPoints: number;
    level: number;
  };
}

// Enhanced tip structure with engagement features
interface WellnessTip {
  id: string;
  title: string;
  description: string;
  action: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  duration: string;
  points: number;
  badges?: string[];
  videoId?: string;
  tags: string[];
  isCompleted?: boolean;
}

// AI-Powered Dynamic Tips System
const dynamicTips = {
  sad: {
    icon: '💙',
    color: 'from-blue-400 to-blue-600',
    tips: [
      {
        id: 'sad-1',
        title: "AI Self-Compassion Challenge",
        description: "Our AI has crafted a personalized compassion exercise based on your journal patterns. Studies show self-compassion reduces depression by 23%.",
        action: "Start 3-minute AI guided session",
        category: "Emotional Support",
        difficulty: "Easy" as const,
        duration: "3 min",
        points: 15,
        badges: ["First Step", "Self Love"],
        tags: ["mindfulness", "AI-guided", "self-care"],
        videoId: "compassion-intro"
      },
      {
        id: 'sad-2',
        title: "Nature Therapy Quest",
        description: "Complete our outdoor mindfulness challenge! Users report 67% mood improvement after nature-based activities.",
        action: "Begin outdoor quest (Track with GPS)",
        category: "Nature Therapy",
        difficulty: "Easy" as const,
        duration: "15 min",
        points: 25,
        badges: ["Nature Explorer", "Fresh Air"],
        tags: ["outdoor", "movement", "vitamin-d"],
        videoId: "nature-therapy"
      },
      {
        id: 'sad-3',
        title: "Movement Mood Booster",
        description: "AI-personalized micro-workout designed for your energy level. Just 5 minutes can release natural mood-lifting endorphins!",
        action: "Start adaptive workout",
        category: "Physical Wellness",
        difficulty: "Medium" as const,
        duration: "5 min",
        points: 20,
        badges: ["Energy Warrior", "Endorphin Rush"],
        tags: ["exercise", "AI-adaptive", "energy"]
      }
    ]
  },
  anxious: {
    icon: '🫂',
    color: 'from-purple-400 to-purple-600',
    tips: [
      {
        id: 'anxious-1',
        title: "AI Breathing Coach",
        description: "Real-time heart rate variability coaching! Our AI adapts breathing patterns to your stress levels for maximum calm.",
        action: "Connect breathing coach",
        category: "Stress Relief",
        difficulty: "Easy" as const,
        duration: "4 min",
        points: 30,
        badges: ["Breath Master", "Zen Warrior"],
        tags: ["breathing", "real-time", "biofeedback"],
        videoId: "ai-breathing"
      },
      {
        id: 'anxious-2',
        title: "5-4-3-2-1 Grounding Game",
        description: "Interactive grounding with point rewards! Tap objects around you in this AR-enhanced mindfulness experience.",
        action: "Launch grounding game",
        category: "Mindfulness",
        difficulty: "Easy" as const,
        duration: "6 min",
        points: 35,
        badges: ["Grounded", "Present Moment"],
        tags: ["grounding", "interactive", "present"],
        videoId: "grounding-game"
      }
    ]
  },
  happy: {
    icon: '✨',
    color: 'from-yellow-400 to-orange-500',
    tips: [
      {
        id: 'happy-1',
        title: "Joy Amplification Challenge",
        description: "Science-backed gratitude multipliers! Share your happiness and earn bonus points while spreading positivity.",
        action: "Amplify your joy (Share & Earn)",
        category: "Positive Psychology",
        difficulty: "Easy" as const,
        duration: "8 min",
        points: 40,
        badges: ["Joy Spreader", "Gratitude Master"],
        tags: ["gratitude", "sharing", "positive"],
        videoId: "joy-amplifier"
      }
    ]
  }
};

// Gamification Features
const achievements = [
  { id: 'streak-7', name: '7-Day Warrior', icon: '🔥', description: '7 consecutive days of practice' },
  { id: 'points-100', name: 'Century Club', icon: '💯', description: '100 points earned' },
  { id: 'tips-completed-25', name: 'Wisdom Seeker', icon: '🧠', description: '25 tips completed' },
  { id: 'mood-improver', name: 'Mood Lifter', icon: '📈', description: 'Improved mood 5 times' },
  { id: 'community-helper', name: 'Community Hero', icon: '❤️', description: 'Helped 10 other users' }
];

// AI-Powered Daily Challenges
const dailyChallenges = [
  {
    id: 'daily-1',
    title: 'Micro-Meditation Monday',
    description: 'Complete 3 one-minute meditation sessions',
    progress: 2,
    total: 3,
    reward: '50 points + Mindful Badge'
  },
  {
    id: 'daily-2', 
    title: 'Gratitude Tuesday',
    description: 'Share 5 things you\'re grateful for',
    progress: 3,
    total: 5,
    reward: '40 points + Thankful Badge'
  },
  {
    id: 'daily-3',
    title: 'Wellness Wednesday',
    description: 'Try 2 new wellness tips',
    progress: 1,
    total: 2,
    reward: '60 points + Explorer Badge'
  }
];

export function EnhancedWellnessTips({ currentMood, recentEntry, userProgress }: EnhancedWellnessTipsProps) {
  const [activeTab, setActiveTab] = useState('personalized');
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [completedTips, setCompletedTips] = useState<string[]>([]);
  const [dailyStreak, setDailyStreak] = useState(userProgress?.streak || 0);
  const [userPoints, setUserPoints] = useState(userProgress?.totalPoints || 0);
  const [userLevel, setUserLevel] = useState(userProgress?.level || 1);
  const [showAchievement, setShowAchievement] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<string | null>(null);
  const [bookmarkedTips, setBookmarkedTips] = useState<string[]>([]);

  // Get mood-specific tips with AI personalization
  const getMoodTips = () => {
    if (!currentMood || !dynamicTips[currentMood as keyof typeof dynamicTips]) {
      return [];
    }
    return dynamicTips[currentMood as keyof typeof dynamicTips].tips;
  };

  const moodTips = getMoodTips();
  const currentTip = moodTips[currentTipIndex];

  // Complete tip with rewards
  const completeTip = (tipId: string, points: number) => {
    if (!completedTips.includes(tipId)) {
      setCompletedTips(prev => [...prev, tipId]);
      setUserPoints(prev => prev + points);
      
      // Level up logic
      const newLevel = Math.floor((userPoints + points) / 100) + 1;
      if (newLevel > userLevel) {
        setUserLevel(newLevel);
        setShowAchievement('Level Up! 🎉');
      }

      // Check for achievements
      if (completedTips.length + 1 === 25) {
        setShowAchievement('Wisdom Seeker Unlocked! 🧠');
      }
    }
  };

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % moodTips.length);
  };

  const toggleBookmark = (tipId: string) => {
    setBookmarkedTips(prev => 
      prev.includes(tipId) 
        ? prev.filter(id => id !== tipId)
        : [...prev, tipId]
    );
  };

  const shareProgress = () => {
    // Mock sharing functionality
    navigator.share?.({
      title: 'Serenique Progress',
      text: `I just completed ${completedTips.length} wellness tips and earned ${userPoints} points on Serenique! 🌟`,
      url: 'https://serenique.com'
    });
  };

  return (
    <div className="space-y-6">
      {/* Achievement Notification */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-4 right-4 z-50"
          >
            <Alert className="glass border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50">
              <Trophy className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="font-medium text-yellow-800">
                {showAchievement}
              </AlertDescription>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setShowAchievement(null)}
                className="absolute top-2 right-2"
              >
                ✕
              </Button>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Header */}
      <Card className="glass border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-2xl font-bold text-orange-500">{dailyStreak}</span>
              </div>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-2xl font-bold text-yellow-600">{userPoints}</span>
              </div>
              <p className="text-xs text-muted-foreground">Points</p>
            </div>
            
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Award className="w-4 h-4 text-purple-500" />
                <span className="text-2xl font-bold text-purple-600">{userLevel}</span>
              </div>
              <p className="text-xs text-muted-foreground">Level</p>
            </div>
            
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-2xl font-bold text-green-600">{completedTips.length}</span>
              </div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tips Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 glass border-0">
          <TabsTrigger value="personalized" className="text-xs">
            <Brain className="w-3 h-3 mr-1" />
            AI Tips
          </TabsTrigger>
          <TabsTrigger value="challenges" className="text-xs">
            <Target className="w-3 h-3 mr-1" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="community" className="text-xs">
            <Users className="w-3 h-3 mr-1" />
            Community
          </TabsTrigger>
          <TabsTrigger value="achievements" className="text-xs">
            <Trophy className="w-3 h-3 mr-1" />
            Rewards
          </TabsTrigger>
        </TabsList>

        {/* Personalized AI Tips */}
        <TabsContent value="personalized" className="space-y-4">
          {moodTips.length > 0 ? (
            <Card className="glass border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                    </motion.div>
                    AI-Powered Tips
                  </CardTitle>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={`bg-gradient-to-r ${dynamicTips[currentMood as keyof typeof dynamicTips]?.color} text-white`}>
                      {dynamicTips[currentMood as keyof typeof dynamicTips]?.icon} {currentMood}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={nextTip}>
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <AnimatePresence mode="wait">
                  {currentTip && (
                    <motion.div
                      key={currentTip.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{currentTip.title}</h3>
                            <Badge variant="outline" size="sm">
                              {currentTip.difficulty}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {currentTip.description}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {currentTip.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              +{currentTip.points} pts
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-green-500" />
                              {currentTip.category}
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBookmark(currentTip.id)}
                          className="ml-2"
                        >
                          <Bookmark 
                            className={`w-4 h-4 ${
                              bookmarkedTips.includes(currentTip.id) 
                                ? 'fill-current text-yellow-500' 
                                : 'text-muted-foreground'
                            }`} 
                          />
                        </Button>
                      </div>

                      {/* Video Integration */}
                      {currentTip.videoId && (
                        <div className="glass p-4 rounded-lg border border-blue-200/20">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Guided Experience Available</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsVideoPlaying(
                                isVideoPlaying === currentTip.videoId ? null : currentTip.videoId
                              )}
                            >
                              {isVideoPlaying === currentTip.videoId ? (
                                <PauseCircle className="w-4 h-4" />
                              ) : (
                                <PlayCircle className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          {isVideoPlaying === currentTip.videoId && (
                            <div className="h-32 bg-muted rounded flex items-center justify-center">
                              <p className="text-sm text-muted-foreground">Video Player (Demo)</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                          onClick={() => completeTip(currentTip.id, currentTip.points)}
                          disabled={completedTips.includes(currentTip.id)}
                        >
                          {completedTips.includes(currentTip.id) ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                              Completed
                            </>
                          ) : (
                            <>
                              <ChevronRight className="w-4 h-4 mr-2" />
                              {currentTip.action}
                            </>
                          )}
                        </Button>
                        
                        <Button variant="outline" onClick={shareProgress}>
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Badges Preview */}
                      {currentTip.badges && (
                        <div className="flex gap-2">
                          {currentTip.badges.map((badge) => (
                            <Badge key={badge} variant="secondary" className="text-xs">
                              🏆 {badge}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          ) : (
            <Card className="glass border-0 shadow-lg">
              <CardContent className="py-8 text-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Brain className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                </motion.div>
                <h3 className="font-medium mb-2">AI Learning Your Patterns</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete a journal entry to unlock personalized AI wellness tips!
                </p>
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Go to Journal
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Daily Challenges */}
        <TabsContent value="challenges" className="space-y-4">
          <Card className="glass border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Daily Challenges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dailyChallenges.map((challenge) => (
                <motion.div
                  key={challenge.id}
                  className="glass p-4 rounded-lg border border-blue-200/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{challenge.title}</h4>
                    <Badge variant="outline">
                      {challenge.progress}/{challenge.total}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {challenge.description}
                  </p>
                  <Progress 
                    value={(challenge.progress / challenge.total) * 100} 
                    className="mb-2"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Reward: {challenge.reward}
                    </span>
                    <Button size="sm">
                      Continue
                    </Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Community Features */}
        <TabsContent value="community" className="space-y-4">
          <Card className="glass border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-500" />
                Community Wellness
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                </motion.div>
                <h3 className="font-medium mb-2">Join the Wellness Community</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect with others, share tips, and support each other's mental health journey.
                </p>
                <Button>
                  <Heart className="w-4 h-4 mr-2" />
                  Join Community
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements */}
        <TabsContent value="achievements" className="space-y-4">
          <Card className="glass border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Your Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    className="glass p-4 rounded-lg border border-yellow-200/20"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <h4 className="font-medium">{achievement.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}