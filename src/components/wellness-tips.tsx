import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Lightbulb, Heart, Brain, Smile, RefreshCw, Zap } from 'lucide-react';
import { useState } from 'react';

interface WellnessTipsProps {
  currentMood?: string;
}

const wellnessTips = {
  sad: {
    icon: '💙',
    color: 'bg-blue-50 border-blue-200',
    tips: [
      {
        title: "Practice Self-Compassion",
        description: "Treat yourself with the same kindness you'd show a good friend. It's okay to feel sad.",
        action: "Write yourself a kind note"
      },
      {
        title: "Connect with Nature",
        description: "Spend 10-15 minutes outside. Fresh air and sunlight can naturally boost your mood.",
        action: "Take a short walk outside"
      },
      {
        title: "Gentle Movement",
        description: "Light exercise like stretching or yoga can help release endorphins and improve your mood.",
        action: "Try 5 minutes of stretching"
      },
      {
        title: "Reach Out",
        description: "Consider calling a friend, family member, or counselor. Connection can be healing.",
        action: "Text someone you care about"
      }
    ]
  },
  anxious: {
    icon: '🫂',
    color: 'bg-purple-50 border-purple-200',
    tips: [
      {
        title: "Box Breathing",
        description: "Breathe in for 4 counts, hold for 4, breathe out for 4, hold for 4. Repeat 4 times.",
        action: "Try it now for 2 minutes"
      },
      {
        title: "5-4-3-2-1 Grounding",
        description: "Notice 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.",
        action: "Practice grounding technique"
      },
      {
        title: "Progressive Muscle Relaxation",
        description: "Tense and then relax each muscle group, starting from your toes up to your head.",
        action: "Spend 10 minutes relaxing"
      },
      {
        title: "Limit Caffeine",
        description: "Caffeine can increase anxiety. Try herbal tea or water instead.",
        action: "Switch to herbal tea"
      }
    ]
  },
  angry: {
    icon: '💪',
    color: 'bg-red-50 border-red-200',
    tips: [
      {
        title: "Physical Release",
        description: "Go for a brisk walk, do jumping jacks, or punch a pillow to release physical tension.",
        action: "Do 2 minutes of exercise"
      },
      {
        title: "Count to 10",
        description: "Before reacting, take deep breaths and count slowly to 10. This gives you time to respond thoughtfully.",
        action: "Practice the 10-count technique"
      },
      {
        title: "Write It Out",
        description: "Write down what made you angry without censoring. This can help you process the emotion.",
        action: "Journal about your feelings"
      },
      {
        title: "Cool Down Time",
        description: "Give yourself space to cool down before addressing the situation that made you angry.",
        action: "Take a 15-minute break"
      }
    ]
  },
  happy: {
    icon: '✨',
    color: 'bg-yellow-50 border-yellow-200',
    tips: [
      {
        title: "Savor the Moment",
        description: "Take time to fully experience and appreciate this positive feeling.",
        action: "Write down what makes you happy"
      },
      {
        title: "Share Your Joy",
        description: "Tell someone about your good day or positive experience. Sharing joy multiplies it.",
        action: "Call someone to share good news"
      },
      {
        title: "Gratitude Practice",
        description: "Write down 3 things you're grateful for today while you're feeling positive.",
        action: "List 3 gratitudes"
      },
      {
        title: "Capture the Memory",
        description: "Take a photo, write in a journal, or create something to remember this happy moment.",
        action: "Document this positive moment"
      }
    ]
  },
  calm: {
    icon: '🧘',
    color: 'bg-green-50 border-green-200',
    tips: [
      {
        title: "Mindful Meditation",
        description: "Use this calm state to practice mindfulness meditation for 5-10 minutes.",
        action: "Meditate for 5 minutes"
      },
      {
        title: "Creative Expression",
        description: "Channel your peaceful energy into creative activities like drawing, writing, or music.",
        action: "Try a creative activity"
      },
      {
        title: "Deep Reflection",
        description: "Use this time for thoughtful reflection about your goals, values, or recent experiences.",
        action: "Reflect on your goals"
      },
      {
        title: "Gentle Planning",
        description: "Plan something positive for your near future while you're in this peaceful mindset.",
        action: "Plan something enjoyable"
      }
    ]
  },
  excited: {
    icon: '🌟',
    color: 'bg-orange-50 border-orange-200',
    tips: [
      {
        title: "Channel Your Energy",
        description: "Direct your excitement toward productive activities or goals you care about.",
        action: "Work on a meaningful project"
      },
      {
        title: "Share Your Enthusiasm",
        description: "Your positive energy can inspire others. Share what's exciting you with friends or family.",
        action: "Share your excitement with others"
      },
      {
        title: "Plan and Organize",
        description: "Use this high-energy state to tackle tasks or organize something you've been putting off.",
        action: "Organize your space"
      },
      {
        title: "Stay Grounded",
        description: "While excitement is wonderful, remember to stay present and make thoughtful decisions.",
        action: "Take 3 deep breaths"
      }
    ]
  },
  neutral: {
    icon: '⚖️',
    color: 'bg-gray-50 border-gray-200',
    tips: [
      {
        title: "Check In With Yourself",
        description: "Use this neutral state to honestly assess how you're doing physically, mentally, and emotionally.",
        action: "Do a full self-check-in"
      },
      {
        title: "Establish Routines",
        description: "Neutral times are perfect for building healthy habits and routines that support your wellbeing.",
        action: "Plan a healthy routine"
      },
      {
        title: "Practice Gratitude",
        description: "Even in neutral moments, there are things to appreciate. Look for small positives around you.",
        action: "Find 3 things to appreciate"
      },
      {
        title: "Gentle Self-Care",
        description: "Engage in basic self-care activities like staying hydrated, eating well, or getting enough sleep.",
        action: "Do one self-care activity"
      }
    ]
  }
};

const generalTips = [
  {
    title: "Stay Hydrated",
    description: "Drink plenty of water throughout the day to support your physical and mental wellbeing.",
    action: "Drink a glass of water now"
  },
  {
    title: "Practice Deep Breathing",
    description: "Take 5 deep breaths whenever you need to center yourself.",
    action: "Try it right now"
  },
  {
    title: "Get Quality Sleep",
    description: "Aim for 7-9 hours of sleep each night for better mood regulation.",
    action: "Set a bedtime reminder"
  },
  {
    title: "Move Your Body",
    description: "Even light exercise like a 5-minute walk can boost your mood and energy.",
    action: "Take a quick movement break"
  }
];

export function WellnessTips({ currentMood }: WellnessTipsProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  
  const moodTips = currentMood && wellnessTips[currentMood as keyof typeof wellnessTips] 
    ? wellnessTips[currentMood as keyof typeof wellnessTips] 
    : null;

  const displayTips = moodTips ? moodTips.tips : generalTips;
  const currentTip = displayTips[currentTipIndex];

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % displayTips.length);
  };

  return (
    <Card className="glass border-0 shadow-lg hover-lift">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Lightbulb className="w-5 h-5 text-yellow-500" />
            </motion.div>
            Wellness Tips
          </CardTitle>
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {moodTips && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Badge variant="secondary" className="flex items-center gap-1 glass border-0">
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {moodTips.icon}
                    </motion.span>
                    {currentMood}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="sm" onClick={nextTip} className="glass border-0">
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentTipIndex}
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-medium flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Brain className="w-4 h-4 text-purple-500" />
              </motion.div>
              {currentTip.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {currentTip.description}
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" size="sm" className="w-full glass border-0 shadow-md hover:shadow-lg transition-all duration-300">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heart className="w-3 h-3 mr-2 text-red-500" />
                </motion.div>
                {currentTip.action}
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <motion.div 
          className="pt-4 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <motion.span
              key={currentTipIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Tip {currentTipIndex + 1} of {displayTips.length}
            </motion.span>
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {moodTips ? `For ${currentMood} mood` : 'General wellness'}
            </span>
          </div>
        </motion.div>

        <AnimatePresence>
          {!moodTips && (
            <motion.div 
              className="text-xs text-muted-foreground glass p-4 rounded-lg border border-blue-200/20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💡
              </motion.span>
              {' '}
              <strong>Tip:</strong> Complete a journal entry to get personalized wellness tips based on your current mood!
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}