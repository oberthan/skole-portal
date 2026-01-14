import { Plus, Users } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { klasser, elever } from '@/data/mockData';

export default function Klasser() {
  return (
    <MainLayout title="Klasser">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Administrer skolens klasser og elever
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Opret Klasse
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {klasser.map((klasse) => {
            const klasseElever = elever.filter(e => e.klasse_id === klasse.id);
            
            return (
              <Card key={klasse.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span>{klasse.navn}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      Årgang {klasse.årgang}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{klasseElever.length} elever</span>
                  </div>
                  
                  {klasseElever.length > 0 && (
                    <div className="mt-4 flex -space-x-2">
                      {klasseElever.slice(0, 5).map((elev) => (
                        <div
                          key={elev.id}
                          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary/10 text-primary text-xs font-semibold"
                          title={elev.navn}
                        >
                          {elev.navn.charAt(0)}
                        </div>
                      ))}
                      {klasseElever.length > 5 && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-muted-foreground text-xs font-semibold">
                          +{klasseElever.length - 5}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
