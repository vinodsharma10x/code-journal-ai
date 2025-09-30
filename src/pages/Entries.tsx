import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search, Calendar, Tag, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Entries = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Entry saved successfully!");
    setIsDialogOpen(false);
  };

  const filteredEntries = entries.filter((entry) =>
    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient">Journal Entries</h1>
          <p className="text-muted-foreground mt-2">Manage and organize your development journal</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" size="lg">
              <Plus className="mr-2 h-4 w-4" /> New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Entry</DialogTitle>
              <DialogDescription>
                Document your development journey
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Entry title..." required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" placeholder="e.g., Learning, Achievement, Challenge" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" placeholder="Separate tags with commas" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your entry here... (Markdown supported)"
                  rows={10}
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="hero">Save Entry</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <Card className="p-4 glass">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 focus-visible:ring-0"
          />
        </div>
      </Card>

      {/* Entries List */}
      <div className="grid gap-4">
        {filteredEntries.map((entry) => (
          <Card key={entry.id} className="p-6 glass hover:shadow-lg transition-smooth">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{entry.title}</h3>
                <p className="text-muted-foreground line-clamp-2">{entry.content}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {entry.date}
              </span>
              <Badge variant="secondary">{entry.category}</Badge>
              <div className="flex items-center gap-2">
                <Tag className="h-3 w-3 text-muted-foreground" />
                {entry.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const entries = [
  {
    id: 1,
    title: "Implemented Redux Toolkit",
    content: "Today I migrated our state management from Context API to Redux Toolkit. The type safety improvements are incredible and the DevTools integration makes debugging so much easier.",
    date: "Jan 15, 2025",
    category: "Learning",
    tags: ["React", "Redux", "TypeScript"],
  },
  {
    id: 2,
    title: "Code Review Insights",
    content: "Had a great code review session with the team. Learned some best practices for handling async operations in React. The team suggested using React Query for server state management.",
    date: "Jan 14, 2025",
    category: "Team",
    tags: ["Code Review", "Best Practices"],
  },
  {
    id: 3,
    title: "Performance Optimization Win",
    content: "Reduced initial load time by 40% by implementing lazy loading and code splitting. Users are going to love this improvement. Used React.lazy and Suspense for component-level code splitting.",
    date: "Jan 13, 2025",
    category: "Achievement",
    tags: ["Performance", "Optimization", "React"],
  },
  {
    id: 4,
    title: "Debugging Complex State Issue",
    content: "Spent 3 hours debugging a race condition in our WebSocket implementation. Finally found the issue - we weren't properly cleaning up subscriptions. Added proper cleanup in useEffect.",
    date: "Jan 12, 2025",
    category: "Challenge",
    tags: ["Debugging", "WebSocket", "React"],
  },
];

export default Entries;
