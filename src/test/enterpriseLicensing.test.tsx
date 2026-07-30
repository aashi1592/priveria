import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import type { LicenseValidationResult } from "@/lib/licenseService";

// Mock the license service so tests control what the "server" authorizes.
const validateLicenseMock = vi.fn<() => Promise<LicenseValidationResult>>();
vi.mock("@/lib/licenseService", () => ({
  validateLicense: () => validateLicenseMock(),
}));

import {
  EnterpriseConfigProvider,
  useEnterpriseConfig,
} from "@/contexts/EnterpriseConfigContext";

/** Test harness that surfaces context state and lets a test drive updateConfig. */
function Harness() {
  const { config, updateConfig, enterpriseLicensed } = useEnterpriseConfig();
  return (
    <div>
      <span data-testid="licensed">{String(enterpriseLicensed)}</span>
      <span data-testid="linddun">{String(config.linddunEnabled)}</span>
      <span data-testid="orgName">{config.organizationName}</span>
      <button onClick={() => updateConfig({ linddunEnabled: true, organizationName: "Acme" })}>
        enable
      </button>
    </div>
  );
}

function renderHarness() {
  return render(
    <EnterpriseConfigProvider>
      <Harness />
    </EnterpriseConfigProvider>
  );
}

describe("EnterpriseConfig license enforcement", () => {
  beforeEach(() => {
    validateLicenseMock.mockReset();
  });

  it("keeps enterprise flags locked when the server returns community tier", async () => {
    validateLicenseMock.mockResolvedValue({ valid: true, tier: "community", enabledFeatures: [] });
    renderHarness();

    await waitFor(() => expect(screen.getByTestId("licensed").textContent).toBe("false"));

    // Attempt to enable an enterprise flag; it must be dropped, but the
    // non-enterprise field (organizationName) must still be applied.
    act(() => {
      screen.getByText("enable").click();
    });

    expect(screen.getByTestId("linddun").textContent).toBe("false");
    expect(screen.getByTestId("orgName").textContent).toBe("Acme");
  });

  it("allows enterprise flags once the server validates an enterprise license", async () => {
    validateLicenseMock.mockResolvedValue({
      valid: true,
      tier: "enterprise",
      enabledFeatures: ["LINDDUN_THREAT_MODELING"],
    });
    renderHarness();

    await waitFor(() => expect(screen.getByTestId("licensed").textContent).toBe("true"));

    act(() => {
      screen.getByText("enable").click();
    });

    expect(screen.getByTestId("linddun").textContent).toBe("true");
  });
});
