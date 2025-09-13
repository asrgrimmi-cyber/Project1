import { mockTasks } from '@/lib/data';
import { AppHeader } from '@/components/app-header';
import { PomodoroTimer } from '@/components/pomodoro/timer';
import { notFound } from 'next/navigation';

export default function TimerPage({ params }: { params: { taskId: string } }) {
  const task = mockTasks.find(t => t.taskId === params.taskId);

  if (!task) {
    notFound();
  }

  return (
    <div className="flex h-full flex-col">
      <AppHeader title="Pomodoro Timer" />
      <main className="flex flex-1 items-center justify-center p-4 md:p-6">
        <PomodoroTimer taskTitle={task.title} />
      </main>
    </div>
  );
}
