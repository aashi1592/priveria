import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  MessageSquare, 
  Users, 
  Briefcase, 
  Code, 
  FileText, 
  ArrowRight, 
  Copy, 
  CheckCircle,
  Lightbulb,
  Target,
  Shield,
  AlertTriangle,
  Download,
  Presentation,
  FileDown
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

type Audience = "executive" | "product" | "engineering" | "legal" | "marketing";
type ConceptType = "dpia" | "rls" | "data-retention" | "consent" | "data-subject-rights" | "lawful-basis" | "cross-border-transfers" | "breach-notification" | "privacy-by-design";

interface TranslationTemplate {
  concept: string;
  technicalDescription: string;
  translations: Record<Audience, string>;
  keyPoints: string[];
  riskImplications: string;
}

const privacyConcepts: Record<ConceptType, TranslationTemplate> = {
  dpia: {
    concept: "Data Protection Impact Assessment (DPIA)",
    technicalDescription: "A systematic process to identify, assess, and mitigate privacy risks associated with data processing activities that are likely to result in high risk to individuals' rights and freedoms.",
    translations: {
      executive: "A DPIA is our risk management tool for protecting customer data. It helps us identify potential issues before they become expensive problems, ensuring we stay compliant and maintain customer trust.",
      product: "Before launching features that handle sensitive user data, we need to complete a DPIA. This assessment helps us design privacy-friendly features from the start, avoiding costly redesigns later.",
      engineering: "A DPIA documents how data flows through our systems and identifies security controls needed. It's required before implementing features involving personal data processing at scale.",
      legal: "A DPIA is a mandatory assessment under GDPR Article 35 for high-risk processing activities. It demonstrates accountability and documents our risk mitigation measures for regulatory compliance.",
      marketing: "A DPIA ensures our campaigns and data collection practices protect customer privacy. It helps us build trust by showing we take data protection seriously."
    },
    keyPoints: [
      "Required for high-risk data processing",
      "Must be completed before processing begins",
      "Documents risks and mitigation measures",
      "Demonstrates regulatory compliance"
    ],
    riskImplications: "Failure to conduct required DPIAs can result in regulatory fines up to €10M or 2% of global turnover, plus reputational damage."
  },
  rls: {
    concept: "Row-Level Security (RLS)",
    technicalDescription: "A database security feature that restricts data access at the row level based on user context, ensuring users can only access data they're authorized to see.",
    translations: {
      executive: "RLS is our data access control mechanism. It automatically ensures each customer only sees their own data, reducing breach risk and maintaining data segregation without manual oversight.",
      product: "RLS handles user data isolation automatically. When you query the database, it only returns data the current user is allowed to see—no extra code needed for basic access control.",
      engineering: "RLS policies are PostgreSQL rules that filter query results based on auth.uid(). They're enforced at the database level, providing defense-in-depth beyond application-layer checks.",
      legal: "RLS implements the principle of data minimization and access control required under GDPR Article 25 (Data Protection by Design). It provides auditable access restrictions.",
      marketing: "RLS ensures customer data privacy by keeping each user's information separate and secure, which strengthens our trust messaging and privacy commitments."
    },
    keyPoints: [
      "Automatic data isolation per user",
      "Enforced at database level",
      "Cannot be bypassed by application bugs",
      "Supports audit and compliance requirements"
    ],
    riskImplications: "Without RLS, a single application bug could expose all users' data. This represents both a compliance violation and severe reputational risk."
  },
  "data-retention": {
    concept: "Data Retention Policy",
    technicalDescription: "Defined rules specifying how long different categories of personal data should be stored and when they must be deleted or anonymized.",
    translations: {
      executive: "Our data retention policy defines how long we keep customer data. It balances business needs with legal requirements, reducing storage costs and liability exposure.",
      product: "Retention policies determine when user data gets deleted. Factor these into feature design—some data can't be kept indefinitely, and users may request deletion.",
      engineering: "Implement automated data lifecycle management: scheduled jobs for deletion, anonymization scripts, and archive processes aligned with retention schedules.",
      legal: "Retention policies fulfill GDPR Article 5(1)(e) storage limitation principle. They must be documented, justified, and consistently applied with demonstrable compliance.",
      marketing: "Clear retention policies show customers we don't hold their data longer than necessary. This supports transparency and can be a competitive differentiator."
    },
    keyPoints: [
      "Different data types have different retention periods",
      "Legal hold requirements may override standard retention",
      "Deletion must be verifiable and documented",
      "Anonymization is an alternative to deletion"
    ],
    riskImplications: "Keeping data longer than necessary increases breach impact and violates storage limitation principles, potentially triggering regulatory action."
  },
  consent: {
    concept: "Consent Management",
    technicalDescription: "The systematic collection, storage, and management of user consent for data processing activities, including tracking consent status and honoring withdrawals.",
    translations: {
      executive: "Consent management tracks user permissions for how we use their data. It's essential for marketing compliance and builds customer trust through transparency.",
      product: "Users must actively opt-in before we can use their data for optional purposes. Design clear consent flows and respect withdrawal requests immediately.",
      engineering: "Implement consent storage with timestamps, version tracking, and integration points for honoring consent state across all services processing personal data.",
      legal: "Consent under GDPR must be freely given, specific, informed, and unambiguous. We need evidence of consent for audit purposes and immediate withdrawal mechanisms.",
      marketing: "Proper consent management ensures our email lists and targeting are compliant. Using data without valid consent exposes us to complaints and regulatory scrutiny."
    },
    keyPoints: [
      "Consent must be freely given and specific",
      "Users can withdraw consent at any time",
      "Records must show when and how consent was given",
      "Different activities may require separate consents"
    ],
    riskImplications: "Processing without valid consent is a fundamental GDPR violation. Fines can reach €20M or 4% of global turnover for the most serious breaches."
  },
  "data-subject-rights": {
    concept: "Data Subject Rights",
    technicalDescription: "Rights granted to individuals under data protection laws, including access, rectification, erasure, portability, and objection to processing.",
    translations: {
      executive: "Data subject rights are legal entitlements customers have over their personal data. We must have processes to handle these requests within legal timeframes.",
      product: "Build self-service features for users to access, download, and delete their data. Manual processes don't scale and create compliance risk.",
      engineering: "Implement API endpoints for data export (JSON/CSV), account deletion workflows, and data rectification. Log all requests for audit purposes.",
      legal: "Articles 15-22 of GDPR define these rights. We have 30 days to respond to most requests. Document our procedures and train relevant staff.",
      marketing: "Respecting data subject rights demonstrates our commitment to privacy. Consider promoting our easy-to-use privacy controls as a trust signal."
    },
    keyPoints: [
      "30-day response deadline for most requests",
      "Right to access, correct, delete, and port data",
      "Must verify requester identity",
      "Some rights have exceptions (legal holds, etc.)"
    ],
    riskImplications: "Failing to respond to subject access requests within deadlines is a common regulatory complaint trigger and can escalate to formal enforcement."
  },
  "lawful-basis": {
    concept: "Lawful Basis for Processing",
    technicalDescription: "The legal grounds under which personal data processing is permitted, including consent, contract performance, legal obligation, vital interests, public task, and legitimate interests.",
    translations: {
      executive: "Lawful basis is our legal justification for using customer data. Every data use must have a documented legal basis before processing begins.",
      product: "Before collecting or using personal data, determine the legal basis. Contract performance and legitimate interests are common for core features; marketing often requires consent.",
      engineering: "Document lawful basis in data flow diagrams and privacy specs. Different bases have different requirements for data retention and user rights.",
      legal: "GDPR Article 6 requires one of six lawful bases. Legitimate interests requires a balancing test. Consent can be withdrawn. Contract is limited to necessary processing.",
      marketing: "Most marketing activities require consent as the lawful basis. Existing customer exemptions exist for similar products/services but with opt-out rights."
    },
    keyPoints: [
      "Must identify basis BEFORE processing",
      "Basis cannot be changed retrospectively",
      "Different bases grant different user rights",
      "Document rationale for legitimate interests"
    ],
    riskImplications: "Processing without valid lawful basis is unlawful processing. This is a serious violation that regulators actively investigate."
  },
  "cross-border-transfers": {
    concept: "Cross-Border Data Transfers",
    technicalDescription: "The movement of personal data from one jurisdiction to another, which under GDPR requires appropriate safeguards such as adequacy decisions, Standard Contractual Clauses (SCCs), or Binding Corporate Rules (BCRs).",
    translations: {
      executive: "Cross-border transfers govern how we move customer data between countries. Proper mechanisms protect us from regulatory action and maintain customer trust when using global services.",
      product: "When selecting third-party tools or cloud providers, consider where data will be stored. Transfers outside the EU/EEA require specific legal mechanisms to be in place.",
      engineering: "Document data flows to identify all cross-border transfers. Ensure infrastructure and vendor choices support transfer mechanisms (SCCs, adequacy). Consider data residency options.",
      legal: "GDPR Chapter V requires transfer safeguards. Post-Schrems II, we need Transfer Impact Assessments for SCCs. Adequacy decisions simplify transfers to approved countries.",
      marketing: "Using global marketing platforms means cross-border transfers. Ensure vendor contracts include proper transfer clauses so we can confidently communicate our data protection standards."
    },
    keyPoints: [
      "Transfers outside EU/EEA require legal basis",
      "Standard Contractual Clauses are most common mechanism",
      "Transfer Impact Assessments may be required",
      "Some countries have adequacy decisions (UK, Canada, Japan, etc.)"
    ],
    riskImplications: "Unlawful international transfers can result in enforcement action and orders to stop data flows, potentially disrupting business operations."
  },
  "breach-notification": {
    concept: "Data Breach Notification",
    technicalDescription: "The mandatory process of reporting personal data breaches to supervisory authorities within 72 hours and to affected individuals when the breach poses high risk to their rights and freedoms.",
    translations: {
      executive: "Breach notification is our legal obligation to report data breaches quickly. A well-prepared response plan protects reputation and demonstrates responsible data stewardship.",
      product: "Features should include monitoring and alerting for anomalous data access. Quick detection enables faster response and reduces breach impact.",
      engineering: "Implement logging, anomaly detection, and incident response procedures. Document data inventories so breach scope can be quickly assessed. Test response playbooks.",
      legal: "GDPR Article 33 requires authority notification within 72 hours for breaches likely to risk rights/freedoms. Article 34 requires individual notification for high-risk breaches.",
      marketing: "How we handle breaches affects brand trust. Transparent, timely communication following a breach can actually strengthen customer relationships."
    },
    keyPoints: [
      "72-hour notification deadline to authorities",
      "Not all breaches require notification (risk threshold)",
      "Affected individuals notified for high-risk breaches",
      "Documentation required even for non-notified breaches"
    ],
    riskImplications: "Failure to notify or late notification compounds breach penalties. Regulators view notification failures as aggravating factors in enforcement decisions."
  },
  "privacy-by-design": {
    concept: "Privacy by Design",
    technicalDescription: "An approach requiring privacy considerations to be embedded into the design and architecture of systems and business practices from the outset, rather than added as an afterthought.",
    translations: {
      executive: "Privacy by Design means building privacy into products from day one. It reduces costly retrofits, speeds up launches, and creates competitive advantage through customer trust.",
      product: "Consider privacy at the requirements stage, not after development. Default settings should be privacy-protective. Minimize data collection to what's actually needed.",
      engineering: "Implement data minimization, pseudonymization, and encryption by default. Design systems for easy consent management and data deletion. Document privacy decisions in specs.",
      legal: "GDPR Article 25 mandates Privacy by Design and by Default. This requires technical and organizational measures appropriate to processing risks at design time.",
      marketing: "Privacy by Design is a selling point. Customers increasingly choose products that respect their privacy—we can market our thoughtful approach to data protection."
    },
    keyPoints: [
      "Privacy considered at earliest design stages",
      "Data minimization: collect only what's needed",
      "Privacy-protective defaults (opt-in vs opt-out)",
      "Regular privacy reviews throughout development"
    ],
    riskImplications: "Retrofitting privacy is expensive and may be impossible. Products designed without privacy in mind may face market rejection or require costly redesigns."
  }
};

const audienceInfo: Record<Audience, { label: string; icon: typeof Users; description: string }> = {
  executive: { label: "Executive / Leadership", icon: Briefcase, description: "Business impact and strategic value" },
  product: { label: "Product Team", icon: Target, description: "Feature implications and user experience" },
  engineering: { label: "Engineering", icon: Code, description: "Technical implementation details" },
  legal: { label: "Legal / Compliance", icon: Shield, description: "Regulatory requirements and risks" },
  marketing: { label: "Marketing", icon: MessageSquare, description: "Customer messaging and trust" }
};

export default function TeamCommunication() {
  const [selectedConcept, setSelectedConcept] = useState<ConceptType>("dpia");
  const [selectedAudience, setSelectedAudience] = useState<Audience>("executive");
  const [customInput, setCustomInput] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const currentTemplate = privacyConcepts[selectedConcept];

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const exportToPDF = (exportAll: boolean = false) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let yPosition = 20;

    const addText = (text: string, fontSize: number, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      const lines = doc.splitTextToSize(text, maxWidth);
      
      if (yPosition + lines.length * (fontSize * 0.5) > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * (fontSize * 0.5) + 5;
    };

    // Title
    addText(currentTemplate.concept, 18, true);
    addText("Privacy Concept Translation Guide", 12);
    yPosition += 5;

    // Technical Definition
    addText("Technical Definition", 14, true);
    addText(currentTemplate.technicalDescription, 10);
    yPosition += 5;

    if (exportAll) {
      // All audiences
      Object.entries(audienceInfo).forEach(([key, info]) => {
        addText(`${info.label}`, 14, true);
        addText(info.description, 10);
        addText(currentTemplate.translations[key as Audience], 10);
        yPosition += 3;
      });
    } else {
      // Selected audience only
      const info = audienceInfo[selectedAudience];
      addText(`${info.label} Translation`, 14, true);
      addText(info.description, 10);
      addText(currentTemplate.translations[selectedAudience], 10);
    }

    yPosition += 5;

    // Key Points
    addText("Key Points", 14, true);
    currentTemplate.keyPoints.forEach((point) => {
      addText(`• ${point}`, 10);
    });

    yPosition += 5;

    // Risk Implications
    addText("Risk Implications", 14, true);
    addText(currentTemplate.riskImplications, 10);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, 285);

    const fileName = exportAll 
      ? `${currentTemplate.concept.replace(/[^a-zA-Z0-9]/g, "_")}_All_Audiences.pdf`
      : `${currentTemplate.concept.replace(/[^a-zA-Z0-9]/g, "_")}_${audienceInfo[selectedAudience].label.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
    
    doc.save(fileName);
    toast.success("PDF downloaded successfully");
  };

  const exportToSlides = () => {
    const slideContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${currentTemplate.concept} - Presentation</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #1a1a2e; color: #eee; }
    .slide { min-height: 100vh; padding: 60px; display: flex; flex-direction: column; justify-content: center; page-break-after: always; }
    .slide-title { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .slide-content { background: #16213e; }
    .slide-audience { background: #0f3460; }
    .slide-risk { background: #1a1a2e; border-left: 8px solid #e94560; }
    h1 { font-size: 3.5rem; margin-bottom: 1rem; }
    h2 { font-size: 2.5rem; margin-bottom: 1.5rem; color: #667eea; }
    h3 { font-size: 1.8rem; margin-bottom: 1rem; color: #94a3b8; }
    p { font-size: 1.4rem; line-height: 1.8; max-width: 900px; }
    ul { list-style: none; margin-top: 1rem; }
    li { font-size: 1.3rem; padding: 0.8rem 0; padding-left: 2rem; position: relative; }
    li::before { content: "→"; position: absolute; left: 0; color: #667eea; }
    .badge { display: inline-block; background: #667eea; padding: 0.5rem 1rem; border-radius: 20px; font-size: 1rem; margin-bottom: 1rem; }
    .footer { position: fixed; bottom: 20px; right: 40px; font-size: 0.9rem; color: #64748b; }
    @media print { .slide { page-break-after: always; } .footer { display: none; } }
  </style>
</head>
<body>
  <!-- Title Slide -->
  <div class="slide slide-title">
    <h1>${currentTemplate.concept}</h1>
    <p>Privacy Concept Translation Guide</p>
  </div>

  <!-- Technical Definition -->
  <div class="slide slide-content">
    <h2>Technical Definition</h2>
    <p>${currentTemplate.technicalDescription}</p>
  </div>

  ${Object.entries(audienceInfo).map(([key, info]) => `
  <!-- ${info.label} -->
  <div class="slide slide-audience">
    <span class="badge">${info.label}</span>
    <h2>How to Explain It</h2>
    <h3>${info.description}</h3>
    <p>${currentTemplate.translations[key as Audience]}</p>
  </div>
  `).join("")}

  <!-- Key Points -->
  <div class="slide slide-content">
    <h2>Key Points to Communicate</h2>
    <ul>
      ${currentTemplate.keyPoints.map(point => `<li>${point}</li>`).join("")}
    </ul>
  </div>

  <!-- Risk Implications -->
  <div class="slide slide-risk">
    <h2>⚠️ Risk Implications</h2>
    <p>${currentTemplate.riskImplications}</p>
  </div>

  <div class="footer">Press Ctrl+P to print as PDF slides</div>
</body>
</html>`;

    const blob = new Blob([slideContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentTemplate.concept.replace(/[^a-zA-Z0-9]/g, "_")}_Slides.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Slide deck downloaded - open in browser and print to PDF for presentation");
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Team Communication"
        description="Translate technical privacy concepts for different stakeholders"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => exportToPDF(false)} className="gap-2">
              <FileDown className="h-4 w-4" />
              PDF (Current Audience)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportToPDF(true)} className="gap-2">
              <FileText className="h-4 w-4" />
              PDF (All Audiences)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportToSlides} className="gap-2">
              <Presentation className="h-4 w-4" />
              Slide Deck (HTML)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </PageHeader>

      <div className="p-6 space-y-6">
        {/* Concept and Audience Selection */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Select Privacy Concept
              </CardTitle>
              <CardDescription>Choose a privacy concept to translate</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedConcept} onValueChange={(v) => setSelectedConcept(v as ConceptType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dpia">Data Protection Impact Assessment (DPIA)</SelectItem>
                  <SelectItem value="rls">Row-Level Security (RLS)</SelectItem>
                  <SelectItem value="data-retention">Data Retention Policy</SelectItem>
                  <SelectItem value="consent">Consent Management</SelectItem>
                  <SelectItem value="data-subject-rights">Data Subject Rights</SelectItem>
                  <SelectItem value="lawful-basis">Lawful Basis for Processing</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Target Audience
              </CardTitle>
              <CardDescription>Who are you communicating with?</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedAudience} onValueChange={(v) => setSelectedAudience(v as Audience)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(audienceInfo).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <info.icon className="h-4 w-4" />
                        {info.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Technical Definition */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{currentTemplate.concept}</CardTitle>
                <CardDescription>Technical Definition</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(currentTemplate.technicalDescription, "technical")}
              >
                {copiedField === "technical" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{currentTemplate.technicalDescription}</p>
          </CardContent>
        </Card>

        {/* Translation Tabs */}
        <Tabs value={selectedAudience} onValueChange={(v) => setSelectedAudience(v as Audience)}>
          <TabsList className="grid w-full grid-cols-5">
            {Object.entries(audienceInfo).map(([key, info]) => (
              <TabsTrigger key={key} value={key} className="flex items-center gap-1">
                <info.icon className="h-4 w-4" />
                <span className="hidden md:inline">{info.label.split(" ")[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(audienceInfo).map(([key, info]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <info.icon className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{info.label} Translation</CardTitle>
                        <CardDescription>{info.description}</CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(currentTemplate.translations[key as Audience], key)}
                    >
                      {copiedField === key ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-foreground leading-relaxed">
                      {currentTemplate.translations[key as Audience]}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Key Points and Risk */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Key Points to Communicate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {currentTemplate.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-1 text-primary shrink-0" />
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Risk Implications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{currentTemplate.riskImplications}</p>
            </CardContent>
          </Card>
        </div>

        {/* All Translations Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Reference - All Translations</CardTitle>
            <CardDescription>Compare how to explain "{currentTemplate.concept}" to different audiences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(audienceInfo).map(([key, info]) => (
                <div key={key} className="flex gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="shrink-0">
                    <Badge variant="outline" className="gap-1">
                      <info.icon className="h-3 w-3" />
                      {info.label.split(" ")[0]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{currentTemplate.translations[key as Audience]}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
