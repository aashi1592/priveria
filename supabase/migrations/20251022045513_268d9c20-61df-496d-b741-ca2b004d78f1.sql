-- Create storage bucket for document uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', false);

-- Storage policies for documents bucket
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Table for uploaded documents
CREATE TABLE public.uploaded_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT
);

-- Enable RLS
ALTER TABLE public.uploaded_documents ENABLE ROW LEVEL SECURITY;

-- RLS policies for uploaded_documents
CREATE POLICY "Users can view their own documents"
ON public.uploaded_documents FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own documents"
ON public.uploaded_documents FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents"
ON public.uploaded_documents FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
ON public.uploaded_documents FOR DELETE
USING (auth.uid() = user_id);

-- Table for extracted entities
CREATE TABLE public.extracted_entities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.uploaded_documents(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_value TEXT NOT NULL,
  confidence DECIMAL(3,2),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.extracted_entities ENABLE ROW LEVEL SECURITY;

-- RLS policies for extracted_entities
CREATE POLICY "Users can view entities from their documents"
ON public.extracted_entities FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.uploaded_documents
    WHERE uploaded_documents.id = extracted_entities.document_id
    AND uploaded_documents.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create entities for their documents"
ON public.extracted_entities FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.uploaded_documents
    WHERE uploaded_documents.id = extracted_entities.document_id
    AND uploaded_documents.user_id = auth.uid()
  )
);

-- Table linking documents to DPIAs
CREATE TABLE public.document_dpia_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.uploaded_documents(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(document_id, assessment_id)
);

-- Enable RLS
ALTER TABLE public.document_dpia_links ENABLE ROW LEVEL SECURITY;

-- RLS policies for document_dpia_links
CREATE POLICY "Users can view links for their documents"
ON public.document_dpia_links FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.uploaded_documents
    WHERE uploaded_documents.id = document_dpia_links.document_id
    AND uploaded_documents.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create links for their documents"
ON public.document_dpia_links FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.uploaded_documents
    WHERE uploaded_documents.id = document_dpia_links.document_id
    AND uploaded_documents.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete links for their documents"
ON public.document_dpia_links FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.uploaded_documents
    WHERE uploaded_documents.id = document_dpia_links.document_id
    AND uploaded_documents.user_id = auth.uid()
  )
);

-- Create indexes for better query performance
CREATE INDEX idx_uploaded_documents_user_id ON public.uploaded_documents(user_id);
CREATE INDEX idx_uploaded_documents_status ON public.uploaded_documents(status);
CREATE INDEX idx_extracted_entities_document_id ON public.extracted_entities(document_id);
CREATE INDEX idx_extracted_entities_entity_type ON public.extracted_entities(entity_type);
CREATE INDEX idx_document_dpia_links_document_id ON public.document_dpia_links(document_id);
CREATE INDEX idx_document_dpia_links_assessment_id ON public.document_dpia_links(assessment_id);