import { useState } from 'react';
import { format, isPast } from 'date-fns';
import { Pencil, Trash2, Calendar, Clock } from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from '@/types/database';
import { TaskStatusBadge } from './TaskStatusBadge';
import { TaskPriorityBadge } from './TaskPriorityBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onUpdate, onDelete, onEdit }: TaskCardProps) {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOverdue = task.due_date && task.status !== 'done' && isPast(new Date(task.due_date));
  const isHighPriority = task.priority === 'high' && task.status !== 'done';

  const handleStatusChange = async (status: TaskStatus) => {
    setUpdating(true);
    await onUpdate(task.id, { status });
    setUpdating(false);
  };

  const handlePriorityChange = async (priority: TaskPriority) => {
    setUpdating(true);
    await onUpdate(task.id, { priority });
    setUpdating(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(task.id);
    setDeleting(false);
  };

  return (
    <Card 
      className={cn(
        'card-hover animate-fade-in',
        isOverdue && 'task-overdue',
        isHighPriority && !isOverdue && 'border-l-4 border-l-priority-high'
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground leading-tight line-clamp-2">
            {task.title}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(task)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Task</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this task? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={deleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      
      {task.description && (
        <CardContent className="pb-3 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        </CardContent>
      )}
      
      <CardFooter className="flex flex-col gap-3 pt-0">
        <div className="flex items-center gap-2 w-full flex-wrap">
          <TaskStatusBadge status={task.status} />
          <TaskPriorityBadge priority={task.priority} />
          
          {isOverdue && (
            <span className="text-xs font-medium text-overdue flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Overdue
            </span>
          )}
        </div>

        {task.due_date && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground w-full">
            <Calendar className="h-3 w-3" />
            <span>Due: {format(new Date(task.due_date), 'PPP')}</span>
          </div>
        )}

        <div className="flex gap-2 w-full">
          <Select
            value={task.status}
            onValueChange={(value) => handleStatusChange(value as TaskStatus)}
            disabled={updating}
          >
            <SelectTrigger className="flex-1 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={task.priority}
            onValueChange={(value) => handlePriorityChange(value as TaskPriority)}
            disabled={updating}
          >
            <SelectTrigger className="flex-1 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardFooter>
    </Card>
  );
}
