import { Users, GraduationCap, BookOpen, School, Calendar } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { elever, lærere, klasser, fag, skemaer } from '@/data/mockData';

export default function Dashboard() {
  return (
    <MainLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Elever"
            value={elever.length}
            icon={Users}
            trend="+12 denne måned"
            trendUp
          />
          <StatCard
            title="Lærere"
            value={lærere.length}
            icon={GraduationCap}
          />
          <StatCard
            title="Klasser"
            value={klasser.length}
            icon={School}
          />
          <StatCard
            title="Fag"
            value={fag.length}
            icon={BookOpen}
          />
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Dagens Skema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {skemaer.slice(0, 4).map((skema) => {
                  const fagNavn = fag.find(f => f.id === skema.fag_id)?.navn;
                  const lærerNavn = lærere.find(l => l.id === skema.lærer_id)?.navn;
                  const klasseNavn = klasser.find(k => k.id === skema.klasse_id)?.navn;
                  
                  return (
                    <div 
                      key={skema.id}
                      className="flex items-center justify-between rounded-lg border border-border/50 p-3"
                    >
                      <div>
                        <p className="font-medium text-foreground">{fagNavn}</p>
                        <p className="text-sm text-muted-foreground">{lærerNavn} • {klasseNavn}</p>
                      </div>
                      <span className="text-sm font-medium text-primary">{skema.tidspunkt}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Seneste Elever
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {elever.slice(0, 5).map((elev) => {
                  const klasseNavn = klasser.find(k => k.id === elev.klasse_id)?.navn;
                  
                  return (
                    <div 
                      key={elev.id}
                      className="flex items-center gap-3 rounded-lg border border-border/50 p-3"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                        {elev.navn.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{elev.navn}</p>
                        <p className="text-sm text-muted-foreground">{elev.email}</p>
                      </div>
                      <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                        {klasseNavn}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
