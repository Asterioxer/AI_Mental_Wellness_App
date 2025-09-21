import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Send, Bot, User, Heart, Lightbulb, MessageCircle, Sparkles, Zap, Settings, AlertTriangle, Phone } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: number;
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
}

const aiPersonalities: AIPersonality[] = [
  {
    name: "Sage",
    avatar: "🧙‍♀️",
    style: "wise and reflective",
    greeting: "Hello, dear soul. I'm here to guide you with wisdom and compassion. 🌟"
  },
  {
    name: "Buddy",
    avatar: "😊",
    style: "friendly and encouraging",
    greeting: "Hey there, friend! I'm so excited to chat with you today! 🎉"
  },
  {
    name: "Zen",
    avatar: "🧘‍♂️",
    style: "calm and mindful",
    greeting: "Welcome to this peaceful moment. Let's explore your inner world together. 🕊️"
  },
  {
    name: "Spark",
    avatar: "⚡",
    style: "energetic and motivating",
    greeting: "Ready to light up your day? I'm here to energize your wellness journey! 🚀"
  }
];

const chatThemes = [
  { name: 'Default', gradient: 'from-blue-500 to-purple-600', bg: 'bg-background' },
  { name: 'Sunset', gradient: 'from-orange-400 to-pink-500', bg: 'bg-gradient-to-br from-orange-50 to-pink-50' },
  { name: 'Ocean', gradient: 'from-cyan-400 to-blue-600', bg: 'bg-gradient-to-br from-cyan-50 to-blue-50' },
  { name: 'Forest', gradient: 'from-green-400 to-emerald-600', bg: 'bg-gradient-to-br from-green-50 to-emerald-50' },
];

const quickActions = [
  { id: 'mood', label: 'Check Mood', icon: '😊', description: 'Quick mood assessment' },
  { id: 'breathing', label: 'Breathe', icon: '🫁', description: 'Guided breathing exercise' },
  { id: 'gratitude', label: 'Gratitude', icon: '🙏', description: '3 things you\'re grateful for' },
  { id: 'goals', label: 'Daily Goal', icon: '🎯', description: 'Set a wellness goal' },
  { id: 'reflection', label: 'Reflect', icon: '💭', description: 'Guided self-reflection' },
  { id: 'energy', label: 'Energy Boost', icon: '⚡', description: 'Quick energizing tips' }
];

// Enhanced AI-like responses based on personality and context
const generateIntelligentResponse = (userMessage: string, personality: AIPersonality, userContext: any): string => {
  const message = userMessage.toLowerCase();
  
  // Crisis detection
  const crisisKeywords = ['suicide', 'kill myself', 'hurt myself', 'don\'t want to live', 'hopeless'];
  const isCrisis = crisisKeywords.some(keyword => message.includes(keyword));
  
  if (isCrisis) {
    return `I hear that you're struggling right now, and I'm genuinely concerned about you. 💙 Your feelings matter, and there are people who want to help. Please consider reaching out to:

• Crisis Text Line: Text HOME to 741741
• National Suicide Prevention Lifeline: 988

You don't have to go through this alone. Would you like to talk about what's making you feel this way?`;
  }

  // Personality-based responses with context awareness
  const personalityResponses = {
    sage: {
      greeting: ["Your words carry deep wisdom. What insights are emerging for you? 🌟", "I sense growth in your reflection. Tell me more about what you're discovering."],
      mood: ["The path to understanding our emotions requires gentle patience. What does this feeling teach you?", "Every emotion carries a message. What is yours whispering to you today?"],
      gratitude: ["Gratitude illuminates the path forward. What light do you see in your life today? ✨", "In appreciation, we find abundance. What gifts surround you?"],
      general: ["Your journey of self-discovery continues to unfold beautifully. What calls to your attention right now?", "There is wisdom in every experience. What would you like to explore together?"]
    },
    buddy: {
      greeting: ["Hey! I'm so excited you're here! What's going on in your world today? 🎉", "You're amazing for reaching out! What's been happening lately?"],
      mood: ["I totally get that! Feelings can be super intense sometimes. What's behind this feeling for you?", "That makes so much sense! You're brave for sharing that. What support do you need right now?"],
      gratitude: ["Oh I LOVE gratitude practice! It's like instant mood magic! ✨ What's making you smile today?", "Yes! Gratitude is my favorite! What awesome things are happening in your life?"],
      general: ["You know what? You're doing great by being here and being open! What else is on your mind?", "I'm here for all of it - the good, the challenging, everything! What do you want to talk about?"]
    },
    zen: {
      greeting: ["Let us settle into this moment together. What wishes to be acknowledged today? 🕊️", "In this space of presence, what arises for you?"],
      mood: ["Notice how feelings flow like water through your being. What do you observe about this emotion?", "Breathe with this feeling, neither pushing nor pulling. What wisdom does it hold?"],
      gratitude: ["In gratitude, we touch the sacred ordinary. What invites your appreciation today? 🙏", "Mindful appreciation connects us to the present moment's gifts. What do you notice?"],
      general: ["Let us explore with gentle curiosity. What draws your awareness right now?", "In the stillness between thoughts, what emerges for you?"]
    },
    spark: {
      greeting: ["WOW! Look at you showing up for yourself today! That's AMAZING! ⚡ What adventure are we going on?", "YES! I can feel your energy! You're absolutely crushing it by being here! What's exciting you?"],
      mood: ["I feel that! Emotions are like energy waves - totally powerful! 🌊 What's this feeling telling you to do?", "Absolutely! That feeling is valid and important! Let's channel this energy - what action feels right?"],
      gratitude: ["LOVE this energy! Gratitude is like rocket fuel for the soul! 🚀 What's lighting you up today?", "Yes! Appreciation amplifies everything good! What victories are you celebrating?"],
      general: ["You're bringing such powerful energy to this conversation! I'm here for it! What's next on your mind?", "I can feel your momentum building! You're doing incredible work - what do you want to tackle?"]
    }
  };

  const personality_key = personality.name.toLowerCase() as keyof typeof personalityResponses;
  const responses = personalityResponses[personality_key];

  // Context-aware response selection
  if (message.includes('grateful') || message.includes('thankful') || message.includes('appreciate')) {
    return responses.gratitude[Math.floor(Math.random() * responses.gratitude.length)];
  }
  
  if (message.includes('feel') || message.includes('mood') || message.includes('emotion')) {
    return responses.mood[Math.floor(Math.random() * responses.mood.length)];
  }
  
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
  }
  
  return responses.general[Math.floor(Math.random() * responses.general.length)];
};

export function ChatbotInterfaceFallback({ currentMood, recentEntry }: ChatbotInterfaceProps) {
  const [selectedPersonality, setSelectedPersonality] = useState<AIPersonality>(aiPersonalities[0]);
  const [currentTheme, setCurrentTheme] = useState(chatThemes[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: selectedPersonality.greeting,
      createdAt: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [conversationScore, setConversationScore] = useState(0);
  const [dailyProgress, setDailyProgress] = useState(25);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      createdAt: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowQuickActions(false);

    // Simulate AI thinking time with realistic delay
    setTimeout(() => {
      const aiResponse = generateIntelligentResponse(input, selectedPersonality, {
        currentMood,
        recentEntry,
        conversationScore
      });

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        createdAt: Date.now()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
      setConversationScore(prev => Math.min(prev + 10, 100));
      setDailyProgress(prev => Math.min(prev + 5, 100));

      // Check for crisis and show alert if needed
      if (aiResponse.includes('Crisis Text Line')) {
        setShowCrisisAlert(true);
      }
    }, 1500 + Math.random() * 1500);
  };

  const sendQuickMessage = (message: string) => {
    setInput(message);
  };

  const handleQuickAction = (actionId: string) => {
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
      setInput(prompt);
      setDailyProgress(prev => Math.min(prev + 10, 100));
    }
  };

  const changePersonality = (personality: AIPersonality) => {
    setSelectedPersonality(personality);
    
    const changeMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `✨ I've transformed! ${personality.greeting}`,
      createdAt: Date.now()
    };

    setMessages(prev => [...prev, changeMessage]);
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
            
            <div className="text-right space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="w-3 h-3" />
                <span>Daily Progress: {dailyProgress}%</span>
              </div>
              <Progress value={dailyProgress} className="w-20 h-2" />
            </div>
          </div>

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
                <Button variant="outline" size="sm" onClick={() => setShowQuickActions(!showQuickActions)}>
                  <Zap className="w-3 h-3 mr-1" />
                  Quick Actions
                </Button>
                <Badge variant="secondary" className="text-xs">
                  ⚡ AI-Powered (Fallback Mode)
                </Badge>
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
                    >
                      <span className="text-lg">{action.icon}</span>
                      <span>{action.label}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="customize" className="mt-4 space-y-4">
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

              <div>
                <p className="text-xs text-muted-foreground mb-2">Chat Theme:</p>
                <div className="grid grid-cols-2 gap-2">
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
          {showCrisisAlert && (
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
                        <span className="text-xs opacity-70 mt-2 block">
                          {new Date(message.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
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

          <form onSubmit={sendMessage} className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
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