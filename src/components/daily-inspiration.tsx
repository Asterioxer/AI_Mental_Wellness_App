import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Quote, Sparkles, RefreshCw, Heart, Star, Sun } from 'lucide-react';

interface Inspiration {
  quote: string;
  author: string;
  category: 'motivation' | 'mindfulness' | 'gratitude' | 'courage' | 'self-love';
  color: string;
}

const inspirations: Inspiration[] = [
  {
    quote: "You are braver than you believe, stronger than you seem, and smarter than you think.",
    author: "A.A. Milne",
    category: "courage",
    color: "from-orange-500 to-red-500"
  },
  {
    quote: "The present moment is the only time over which we have dominion.",
    author: "Thich Nhat Hanh",
    category: "mindfulness",
    color: "from-green-500 to-teal-500"
  },
  {
    quote: "Gratitude makes sense of our past, brings peace for today, and creates a vision for tomorrow.",
    author: "Melody Beattie",
    category: "gratitude",
    color: "from-purple-500 to-pink-500"
  },
  {
    quote: "You yourself, as much as anybody in the entire universe, deserve your love and affection.",
    author: "Buddha",
    category: "self-love",
    color: "from-rose-500 to-pink-500"
  },
  {
    quote: "The only way out is through.",
    author: "Robert Frost",
    category: "courage",
    color: "from-blue-500 to-indigo-500"
  },
  {
    quote: "Peace comes from within. Do not seek it without.",
    author: "Buddha",
    category: "mindfulness",
    color: "from-cyan-500 to-blue-500"
  },
  {
    quote: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    author: "Ralph Waldo Emerson",
    category: "motivation",
    color: "from-amber-500 to-orange-500"
  },
  {
    quote: "Be yourself; everyone else is already taken.",
    author: "Oscar Wilde",
    category: "self-love",
    color: "from-violet-500 to-purple-500"
  },
  {
    quote: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "motivation",
    color: "from-emerald-500 to-green-500"
  },
  {
    quote: "The greatest thing in the world is to know how to belong to oneself.",
    author: "Michel de Montaigne",
    category: "self-love",
    color: "from-pink-500 to-rose-500"
  },
  {
    quote: "Mindfulness is about being fully awake in our lives.",
    author: "Jon Kabat-Zinn",
    category: "mindfulness",
    color: "from-teal-500 to-cyan-500"
  },
  {
    quote: "Gratitude is not only the greatest of virtues but the parent of all others.",
    author: "Cicero",
    category: "gratitude",
    color: "from-indigo-500 to-purple-500"
  }
];

const categoryIcons = {
  motivation: <Star className="w-3 h-3" />,
  mindfulness: <Sun className="w-3 h-3" />,
  gratitude: <Heart className="w-3 h-3" />,
  courage: <Sparkles className="w-3 h-3" />,
  'self-love': <Heart className="w-3 h-3" />
};

const categoryLabels = {
  motivation: 'Motivation',
  mindfulness: 'Mindfulness',
  gratitude: 'Gratitude',
  courage: 'Courage',
  'self-love': 'Self-Love'
};

export function DailyInspiration() {
  const [currentInspiration, setCurrentInspiration] = useState<Inspiration>(inspirations[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Get daily inspiration based on date to ensure same quote for the day
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('serenique_inspiration_date');
    const storedIndex = localStorage.getItem('serenique_inspiration_index');
    
    if (storedDate === today && storedIndex) {
      const index = parseInt(storedIndex);
      if (index >= 0 && index < inspirations.length) {
        setCurrentInspiration(inspirations[index]);
        return;
      }
    }
    
    // Generate new daily inspiration
    const dateHash = today.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const dailyIndex = Math.abs(dateHash) % inspirations.length;
    setCurrentInspiration(inspirations[dailyIndex]);
    
    localStorage.setItem('serenique_inspiration_date', today);
    localStorage.setItem('serenique_inspiration_index', dailyIndex.toString());
  }, []);

  const refreshInspiration = () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    
    // Get a random inspiration different from current
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * inspirations.length);
    } while (newIndex === inspirations.indexOf(currentInspiration) && inspirations.length > 1);
    
    setTimeout(() => {
      setCurrentInspiration(inspirations[newIndex]);
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <Card className="glass border-0 shadow-lg hover-lift">
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Quote className="w-4 h-4 text-purple-500" />
            </motion.div>
            Daily Inspiration
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-purple-500/10"
            onClick={refreshInspiration}
            disabled={isRefreshing}
          >
            <motion.div
              animate={{ rotate: isRefreshing ? 360 : 0 }}
              transition={{ 
                duration: 0.6,
                ease: "easeInOut"
              }}
            >
              <RefreshCw className="w-3 h-3 text-purple-500" />
            </motion.div>
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentInspiration.quote}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-3"
          >
            {/* Category Badge */}
            <div className="flex justify-center">
              <Badge 
                className={`glass border-0 text-white bg-gradient-to-r ${currentInspiration.color} shadow-lg`}
                variant="outline"
              >
                <span className="flex items-center gap-1">
                  {categoryIcons[currentInspiration.category]}
                  {categoryLabels[currentInspiration.category]}
                </span>
              </Badge>
            </div>

            {/* Quote */}
            <div className="relative">
              <motion.div
                className="absolute -top-2 -left-2"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Quote className="w-6 h-6 text-purple-300/40" />
              </motion.div>
              
              <blockquote className="text-sm leading-relaxed text-center italic px-4 py-2 relative">
                <span className="relative z-10">{currentInspiration.quote}</span>
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${currentInspiration.color} opacity-5 rounded-lg`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.05 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </blockquote>
              
              <motion.div
                className="absolute -bottom-1 -right-2"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Quote className="w-6 h-6 text-purple-300/40 rotate-180" />
              </motion.div>
            </div>

            {/* Author */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <p className="text-xs text-muted-foreground">
                — {currentInspiration.author}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Decorative Elements */}
        <motion.div
          className="flex justify-center items-center gap-2 mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${currentInspiration.color}`}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3
              }}
            />
          ))}
        </motion.div>

        {/* Reflection Prompt */}
        <motion.div
          className="text-center p-3 glass rounded-lg border border-purple-500/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <motion.p 
            className="text-xs text-purple-500"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            💭 How does this resonate with your journey today?
          </motion.p>
        </motion.div>

        {/* Progress Indicator */}
        <div className="flex justify-center items-center gap-1 pt-2">
          {inspirations.map((_, index) => (
            <motion.div
              key={index}
              className={`w-1 h-1 rounded-full transition-all duration-300 ${
                index === inspirations.indexOf(currentInspiration)
                  ? `bg-gradient-to-r ${currentInspiration.color}`
                  : 'bg-muted-foreground/30'
              }`}
              animate={{ 
                scale: index === inspirations.indexOf(currentInspiration) ? 1.5 : 1
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}