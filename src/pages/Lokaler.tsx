import { Plus, DoorOpen } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { lokaler } from '@/data/mockData';

export default function Lokaler() {
  return (
    <MainLayout title="Lokaler">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Oversigt over skolens lokaler
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tilføj Lokale
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {lokaler.map((lokale) => (
            <Card key={lokale.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <DoorOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{lokale.navn}</p>
                    <p className="text-sm text-muted-foreground">Tilgængelig</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
