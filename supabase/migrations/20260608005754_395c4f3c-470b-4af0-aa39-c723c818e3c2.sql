
-- Harden has_role to prevent role enumeration: only allow self-checks unless caller is admin
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _user_id IS DISTINCT FROM auth.uid()
     AND NOT EXISTS (
       SELECT 1 FROM public.user_roles
       WHERE user_id = auth.uid() AND role = 'admin'
     )
  THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$;

-- Explicit deny policies for enterprise_licenses write operations (defense in depth / auditability)
DROP POLICY IF EXISTS "Users cannot insert licenses" ON public.enterprise_licenses;
DROP POLICY IF EXISTS "Users cannot update licenses" ON public.enterprise_licenses;
DROP POLICY IF EXISTS "Users cannot delete licenses" ON public.enterprise_licenses;

CREATE POLICY "Users cannot insert licenses"
  ON public.enterprise_licenses FOR INSERT
  TO authenticated
  WITH CHECK (false);

CREATE POLICY "Users cannot update licenses"
  ON public.enterprise_licenses FOR UPDATE
  TO authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Users cannot delete licenses"
  ON public.enterprise_licenses FOR DELETE
  TO authenticated
  USING (false);
