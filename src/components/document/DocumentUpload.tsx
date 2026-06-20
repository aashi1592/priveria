import { useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface DocumentUploadProps {
  onUploadComplete?: (documentId: string) => void;
}

export function DocumentUpload({ onUploadComplete }: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload to storage
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { data: document, error: dbError } = await supabase
        .from('uploaded_documents')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          status: 'pending'
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast({
        title: "Upload successful",
        description: "Document uploaded. Starting AI analysis...",
      });

      setUploading(false);
      setAnalyzing(true);

      // Trigger AI analysis - only send documentId, file path is retrieved server-side
      const { error: analysisError } = await supabase.functions.invoke('analyze-document', {
        body: {
          documentId: document.id
        }
      });

      if (analysisError) throw analysisError;

      toast({
        title: "Analysis complete",
        description: "Document has been analyzed successfully",
      });

      setAnalyzing(false);
      onUploadComplete?.(document.id);

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload document",
        variant: "destructive",
      });
      setUploading(false);
      setAnalyzing(false);
    }
  };

  return (
    <Card className="border-dashed border-2 hover:border-primary transition-colors">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          {uploading || analyzing ? (
            <>
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">
                  {uploading ? "Uploading..." : "Analyzing document..."}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {analyzing && "AI is extracting compliance data"}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 bg-primary/10 rounded-full">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Upload Document for Analysis
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload contracts, DPAs, or security documentation
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Supported formats: PDF, DOC, DOCX (Max 10MB)
                </p>
              </div>
              <label htmlFor="file-upload">
                <Button variant="default" size="lg" asChild>
                  <span>
                    <FileText className="mr-2 h-5 w-5" />
                    Select Document
                  </span>
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                />
              </label>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}