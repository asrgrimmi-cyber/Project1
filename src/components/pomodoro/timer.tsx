'use client';
import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const sessionDurations = {
  Work: 25 * 60,
  'Short Break': 5 * 60,
  'Long Break': 15 * 60,
};

type SessionType = keyof typeof sessionDurations;

export function PomodoroTimer({ taskTitle }: { taskTitle: string }) {
  const [sessionType, setSessionType] = useState<SessionType>('Work');
  const [time, setTime] = useState(sessionDurations[sessionType]);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const { toast } = useToast();

  const nextSession = useCallback(() => {
    let next: SessionType;
    if (sessionType === 'Work') {
      const newCount = sessionCount + 1;
      setSessionCount(newCount);
      if (newCount % 4 === 0) {
        next = 'Long Break';
      } else {
        next = 'Short Break';
      }
    } else {
      next = 'Work';
    }
    setSessionType(next);
    setTime(sessionDurations[next]);
    setIsActive(true);
    toast({
      title: 'Session Started',
      description: `Time for a ${next.toLowerCase()}.`,
    });
  }, [sessionCount, sessionType, toast]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (isActive && time === 0) {
      if (sessionType === 'Work') {
        // In a real app, log session completion
      }
      nextSession();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time, nextSession, sessionType]);

  useEffect(() => {
    // Update document title with time
    document.title = `${Math.floor(time / 60)
      .toString()
      .padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')} - TaskZen`;
  }, [time]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTime(sessionDurations[sessionType]);
  };
  
  const progress = (time / sessionDurations[sessionType]) * 100;

  return (
    <div className="flex flex-col items-center justify-center gap-8 rounded-xl bg-card p-8 shadow-lg md:p-12">
      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground">{sessionType}</p>
        <p className="font-headline text-lg text-foreground/80 break-all">{taskTitle}</p>
      </div>

      <div className="relative h-64 w-64">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle
            className="text-muted/20"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            r="56"
            cx="60"
            cy="60"
          />
          <circle
            className="text-primary transition-all duration-500"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            fill="transparent"
            r="56"
            cx="60"
            cy="60"
            style={{
              strokeDasharray: 352,
              strokeDashoffset: 352 - (352 * progress) / 100,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-headline text-6xl font-bold tabular-nums">
            {Math.floor(time / 60).toString().padStart(2, '0')}:{(time % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={resetTimer}>
          <RotateCcw className="h-6 w-6" />
        </Button>
        <Button size="icon" className="h-20 w-20 rounded-full text-2xl" onClick={toggleTimer}>
          {isActive ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
        </Button>
        <div className="h-12 w-12"></div>
      </div>
    </div>
  );
}
