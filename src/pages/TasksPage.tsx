import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskForm } from '@/components/tasks/TaskForm';
import { useTasks } from '@/hooks/useTasks';
import { TaskStatus, TaskPriority } from '@/types/database';

export function TasksPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { tasks, loading, createTask, updateTask, deleteTask, getStats, exportToCSV } = useTasks();

  const handleCreateTask = async (data: {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    due_date?: string | null;
  }) => {
    await createTask(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onCreateTask={() => setCreateDialogOpen(true)} onExportCSV={exportToCSV} />
      
      <main className="container py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Track and manage your tasks</p>
        </div>

        <Dashboard stats={getStats()} />

        <div className="pt-4">
          <h2 className="text-xl font-semibold text-foreground mb-4">Tasks</h2>
          <TaskList
            tasks={tasks}
            loading={loading}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        </div>
      </main>

      <TaskForm
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}
