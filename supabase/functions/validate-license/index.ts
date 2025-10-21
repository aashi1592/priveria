import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LicenseValidationRequest {
  licenseKey?: string;
  organizationId?: string;
}

interface LicenseValidationResponse {
  valid: boolean;
  tier: 'community' | 'enterprise';
  enabledFeatures: string[];
  expiresAt?: string;
  message?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          tier: 'community', 
          enabledFeatures: [],
          message: 'No authorization header'
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          tier: 'community', 
          enabledFeatures: [],
          message: 'Invalid authentication'
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const body: LicenseValidationRequest = await req.json();
    const { licenseKey, organizationId } = body;

    // If no license key provided, return community tier
    if (!licenseKey) {
      return new Response(
        JSON.stringify({ 
          valid: true, 
          tier: 'community', 
          enabledFeatures: []
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Query the enterprise_licenses table
    const { data: license, error: licenseError } = await supabase
      .from('enterprise_licenses')
      .select('*')
      .eq('license_key', licenseKey)
      .eq('organization_id', organizationId || user.id)
      .eq('is_active', true)
      .maybeSingle();

    if (licenseError) {
      console.error('License query error:', licenseError);
      return new Response(
        JSON.stringify({ 
          valid: false, 
          tier: 'community', 
          enabledFeatures: [],
          message: 'Error querying license'
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // No valid license found
    if (!license) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          tier: 'community', 
          enabledFeatures: [],
          message: 'No valid license found'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if license has expired
    if (license.valid_until && new Date(license.valid_until) < new Date()) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          tier: 'community', 
          enabledFeatures: [],
          message: 'License has expired'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Valid enterprise license
    const response: LicenseValidationResponse = {
      valid: true,
      tier: license.license_tier as 'community' | 'enterprise',
      enabledFeatures: license.enabled_features || [],
      expiresAt: license.valid_until || undefined,
    };

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('License validation error:', error);
    return new Response(
      JSON.stringify({ 
        valid: false, 
        tier: 'community', 
        enabledFeatures: [],
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
