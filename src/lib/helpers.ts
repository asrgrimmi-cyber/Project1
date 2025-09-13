import type { Task, TaskWithChildren } from './types';

export function buildTaskTree(tasks: Task[]): TaskWithChildren[] {
  const taskMap = new Map<string, TaskWithChildren>();
  const taskTree: TaskWithChildren[] = [];

  // Initialize map with all tasks and an empty children array
  tasks.forEach(task => {
    taskMap.set(task.taskId, { ...task, children: [] });
  });

  // Populate children arrays
  tasks.forEach(task => {
    if (task.parentId && taskMap.has(task.parentId)) {
      const parent = taskMap.get(task.parentId);
      const child = taskMap.get(task.taskId);
      if (parent && child) {
        parent.children.push(child);
      }
    }
  });

  // Collect root tasks (tasks with no parent or whose parent is not in the map)
  tasks.forEach(task => {
    if (!task.parentId || !taskMap.has(task.parentId)) {
      const rootTask = taskMap.get(task.taskId);
      if (rootTask) {
        taskTree.push(rootTask);
      }
    }
  });

  return taskTree;
}
