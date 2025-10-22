import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { documentId, fileUrl } = await req.json();

    if (!documentId || !fileUrl) {
      throw new Error('Missing required parameters');
    }

    console.log(`Processing document ${documentId} for user ${user.id}`);

    // Update document status to processing
    await supabase
      .from('uploaded_documents')
      .update({ status: 'processing' })
      .eq('id', documentId);

    // Download the file content
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('documents')
      .download(fileUrl);

    if (downloadError || !fileData) {
      throw new Error('Failed to download file');
    }

    // Convert file to base64 for AI analysis
    const arrayBuffer = await fileData.arrayBuffer();
    const base64Content = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    // Call Lovable AI for document analysis
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a GDPR and privacy compliance expert. Analyze the provided document and extract:
1. Vendor/Company name
2. Data categories being processed (e.g., personal data, sensitive data)
3. Processing purposes
4. Data retention periods
5. Legal basis for processing
6. Data transfer jurisdictions
7. Security certifications mentioned
8. Risk indicators (high-risk processing activities)
9. Compliance frameworks referenced (GDPR, CCPA, ISO 27001, etc.)

Return your analysis as a structured JSON object with these fields.`
          },
          {
            role: 'user',
            content: `Please analyze this document for GDPR compliance information. Extract all relevant data protection details.`
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'extract_document_data',
              description: 'Extract structured data from privacy and compliance documents',
              parameters: {
                type: 'object',
                properties: {
                  vendor_name: { type: 'string' },
                  data_categories: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  processing_purposes: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  retention_period: { type: 'string' },
                  legal_basis: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  jurisdictions: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  certifications: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  risk_indicators: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        type: { type: 'string' },
                        description: { type: 'string' },
                        severity: { type: 'string', enum: ['low', 'medium', 'high'] }
                      }
                    }
                  },
                  compliance_frameworks: {
                    type: 'array',
                    items: { type: 'string' }
                  }
                },
                required: ['vendor_name', 'data_categories', 'processing_purposes']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'extract_document_data' } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI analysis failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error('No structured data extracted from document');
    }

    const extractedData = JSON.parse(toolCall.function.arguments);
    console.log('Extracted data:', extractedData);

    // Store extracted entities in the database
    const entitiesToInsert = [];

    if (extractedData.vendor_name) {
      entitiesToInsert.push({
        document_id: documentId,
        entity_type: 'vendor_name',
        entity_value: extractedData.vendor_name,
        confidence: 0.95
      });
    }

    if (extractedData.data_categories) {
      extractedData.data_categories.forEach((category: string) => {
        entitiesToInsert.push({
          document_id: documentId,
          entity_type: 'data_category',
          entity_value: category,
          confidence: 0.90
        });
      });
    }

    if (extractedData.processing_purposes) {
      extractedData.processing_purposes.forEach((purpose: string) => {
        entitiesToInsert.push({
          document_id: documentId,
          entity_type: 'processing_purpose',
          entity_value: purpose,
          confidence: 0.90
        });
      });
    }

    if (extractedData.retention_period) {
      entitiesToInsert.push({
        document_id: documentId,
        entity_type: 'retention_period',
        entity_value: extractedData.retention_period,
        confidence: 0.85
      });
    }

    if (extractedData.legal_basis) {
      extractedData.legal_basis.forEach((basis: string) => {
        entitiesToInsert.push({
          document_id: documentId,
          entity_type: 'legal_basis',
          entity_value: basis,
          confidence: 0.85
        });
      });
    }

    if (extractedData.jurisdictions) {
      extractedData.jurisdictions.forEach((jurisdiction: string) => {
        entitiesToInsert.push({
          document_id: documentId,
          entity_type: 'jurisdiction',
          entity_value: jurisdiction,
          confidence: 0.90
        });
      });
    }

    if (extractedData.certifications) {
      extractedData.certifications.forEach((cert: string) => {
        entitiesToInsert.push({
          document_id: documentId,
          entity_type: 'certification',
          entity_value: cert,
          confidence: 0.90
        });
      });
    }

    if (extractedData.risk_indicators) {
      extractedData.risk_indicators.forEach((risk: any) => {
        entitiesToInsert.push({
          document_id: documentId,
          entity_type: 'risk_indicator',
          entity_value: risk.type,
          confidence: 0.80,
          metadata: { description: risk.description, severity: risk.severity }
        });
      });
    }

    if (extractedData.compliance_frameworks) {
      extractedData.compliance_frameworks.forEach((framework: string) => {
        entitiesToInsert.push({
          document_id: documentId,
          entity_type: 'compliance_framework',
          entity_value: framework,
          confidence: 0.90
        });
      });
    }

    // Insert all entities
    const { error: insertError } = await supabase
      .from('extracted_entities')
      .insert(entitiesToInsert);

    if (insertError) {
      console.error('Error inserting entities:', insertError);
      throw insertError;
    }

    // Update document status to completed
    await supabase
      .from('uploaded_documents')
      .update({ 
        status: 'completed',
        processed_at: new Date().toISOString()
      })
      .eq('id', documentId);

    return new Response(
      JSON.stringify({ 
        success: true,
        extractedData,
        entitiesCount: entitiesToInsert.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-document function:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});