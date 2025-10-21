# DPIA Platform - Architecture Overview

This document provides a comprehensive overview of the DPIA Platform's architecture, design decisions, and technical implementation.

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Layers](#architecture-layers)
- [Data Flow](#data-flow)
- [Security Architecture](#security-architecture)
- [Feature Flag System](#feature-flag-system)
- [Database Schema](#database-schema)
- [API Design](#api-design)
- [Technology Choices](#technology-choices)

---

## System Overview

The DPIA Platform is a full-stack web application built with modern technologies, designed for scalability, security, and maintainability.

### High-Level Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    Client Layer (Browser)                   │
│  React 18 + TypeScript + Tailwind CSS + shadcn/ui         │
└────────────────────────────────────────────────────────────┘
                            ↕ HTTPS
┌────────────────────────────────────────────────────────────┐
│              Application Layer (Frontend)                   │
│  • Feature Flag Manager                                    │
│  • State Management (React Context + TanStack Query)       │
│  • Authentication Flow                                      │
│  • Route Protection                                         │
└────────────────────────────────────────────────────────────┘
                            ↕ REST API
┌────────────────────────────────────────────────────────────┐
│            Backend Layer (Lovable Cloud / Supabase)        │
│  • PostgreSQL Database (RLS enabled)                       │
│  • Authentication Service                                   │
│  • Edge Functions (Serverless)                             │
│  • File Storage                                             │
└────────────────────────────────────────────────────────────┘
                            ↕ Integrations
┌────────────────────────────────────────────────────────────┐
│         External Services (Enterprise Only)                 │
│  • Lovable AI (AI capabilities)                            │
│  • OneTrust (GRC sync)                                      │
│  • ServiceNow (Ticketing)                                   │
└────────────────────────────────────────────────────────────┘
```

---

## Architecture Layers

### 1. Presentation Layer

**Technology**: React 18 with TypeScript

**Components**:
- **UI Components** (`src/components/ui/`)
  - Built with shadcn/ui library
  - Reusable, accessible, themeable
  - Following Radix UI primitives

- **Feature Components** (`src/components/dashboard/`, etc.)
  - Business logic components
  - Data fetching and mutations
  - State management

- **Page Components** (`src/pages/`)
  - Route-level components
  - Layout composition
  - SEO optimization

**State Management**:
- **Local State**: React useState/useReducer
- **Server State**: TanStack Query (React Query)
- **Global State**: React Context API
- **Form State**: React Hook Form + Zod

### 2. Application Layer

**Feature Flag System** (`src/config/features.ts`):

```typescript
export class FeatureManager {
  // Singleton pattern
  private static instance: FeatureManager;
  
  // Manages enterprise vs community features
  private enabledFeatures: Set<string>;
  
  // License validation
  setLicense(tier: FeatureTier, features: string[])
  
  // Runtime checks
  isFeatureEnabled(featureId: string): boolean
}
```

**Authentication Flow**:
1. User submits credentials
2. Supabase Auth validates
3. JWT token issued
4. Token stored in httpOnly cookie
5. Automatic refresh on expiry
6. RLS policies enforce access

### 3. Data Layer

**Backend**: Lovable Cloud (powered by Supabase)

**Core Services**:
- **PostgreSQL Database**: Structured data storage
- **Row Level Security (RLS)**: Data access control
- **Edge Functions**: Serverless compute
- **Storage Buckets**: File management
- **Realtime Subscriptions**: Live updates

---

## Data Flow

### Example: Creating a DPIA Assessment

```
┌──────────┐
│  User    │
└────┬─────┘
     │ 1. Fill form
     ↓
┌────────────────┐
│ DPIAWizard.tsx │
└────┬───────────┘
     │ 2. Submit
     ↓
┌──────────────────────┐
│ useAssessments hook  │
└────┬─────────────────┘
     │ 3. Validate data
     ↓
┌──────────────────┐
│ Supabase Client  │
└────┬─────────────┘
     │ 4. INSERT query
     ↓
┌──────────────────────┐
│ PostgreSQL Database  │
│ • RLS check          │
│ • Insert row         │
│ • Trigger functions  │
└────┬─────────────────┘
     │ 5. Return data
     ↓
┌──────────────────┐
│ React Query      │
│ • Update cache   │
│ • Invalidate     │
└────┬─────────────┘
     │ 6. Re-render
     ↓
┌────────────┐
│ Dashboard  │
│ (Updated)  │
└────────────┘
```

---

## Security Architecture

### 1. Authentication

**Method**: JWT-based authentication via Supabase Auth

```typescript
// User registration
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securePassword123',
  options: {
    emailRedirectTo: `${window.location.origin}/`,
  }
});

// Session management
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // User authenticated
  }
});
```

### 2. Row Level Security (RLS)

All database tables use RLS to enforce access control:

```sql
-- Example: Users can only see their own assessments
CREATE POLICY "Users can view their own assessments"
  ON public.assessments
  FOR SELECT
  USING (auth.uid() = user_id);
```

**Security Rules**:
- No direct table access without RLS
- `auth.uid()` used for user identification
- Separate policies for SELECT, INSERT, UPDATE, DELETE
- Security definer functions for role checks

### 3. Role-Based Access Control (RBAC)

```sql
-- User roles enum
CREATE TYPE app_role AS ENUM ('admin', 'moderator', 'user');

-- Security definer function (prevents RLS recursion)
CREATE FUNCTION has_role(_user_id uuid, _role app_role)
RETURNS BOOLEAN
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Usage in RLS policy
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (has_role(auth.uid(), 'admin'));
```

### 4. API Security

**Edge Functions**:
```typescript
// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Authentication check
const authHeader = req.headers.get('Authorization');
const { data: { user } } = await supabase.auth.getUser(token);
if (!user) {
  return new Response('Unauthorized', { status: 401 });
}
```

---

## Feature Flag System

### Architecture

The feature flag system controls access to community vs enterprise features without code duplication.

```typescript
// Feature definition
const FEATURE_DEFINITIONS = {
  CORE_DPIA: {
    id: 'CORE_DPIA',
    tier: 'community',
    enabled: true
  },
  AI_RISK_SCORING: {
    id: 'AI_RISK_SCORING',
    tier: 'enterprise',
    enabled: false // Requires license
  }
};

// Runtime check
if (featureManager.isFeatureEnabled('AI_RISK_SCORING')) {
  // Show AI features
} else {
  // Show upgrade prompt
}
```

### Component-Level Protection

```typescript
// HOC pattern
const AIRiskScoring = withEnterpriseFeature(
  AIRiskScoringComponent,
  'AI_RISK_SCORING'
);

// Component gate pattern
<FeatureGate featureId="AI_RISK_SCORING">
  <AIRiskScoringComponent />
</FeatureGate>
```

### License Validation Flow

```
User Login
    ↓
Frontend checks localStorage for license
    ↓
Call /functions/v1/validate-license
    ↓
Backend queries enterprise_licenses table
    ↓
Return: { tier: 'enterprise', enabledFeatures: [...] }
    ↓
FeatureManager.setLicense(tier, features)
    ↓
UI updates to show/hide features
```

---

## Database Schema

### Core Tables

#### `profiles`
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  first_name TEXT,
  last_name TEXT,
  organization_name TEXT DEFAULT 'Enterprise Organization',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### `user_roles`
```sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);
```

#### `assessments`
```sql
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  risk_level TEXT NOT NULL DEFAULT 'low',
  processing_type TEXT,
  processing_purpose TEXT,
  legal_basis TEXT,
  data_categories TEXT[],
  retention_period TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### `vendors`
```sql
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  risk_level TEXT NOT NULL DEFAULT 'low',
  compliance_status TEXT NOT NULL DEFAULT 'pending',
  data_processing TEXT,
  jurisdiction TEXT,
  certifications TEXT[],
  contact_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### `enterprise_licenses`
```sql
CREATE TABLE enterprise_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES auth.users(id),
  license_key TEXT NOT NULL UNIQUE,
  license_tier TEXT NOT NULL DEFAULT 'community',
  enabled_features JSONB NOT NULL DEFAULT '[]'::jsonb,
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Indexes

```sql
-- Performance optimization
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessments_risk_level ON assessments(risk_level);
CREATE INDEX idx_vendors_user_id ON vendors(user_id);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_enterprise_licenses_license_key ON enterprise_licenses(license_key);
```

---

## API Design

### REST Endpoints (via Supabase)

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/assessments` | GET | List assessments | Yes |
| `/assessments` | POST | Create assessment | Yes |
| `/assessments/:id` | GET | Get assessment | Yes |
| `/assessments/:id` | PATCH | Update assessment | Yes |
| `/assessments/:id` | DELETE | Delete assessment | Yes |
| `/vendors` | GET | List vendors | Yes |
| `/vendors` | POST | Create vendor | Yes |
| `/functions/v1/validate-license` | POST | Validate license | Yes |

### Edge Functions

**`validate-license`**:
- **Purpose**: Validate enterprise license keys
- **Input**: `{ licenseKey, organizationId }`
- **Output**: `{ valid, tier, enabledFeatures[] }`

---

## Technology Choices

### Frontend

| Technology | Reason |
|------------|--------|
| **React 18** | Component-based, large ecosystem, concurrent features |
| **TypeScript** | Type safety, better DX, fewer runtime errors |
| **Vite** | Fast HMR, modern build tool, ESM-first |
| **Tailwind CSS** | Utility-first, fast development, small bundle |
| **shadcn/ui** | Accessible, customizable, copy-paste components |
| **TanStack Query** | Powerful data fetching, caching, sync |
| **React Hook Form** | Performant forms, validation, minimal re-renders |
| **Zod** | Schema validation, TypeScript inference |

### Backend

| Technology | Reason |
|------------|--------|
| **Lovable Cloud** | Zero-config, auto-scaling, integrated |
| **PostgreSQL** | Robust, ACID compliant, JSON support |
| **Row Level Security** | Database-level authorization, secure by default |
| **Edge Functions** | Serverless, pay-per-use, near-instant scaling |

### Why Not...?

| Alternative | Why Not Chosen |
|-------------|----------------|
| **Next.js** | Lovable uses Vite + React Router for simplicity |
| **Redux** | React Query + Context sufficient for our needs |
| **MongoDB** | PostgreSQL better for relational data + RLS |
| **Firebase** | Lovable Cloud provides better integration |

---

## Design Patterns

### 1. Component Composition

```typescript
// Composable card component
<Card>
  <CardHeader>
    <CardTitle>Assessment</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### 2. Custom Hooks

```typescript
// Encapsulate logic in reusable hooks
export function useAssessments() {
  const query = useQuery(['assessments'], fetchAssessments);
  const create = useMutation(createAssessment);
  return { assessments: query.data, create };
}
```

### 3. Higher-Order Components

```typescript
// Add functionality to components
export const withAuth = (Component) => {
  return (props) => {
    const { user } = useAuth();
    if (!user) return <Redirect to="/login" />;
    return <Component {...props} />;
  };
};
```

---

## Performance Optimization

### 1. Code Splitting

```typescript
// Lazy load pages
const DPIAWizard = lazy(() => import('./pages/DPIAWizard'));
```

### 2. Memoization

```typescript
// Prevent unnecessary re-renders
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

### 3. Query Caching

```typescript
// TanStack Query caches API responses
const { data } = useQuery(['assessments'], fetchAssessments, {
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

---

## Future Architecture Considerations

- **Microservices**: Consider splitting into separate services as complexity grows
- **Event-Driven**: Implement event bus for real-time updates
- **GraphQL**: Evaluate GraphQL for more flexible API queries
- **WebSockets**: Real-time collaboration features
- **CDN**: Static asset distribution for global performance

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

---

**Questions?** Open a [GitHub Discussion](https://github.com/yourorg/dpia-platform/discussions)
