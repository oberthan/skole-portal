import { Plus, BookOpen } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fag, lærere } from '@/data/mockData';

export default function Fag() {
  return (
    <MainLayout title="Fag">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Oversigt over alle fag
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tilføj Fag
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fag.map((f) => {
            const fagLærere = lærere.filter(l => l.fag_id === f.id);
            
            return (
              <Card key={f.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    {f.navn}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {f.beskrivelse && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {f.beskrivelse}
                    </p>
                  )}
                  
                  {fagLærere.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Lærere
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {fagLærere.map((lærer) => (
                          <span
                            key={lærer.id}
                            className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                          >
                            {lærer.navn}
                          </span>
                        ))}
                      </div>
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
