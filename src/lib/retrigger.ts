/**
 * Re-trigger rules — turn a DPIA into a "living" object.
 *
 * A DPIA can declare which of its attributes, when they change, should send the
 * assessment back into review ("re-trigger the workflow"), plus an optional
 * time-based rule handled server-side (see the apply_time_retriggers() SQL
 * function / pg_cron scan). This module holds the pure, framework-free logic so
 * it is unit-testable and shared between the wizard UI and AssessmentsContext.
 *
 * The config lives under `assessment.details.retrigger` so no separate table is
 * needed; RLS on `assessments` already scopes it to the owner.
 */
import type { Assessment } from "@/contexts/AssessmentsContext";

export interface RetriggerConfig {
  /** When true, the server-side scan re-reviews the DPIA once `nextReview` passes. */
  timeBased?: boolean;
  /** Attribute keys (from RETRIGGER_ATTRIBUTES) whose change re-triggers review. */
  watch?: string[];
  /** Stamp of the most recent automatic re-trigger, for display/audit. */
  lastFired?: { at: string; reason: string };
}

type Scope = "top" | "details";

/** The attributes a DPIA can watch for change. `top` = Assessment field; `details` = details.* key. */
export const RETRIGGER_ATTRIBUTES: { key: string; label: string; scope: Scope }[] = [
  { key: "riskScore", label: "Overall risk score", scope: "top" },
  { key: "riskLevel", label: "Risk level", scope: "top" },
  { key: "tier", label: "Risk tier", scope: "top" },
  { key: "aiClassification", label: "EU AI Act classification", scope: "details" },
  { key: "autonomy", label: "Agent autonomy level", scope: "details" },
  { key: "dataCategories", label: "Data categories", scope: "details" },
  { key: "crossBorderTransfers", label: "Cross-border transfers", scope: "details" },
  { key: "vendorName", label: "Vendor", scope: "details" },
];

/** Read the re-trigger config off an assessment (never throws; returns {} if absent). */
export function getRetriggerConfig(assessment: Pick<Assessment, "details">): RetriggerConfig {
  const details = assessment.details as Record<string, unknown> | undefined;
  return (details?.retrigger as RetriggerConfig | undefined) ?? {};
}

/**
 * Decide whether a pending update should re-trigger review, given the current
 * assessment and the partial updates about to be applied. Only attributes the
 * DPIA is configured to `watch` are considered, and details.* keys are only
 * evaluated when the update actually carries a new `details` object.
 */
export function detectRetrigger(
  current: Assessment,
  updates: Partial<Assessment>
): { fired: boolean; reason: string } {
  const { watch = [] } = getRetriggerConfig(current);
  if (watch.length === 0) return { fired: false, reason: "" };

  const currentDetails = (current.details ?? {}) as Record<string, unknown>;
  const nextDetails = (updates.details ?? undefined) as Record<string, unknown> | undefined;
  const changed: string[] = [];

  for (const attr of RETRIGGER_ATTRIBUTES) {
    if (!watch.includes(attr.key)) continue;

    let before: unknown;
    let after: unknown;
    if (attr.scope === "top") {
      if (!(attr.key in updates)) continue;
      before = (current as unknown as Record<string, unknown>)[attr.key];
      after = (updates as Record<string, unknown>)[attr.key];
    } else {
      if (nextDetails === undefined) continue; // details not part of this update
      before = currentDetails[attr.key];
      after = nextDetails[attr.key];
    }
    if (JSON.stringify(before ?? null) !== JSON.stringify(after ?? null)) {
      changed.push(attr.label);
    }
  }

  if (changed.length === 0) return { fired: false, reason: "" };
  return { fired: true, reason: `Re-review required: ${changed.join(", ")} changed` };
}

/**
 * Produce the effective updates to persist. When a watched attribute changed,
 * force status back to "in-review" and stamp details.retrigger.lastFired so the
 * UI can show why. Returns the (possibly augmented) updates plus the reason.
 */
export function applyRetrigger(
  current: Assessment,
  updates: Partial<Assessment>,
  now: string
): { updates: Partial<Assessment>; fired: boolean; reason: string } {
  const { fired, reason } = detectRetrigger(current, updates);
  if (!fired) return { updates, fired, reason };

  const baseDetails = (updates.details ?? current.details ?? {}) as Record<string, unknown>;
  const existing = (baseDetails.retrigger as RetriggerConfig | undefined) ?? {};
  return {
    fired,
    reason,
    updates: {
      ...updates,
      status: "in-review",
      details: { ...baseDetails, retrigger: { ...existing, lastFired: { at: now, reason } } },
    },
  };
}
