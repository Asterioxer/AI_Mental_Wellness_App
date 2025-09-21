import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { 
  Lightbulb, Heart, Brain, Smile, RefreshCw, Zap, Trophy, Star, 
  CheckCircle, Target, Calendar, Users, Bookmark, Share2, 
  PlayCircle, PauseCircle, Timer, Gift, TrendingUp, Award,
  Flame, Clock, ChevronRight, MessageSquare, Send, Sparkles,
  AlertTriangle, Phone, Bot, User, Mic, MicOff, Volume2
} from 'lucide-react';
import { LocalWellnessAI, type UserContext, type AIRecommendation } from '../utils/local-ai-engine';

interface AIPoweredWellnessTipsProps {
  currentMood?: string;
  recentEntry?: string;
  userProgress?: {
    completedTips: number;
    streak: number;
    totalPoints: number;
    level: number;
  };
}

// Initialize local AI engine
const localAI = new LocalWellnessAI();

export function AIPoweredWellnessTips({ currentMood, recentEntry, userProgress }: AIPoweredWellnessTipsProps) {
  const [activeTab, setActiveTab] = useState('ai-assistant');
  const [userInput, setUserInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
    recommendations?: AIRecommendation[];
  }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentRecommendations, setCurrentRecommendations] = useState<AIRecommendation[]>([]);
  const [completedTips, setCompletedTips] = useState<string[]>([]);
  const [bookmarkedTips, setBookmarkedTips] = useState<string[]>([]);
  const [dailyStreak, setDailyStreak] = useState(userProgress?.streak || 0);
  const [userPoints, setUserPoints] = useState(userProgress?.totalPoints || 0);
  const [userLevel, setUserLevel] = useState(userProgress?.level || 1);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [emergencyInfo, setEmergencyInfo] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Get current time of day
  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  };

  // Build user context for AI
  const getUserContext = (): UserContext => ({
    currentMood,
    recentEntry,
    timeOfDay: getTimeOfDay(),
    userHistory: {
      completedTips,
      preferredCategories: ['Mindfulness', 'Breathing'], // Would track from user behavior
      moodPatterns: [
        { mood: currentMood || 'neutral', timestamp: new Date() }
      ],
      engagementLevel: userPoints / 100
    }
  });

  // Handle AI conversation
  const handleAIQuery = async (query: string) => {
    if (!query.trim()) return;

    setIsProcessing(true);
    const userMessage = {
      id: Date.now().toString(),
      content: query,
      isUser: true,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setUserInput('');

    try {
      const context = getUserContext();
      
      // Get AI recommendations and analysis
      const aiResponse = await localAI.generateRecommendations(query, context);
      const conversationalResponse = await localAI.generateConversationalResponse(query, context);

      // Handle emergency situations
      if (aiResponse.emergencyAlert) {
        setEmergencyInfo(aiResponse.emergencyAlert);
        setShowEmergencyAlert(true);
      }

      // Add AI response to chat
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: conversationalResponse,
        isUser: false,
        timestamp: new Date(),
        recommendations: aiResponse.recommendations
      };

      setChatMessages(prev => [...prev, aiMessage]);
      setCurrentRecommendations(aiResponse.recommendations);

    } catch (error) {
      console.error('AI processing error:', error);
      
      // Fallback response
      const fallbackMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm here to listen and support you. While I process your message, take a deep breath with me. Sometimes the simple act of reaching out is the first step toward feeling better. 💙",
        isUser: false,
        timestamp: new Date(),
        recommendations: []
      };

      setChatMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Complete tip with rewards and analytics
  const completeTip = (tipId: string, points: number) => {
    if (!completedTips.includes(tipId)) {
      setCompletedTips(prev => [...prev, tipId]);
      setUserPoints(prev => prev + points);
      
      // Level up logic
      const newLevel = Math.floor((userPoints + points) / 100) + 1;
      if (newLevel > userLevel) {
        setUserLevel(newLevel);
        setShowSuccessAnimation(true);
        setTimeout(() => setShowSuccessAnimation(false), 3000);
      }

      // Streak tracking
      setDailyStreak(prev => prev + 1);
    }
  };

  // Voice input simulation (would integrate with Web Speech API)
  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice input - in real implementation would use SpeechRecognition
      setTimeout(() => {
        setUserInput("I'm feeling anxious about tomorrow");
        setIsListening(false);
      }, 2000);
    }
  };

  // Auto-generate recommendations on mood/context change
  useEffect(() => {
    if (currentMood && chatMessages.length === 0) {
      const initialQuery = `I'm feeling ${currentMood} today. Can you help me?`;
      handleAIQuery(initialQuery);
    }
  }, [currentMood]);

  return (
    <div className="space-y-6">
      {/* Success Animation */}
      <AnimatePresence>
        {showSuccessAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: -100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: -100 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <Card className="glass border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardContent className="py-4 px-6 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: 2 }}
                >
                  <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                </motion.div>
                <p className="font-medium text-yellow-800">Level Up! 🎉</p>
                <p className="text-sm text-yellow-700">You reached Level {userLevel}!</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emergency Alert */}
      <AnimatePresence>
        {showEmergencyAlert && emergencyInfo && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <Alert className="border-red-500 bg-red-50 dark:bg-red-950/20">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-300">
                <div className="space-y-3">
                  <p className="font-medium">{emergencyInfo.message}</p>
                  <div className="space-y-2">
                    {emergencyInfo.resources.map((resource: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Phone className="w-3 h-3" />
                        <span>{resource}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEmergencyAlert(false)}
                    className="mt-2"
                  >
                    I understand
                  </Button>
                </div>
              </AlertDescription>
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

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 glass border-0">
          <TabsTrigger value="ai-assistant" className="text-xs">
            <Bot className="w-3 h-3 mr-1" />
            AI Assistant
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="text-xs">
            <Lightbulb className="w-3 h-3 mr-1" />
            Smart Tips
          </TabsTrigger>
          <TabsTrigger value="progress" className="text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            Progress
          </TabsTrigger>
        </TabsList>

        {/* AI Assistant Tab */}
        <TabsContent value="ai-assistant" className="space-y-4">
          <Card className="glass border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Brain className="w-5 h-5 text-purple-500" />
                </motion.div>
                AI Wellness Assistant
                <Badge className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
                  Local AI • No Data Sent
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Chat Messages */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {chatMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl p-3 ${
                        message.isUser 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                          : 'bg-muted/50 backdrop-blur-sm'
                      }`}>
                        <div className="flex items-start gap-2">
                          {!message.isUser && (
                            <Bot className="w-4 h-4 mt-0.5 text-purple-500 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {message.content}
                            </p>
                            <span className="text-xs opacity-70 mt-1 block">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {message.isUser && (
                            <User className="w-4 h-4 mt-0.5 opacity-80 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                <AnimatePresence>
                  {isProcessing && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex justify-start"
                    >
                      <div className="bg-muted/50 backdrop-blur-sm rounded-2xl p-3">
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-purple-500" />
                          <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="w-2 h-2 bg-purple-500 rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">AI is thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input Area */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Tell me how you're feeling or what you're going through..."
                      className="resize-none glass border-0"
                      rows={2}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAIQuery(userInput);
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleVoiceInput}
                      className={`absolute bottom-2 right-2 ${isListening ? 'text-red-500' : 'text-muted-foreground'}`}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                  </div>
                  
                  <Button
                    onClick={() => handleAIQuery(userInput)}
                    disabled={!userInput.trim() || isProcessing}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                  {[
                    "I'm feeling anxious",
                    "I'm having trouble sleeping",
                    "I feel overwhelmed",
                    "I need motivation",
                    "I'm feeling lonely"
                  ].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAIQuery(suggestion)}
                      className="text-xs glass border-0"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Smart Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card className="glass border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Personalized Recommendations
                <Badge variant="secondary">
                  {currentRecommendations.length} tips found
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {currentRecommendations.length > 0 ? (
                <div className="space-y-4">
                  {currentRecommendations.map((rec) => (
                    <motion.div
                      key={rec.id}
                      className="glass p-4 rounded-lg border border-blue-200/20"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{rec.title}</h4>
                              <Badge variant="outline" size="sm">
                                {rec.difficulty}
                              </Badge>
                              <Badge 
                                variant="secondary" 
                                className={`${rec.confidence > 0.8 ? 'bg-green-100 text-green-800' : 
                                  rec.confidence > 0.6 ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-blue-100 text-blue-800'}`}
                              >
                                {Math.round(rec.confidence * 100)}% match
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-2">
                              {rec.description}
                            </p>

                            {rec.personalizedMessage && (
                              <div className="bg-blue-50 dark:bg-blue-950/20 p-2 rounded text-xs text-blue-800 dark:text-blue-300 mb-2">
                                {rec.personalizedMessage}
                              </div>
                            )}

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {rec.duration}
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500" />
                                +{rec.points} pts
                              </div>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3 text-green-500" />
                                {rec.category}
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setBookmarkedTips(prev => 
                              prev.includes(rec.id) 
                                ? prev.filter(id => id !== rec.id)
                                : [...prev, rec.id]
                            )}
                          >
                            <Bookmark 
                              className={`w-4 h-4 ${
                                bookmarkedTips.includes(rec.id) 
                                  ? 'fill-current text-yellow-500' 
                                  : 'text-muted-foreground'
                              }`} 
                            />
                          </Button>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                            onClick={() => completeTip(rec.id, rec.points)}
                            disabled={completedTips.includes(rec.id)}
                          >
                            {completedTips.includes(rec.id) ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                                Completed
                              </>
                            ) : (
                              <>
                                <ChevronRight className="w-4 h-4 mr-2" />
                                {rec.action}
                              </>
                            )}
                          </Button>
                        </div>

                        {/* AI Reasoning */}
                        <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                          <strong>AI Analysis:</strong> {rec.reasoning}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">Start a conversation with AI</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tell the AI assistant how you're feeling to get personalized wellness recommendations.
                  </p>
                  <Button 
                    onClick={() => setActiveTab('ai-assistant')}
                    className="bg-gradient-to-r from-blue-500 to-purple-600"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Talk to AI Assistant
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-4">
          <Card className="glass border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Your Wellness Journey
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
                </motion.div>
                <h3 className="text-xl font-medium mb-2">Level {userLevel} Wellness Explorer</h3>
                <p className="text-muted-foreground mb-4">
                  You've completed {completedTips.length} wellness activities and earned {userPoints} points!
                </p>
                <Progress value={(userPoints % 100)} className="mb-2" />
                <p className="text-xs text-muted-foreground">
                  {100 - (userPoints % 100)} points to next level
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center glass p-4 rounded-lg">
                  <Flame className="w-8 h-8 mx-auto text-orange-500 mb-2" />
                  <h4 className="font-medium">{dailyStreak} Day Streak</h4>
                  <p className="text-xs text-muted-foreground">Keep it going!</p>
                </div>
                
                <div className="text-center glass p-4 rounded-lg">
                  <Bookmark className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                  <h4 className="font-medium">{bookmarkedTips.length} Saved Tips</h4>
                  <p className="text-xs text-muted-foreground">Ready for later</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}