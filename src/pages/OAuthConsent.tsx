/**
 * OAuth 2.1 consent screen for MCP clients connecting to Priveria.
 * Supabase redirects here with ?authorization_id=... so the signed-in user can
 * approve or deny an external client (Claude, ChatGPT, Cursor, ...).
 */
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, AlertTriangle } from "lucide-react";

type OAuthNamespace = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
};

const oauth = () => (supabase.auth as unknown as { oauth: OAuthNamespace }).oauth;

const OAuthConsent = () => {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Missing authorization_id in the request URL.");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/login?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error: detailsError } = await oauth().getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (detailsError) {
        setError(detailsError.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  const decide = async (approve: boolean) => {
    setBusy(true);
    const { data, error: decisionError } = approve
      ? await oauth().approveAuthorization(authorizationId)
      : await oauth().denyAuthorization(authorizationId);
    if (decisionError) {
      setBusy(false);
      setError(decisionError.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  };

  const clientName = details?.client?.name ?? "this application";

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            {error ? (
              <AlertTriangle className="h-6 w-6 text-destructive" />
            ) : (
              <ShieldCheck className="h-6 w-6 text-primary" />
            )}
            <CardTitle className="text-xl">
              {error ? "Authorization problem" : "Connect to Priveria"}
            </CardTitle>
          </div>
          <CardDescription>
            {error
              ? "This authorization request could not be completed."
              : details
                ? `${clientName} is requesting access to your Priveria account.`
                : "Loading authorization request…"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-sm text-muted-foreground">{error}</p>}

          {!error && details && (
            <>
              <div className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">
                Approving lets {clientName} read and create DPIA assessments, vendors, and risk
                summaries as you. Your existing permissions still apply — it can never see data you
                cannot see. You can revoke access at any time.
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" disabled={busy} onClick={() => decide(true)}>
                  {busy ? "Please wait…" : "Approve"}
                </Button>
                <Button
                  className="flex-1"
                  variant="outline"
                  disabled={busy}
                  onClick={() => decide(false)}
                >
                  Deny
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthConsent;
