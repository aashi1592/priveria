-- Grant base table privileges to the `authenticated` role.
--
-- Row Level Security only filters rows AFTER a role has table-level privileges;
-- without these GRANTs PostgREST returns "42501 permission denied for table".
-- Hosted Supabase applies these via default privileges automatically, so this
-- was never exercised there — but a fresh local/self-hosted instance needs them
-- explicitly. Privileges mirror each table's existing RLS policies.

GRANT SELECT, INSERT, UPDATE, DELETE ON public.assessments        TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vendors            TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.uploaded_documents TO authenticated;
GRANT SELECT, INSERT                 ON public.extracted_entities  TO authenticated;
GRANT SELECT, INSERT, DELETE         ON public.document_dpia_links TO authenticated;
GRANT SELECT, INSERT, UPDATE         ON public.profiles            TO authenticated;
GRANT SELECT                         ON public.user_roles          TO authenticated;
GRANT SELECT                         ON public.enterprise_licenses TO authenticated;
