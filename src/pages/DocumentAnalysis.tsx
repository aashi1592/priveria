import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { FeatureGate } from "@/components/enterprise/withEnterpriseFeature";
import { DocumentUpload } from "@/components/document/DocumentUpload";
import { DocumentAnalysisResults } from "@/components/document/DocumentAnalysisResults";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DocumentAnalysis = () => {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Document Analysis"
        description="AI-powered extraction of compliance data from contracts and documentation"
      />

      <div className="px-6 py-8">
        <FeatureGate featureId="AI_DOCUMENT_ANALYSIS" variant="banner">
          <Tabs defaultValue="upload" className="space-y-6">
            <TabsList>
              <TabsTrigger value="upload">Upload Document</TabsTrigger>
              <TabsTrigger value="results" disabled={!selectedDocumentId}>
                Analysis Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              <DocumentUpload 
                onUploadComplete={(documentId) => {
                  setSelectedDocumentId(documentId);
                }}
              />
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              {selectedDocumentId && (
                <DocumentAnalysisResults documentId={selectedDocumentId} />
              )}
            </TabsContent>
          </Tabs>
        </FeatureGate>
      </div>
    </div>
  );
};

export default DocumentAnalysis;