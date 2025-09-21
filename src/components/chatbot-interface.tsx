import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useChat } from 'ai/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Send, Bot, User, Heart, Lightbulb, MessageCircle, Sparkles, Smile, Frown, Meh, Zap, Wind, Star, Music, Coffee, Palette, Settings, Gift, Target, Calendar, AlertTriangle, Phone } from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  type?: 'suggestion' | 'question' | 'support' | 'exercise' | 'achievement' | 'mood';
  mood?: string;
  reactions?: string[];
  isInteractive?: boolean;
  exerciseType?: 'breathing' | 'gratitude' | 'reflection' | 'goal';
}

interface ChatbotInterfaceProps {
  currentMood?: string;
  recentEntry?: string;
}

interface AIPersonality {
  name: string;
  avatar: string;
  style: string;
  greeting: string;
  icon: string;
}

const moodResponses = {
  happy: [
    "I'm so glad to hear you're feeling happy! 😊 What's bringing you joy today?",
    "That's wonderful! Would you like to share what made your day bright?",
    "Your happiness is contagious! What activities have been lifting your spirits?"
  ],
  sad: [
    "I hear that you're feeling sad, and that's completely okay. 💙 Would you like to talk about what's on your mind?",
    "It's brave of you to acknowledge these feelings. Sometimes talking can help - what's been weighing on you?",
    "I'm here to listen. Sad feelings are valid and temporary. What would help you feel supported right now?"
  ],
  anxious: [
    "I understand anxiety can feel overwhelming. 🫂 Let's take this one step at a time. What's making you feel anxious?",
    "Anxiety is tough, but you're not alone. What techniques have helped you cope with anxious feelings before?",
    "It's okay to feel anxious. Would you like to try a breathing exercise together, or would you prefer to talk about what's worrying you?"
  ],
  angry: [
    "I can sense you're feeling angry. That's a valid emotion. 💪 What's behind these feelings?",
    "Anger often tells us something important. What's frustrating you right now?",
    "It's okay to feel angry. Would you like to talk through what's bothering you, or try some techniques to help manage these feelings?"
  ],
  calm: [
    "It's beautiful that you're feeling calm. ✨ What's helping you maintain this peaceful state?",
    "That sense of calm is precious. What practices or activities help you feel centered?",
    "I love hearing about your calm moments. What would you like to reflect on while you're in this peaceful space?"
  ],
  excited: [
    "Your excitement is infectious! 🌟 What's got you feeling so energized?",
    "I can feel your positive energy! What amazing things are happening in your life?",
    "That's fantastic! Tell me more about what's making you feel so excited!"
  ],
  neutral: [
    "Thank you for checking in. How are you really feeling today?",
    "Sometimes neutral is exactly where we need to be. What's on your mind?",
    "I'm here to listen. What would you like to talk about or explore today?"
  ]
};

const supportiveTips = {
  sad: [
    "💙 Try the 5-4-3-2-1 grounding technique: Notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
    "🌱 Remember: feelings are temporary visitors, not permanent residents. This too shall pass.",
    "☀️ Consider reaching out to a trusted friend or family member. Connection can be healing."
  ],
  anxious: [
    "🌊 Try box breathing: Breathe in for 4 counts, hold for 4, breathe out for 4, hold for 4. Repeat.",
    "🧘 Mindfulness can help: Focus on what you can control right now, in this moment.",
    "📝 Writing down your worries can sometimes help make them feel more manageable."
  ],
  angry: [
    "💪 Physical activity can help release angry energy - try going for a walk or doing some stretches.",
    "🎯 Ask yourself: What boundary was crossed? What do I need right now?",
    "⏰ Give yourself permission to feel angry, then set a timer for 10 minutes to process it before deciding on action."
  ],
  happy: [
    "✨ Savor this moment! What specific things are contributing to your happiness?",
    "📸 Consider keeping a gratitude journal to remember these positive feelings.",
    "🤝 Sharing joy often multiplies it - consider telling someone about your good day!"
  ]
};

const conversationStarters = [
  "How was your day?",
  "What's been on your mind lately?",
  "Tell me about something that made you smile recently",
  "What's one thing you're grateful for today?",
  "How are you taking care of yourself?",
  "What's challenging you right now?"
];

const aiPersonalities: AIPersonality[] = [
  {
    name: "Sage",
    avatar: "🧙‍♀️",
    style: "wise and reflective",
    greeting: "Hello, dear soul. I'm here to guide you with wisdom and compassion. 🌟",
    icon: "✨"
  },
  {
    name: "Buddy",
    avatar: "😊",
    style: "friendly and encouraging",
    greeting: "Hey there, friend! I'm so excited to chat with you today! 🎉",
    icon: "💫"
  },
  {
    name: "Zen",
    avatar: "🧘‍♂️",
    style: "calm and mindful",
    greeting: "Welcome to this peaceful moment. Let's explore your inner world together. 🕊️",
    icon: "🌸"
  },
  {
    name: "Spark",
    avatar: "⚡",
    style: "energetic and motivating",
    greeting: "Ready to light up your day? I'm here to energize your wellness journey! 🚀",
    icon: "🔥"
  }
];

const quickActions = [
  { id: 'mood', label: 'Check Mood', icon: '😊', description: 'Quick mood assessment' },
  { id: 'breathing', label: 'Breathe', icon: '🫁', description: 'Guided breathing exercise' },
  { id: 'gratitude', label: 'Gratitude', icon: '🙏', description: '3 things you\'re grateful for' },
  { id: 'goals', label: 'Daily Goal', icon: '🎯', description: 'Set a wellness goal' },
  { id: 'reflection', label: 'Reflect', icon: '💭', description: 'Guided self-reflection' },
  { id: 'energy', label: 'Energy Boost', icon: '⚡', description: 'Quick energizing tips' }
];

const moodOptions = [
  { emoji: '😄', label: 'Amazing', value: 'amazing' },
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '😌', label: 'Calm', value: 'calm' },
  { emoji: '😐', label: 'Neutral', value: 'neutral' },
  { emoji: '😔', label: 'Sad', value: 'sad' },
  { emoji: '😰', label: 'Anxious', value: 'anxious' },
  { emoji: '😤', label: 'Frustrated', value: 'frustrated' },
  { emoji: '😴', label: 'Tired', value: 'tired' }
];

const chatThemes = [
  { name: 'Default', gradient: 'from-blue-500 to-purple-600', bg: 'bg-background' },
  { name: 'Sunset', gradient: 'from-orange-400 to-pink-500', bg: 'bg-gradient-to-br from-orange-50 to-pink-50' },
  { name: 'Ocean', gradient: 'from-cyan-400 to-blue-600', bg: 'bg-gradient-to-br from-cyan-50 to-blue-50' },
  { name: 'Forest', gradient: 'from-green-400 to-emerald-600', bg: 'bg-gradient-to-br from-green-50 to-emerald-50' },
  { name: 'Lavender', gradient: 'from-purple-400 to-indigo-600', bg: 'bg-gradient-to-br from-purple-50 to-indigo-50' }
];

export function ChatbotInterface({ currentMood, recentEntry }: ChatbotInterfaceProps) {
  const [selectedPersonality, setSelectedPersonality] = useState<AIPersonality>(aiPersonalities[0]);
  const [currentTheme, setCurrentTheme] = useState(chatThemes[0]);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [conversationScore, setConversationScore] = useState(0);
  const [dailyProgress, setDailyProgress] = useState(25);
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Real AI Chat Integration
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    setMessages
  } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: selectedPersonality.greeting,
      }
    ],
    body: {
      personality: selectedPersonality,
      userContext: {
        currentMood,
        recentEntry,
        conversationScore
      }
    },
    onResponse: async (response) => {
      // Check for crisis detection
      if (response.headers.get('x-crisis-detected') === 'true') {
        setShowCrisisAlert(true);
      }
    },
    onFinish: () => {
      // Update conversation metrics
      setConversationScore(prev => Math.min(prev + 10, 100));
      setDailyProgress(prev => Math.min(prev + 5, 100));
      
      // Randomly suggest exercises
      if (Math.random() > 0.7) {
        setTimeout(() => {
          suggestRandomExercise();
        }, 2000);
      }
    }
  });

  // Enhanced message sending with AI integration
  const sendAIMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    setShowQuickActions(false);
    await handleSubmit(e);
  };

  // Quick message handler for conversation starters
  const sendQuickMessage = (message: string) => {
    handleInputChange({ target: { value: message } } as any);
  };

  // Crisis resources component
  const CrisisAlert = () => (
    <Alert className="mb-4 border-red-200 bg-red-50 dark:bg-red-950/20">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800 dark:text-red-300">
        <div className="space-y-2">
          <p className="font-medium">If you're in crisis, please reach out for immediate help:</p>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3" />
              <span>Crisis Text Line: Text HOME to 741741</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3" />
              <span>National Suicide Prevention Lifeline: 988</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCrisisAlert(false)}
            className="mt-2"
          >
            I understand
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );

  const sendTip = () => {
    if (!currentMood || !supportiveTips[currentMood as keyof typeof supportiveTips]) return;
    
    const tips = supportiveTips[currentMood as keyof typeof supportiveTips];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    
    const tipMessage: ChatMessage = {
      id: Date.now().toString(),
      text: `Here's a helpful tip for when you're feeling ${currentMood}: ${randomTip}`,
      isBot: true,
      timestamp: new Date(),
      type: 'suggestion'
    };

    setMessages(prev => [...prev, tipMessage]);
  };

  const handleQuickAction = async (actionId: string) => {
    setActiveExercise(actionId);
    setShowQuickActions(false);
    
    const actionPrompts = {
      mood: "I'd like to check in with my mood right now. Can you help me explore how I'm feeling?",
      breathing: "I'd like to do a breathing exercise. Can you guide me through one?",
      gratitude: "I want to practice gratitude. Can you help me think of things I'm grateful for?",
      goals: "I'd like to set a wellness goal for today. Can you help me create one?",
      reflection: "I want to do some self-reflection. Can you give me a thoughtful question?",
      energy: "I need an energy boost. Can you suggest something to help me feel more energized?"
    };

    const prompt = actionPrompts[actionId as keyof typeof actionPrompts];
    if (prompt) {
      // Send the action as a user message to the AI
      const actionMessage = {
        id: Date.now().toString(),
        role: 'user' as const,
        content: prompt
      };
      
      setMessages(prev => [...prev, actionMessage]);
      setDailyProgress(prev => Math.min(prev + 10, 100));
      
      // Let the AI respond naturally to the action request
      await handleSubmit(new Event('submit') as any);
    }
  };

  const handleMoodSelection = async (mood: string) => {
    const moodMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: `I'm feeling ${mood} right now. Can you help me understand and work with this mood?`
    };

    setMessages(prev => [...prev, moodMessage]);
    setActiveExercise(null);
    setShowQuickActions(true);
    
    // Let AI respond to mood selection
    await handleSubmit(new Event('submit') as any);
  };

  // Send tip function adapted for AI
  const sendTip = async () => {
    if (!currentMood) return;
    
    const tipPrompt = `I'm feeling ${currentMood}. Can you give me a helpful wellness tip for this mood?`;
    sendQuickMessage(tipPrompt);
  };

  const addMessageReaction = (messageId: string, reaction: string) => {
    // For now, just provide visual feedback
    // In a full implementation, you could store reactions in localStorage or send to backend
    console.log(`Reaction ${reaction} added to message ${messageId}`);
  };

  const changePersonality = (personality: AIPersonality) => {
    setSelectedPersonality(personality);
    
    const changeMessage = {
      id: Date.now().toString(),
      role: 'assistant' as const,
      content: `✨ I've transformed! ${personality.greeting}`
    };

    setMessages(prev => [...prev, changeMessage]);
  };

  const suggestRandomExercise = () => {
    const suggestions = [
      "💡 Quick suggestion: How about we try a 2-minute gratitude reflection?",
      "🌟 Feeling adventurous? Let's set a small wellness goal together!",
      "🧘‍♀️ Would you like to try a brief mindfulness moment?",
      "⚡ Want to boost your energy with a quick movement break?"
    ];

    const suggestionMessage = {
      id: Date.now().toString(),
      role: 'assistant' as const,
      content: suggestions[Math.floor(Math.random() * suggestions.length)]
    };

    setMessages(prev => [...prev, suggestionMessage]);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`h-full ${currentTheme.bg} rounded-lg`}>
      <Card className="h-full flex flex-col glass border-0">
        <CardHeader className="flex-shrink-0 space-y-4">
          {/* AI Companion Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className={`w-10 h-10 rounded-full bg-gradient-to-r ${currentTheme.gradient} flex items-center justify-center text-white text-lg`}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {selectedPersonality.avatar}
              </motion.div>
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  {selectedPersonality.name}
                  <Badge variant="secondary" className="text-xs">
                    {selectedPersonality.style}
                  </Badge>
                </CardTitle>
                <p className="text-xs text-muted-foreground">AI Wellness Companion</p>
              </div>
            </div>
            
            {/* Progress & Score */}
            <div className="text-right space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="w-3 h-3" />
                <span>Daily Progress: {dailyProgress}%</span>
              </div>
              <Progress value={dailyProgress} className="w-20 h-2" />
            </div>
          </div>

          {/* Interactive Tabs */}
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-3 glass">
              <TabsTrigger value="chat" className="text-xs">
                <MessageCircle className="w-3 h-3 mr-1" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="exercises" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                Quick Actions
              </TabsTrigger>
              <TabsTrigger value="customize" className="text-xs">
                <Settings className="w-3 h-3 mr-1" />
                Customize
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="mt-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={sendTip} disabled={!currentMood}>
                  <Lightbulb className="w-3 h-3 mr-1" />
                  Get Tip
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowQuickActions(!showQuickActions)}>
                  <Zap className="w-3 h-3 mr-1" />
                  Quick Actions
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="exercises" className="mt-4">
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <motion.div key={action.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action.id)}
                      className="w-full h-auto p-2 flex flex-col items-center gap-1 text-xs"
                      disabled={activeExercise === action.id}
                    >
                      <span className="text-lg">{action.icon}</span>
                      <span>{action.label}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="customize" className="mt-4 space-y-4">
              {/* AI Personality Selection */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">AI Personality:</p>
                <div className="grid grid-cols-2 gap-2">
                  {aiPersonalities.map((personality) => (
                    <Button
                      key={personality.name}
                      variant={selectedPersonality.name === personality.name ? "default" : "outline"}
                      size="sm"
                      onClick={() => changePersonality(personality)}
                      className="text-xs h-auto p-2"
                    >
                      <span className="mr-1">{personality.avatar}</span>
                      {personality.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Theme Selection */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Chat Theme:</p>
                <div className="grid grid-cols-3 gap-2">
                  {chatThemes.map((theme) => (
                    <Button
                      key={theme.name}
                      variant={currentTheme.name === theme.name ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentTheme(theme)}
                      className="text-xs h-8"
                    >
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${theme.gradient} mr-1`} />
                      {theme.name}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-4 pt-0">
          {/* Crisis Alert */}
          {showCrisisAlert && <CrisisAlert />}
          
          {/* Error Handling */}
          {error && (
            <Alert className="mb-4 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 dark:text-yellow-300">
                Connection issue detected. I'm still here to listen, but responses may be delayed.
              </AlertDescription>
            </Alert>
          )}

          <ScrollArea className="flex-1 mb-4" ref={scrollAreaRef}>
            <div className="space-y-4 pr-4">
              {messages.map((message) => (
                <motion.div 
                  key={message.id} 
                  className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                    message.role === 'assistant' 
                      ? 'bg-muted/50 text-muted-foreground backdrop-blur-sm' 
                      : `bg-gradient-to-r ${currentTheme.gradient} text-white`
                  }`}>
                    <div className="flex items-start gap-2">
                      {message.role === 'assistant' ? (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">
                          {selectedPersonality.avatar}
                        </div>
                      ) : (
                        <User className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-80" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        
                        {/* Message Reactions for AI messages */}
                        {message.role === 'assistant' && (
                          <div className="flex gap-1 mt-2">
                            {['❤️', '👍', '🤗', '💭'].map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => addMessageReaction(message.id, emoji)}
                                className="text-xs px-2 py-1 rounded-full transition-all hover:scale-110 bg-white/50 hover:bg-white/80"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}

                        <span className="text-xs opacity-70 mt-2 block">
                          {new Date(message.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Enhanced Typing Indicator */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div 
                    className="flex justify-start"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <div className="bg-muted/50 backdrop-blur-sm rounded-2xl p-3 max-w-[80%]">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs">
                          {selectedPersonality.avatar}
                        </div>
                        <div className="flex gap-1">
                          <motion.div 
                            className="w-2 h-2 bg-muted-foreground rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div 
                            className="w-2 h-2 bg-muted-foreground rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.div 
                            className="w-2 h-2 bg-muted-foreground rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{selectedPersonality.name} is thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>

          {/* Enhanced Quick Actions */}
          <AnimatePresence>
            {showQuickActions && !activeExercise && (
              <motion.div 
                className="mb-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.slice(0, 3).map((action) => (
                    <motion.div key={action.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction(action.id)}
                        className="text-xs h-8 glass border-0"
                      >
                        <span className="mr-1">{action.icon}</span>
                        {action.label}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Input Area */}
          <form onSubmit={sendAIMessage} className="space-y-2">
            {/* Conversation starters */}
            <div className="flex flex-wrap gap-1">
              {conversationStarters.slice(0, 2).map((starter, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => sendQuickMessage(starter)}
                  className="text-xs h-6 px-2 text-muted-foreground hover:text-foreground"
                >
                  "{starter}"
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder={`Share your thoughts with ${selectedPersonality.name}...`}
                disabled={isLoading}
                className="glass border-0 backdrop-blur-sm"
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={`bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90 border-0`}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}