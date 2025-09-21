import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, Calendar, TrendingUp, Lightbulb, Target } from 'lucide-react';

interface MoodEntry {
  id: string;
  content: string;
  mood: string;
  timestamp: Date;
  confidence?: number;
}

interface MoodPatternsProps {
  entries: MoodEntry[];
}

export function MoodPatterns({ entries }: MoodPatternsProps) {
  // Analyze time patterns
  const hourlyMoods = entries.reduce((acc, entry) => {
    const hour = entry.timestamp.getHours();
    if (!acc[hour]) acc[hour] = [];
    acc[hour].push(entry.mood);
    return acc;
  }, {} as Record<number, string[]>);

  // Find best time of day
  const bestHour = Object.entries(hourlyMoods)
    .map(([hour, moods]) => ({
      hour: parseInt(hour),
      avgMood: moods.reduce((sum, mood) => {
        const values = { sad: 1, angry: 2, anxious: 3, neutral: 4, calm: 5, happy: 6, excited: 7 };
        return sum + (values[mood as keyof typeof values] || 4);
      }, 0) / moods.length
    }))
    .sort((a, b) => b.avgMood - a.avgMood)[0];

  // Analyze weekly patterns
  const weeklyMoods = entries.reduce((acc, entry) => {
    const day = entry.timestamp.getDay(); // 0 = Sunday, 1 = Monday, etc.
    if (!acc[day]) acc[day] = [];
    acc[day].push(entry.mood);
    return acc;
  }, {} as Record<number, string[]>);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const bestDay = Object.entries(weeklyMoods)
    .map(([day, moods]) => ({
      day: parseInt(day),
      dayName: dayNames[parseInt(day)],
      avgMood: moods.reduce((sum, mood) => {
        const values = { sad: 1, angry: 2, anxious: 3, neutral: 4, calm: 5, happy: 6, excited: 7 };
        return sum + (values[mood as keyof typeof values] || 4);
      }, 0) / moods.length
    }))
    .sort((a, b) => b.avgMood - a.avgMood)[0];

  // Generate insights
  const insights = [
    {
      icon: Clock,
      title: "Peak Mood Time",
      description: bestHour ? `You tend to feel best around ${bestHour.hour}:00` : "Not enough data yet",
      color: "text-blue-500"
    },
    {
      icon: Calendar,
      title: "Best Day",
      description: bestDay ? `${bestDay.dayName}s are typically your brightest days` : "Track more to see patterns",
      color: "text-green-500"
    },
    {
      icon: TrendingUp,
      title: "Consistency",
      description: entries.length >= 7 ? "You're building great tracking habits!" : "Keep logging to see patterns",
      color: "text-purple-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Mood Insights */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass border-0 shadow-lg hover-lift h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Mood Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-3 p-3 glass rounded-lg border-0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className={`mt-0.5 ${insight.color}`}>
                  <insight.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">{insight.title}</p>
                  <p className="text-xs text-muted-foreground">{insight.description}</p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="glass border-0 shadow-lg hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="p-3 glass rounded-lg border-0">
                <Badge variant="secondary" className="mb-2 bg-blue-500/10 text-blue-600 border-0">
                  Daily Practice
                </Badge>
                <p className="text-sm">
                  Try journaling consistently at your peak mood time for better insights.
                </p>
              </div>
              
              <div className="p-3 glass rounded-lg border-0">
                <Badge variant="secondary" className="mb-2 bg-green-500/10 text-green-600 border-0">
                  Mindfulness
                </Badge>
                <p className="text-sm">
                  Consider a 5-minute breathing exercise when you notice mood dips.
                </p>
              </div>
              
              <div className="p-3 glass rounded-lg border-0">
                <Badge variant="secondary" className="mb-2 bg-purple-500/10 text-purple-600 border-0">
                  Reflection
                </Badge>
                <p className="text-sm">
                  Review your entries weekly to identify what brings you joy.
                </p>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}