import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Entrants from "@/components/Entrants";
import FinalDraw from "@/components/FinalDraw";
import Winner from "@/components/Winner";

const Index = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">Logo Hunt Winner Draw</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          An internal tool to manage and execute the competition winner draw.
        </p>
      </header>
      
      <Tabs defaultValue="entrants" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="entrants">Entrants</TabsTrigger>
          <TabsTrigger value="final-draw">The Final Draw</TabsTrigger>
          <TabsTrigger value="winner">WINNER!</TabsTrigger>
        </TabsList>
        <TabsContent value="entrants" className="mt-4">
          <Entrants />
        </TabsContent>
        <TabsContent value="final-draw" className="mt-4">
          <FinalDraw />
        </TabsContent>
        <TabsContent value="winner" className="mt-4">
          <Winner />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;