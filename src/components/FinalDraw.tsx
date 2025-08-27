import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { mockEntrants } from "@/data/mockData";

const FinalDraw = () => {
  const finalists = mockEntrants.filter((e) => e.status === 'Finalist');

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">The Finalists</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {finalists.map((finalist) => (
          <Card key={finalist.id}>
            <CardHeader>
              <CardTitle>{finalist.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{finalist.email}</p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" size="sm">Eliminate</Button>
              <Button variant="default" size="sm">Crown Winner</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FinalDraw;