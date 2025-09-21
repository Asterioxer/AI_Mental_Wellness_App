import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Flame, Trophy, Target } from 'lucide-react';

interface MoodStreakTrackerProps {
  entries: Array<{
    id: string;
    date: string;
    mood: string;
    content: string;
  }>;
}

export function MoodStreakTracker({ entries }: MoodStreakTrackerProps) {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  useEffect(() => {
    calculateStreaks();
  }, [entries]);

  const calculateStreaks = () => {
    if (entries.length === 0) {
      setCurrentStreak(0);
      setLongestStreak(0);
      return;
    }

    // Sort entries by date (newest first)
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Calculate current streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date);
      entryDate.setHours(0, 0, 0, 0);
      
      const diffTime = today.getTime() - entryDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === streak) {
        streak++;
      } else if (diffDays === streak + 1 && streak === 0) {
        // Allow for yesterday if no entry today
        streak++;
      } else {
        break;
      }
    }

    setCurrentStreak(streak);

    // Calculate longest streak
    let maxStreak = 0;
    let tempStreak = 1;
    
    for (let i = 1; i < sortedEntries.length; i++) {
      const currentDate = new Date(sortedEntries[i].date);
      const previousDate = new Date(sortedEntries[i - 1].date);
      
      currentDate.setHours(0, 0, 0, 0);
      previousDate.setHours(0, 0, 0, 0);
      
      const diffTime = previousDate.getTime() - currentDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else {
        maxStreak = Math.max(maxStreak, tempStreak);
        tempStreak = 1;
      }
    }
    
    maxStreak = Math.max(maxStreak, tempStreak);
    setLongestStreak(Math.max(maxStreak, currentStreak));
  };

  const getStreakMessage = () => {
    if (currentStreak === 0) return "Start your journey today!";
    if (currentStreak === 1) return "Great start! Keep going!";
    if (currentStreak < 7) return "Building momentum!";
    if (currentStreak < 30) return "Amazing consistency!";
    return "You're on fire! 🔥";
  };

  const getStreakColor = () => {
    if (currentStreak === 0) return "text-muted-foreground";
    if (currentStreak < 3) return "text-blue-500";
    if (currentStreak < 7) return "text-green-500";
    if (currentStreak < 30) return "text-orange-500";
    return "text-red-500";
  };

  const getRecentDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const hasEntry = entries.some(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === date.getTime();
      });
      
      days.push({
        date: date.getDate(),
        hasEntry,
        isToday: i === 0
      });
    }
    
    return days;
  };

  return (
    <Card className="glass border-0 shadow-lg hover-lift h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <motion.div
            animate={{ 
              scale: currentStreak > 0 ? [1, 1.2, 1] : 1,
              rotate: currentStreak > 0 ? [0, 10, -10, 0] : 0
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Flame className={`w-4 h-4 ${getStreakColor()}`} />
          </motion.div>
          Mood Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
        {/* Current Streak */}
        <div className="text-center space-y-2">
          <motion.div
            className="text-3xl font-bold"
            animate={{ scale: currentStreak > 0 ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className={getStreakColor()}>{currentStreak}</span>
          </motion.div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              {currentStreak === 1 ? "day" : "days"} in a row
            </p>
            <p className="text-xs font-medium text-blue-500">
              {getStreakMessage()}
            </p>
          </div>
        </div>

        {/* Recent 7 Days Visual */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Last 7 days</p>
          <div className="flex gap-1 justify-center">
            {getRecentDays().map((day, index) => (
              <motion.div
                key={index}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium border transition-all duration-300 ${
                  day.hasEntry
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white border-transparent shadow-sm'
                    : day.isToday
                    ? 'border-blue-500 text-blue-500 border-2'
                    : 'border-border text-muted-foreground'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
              >
                {day.date}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
          <motion.div 
            className="text-center space-y-1"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3 text-yellow-500" />
              <span className="text-xs font-medium">{longestStreak}</span>
            </div>
            <p className="text-xs text-muted-foreground">Best</p>
          </motion.div>
          
          <motion.div 
            className="text-center space-y-1"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-center gap-1">
              <Target className="w-3 h-3 text-green-500" />
              <span className="text-xs font-medium">{entries.length}</span>
            </div>
            <p className="text-xs text-muted-foreground">Total</p>
          </motion.div>
        </div>

        {/* Next Goal */}
        {currentStreak > 0 && (
          <motion.div
            className="text-center p-2 glass rounded-lg border border-blue-500/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-xs text-blue-500 font-medium">
              {currentStreak < 7 ? `${7 - currentStreak} more for 1 week!` :
               currentStreak < 30 ? `${30 - currentStreak} more for 1 month!` :
               "Keep the momentum going! 🚀"}
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}