import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockEntrants } from "@/data/mockData";

const Entrants = () => {
  const entrants = mockEntrants.filter((e) => e.status === 'Entrant');

  return (
    <div className="space-y-4">
      <Button size="lg" className="w-full text-xl font-bold py-8">
        SELECT 5 FINALISTS
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>All Entrants</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {entrants.map((entrant) => (
              <li key={entrant.id} className="border p-4 rounded-md flex justify-between items-center">
                <div>
                  <p className="font-semibold">{entrant.name}</p>
                  <p className="text-sm text-gray-500">{entrant.email}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Entrants;