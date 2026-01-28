import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  variant: 'pending' | 'progress' | 'done' | 'overdue';
}

export function StatsCard({ title, value, icon, variant }: StatsCardProps) {
  const variantStyles = {
    pending: 'stat-pending border-status-pending/30',
    progress: 'stat-progress border-status-progress/30',
    done: 'stat-done border-status-done/30',
    overdue: 'bg-overdue-bg border-overdue/30',
  };

  const iconStyles = {
    pending: 'text-status-pending',
    progress: 'text-status-progress',
    done: 'text-status-done',
    overdue: 'text-overdue',
  };

  return (
    <div
      className={cn(
        'rounded-lg border p-4 card-hover',
        variantStyles[variant]
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
        </div>
        <div className={cn('p-2 rounded-lg bg-card', iconStyles[variant])}>
          {icon}
        </div>
      </div>
    </div>
  );
}
