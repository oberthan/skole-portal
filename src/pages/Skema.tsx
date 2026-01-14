import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { skemaer, klasser, fag, lærere, lokaler } from '@/data/mockData';

const dage = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag'];
const tidspunkter = ['08:00-09:30', '10:00-11:30', '12:30-14:00', '14:15-15:45'];

export default function Skema() {
  return (
    <MainLayout title="Skema">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-48">
            <Select defaultValue="1">
              <SelectTrigger>
                <SelectValue placeholder="Vælg klasse" />
              </SelectTrigger>
              <SelectContent>
                {klasser.map((klasse) => (
                  <SelectItem key={klasse.id} value={klasse.id}>
                    {klasse.navn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ugeskema - 1.A</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-border bg-muted/50 p-3 text-left text-sm font-medium">
                      Tid
                    </th>
                    {dage.map((dag) => (
                      <th 
                        key={dag} 
                        className="border border-border bg-muted/50 p-3 text-center text-sm font-medium min-w-[150px]"
                      >
                        {dag}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tidspunkter.map((tid) => (
                    <tr key={tid}>
                      <td className="border border-border bg-muted/30 p-3 text-sm font-medium">
                        {tid}
                      </td>
                      {dage.map((dag) => {
                        const dagKort = dag.slice(0, 3);
                        const skema = skemaer.find(s => 
                          s.klasse_id === '1' && 
                          s.tidspunkt.startsWith(dagKort) &&
                          s.tidspunkt.includes(tid)
                        );
                        
                        if (skema) {
                          const fagNavn = fag.find(f => f.id === skema.fag_id)?.navn;
                          const lærerNavn = lærere.find(l => l.id === skema.lærer_id)?.navn;
                          const lokaleNavn = lokaler.find(l => l.id === skema.lokale_id)?.navn;
                          
                          return (
                            <td key={dag} className="border border-border p-2">
                              <div className="rounded-lg bg-primary/10 p-2 text-center">
                                <p className="font-medium text-primary text-sm">{fagNavn}</p>
                                <p className="text-xs text-muted-foreground mt-1">{lærerNavn}</p>
                                <p className="text-xs text-muted-foreground">{lokaleNavn}</p>
                              </div>
                            </td>
                          );
                        }
                        
                        return (
                          <td key={dag} className="border border-border p-2">
                            <div className="h-16" />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
