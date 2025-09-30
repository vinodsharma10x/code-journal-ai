import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  category: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

const Entries = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch entries');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const tagsInput = formData.get('tags') as string;
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [];

    try {
      if (editingEntry) {
        const { error } = await supabase
          .from('journal_entries')
          .update({ title, content, category, tags })
          .eq('id', editingEntry.id);

        if (error) throw error;
        toast.success('Entry updated successfully!');
      } else {
        const { error } = await supabase
          .from('journal_entries')
          .insert([{ 
            title, 
            content, 
            category, 
            tags,
            user_id: user?.id 
          }]);

        if (error) throw error;
        toast.success('Entry saved successfully!');
      }

      setIsDialogOpen(false);
      setEditingEntry(null);
      fetchEntries();
      e.currentTarget.reset();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save entry');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Entry deleted successfully');
      fetchEntries();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete entry');
    }
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingEntry(null);
  };

  const filteredEntries = entries.filter((entry) =>
    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient">Journal Entries</h1>
          <p className="text-muted-foreground mt-2">Manage and organize your development journal</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button variant="hero" size="lg">
              <Plus className="mr-2 h-4 w-4" /> New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingEntry ? 'Edit Entry' : 'Create New Entry'}</DialogTitle>
              <DialogDescription>
                Document your development journey
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  name="title"
                  placeholder="Entry title..." 
                  defaultValue={editingEntry?.title}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input 
                  id="category" 
                  name="category"
                  placeholder="e.g., Learning, Achievement, Challenge"
                  defaultValue={editingEntry?.category || ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input 
                  id="tags" 
                  name="tags"
                  placeholder="Separate tags with commas"
                  defaultValue={editingEntry?.tags.join(', ')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Write your entry here... (Markdown supported)"
                  rows={10}
                  defaultValue={editingEntry?.content}
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="hero">
                  {editingEntry ? 'Update Entry' : 'Save Entry'}
                </Button>
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
      {filteredEntries.length === 0 ? (
        <Card className="p-12 text-center glass">
          <p className="text-muted-foreground mb-4">No entries yet. Start documenting your journey!</p>
          <Button variant="hero" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Your First Entry
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredEntries.map((entry) => (
            <Card key={entry.id} className="p-6 glass hover:shadow-lg transition-smooth">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{entry.title}</h3>
                  <p className="text-muted-foreground line-clamp-2">{entry.content}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(entry)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(entry.created_at).toLocaleDateString()}
                </span>
                {entry.category && (
                  <Badge variant="secondary">{entry.category}</Badge>
                )}
                {entry.tags.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Tag className="h-3 w-3 text-muted-foreground" />
                    {entry.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Entries;
