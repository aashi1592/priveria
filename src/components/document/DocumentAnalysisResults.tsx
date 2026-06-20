import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { FileText, AlertTriangle, Shield, MapPin, Calendar, Scale, Award, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentAnalysisResultsProps {
  documentId: string;
  onLinkToDPIA?: () => void;
}

interface ExtractedEntity {
  id: string;
  entity_type: string;
  entity_value: string;
  confidence: number;
  metadata?: Record<string, unknown>;
}

export function DocumentAnalysisResults({ documentId, onLinkToDPIA }: DocumentAnalysisResultsProps) {
  const [entities, setEntities] = useState<ExtractedEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadEntities = async () => {
      try {
        const { data, error } = await supabase
          .from('extracted_entities')
          .select('*')
          .eq('document_id', documentId)
          .order('entity_type', { ascending: true });

        if (error) throw error;
        setEntities((data || []) as ExtractedEntity[]);
      } catch (error) {
        toast({
          title: "Failed to load results",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadEntities();
  }, [documentId, toast]);

  const groupedEntities = entities.reduce((acc, entity) => {
    if (!acc[entity.entity_type]) {
      acc[entity.entity_type] = [];
    }
    acc[entity.entity_type].push(entity);
    return acc;
  }, {} as Record<string, ExtractedEntity[]>);

  const getIcon = (type: string) => {
    switch (type) {
      case 'vendor_name': return <FileText className="h-5 w-5" />;
      case 'risk_indicator': return <AlertTriangle className="h-5 w-5" />;
      case 'jurisdiction': return <MapPin className="h-5 w-5" />;
      case 'retention_period': return <Calendar className="h-5 w-5" />;
      case 'legal_basis': return <Scale className="h-5 w-5" />;
      case 'certification': return <Award className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  const formatEntityType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (loading) {
    return <Card><CardContent className="pt-6">Loading analysis results...</CardContent></Card>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Analysis Results</h2>
        {onLinkToDPIA && (
          <Button onClick={onLinkToDPIA} variant="outline">
            <LinkIcon className="mr-2 h-4 w-4" />
            Link to DPIA
          </Button>
        )}
      </div>

      {Object.keys(groupedEntities).length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No data extracted from document</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(groupedEntities).map(([type, entityList]) => (
            <Card key={type}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  {getIcon(type)}
                  {formatEntityType(type)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {entityList.map((entity) => (
                    <div key={entity.id} className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {entity.entity_value}
                        </p>
                        {entity.metadata && (
                          <div className="mt-1">
                            {entity.metadata.description && (
                              <p className="text-xs text-muted-foreground">
                                {String(entity.metadata.description)}
                              </p>
                            )}
                            {entity.metadata.severity && (
                              <Badge
                                variant={
                                  entity.metadata.severity === 'high' ? 'destructive' :
                                  entity.metadata.severity === 'medium' ? 'default' : 'secondary'
                                }
                                className="mt-1"
                              >
                                {String(entity.metadata.severity)}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(entity.confidence * 100)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}