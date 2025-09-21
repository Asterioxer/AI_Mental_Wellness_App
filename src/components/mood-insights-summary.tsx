import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Minus, Activity, Brain, Heart, Calendar } from 'lucide-react';

interface MoodEntry {
  id: string;
  content: string;
  mood: string;
  timestamp: Date;
  confidence?: number;
}

interface MoodInsightsSummaryProps {
  entries: MoodEntry[];
}

const moodValues = {
  sad: 1,
  angry: 2,
  anxious: 3,
  neutral: 4,
  calm: 5,
  happy: 6,
  excited: 7
};

export function MoodInsightsSummary({ entries }: MoodInsightsSummaryProps) {
  // Calculate insights
  const totalEntries = entries.length;
  const recentEntries = entries.slice(0, Math.ceil(entries.length / 2));
  const olderEntries = entries.slice(Math.ceil(entries.length / 2));
  
  const recentAvg = recentEntries.length > 0 
    ? recentEntries.reduce((sum, entry) => sum + (moodValues[entry.mood as keyof typeof moodValues] || 4), 0) / recentEntries.length
    : 4;
  
  const olderAvg = olderEntries.length > 0
    ? olderEntries.reduce((sum, entry) => sum + (moodValues[entry.mood as keyof typeof moodValues] || 4), 0) / olderEntries.length
    : 4;

  const trend = recentAvg > olderAvg ? 'improving' : recentAvg < olderAvg ? 'declining' : 'stable';
  const trendPercentage = olderAvg > 0 ? Math.abs(((recentAvg - olderAvg) / olderAvg) * 100) : 0;

  // Most common mood
  const moodCounts = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCommonMood = Object.entries(moodCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';
  
  // Weekly activity
  const thisWeekEntries = entries.filter(entry => {
    const daysDiff = Math.floor((new Date().getTime() - entry.timestamp.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 7;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Mood Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass border-0 shadow-lg hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Mood Trend</p>
                <p className="text-xl font-medium capitalize">{trend}</p>
              </div>
              <div className={`flex items-center gap-1 ${
                trend === 'improving' ? 'text-green-500' : 
                trend === 'declining' ? 'text-red-500' : 'text-blue-500'
              }`}>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {trend === 'improving' ? <TrendingUp className="w-4 h-4" /> :
                   trend === 'declining' ? <TrendingDown className="w-4 h-4" /> :
                   <Minus className="w-4 h-4" />}
                </motion.div>
                <span className="text-sm">
                  {trend === 'stable' ? '0%' : `${trendPercentage.toFixed(1)}%`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Most Common Mood */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="glass border-0 shadow-lg hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Dominant Mood</p>
                <p className="text-xl font-medium capitalize">{mostCommonMood}</p>
              </div>
              <div className="flex items-center gap-1 text-purple-500">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Brain className="w-4 h-4" />
                </motion.div>
                <span className="text-sm">
                  {Math.round((moodCounts[mostCommonMood] || 0) / totalEntries * 100)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="glass border-0 shadow-lg hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">This Week</p>
                <p className="text-xl font-medium">{thisWeekEntries} Entries</p>
              </div>
              <div className="flex items-center gap-1 text-blue-500">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Activity className="w-4 h-4" />
                </motion.div>
                <span className="text-sm">
                  {thisWeekEntries >= 5 ? 'Great!' : thisWeekEntries >= 3 ? 'Good' : 'Keep going'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Average Wellbeing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="glass border-0 shadow-lg hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Wellbeing Score</p>
                <p className="text-xl font-medium">
                  {entries.length > 0 ? (recentAvg * (10/7)).toFixed(1) : '0.0'}/10
                </p>
              </div>
              <div className={`flex items-center gap-1 ${
                recentAvg >= 5 ? 'text-green-500' : 
                recentAvg >= 4 ? 'text-yellow-500' : 'text-orange-500'
              }`}>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heart className="w-4 h-4" />
                </motion.div>
                <span className="text-sm">
                  {recentAvg >= 6 ? 'Excellent' : 
                   recentAvg >= 5 ? 'Good' : 
                   recentAvg >= 4 ? 'Fair' : 'Needs attention'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}