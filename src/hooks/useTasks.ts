import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskStatus, TaskPriority, TaskStats } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Cast the data to our Task type
      const typedTasks: Task[] = (data || []).map((task) => ({
        id: task.id,
        user_id: task.user_id,
        title: task.title,
        description: task.description,
        status: task.status as TaskStatus,
        priority: task.priority as TaskPriority,
        due_date: task.due_date,
        created_at: task.created_at,
        updated_at: task.updated_at,
      }));
      
      setTasks(typedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch tasks',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createTask = useCallback(async (task: {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    due_date?: string | null;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: task.title,
          description: task.description || null,
          status: task.status || 'pending',
          priority: task.priority || 'medium',
          due_date: task.due_date || null,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const newTask: Task = {
        id: data.id,
        user_id: data.user_id,
        title: data.title,
        description: data.description,
        status: data.status as TaskStatus,
        priority: data.priority as TaskPriority,
        due_date: data.due_date,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setTasks((prev) => [newTask, ...prev]);
      
      toast({
        title: 'Success',
        description: 'Task created successfully',
      });

      return { data: newTask, error: null };
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive',
      });
      return { data: null, error };
    }
  }, [toast]);

  const updateTask = useCallback(async (id: string, updates: Partial<Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedTask: Task = {
        id: data.id,
        user_id: data.user_id,
        title: data.title,
        description: data.description,
        status: data.status as TaskStatus,
        priority: data.priority as TaskPriority,
        due_date: data.due_date,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );

      toast({
        title: 'Success',
        description: 'Task updated successfully',
      });

      return { data: updatedTask, error: null };
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      });
      return { data: null, error };
    }
  }, [toast]);

  const deleteTask = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTasks((prev) => prev.filter((task) => task.id !== id));

      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      });

      return { error: null };
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive',
      });
      return { error };
    }
  }, [toast]);

  const getStats = useCallback((): TaskStats => {
    const now = new Date();
    const overdue = tasks.filter((task) => {
      if (!task.due_date || task.status === 'done') return false;
      return new Date(task.due_date) < now;
    }).length;

    return {
      pending: tasks.filter((t) => t.status === 'pending').length,
      in_progress: tasks.filter((t) => t.status === 'in_progress').length,
      done: tasks.filter((t) => t.status === 'done').length,
      total: tasks.length,
      overdue,
    };
  }, [tasks]);

  const exportToCSV = useCallback(() => {
    const headers = ['Title', 'Description', 'Status', 'Priority', 'Due Date', 'Created At'];
    const rows = tasks.map((task) => [
      task.title,
      task.description || '',
      task.status,
      task.priority,
      task.due_date ? new Date(task.due_date).toLocaleDateString() : '',
      new Date(task.created_at).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tasks_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: 'Success',
      description: 'Tasks exported to CSV',
    });
  }, [tasks, toast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    fetchTasks,
    getStats,
    exportToCSV,
  };
}
