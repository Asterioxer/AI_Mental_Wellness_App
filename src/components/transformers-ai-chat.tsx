import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Bot, User, Send, Mic, MicOff, Brain, Heart, Zap, 
  AlertTriangle, Phone, MessageSquare, Lightbulb,
  Activity, TrendingUp, Shield, CheckCircle2, Loader2,
  Sparkles, Target, Clock, Star, RefreshCw, UserCheck,
  BookOpen, MessageCircleMore, Stethoscope, Eye, 
  PsychologyIcon, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { transformersAI, type ChatMessage, type AIResponse } from '../utils/transformers-ai-engine';

interface TransformersAIChatProps {
  currentMood?: string;
  recentEntry?: string;
  onMoodUpdate?: (mood: string, confidence: number) => void;
}

export function TransformersAIChat({ currentMood, recentEntry, onMoodUpdate }: TransformersAIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initProgress, setInitProgress] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [currentAIResponse, setCurrentAIResponse] = useState<AIResponse | null>(null);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [modelStatus, setModelStatus] = useState({
    psychological_assessment: false,
    therapeutic_modalities: false,
    crisis_detection: false,
    sentiment_analysis: false,
    emotion_detection: false,
    intent_classification: false,
    contextual_understanding: false
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize AI models on component mount
  useEffect(() => {
    initializeAI();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate initial greeting based on mood
  useEffect(() => {
    if (currentMood && messages.length === 0 && !isInitializing) {
      generateInitialGreeting();
    }
  }, [currentMood, isInitializing]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeAI = async () => {
    try {
      setIsInitializing(true);
      setInitProgress(10);

      // Simulate initialization progress
      const progressSteps = [20, 40, 60, 80, 95, 100];
      let stepIndex = 0;

      const progressInterval = setInterval(() => {
        if (stepIndex < progressSteps.length) {
          setInitProgress(progressSteps[stepIndex]);
          stepIndex++;
        } else {
          clearInterval(progressInterval);
        }
      }, 800);

      // Actually initialize the AI
      await transformersAI.initialize();
      
      // Update model status
      const status = transformersAI.getLoadingStatus();
      setModelStatus(status.modelsLoaded);
      
      clearInterval(progressInterval);
      setInitProgress(100);
      
      setTimeout(() => {
        setIsInitializing(false);
        addSystemMessage("✨ Advanced Psychological AI Engine ready! I'm here to support you with professional-grade empathy, cognitive assessment, and crisis intervention capabilities. How are you feeling today?");
      }, 500);

    } catch (error) {
      console.error('Failed to initialize AI:', error);
      setIsInitializing(false);
      addSystemMessage("Local AI Engine initialized with basic functionality. I'm here to support you! 💙");
    }
  };

  const generateInitialGreeting = async () => {
    const greetings = {
      sad: "I notice you're feeling sad today. 💙 I'm here to listen and support you through this.",
      anxious: "I can sense some anxiety in your recent entries. 🫂 Let's work through this together, one breath at a time.",
      happy: "It's wonderful to see you're feeling happy! ✨ I'd love to hear what's bringing you joy today.",
      angry: "I can feel there's some anger or frustration. 💪 Those feelings are valid - let's talk about what's going on.",
      excited: "Your excitement is contagious! 🌟 I'm here to celebrate with you and hear all about it.",
      calm: "I sense a peaceful energy from you today. 🧘 How can we nurture this calm feeling?",
      neutral: "Thank you for joining me today. 🌸 I'm here to listen and support you however you need."
    };

    const greeting = greetings[currentMood as keyof typeof greetings] || greetings.neutral;
    addSystemMessage(greeting);
  };

  const addSystemMessage = (content: string) => {
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      isUser: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: userInput.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsProcessing(true);

    try {
      // Process with transformers AI
      const aiResponse = await transformersAI.processUserInput(userInput, messages);
      setCurrentAIResponse(aiResponse);

      // Handle emergency situations
      if (aiResponse.isEmergency) {
        setShowEmergencyAlert(true);
      }

      // Update mood if significantly different
      if (onMoodUpdate && aiResponse.sentiment.score > 0.7) {
        const detectedMood = aiResponse.sentiment.label === 'POSITIVE' ? 'happy' : 'sad';
        onMoodUpdate(detectedMood, aiResponse.sentiment.score);
      }

      // Create AI response message
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.response,
        isUser: false,
        timestamp: new Date(),
        sentiment: aiResponse.sentiment,
        emotions: aiResponse.emotions
      };

      // Add typing delay for more natural feel
      setTimeout(() => {
        setMessages(prev => [...prev, aiMessage]);
        setIsProcessing(false);
      }, 1000);

    } catch (error) {
      console.error('AI processing failed:', error);
      
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble processing that right now, but I'm still here for you. Can you tell me more about how you're feeling? 💙",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, fallbackMessage]);
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input simulation - in production would use Web Speech API
    if (!isListening) {
      setTimeout(() => {
        setUserInput("I'm feeling really anxious about my upcoming presentation");
        setIsListening(false);
      }, 2000);
    }
  };

  const handleQuickResponse = (response: string) => {
    setUserInput(response);
    setTimeout(() => handleSendMessage(), 100);
  };

  const quickResponses = [
    "I'm feeling anxious",
    "I'm having trouble sleeping",
    "I feel overwhelmed",
    "I'm feeling sad today",
    "I need some motivation",
    "I'm feeling lonely"
  ];

  if (isInitializing) {
    return (
      <Card className="glass border-0 shadow-lg">
        <CardContent className="py-12">
          <div className="text-center space-y-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-16 h-16 mx-auto text-purple-500" />
            </motion.div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Initializing Local AI Engine</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Starting advanced pattern recognition and mental health support systems...
              </p>
              
              <Progress value={initProgress} className="w-full max-w-md mx-auto" />
              
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-sm">
                <div className={`flex items-center gap-2 ${modelStatus.psychological_assessment ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {modelStatus.psychological_assessment ? <CheckCircle2 className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                  Psychological Assessment
                </div>
                <div className={`flex items-center gap-2 ${modelStatus.therapeutic_modalities ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {modelStatus.therapeutic_modalities ? <CheckCircle2 className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                  Therapeutic Modalities
                </div>
                <div className={`flex items-center gap-2 ${modelStatus.crisis_detection ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {modelStatus.crisis_detection ? <CheckCircle2 className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                  Crisis Detection
                </div>
                <div className={`flex items-center gap-2 ${modelStatus.sentiment_analysis ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {modelStatus.sentiment_analysis ? <CheckCircle2 className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                  Sentiment Analysis
                </div>
                <div className={`flex items-center gap-2 ${modelStatus.emotion_detection ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {modelStatus.emotion_detection ? <CheckCircle2 className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                  Emotion Detection
                </div>
                <div className={`flex items-center gap-2 ${modelStatus.intent_classification ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {modelStatus.intent_classification ? <CheckCircle2 className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                  Intent Classification
                </div>
                <div className={`flex items-center gap-2 ${modelStatus.contextual_understanding ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {modelStatus.contextual_understanding ? <CheckCircle2 className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                  Contextual Understanding
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Emergency Alert */}
      <AnimatePresence>
        {showEmergencyAlert && currentAIResponse?.isEmergency && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <Alert className="border-red-500 bg-red-50 dark:bg-red-950/20">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-300">
                <div className="space-y-3">
                  <p className="font-medium">I'm concerned about your wellbeing.</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-3 h-3" />
                      <span>Crisis Text Line: Text HOME to 741741</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-3 h-3" />
                      <span>National Suicide Prevention Lifeline: 988</span>
                    </div>
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

      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 glass border-0">
          <TabsTrigger value="chat" className="text-xs">
            <MessageSquare className="w-3 h-3 mr-1" />
            AI Chat
          </TabsTrigger>
          <TabsTrigger value="insights" className="text-xs">
            <Activity className="w-3 h-3 mr-1" />
            Live Analysis
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="text-xs">
            <Lightbulb className="w-3 h-3 mr-1" />
            Recommendations
          </TabsTrigger>
          <TabsTrigger value="therapeutic" className="text-xs">
            <Stethoscope className="w-3 h-3 mr-1" />
            Therapeutic
          </TabsTrigger>
        </TabsList>

        {/* Chat Interface */}
        <TabsContent value="chat" className="space-y-4">
          <Card className="glass border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Bot className="w-5 h-5 text-purple-500" />
                  </motion.div>
                  AI Wellness Companion
                </CardTitle>
                
                <div className="flex items-center gap-2">
                  <Badge className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
                    <Shield className="w-3 h-3 mr-1" />
                    Private • Local AI
                  </Badge>
                  <Badge variant="secondary">
                    <Zap className="w-3 h-3 mr-1" />
                    Advanced Local AI
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Chat Messages */}
              <div 
                ref={chatContainerRef}
                className="space-y-4 max-h-96 overflow-y-auto pr-2"
              >
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] rounded-2xl p-4 ${
                        message.isUser 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                          : 'glass border border-border/50'
                      }`}>
                        <div className="flex items-start gap-3">
                          {!message.isUser && (
                            <Bot className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                          )}
                          
                          <div className="flex-1 space-y-2">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {message.content}
                            </p>
                            
                            {/* Sentiment and emotion indicators */}
                            {message.sentiment && (
                              <div className="flex items-center gap-2 text-xs opacity-70">
                                <span className={`px-2 py-1 rounded-full ${
                                  message.sentiment.label === 'POSITIVE' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                }`}>
                                  {message.sentiment.label.toLowerCase()} ({Math.round(message.sentiment.score * 100)}%)
                                </span>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between text-xs opacity-60">
                              <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                          
                          {message.isUser && (
                            <User className="w-5 h-5 opacity-80 flex-shrink-0 mt-0.5" />
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
                      <div className="glass border border-border/50 rounded-2xl p-4">
                        <div className="flex items-center gap-3">
                          <Bot className="w-5 h-5 text-purple-500" />
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
                          <span className="text-xs text-muted-foreground">AI is analyzing...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Response Buttons */}
              {messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <p className="text-xs text-muted-foreground text-center">Quick responses:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {quickResponses.map((response) => (
                      <Button
                        key={response}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuickResponse(response)}
                        className="text-xs glass border-0 hover:scale-105 transition-transform"
                      >
                        {response}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Input Area */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Share how you're feeling or what's on your mind..."
                      className="resize-none glass border-0 pr-12"
                      rows={2}
                      disabled={isProcessing}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleVoiceInput}
                      className={`absolute bottom-2 right-2 ${isListening ? 'text-red-500' : 'text-muted-foreground'}`}
                      disabled={isProcessing}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                  </div>
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={!userInput.trim() || isProcessing}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {isListening && (
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="inline-flex items-center gap-2 text-red-500 text-sm"
                    >
                      <Mic className="w-4 h-4" />
                      Listening...
                    </motion.div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Live Analysis Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card className="glass border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-500" />
                Real-time AI Analysis
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {currentAIResponse ? (
                <div className="space-y-4">
                  {/* Sentiment Analysis */}
                  <div className="glass p-4 rounded-lg border border-border/50">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      Sentiment Analysis
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          {currentAIResponse.sentiment.label.toLowerCase()}
                        </span>
                        <Badge variant={currentAIResponse.sentiment.label === 'POSITIVE' ? 'default' : 'secondary'}>
                          {Math.round(currentAIResponse.sentiment.score * 100)}%
                        </Badge>
                      </div>
                      <Progress value={currentAIResponse.sentiment.score * 100} />
                    </div>
                  </div>

                  {/* Emotion Detection */}
                  <div className="glass p-4 rounded-lg border border-border/50">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      Detected Emotions
                    </h4>
                    <div className="space-y-2">
                      {currentAIResponse.emotions.slice(0, 3).map((emotion, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm capitalize">{emotion.label}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={emotion.score * 100} className="w-20" />
                            <span className="text-xs text-muted-foreground">
                              {Math.round(emotion.score * 100)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Intent and Urgency */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass p-4 rounded-lg border border-border/50">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-500" />
                        Intent
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {currentAIResponse.intent.replace(/_/g, ' ')}
                      </p>
                    </div>
                    
                    <div className="glass p-4 rounded-lg border border-border/50">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-500" />
                        Urgency Level
                      </h4>
                      <Badge variant={
                        currentAIResponse.urgency === 'crisis' ? 'destructive' :
                        currentAIResponse.urgency === 'high' ? 'destructive' :
                        currentAIResponse.urgency === 'medium' ? 'default' : 'secondary'
                      }>
                        {currentAIResponse.urgency}
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No Analysis Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Send a message to see real-time AI analysis
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card className="glass border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                AI-Generated Recommendations
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {currentAIResponse?.recommendations ? (
                <div className="space-y-3">
                  {currentAIResponse.recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      className="glass p-4 rounded-lg border border-border/50"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-medium ${
                          rec.category === 'crisis' ? 'bg-red-500' :
                          rec.category === 'professional_help' ? 'bg-orange-500' :
                          rec.category === 'coping' ? 'bg-blue-500' :
                          rec.category === 'self_care' ? 'bg-green-500' :
                          'bg-purple-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{rec.action}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline">
                              <Star className="w-3 h-3 mr-1" />
                              Priority: {rec.priority}/10
                            </Badge>
                            <Badge variant="secondary" className="capitalize">
                              {rec.timeframe.replace(/_/g, ' ')}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {rec.category.replace(/_/g, ' ')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Lightbulb className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No Recommendations Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Chat with the AI to receive personalized wellness recommendations
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Therapeutic Tab */}
        <TabsContent value="therapeutic" className="space-y-4">
          <Card className="glass border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-blue-500" />
                Therapeutic Support
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {currentAIResponse ? (
                <div className="space-y-4">
                  {/* Therapeutic Approach */}
                  <div className="glass p-4 rounded-lg border border-border/50">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-purple-500" />
                      Therapeutic Approach
                    </h4>
                    <div className="space-y-2">
                      <Badge variant="outline" className="capitalize">
                        {currentAIResponse.therapeuticApproach.replace(/_/g, ' ')}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Selected based on your current emotional state and communication patterns
                      </p>
                    </div>
                  </div>

                  {/* Psychological Insights */}
                  {currentAIResponse.psychologicalInsights.length > 0 && (
                    <div className="glass p-4 rounded-lg border border-border/50">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Eye className="w-4 h-4 text-green-500" />
                        Psychological Insights
                      </h4>
                      <div className="space-y-3">
                        {currentAIResponse.psychologicalInsights.map((insight, index) => (
                          <div key={index} className="border-l-2 border-blue-500 pl-3">
                            <h5 className="text-sm font-medium capitalize">{insight.pattern.replace(/_/g, ' ')}</h5>
                            <p className="text-xs text-muted-foreground mb-1">{insight.description}</p>
                            <p className="text-xs text-blue-600">{insight.supportiveAction}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow-up Questions */}
                  {currentAIResponse.followUpQuestions.length > 0 && (
                    <div className="glass p-4 rounded-lg border border-border/50">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <MessageCircleMore className="w-4 h-4 text-orange-500" />
                        Therapeutic Questions
                      </h4>
                      <div className="space-y-2">
                        {currentAIResponse.followUpQuestions.map((question, index) => (
                          <div key={index} className="text-sm text-muted-foreground italic border-l-2 border-orange-200 pl-3">
                            \"{question}\"
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contextual Factors */}
                  <div className="glass p-4 rounded-lg border border-border/50">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-indigo-500" />
                      Contextual Analysis
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Time Context:</span>
                        <p className="capitalize">{currentAIResponse.contextualFactors.timeOfDay}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Conversation Flow:</span>
                        <p className="capitalize">{currentAIResponse.contextualFactors.conversationFlow.replace(/_/g, ' ')}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Emotional Progression:</span>
                        <p className="capitalize">{currentAIResponse.contextualFactors.emotionalProgression.replace(/_/g, ' ')}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Protective Factors:</span>
                        <p>{currentAIResponse.contextualFactors.protectiveFactors.length} detected</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Stethoscope className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No Therapeutic Support Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Chat with the AI to receive therapeutic support
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}