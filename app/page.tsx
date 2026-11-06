import { BookPlus, LineChart, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: BookPlus,
    title: "Add books",
    text: "Save every book you want to read with its author, pages and status.",
  },
  {
    icon: LineChart,
    title: "Track your progress",
    text: "Move books from To Read to Reading to Finished with a single click.",
  },
  {
    icon: Search,
    title: "Search your shelf",
    text: "Filter by status or search by title and author, and see your totals.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div className="max-w-2xl space-y-3 pt-4">
        <h1 data-testid="home-title" className="text-4xl font-bold tracking-tight sm:text-5xl">
          ShelfLife
        </h1>
        <p className="text-muted-foreground sm:text-lg">
          A simple place to keep the books you want to read, are reading or have finished —
          and to see how much is on your shelf.
        </p>
      </div>

      <div className="grid w-full gap-4 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <Card key={title} className="text-left">
            <CardHeader>
              <Icon className="mb-1 size-6 text-primary" aria-hidden />
              <CardTitle>{title}</CardTitle>
              <CardDescription>{text}</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </div>
    </div>
  );
}
