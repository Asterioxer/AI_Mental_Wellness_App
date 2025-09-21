import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Send, Sparkles, PenTool } from 'lucide-react';

interface JournalEntry {
  id: string;
  content: string;
  mood: string;
  timestamp: Date;
  confidence?: number;
}

interface JournalEntryFormProps {
  onSubmit: (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => void;
}

const moodAnalysis = {
  'happy': { emoji: '😊', color: 'bg-yellow-100 text-yellow-800', label: 'Joy' },
  'sad': { emoji: '😢', color: 'bg-blue-100 text-blue-800', label: 'Sadness' },
  'angry': { emoji: '😠', color: 'bg-red-100 text-red-800', label: 'Anger' },
  'anxious': { emoji: '😰', color: 'bg-purple-100 text-purple-800', label: 'Anxiety' },
  'calm': { emoji: '😌', color: 'bg-green-100 text-green-800', label: 'Calm' },
  'excited': { emoji: '🤩', color: 'bg-orange-100 text-orange-800', label: 'Excitement' },
  'neutral': { emoji: '😐', color: 'bg-gray-100 text-gray-800', label: 'Neutral' }
};

// Simple mood detection based on keywords (in real app, this would call the AI API)
const detectMood = (text: string): { mood: string; confidence: number } => {
  const words = text.toLowerCase().split(' ');
  
  const moodKeywords = {
    happy: ['happy', 'joy', 'great', 'amazing', 'wonderful', 'excited', 'love', 'fantastic'],
    sad: ['sad', 'depressed', 'down', 'upset', 'cry', 'lonely', 'hurt', 'devastated'],
    angry: ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'rage', 'hate'],
    anxious: ['anxious', 'worried', 'nervous', 'scared', 'panic', 'stress', 'overwhelmed'],
    calm: ['calm', 'peaceful', 'relaxed', 'serene', 'content', 'tranquil'],
    excited: ['excited', 'thrilled', 'energized', 'pumped', 'enthusiastic'],
  };

  let bestMood = 'neutral';
  let maxScore = 0;

  Object.entries(moodKeywords).forEach(([mood, keywords]) => {
    const score = keywords.reduce((acc, keyword) => {
      return acc + words.filter(word => word.includes(keyword)).length;
    }, 0);
    
    if (score > maxScore) {
      maxScore = score;
      bestMood = mood;
    }
  });

  const confidence = Math.min(0.6 + (maxScore * 0.1), 0.95);
  return { mood: bestMood, confidence };
};

export function JournalEntryForm({ onSubmit }: JournalEntryFormProps) {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedMood, setDetectedMood] = useState<{ mood: string; confidence: number } | null>(null);

  const handleAnalyzeMood = () => {
    if (!content.trim()) return;
    
    setIsAnalyzing(true);
    // Simulate API call delay
    setTimeout(() => {
      const result = detectMood(content);
      setDetectedMood(result);
      setIsAnalyzing(false);
    }, 1000);
  };

  const handleSubmit = () => {
    if (!content.trim()) return;
    
    const mood = detectedMood?.mood || 'neutral';
    const confidence = detectedMood?.confidence || 0.5;
    
    onSubmit({
      content: content.trim(),
      mood,
      confidence
    });

    setContent('');
    setDetectedMood(null);
  };

  const moodData = detectedMood ? moodAnalysis[detectedMood.mood as keyof typeof moodAnalysis] : null;

  return (
    <Card className="w-full glass border-0 shadow-lg hover-lift">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 gradient-text">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <PenTool className="w-5 h-5" />
          </motion.div>
          Journal Entry
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <motion.label 
            htmlFor="journal-content" 
            className="block"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            How are you feeling today? Share your thoughts...
          </motion.label>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Textarea
              id="journal-content"
              placeholder="Today I felt... I'm thinking about... What's on my mind is..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-32 resize-none glass border-0 shadow-inner focus:shadow-lg transition-all duration-300"
            />
          </motion.div>
        </div>

        <AnimatePresence>
          {detectedMood && moodData && (
            <motion.div 
              className="flex items-center gap-2 p-4 glass rounded-xl border border-purple-200/20"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <motion.span 
                className="text-3xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                {moodData.emoji}
              </motion.span>
              <div className="flex items-center gap-2 text-[rgba(68,22,22,1)]">
                <Badge className={`${moodData.color} glass border-0 shadow-sm`}>
                  {moodData.label}
                </Badge>
                <motion.span 
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {Math.round(detectedMood.confidence * 100)}% confidence
                </motion.span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3">
          <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleAnalyzeMood}
              disabled={!content.trim() || isAnalyzing}
              variant="outline"
              className="w-full glass border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <motion.div
                animate={isAnalyzing ? { rotate: 360 } : {}}
                transition={{ duration: 1, repeat: isAnalyzing ? Infinity : 0, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
              </motion.div>
              {isAnalyzing ? 'Analyzing...' : 'Analyze Mood'}
            </Button>
          </motion.div>
          
          <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleSubmit}
              disabled={!content.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Send className="w-4 h-4 mr-2" />
              Save Entry
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}