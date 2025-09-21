import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format, subDays } from 'date-fns';

interface MoodEntry {
  id: string;
  content: string;
  mood: string;
  timestamp: Date;
  confidence?: number;
}

interface MoodTrendGraphProps {
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

export function MoodTrendGraph({ entries }: MoodTrendGraphProps) {
  // Prepare mood trend data for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i); // Start from 6 days ago to today
    const dayEntries = entries.filter(entry => 
      format(entry.timestamp, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    
    const averageMood = dayEntries.length > 0 
      ? dayEntries.reduce((acc, entry) => acc + (moodValues[entry.mood as keyof typeof moodValues] || 4), 0) / dayEntries.length
      : 3 + Math.random() * 2; // Random values between 3-5 for demo

    return {
      day: format(date, 'EEE').toUpperCase(),
      mood: Math.round(averageMood * 10) / 10,
      entries: dayEntries.length
    };
  });

  // Calculate average mood for the last 7 days
  const averageMood = last7Days.reduce((sum, day) => sum + day.mood, 0) / last7Days.length;
  const moodScore = (averageMood * 10 / 7).toFixed(1); // Convert to 0-10 scale

  // Calculate percentage change (mock calculation for demo)
  const percentageChange = "+3%";

  return (
    <Card className="glass border-0 shadow-lg bg-gradient-to-br from-slate-800/90 to-slate-900/90 text-white">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-white text-lg font-medium mb-1">
              Mood Visualization
            </CardTitle>
            <p className="text-slate-300 text-sm">
              Your mood fluctuations over the last 7 days.
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-light text-white mb-1">
              {moodScore}
            </div>
            <div className="text-green-400 text-sm font-medium">
              {percentageChange}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 pb-6">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={last7Days} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              className="text-slate-400"
              interval={0}
            />
            <YAxis hide />
            <Area
              type="monotone"
              dataKey="mood"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#moodGradient)"
              dot={false}
              activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#1e293b' }}
            />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#1e293b' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}