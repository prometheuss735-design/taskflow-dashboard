import { CheckSquare, LogOut, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  onCreateTask: () => void;
  onExportCSV: () => void;
}

export function Header({ onCreateTask, onExportCSV }: HeaderProps) {
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary rounded-lg">
            <CheckSquare className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground hidden sm:inline">TaskFlow</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onExportCSV} className="hidden sm:flex">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="icon" onClick={onExportCSV} className="sm:hidden">
            <Download className="h-4 w-4" />
          </Button>
          
          <Button size="sm" onClick={onCreateTask}>
            <Plus className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">New Task</span>
            <span className="sm:hidden">Add</span>
          </Button>

          <div className="hidden sm:flex items-center gap-3 ml-2 pl-4 border-l">
            <span className="text-sm text-muted-foreground truncate max-w-[150px]">
              {user?.email}
            </span>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          
          <Button variant="ghost" size="icon" onClick={handleSignOut} className="sm:hidden">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
