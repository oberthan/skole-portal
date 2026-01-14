import { Bell, Search, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  title: string;
}

const rolleLabels = {
  admin: 'Administrator',
  lærer: 'Lærer',
  elev: 'Elev',
};

export function Header({ title }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Søg..." 
            className="w-64 pl-9 bg-muted/50"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            3
          </span>
        </Button>
        
        {user && (
          <div className="flex items-center gap-3 pl-2 border-l border-border">
            <div className="text-right">
              <p className="text-sm font-medium">{user.navn}</p>
              <Badge variant="secondary" className="text-xs">
                {rolleLabels[user.rolle]}
              </Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Log ud">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
