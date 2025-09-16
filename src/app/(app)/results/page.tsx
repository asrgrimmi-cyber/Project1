'use client';

import { CheckCircle, Zap, Clock, TrendingUp } from 'lucide-react';
import { AppHeader } from '@/components/app-header';
import { StatsCard } from '@/components/dashboard/stats-card';
import { ImpactChart } from '@/components/dashboard/impact-chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useTasks } from '@/context/task-context';

export default function ResultsPage() {
  const { tasks } = useTasks();
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const totalPomodoros = tasks.reduce((acc, task) => acc + task.pomodoroSessions, 0);
  const totalWorkTime = totalPomodoros * 25; // Assuming 25 min per pomodoro

  const highImpactCompleted = tasks.filter(t => t.isCompleted && t.isHighImpact).length;
  const lowImpactCompleted = tasks.filter(t => t.isCompleted && !t.isHighImpact).length;

  const chartData = {
    highImpact: highImpactCompleted,
    lowImpact: lowImpactCompleted,
  };

  const recentlyCompleted = tasks
    .filter(t => t.isCompleted && t.completionDate)
    .sort((a, b) => new Date(b.completionDate!).getTime() - new Date(a.completionDate!).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader title="Results" />
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title="Completion Rate"
            value={`${completionRate}%`}
            icon={CheckCircle}
            description={`${completedTasks} of ${totalTasks} tasks completed`}
          />
          <StatsCard 
            title="Pomodoro Sessions"
            value={totalPomodoros.toString()}
            icon={Clock}
            description="Total completed focus sessions"
          />
           <StatsCard 
            title="Total Focus Time"
            value={`${Math.floor(totalWorkTime / 60)}h ${totalWorkTime % 60}m`}
            icon={TrendingUp}
            description="Estimated time in deep work"
          />
          <StatsCard 
            title="High-Impact Tasks"
            value={highImpactCompleted.toString()}
            icon={Zap}
            description="Crucial tasks completed"
          />
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-span-3">
             <ImpactChart data={chartData} />
          </div>
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Recently Completed Tasks</CardTitle>
              <CardDescription>A look at your latest achievements.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Impact</TableHead>
                    <TableHead className="text-right">Completed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentlyCompleted.map(task => (
                    <TableRow key={task.taskId}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>
                        <Badge variant={task.isHighImpact ? "default" : "secondary"} className={task.isHighImpact ? "bg-amber-500" : ""}>
                          {task.isHighImpact ? 'High' : 'Low'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{format(new Date(task.completionDate!), 'MMM d, yyyy')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
