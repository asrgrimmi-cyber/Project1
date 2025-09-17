'use client';

import { CheckCircle, Zap, Clock, TrendingUp, BarChart2, RotateCcw } from 'lucide-react';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/dashboard/stats-card';
import { ImpactChart } from '@/components/dashboard/impact-chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useTasks } from '@/context/task-context';

function EmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card/50 p-12 text-center">
        <div className="flex flex-col items-center gap-4">
            <BarChart2 className="h-16 w-16 text-muted-foreground" />
            <div className="text-center">
                <h3 className="font-headline text-xl font-semibold tracking-tight">No completed tasks yet.</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Complete some tasks to see your results and statistics here.
                </p>
            </div>
        </div>
    </div>
  );
}

export default function ResultsPage() {
  const { tasks, resetTasks } = useTasks();
  const completedTasksList = tasks.filter(t => t.isCompleted);

  const totalTasks = tasks.length;
  const completedTasks = completedTasksList.length;
  
  if (completedTasks === 0) {
    return (
       <div className="flex flex-1 flex-col">
        <AppHeader title="Results" />
        <main className="flex-1 p-4 md:p-6">
            <EmptyState />
        </main>
      </div>
    )
  }

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const totalPomodoros = completedTasksList.reduce((acc, task) => acc + task.pomodoroSessions, 0);
  const totalWorkTime = totalPomodoros * 25; // Assuming 25 min per pomodoro

  const highImpactCompleted = completedTasksList.filter(t => t.isHighImpact).length;
  const lowImpactCompleted = completedTasksList.filter(t => !t.isHighImpact).length;

  const chartData = {
    highImpact: highImpactCompleted,
    lowImpact: lowImpactCompleted,
  };

  const recentlyCompleted = completedTasksList
    .filter(t => t.completionDate)
    .sort((a, b) => new Date(b.completionDate!).getTime() - new Date(a.completionDate!).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader title="Results" />
      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6 flex items-center justify-between">
            <div />
            <Button variant="outline" onClick={resetTasks}>
              <RotateCcw className="mr-2 h-4 w-4" /> Reset All Tasks
            </Button>
        </div>
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
            value={totalWorkTime > 0 ? `${Math.floor(totalWorkTime / 60)}h ${totalWorkTime % 60}m` : '0m'}
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
