# Enterprise Data Privacy Feature Guide

This document describes the Enterprise Data Privacy (DPIA) platform features, how they work, and how to configure and test them in the mock/demo environment. It is meant to be distribution-ready for documentation in the repository and suitable for export to PDF/DOCX.

## Contents
- Overview
- Core DPIA Features
- LINDDUN Threat Modeling
- AI Intelligence
- Vendor Management & Recommendations
- Real-Time Compliance Monitoring
- Settings & Integrations
- Exporting & Reports
- Demo / Mockup Notes

## Overview
The platform provides a modular DPIA workflow, vendor management, threat modeling (LINDDUN), and AI-driven monitoring and recommendations. The UI includes fully interactive mock data for demonstration. Enterprise integrations (OneTrust, Jira, Transcend, TrustArc, AuditBoard) are configurable in Settings; backend syncs are implemented when integrations are enabled and infrastructure is provisioned.

## Core DPIA Features
- Multi-step DPIA wizard (create, review, approve)
- Risk scoring (manual and AI-assisted)
- Assessment lifecycle (draft, active, archived)
- Reporting (PDF/Word export, summary dashboards)
- Role-based access controls (admin, reviewer, contributor)

## LINDDUN Threat Modeling
- Supports all seven LINDDUN categories (Linkability, Identifiability, Non-repudiation, Detectability, Disclosure of information, Unawareness, Non-compliance)
- Optional step in wizard; enabling in Settings injects threat-modeling into DPIA flow
- Threat catalog with example mitigations

## AI Intelligence
- AI Vendor Recommendations: matches processing activities to vendors in the local vendor database (includes vendors synced from OneTrust when enabled)
- AI Risk Scoring: optional enterprise feature providing automated risk scores and rationale
- Natural language explanations for recommended actions and alerts

## Vendor Management & Recommendations
- Vendor profiles capture name, description, certifications, locations, risk scores, DPAs, sub-processors
- Recommendations use configurable weights (certifications, geography, capabilities, cost)
- Integration with OneTrust supports bidirectional sync (when enabled and backend is implemented)

## Real-Time Compliance Monitoring (Detailed)
Purpose: continuously detect compliance gaps and alert stakeholders.

What it monitors:
- DPIA lifecycle compliance (expiries, approvals, incomplete drafts)
- Vendor compliance (certification expiries, DPA renewals, sub-processor changes)
- Regulatory changes and impact analysis
- Data processing anomalies (purpose drift, retention violations, cross-border transfers)

How it works:
- Configurable scan frequency (real-time/15m, hourly, daily)
- AI-powered analysis for anomaly detection and predictive forecasting
- Multi-level alerts: Critical / High / Medium / Low
- Auto-generated remediation tasks (Jira/ServiceNow) and notifications (email/Slack)

Example alerts and remediation steps are included in the platform mock data and Feature Guide.

## Settings & Integrations
- Feature flags for enterprise modules (LINDDUN, AI scoring, OneTrust sync, etc.)
- API connector configuration for OneTrust, Jira, Transcend, TrustArc, AuditBoard
- Test Connection buttons and mock responses in demo

## Exporting & Reports
- Feature Guide, DPIA reports, and executive summaries can be exported to PDF or DOCX
- Mock export implemented in frontend demo; production export uses server-side generation when backend is enabled

## Demo / Mockup Notes
- All interactive mock features update mock data in real-time within the demo
- Settings persist across navigation in the demo environment
- For production functionality, enable Lovable Cloud (Supabase) and backend services as described in ENTERPRISE_CAPABILITIES.md