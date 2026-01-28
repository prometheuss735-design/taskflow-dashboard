import { Badge } from '@/components/ui/badge';
import { TaskPriority } from '@/types/database';
import { cn } from '@/lib/utils';

interface TaskPriorityBadgeProps {
  priority: TaskPriority;
}

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  low: {
    label: 'Low',
    className: 'priority-low',
  },
  medium: {
    label: 'Medium',
    className: 'priority-medium',
  },
  high: {
    label: 'High',
    className: 'priority-high',
  },
};

export function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
  const config = priorityConfig[priority];
  
  return (
    <Badge variant="outline" className={cn('font-medium', config.className)}>
      {config.label}
    </Badge>
  );
}
