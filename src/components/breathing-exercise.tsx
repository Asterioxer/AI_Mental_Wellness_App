import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Play, Pause, RotateCcw, Wind, Heart } from 'lucide-react';

interface BreathingExerciseProps {
  className?: string;
}

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'pause';
type BreathingPattern = {
  name: string;
  description: string;
  phases: { [key in BreathingPhase]: number };
  color: string;
  icon: React.ReactNode;
};

const breathingPatterns: BreathingPattern[] = [
  {
    name: '4-7-8',
    description: 'Calming & Sleep',
    phases: { inhale: 4, hold: 7, exhale: 8, pause: 0 },
    color: 'from-blue-500 to-purple-600',
    icon: <Wind className="w-3 h-3" />
  },
  {
    name: 'Box',
    description: 'Focus & Balance',
    phases: { inhale: 4, hold: 4, exhale: 4, pause: 4 },
    color: 'from-green-500 to-teal-600',
    icon: <Heart className="w-3 h-3" />
  },
  {
    name: 'Simple',
    description: 'Quick Relief',
    phases: { inhale: 4, hold: 0, exhale: 6, pause: 0 },
    color: 'from-orange-500 to-red-600',
    icon: <Wind className="w-3 h-3" />
  }
];

export function BreathingExercise({ className }: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentPattern, setCurrentPattern] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('inhale');
  const [timeLeft, setTimeLeft] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pattern = breathingPatterns[currentPattern];

  useEffect(() => {
    if (isActive) {
      if (timeLeft > 0) {
        intervalRef.current = setTimeout(() => {
          setTimeLeft(prev => prev - 1);
          setTotalTime(prev => prev + 1);
        }, 1000);
      } else {
        nextPhase();
      }
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const nextPhase = () => {
    const phases: BreathingPhase[] = ['inhale', 'hold', 'exhale', 'pause'];
    const currentIndex = phases.indexOf(currentPhase);
    const nextIndex = (currentIndex + 1) % phases.length;
    const nextPhase = phases[nextIndex];
    
    // Skip phases with 0 duration
    if (pattern.phases[nextPhase] === 0) {
      const afterNext = phases[(nextIndex + 1) % phases.length];
      setCurrentPhase(afterNext);
      setTimeLeft(pattern.phases[afterNext]);
    } else {
      setCurrentPhase(nextPhase);
      setTimeLeft(pattern.phases[nextPhase]);
    }
    
    // Increment cycle when completing a full round
    if (nextPhase === 'inhale') {
      setCycle(prev => prev + 1);
    }
  };

  const startExercise = () => {
    setIsActive(true);
    setCurrentPhase('inhale');
    setTimeLeft(pattern.phases.inhale);
    setCycle(0);
    setTotalTime(0);
  };

  const pauseExercise = () => {
    setIsActive(!isActive);
  };

  const resetExercise = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setTimeLeft(0);
    setCycle(0);
    setTotalTime(0);
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'pause': return 'Pause';
      default: return 'Ready';
    }
  };

  const getCircleScale = () => {
    switch (currentPhase) {
      case 'inhale': return 1.4;
      case 'hold': return 1.4;
      case 'exhale': return 0.8;
      case 'pause': return 0.8;
      default: return 1;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={`glass border-0 shadow-lg hover-lift ${className}`}>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <motion.div
            animate={{ rotate: isActive ? 360 : 0 }}
            transition={{ duration: 2, repeat: isActive ? Infinity : 0, ease: "linear" }}
          >
            <Wind className="w-4 h-4 text-blue-500" />
          </motion.div>
          Breathing Exercise
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pattern Selector */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Pattern</p>
          <div className="flex gap-1">
            {breathingPatterns.map((p, index) => (
              <Button
                key={index}
                variant={currentPattern === index ? "default" : "outline"}
                size="sm"
                className={`flex-1 h-8 text-xs ${
                  currentPattern === index 
                    ? `bg-gradient-to-r ${p.color} text-white border-0` 
                    : 'glass border-0'
                }`}
                onClick={() => {
                  if (!isActive) {
                    setCurrentPattern(index);
                    resetExercise();
                  }
                }}
                disabled={isActive}
              >
                <span className="flex items-center gap-1">
                  {p.icon}
                  {p.name}
                </span>
              </Button>
            ))}
          </div>
          <p className="text-xs text-center text-muted-foreground">
            {pattern.description}
          </p>
        </div>

        {/* Breathing Circle */}
        <div className="relative flex items-center justify-center h-32">
          <motion.div
            className={`w-24 h-24 rounded-full bg-gradient-to-br ${pattern.color} shadow-lg flex items-center justify-center`}
            animate={{ 
              scale: isActive ? getCircleScale() : 1,
              boxShadow: isActive 
                ? "0 0 40px rgba(102, 126, 234, 0.4), 0 0 80px rgba(102, 126, 234, 0.2)"
                : "0 8px 32px rgba(102, 126, 234, 0.3)"
            }}
            transition={{ 
              duration: timeLeft,
              ease: "easeInOut"
            }}
          >
            <div className="text-white text-center">
              <motion.p 
                className="text-xs font-medium"
                key={currentPhase}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {getPhaseText()}
              </motion.p>
              {isActive && (
                <motion.p 
                  className="text-lg font-bold"
                  key={timeLeft}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {timeLeft}
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Pulse Ring */}
          {isActive && (
            <motion.div
              className={`absolute w-32 h-32 rounded-full border-2 border-blue-400/30`}
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {!isActive && timeLeft === 0 ? (
            <Button 
              onClick={startExercise} 
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
              size="sm"
            >
              <Play className="w-3 h-3 mr-1" />
              Start
            </Button>
          ) : (
            <>
              <Button 
                onClick={pauseExercise}
                variant="outline"
                className="flex-1 glass border-0"
                size="sm"
              >
                {isActive ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                {isActive ? 'Pause' : 'Resume'}
              </Button>
              <Button 
                onClick={resetExercise}
                variant="outline"
                className="glass border-0"
                size="sm"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            </>
          )}
        </div>

        {/* Stats */}
        <AnimatePresence>
          {(cycle > 0 || totalTime > 0) && (
            <motion.div
              className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-1">
                  <Badge variant="outline" className="glass border-0 text-xs">
                    {cycle}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Cycles</p>
              </div>
              
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-1">
                  <Badge variant="outline" className="glass border-0 text-xs">
                    {formatTime(totalTime)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Time</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Encouragement */}
        {cycle >= 3 && (
          <motion.div
            className="text-center p-2 glass rounded-lg border border-green-500/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs text-green-500 font-medium">
              {cycle >= 10 ? "Amazing dedication! 🧘‍♀️" :
               cycle >= 5 ? "You're in the flow! ✨" :
               "Great progress! 🌟"}
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}