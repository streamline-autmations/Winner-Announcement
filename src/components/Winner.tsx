import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockEntrants } from "@/data/mockData";
import { Crown } from "lucide-react";

const Winner = () => {
  const winner = mockEntrants.find((e) => e.status === 'Winner');

  if (!winner) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">No winner has been selected yet.</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="w-full h-64 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Confetti GIF placeholder</p>
      </div>
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-yellow-500 flex items-center justify-center gap-2">
            <Crown className="w-10 h-10" />
            WINNER!
            <Crown className="w-10 h-10" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{winner.name}</p>
          <p className="text-lg text-gray-600 dark:text-gray-400">{winner.email}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Winner;