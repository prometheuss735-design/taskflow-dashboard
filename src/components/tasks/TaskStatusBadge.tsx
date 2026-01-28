import { Badge } from '@/components/ui/badge';
import { TaskStatus } from '@/types/database';
import { cn } from '@/lib/utils';

interface TaskStatusBadgeProps {
  status: TaskStatus;
}

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'status-pending',
  },
  in_progress: {
    label: 'In Progress',
    className: 'status-progress',
  },
  done: {
    label: 'Done',
    className: 'status-done',
  },
};

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge variant="outline" className={cn('font-medium', config.className)}>
      {config.label}
    </Badge>
  );
}
