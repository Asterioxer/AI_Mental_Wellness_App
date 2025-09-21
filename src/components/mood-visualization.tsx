import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { format, subDays } from 'date-fns';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';

interface MoodEntry {
  id: string;
  content: string;
  mood: string;
  timestamp: Date;
  confidence?: number;
}

interface MoodVisualizationProps {
  entries: MoodEntry[];
}

const moodColors = {
  happy: '#FEF3C7',
  sad: '#DBEAFE', 
  angry: '#FEE2E2',
  anxious: '#F3E8FF',
  calm: '#D1FAE5',
  excited: '#FED7AA',
  neutral: '#F3F4F6'
};

const moodEmojis = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  anxious: '😰',
  calm: '😌',
  excited: '🤩',
  neutral: '😐'
};

const moodValues = {
  sad: 1,
  angry: 2,
  anxious: 3,
  neutral: 4,
  calm: 5,
  happy: 6,
  excited: 7
};

export function MoodVisualization({ entries }: MoodVisualizationProps) {
  // Prepare mood trend data for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    const dayEntries = entries.filter(entry => 
      format(entry.timestamp, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    
    const averageMood = dayEntries.length > 0 
      ? dayEntries.reduce((acc, entry) => acc + moodValues[entry.mood as keyof typeof moodValues], 0) / dayEntries.length
      : 4; // neutral

    return {
      date: format(date, 'MMM dd'),
      mood: Math.round(averageMood * 10) / 10,
      entries: dayEntries.length
    };
  }).reverse();

  // Mood distribution data
  const moodCounts = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const moodDistribution = Object.entries(moodCounts).map(([mood, count]) => ({
    mood,
    count,
    percentage: Math.round((count / entries.length) * 100),
    color: moodColors[mood as keyof typeof moodColors]
  }));

  // Recent mood (today's entries)
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayEntries = entries.filter(entry => 
    format(entry.timestamp, 'yyyy-MM-dd') === today
  );

  const currentMood = todayEntries.length > 0 
    ? todayEntries[todayEntries.length - 1].mood 
    : 'neutral';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const moodScore = payload[0].value;
      let moodLabel = 'Neutral';
      if (moodScore >= 6) moodLabel = 'Very Positive';
      else if (moodScore >= 5) moodLabel = 'Positive';
      else if (moodScore >= 4) moodLabel = 'Neutral';
      else if (moodScore >= 3) moodLabel = 'Slightly Low';
      else if (moodScore >= 2) moodLabel = 'Low';
      else moodLabel = 'Very Low';

      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-medium">{label}</p>
          <p className="text-sm">Mood: {moodLabel}</p>
          <p className="text-sm">Entries: {payload[0].payload.entries}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Current Mood */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass border-0 shadow-lg hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Activity className="w-5 h-5 text-purple-500" />
              </motion.div>
              Today's Mood
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <motion.div 
              className="text-7xl mb-6"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {moodEmojis[currentMood as keyof typeof moodEmojis]}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="text-lg px-6 py-3 glass border-0 shadow-lg bg-white/50 dark:bg-transparent text-slate-800 dark:text-white">
                {currentMood.charAt(0).toUpperCase() + currentMood.slice(1)}
              </Badge>
            </motion.div>
            <motion.p 
              className="text-sm text-muted-foreground mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Based on {todayEntries.length} {todayEntries.length === 1 ? 'entry' : 'entries'} today
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Mood Trend Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="glass border-0 shadow-lg hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              7-Day Mood Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-[1px] pr-[12px] pb-[24px] pl-[12px]">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" />
                <YAxis domain={[1, 7]} tickFormatter={(value) => {
                  const labels = ['', 'Very Low', 'Low', 'Slightly Low', 'Neutral', 'Positive', 'Very Positive', 'Excited'];
                  return labels[value] || '';
                }} stroke="rgba(255,255,255,0.7)" />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="url(#colorGradient)" 
                  strokeWidth={4}
                  dot={{ fill: '#667eea', strokeWidth: 3, r: 8 }}
                  activeDot={{ r: 10, fill: '#764ba2' }}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Mood Distribution */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="glass border-0 shadow-lg hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-green-500" />
              Mood Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={moodDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  dataKey="count"
                  label={({ mood, percentage }) => `${mood} ${percentage}%`}
                >
                  {moodDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Activity */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="glass border-0 shadow-lg hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-500" />
              Journal Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip />
                <Bar 
                  dataKey="entries" 
                  fill="url(#barGradient)" 
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#43e97b" />
                    <stop offset="100%" stopColor="#38f9d7" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}