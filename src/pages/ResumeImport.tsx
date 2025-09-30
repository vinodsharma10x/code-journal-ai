import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const ResumeImport = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setUploadedFile(file);
    } else {
      toast.error("Please upload a PDF or DOCX file");
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleImport = () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Resume imported successfully! Check your entries.");
    }, 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold text-gradient">Resume Import</h1>
        <p className="text-muted-foreground mt-2">
          Import your professional experience to jumpstart your journal
        </p>
      </div>

      <Card className="p-8 glass">
        <div className="space-y-6">
          <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">How it works</p>
              <p className="text-muted-foreground">
                Upload your resume (PDF or DOCX) and our AI will extract your professional experience,
                creating journal entries for each position. You can edit these entries afterward.
              </p>
            </div>
          </div>

          {!uploadedFile ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">Drop your resume here</p>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse (PDF or DOCX, max 10MB)
              </p>
              <input
                type="file"
                id="resume-upload"
                accept=".pdf,.docx"
                onChange={handleFileInput}
                className="hidden"
              />
              <label htmlFor="resume-upload">
                <Button variant="hero" asChild>
                  <span>Choose File</span>
                </Button>
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <FileText className="h-10 w-10 text-primary flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Check className="h-5 w-5 text-primary" />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="hero"
                  onClick={handleImport}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? "Processing..." : "Import Resume"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setUploadedFile(null)}
                  disabled={isProcessing}
                >
                  Remove
                </Button>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-border">
            <h3 className="font-semibold mb-4">What gets imported:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Work experience and job positions
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Key projects and achievements
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Technical skills and technologies
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Education and certifications
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResumeImport;
