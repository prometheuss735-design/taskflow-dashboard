import { Clock, PlayCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { TaskStats } from '@/types/database';
import { StatsCard } from './StatsCard';

interface DashboardProps {
  stats: TaskStats;
}

export function Dashboard({ stats }: DashboardProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      <StatsCard
        title="Pending"
        value={stats.pending}
        icon={<Clock className="h-5 w-5" />}
        variant="pending"
      />
      <StatsCard
        title="In Progress"
        value={stats.in_progress}
        icon={<PlayCircle className="h-5 w-5" />}
        variant="progress"
      />
      <StatsCard
        title="Completed"
        value={stats.done}
        icon={<CheckCircle2 className="h-5 w-5" />}
        variant="done"
      />
      <StatsCard
        title="Overdue"
        value={stats.overdue}
        icon={<AlertTriangle className="h-5 w-5" />}
        variant="overdue"
      />
    </div>
  );
}
