import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { format, isToday, isYesterday, startOfWeek, startOfMonth } from 'date-fns';
import { Calendar, Clock, Filter, TrendingUp } from 'lucide-react';

interface MoodEntry {
  id: string;
  content: string;
  mood: string;
  timestamp: Date;
  confidence?: number;
}

interface MoodHistoryProps {
  entries: MoodEntry[];
  onDeleteEntry?: (id: string) => void;
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

export function MoodHistory({ entries, onDeleteEntry }: MoodHistoryProps) {
  const [filterPeriod, setFilterPeriod] = useState<string>('all');
  const [filterMood, setFilterMood] = useState<string>('all');
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const formatDate = (date: Date): string => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM dd, yyyy');
  };

  const formatTime = (date: Date): string => {
    return format(date, 'h:mm a');
  };

  // Filter entries based on selected filters
  const filteredEntries = entries.filter(entry => {
    const now = new Date();
    let passesTimeFilter = true;
    let passesMoodFilter = true;

    // Time filter
    if (filterPeriod === 'today') {
      passesTimeFilter = isToday(entry.timestamp);
    } else if (filterPeriod === 'week') {
      passesTimeFilter = entry.timestamp >= startOfWeek(now);
    } else if (filterPeriod === 'month') {
      passesTimeFilter = entry.timestamp >= startOfMonth(now);
    }

    // Mood filter
    if (filterMood !== 'all') {
      passesMoodFilter = entry.mood === filterMood;
    }

    return passesTimeFilter && passesMoodFilter;
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  // Group entries by date
  const groupedEntries = filteredEntries.reduce((groups, entry) => {
    const dateKey = format(entry.timestamp, 'yyyy-MM-dd');
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(entry);
    return groups;
  }, {} as Record<string, MoodEntry[]>);

  const uniqueMoods = Array.from(new Set(entries.map(entry => entry.mood)));

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Mood History
          </CardTitle>
          <Badge variant="secondary">
            {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
          </Badge>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Select value={filterPeriod} onValueChange={setFilterPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterMood} onValueChange={setFilterMood}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Moods</SelectItem>
              {uniqueMoods.map(mood => (
                <SelectItem key={mood} value={mood}>
                  {moodAnalysis[mood as keyof typeof moodAnalysis]?.emoji} {mood}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-96">
          {Object.keys(groupedEntries).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No entries found for the selected filters.</p>
              <p className="text-sm">Start journaling to see your mood history!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedEntries).map(([dateKey, dayEntries]) => (
                <div key={dateKey}>
                  <h3 className="sticky top-0 bg-background py-2 border-b mb-3">
                    {formatDate(dayEntries[0].timestamp)}
                  </h3>
                  
                  <div className="space-y-3 ml-4">
                    {dayEntries.map((entry) => {
                      const moodData = moodAnalysis[entry.mood as keyof typeof moodAnalysis];
                      const isExpanded = expandedEntry === entry.id;
                      
                      return (
                        <div key={entry.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{moodData.emoji}</span>
                              <Badge className={moodData.color}>
                                {moodData.label}
                              </Badge>
                              {entry.confidence && (
                                <span className="text-xs text-muted-foreground">
                                  {Math.round(entry.confidence * 100)}%
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {formatTime(entry.timestamp)}
                            </div>
                          </div>
                          
                          <div className="text-sm">
                            {isExpanded ? (
                              <p className="whitespace-pre-wrap">{entry.content}</p>
                            ) : (
                              <p className="line-clamp-2">{entry.content}</p>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                            >
                              {isExpanded ? 'Show Less' : 'Read More'}
                            </Button>
                            
                            {onDeleteEntry && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDeleteEntry(entry.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}