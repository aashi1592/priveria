import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, HelpCircle, Github, ExternalLink, BookOpen, Mail, Heart, Sparkles, Users, Shield } from "lucide-react";

const slackInviteUrl = "https://decodedbycounsel.slack.com/archives/C0B615QH2Q0";
const githubUrl = "https://github.com/priveria/priveria";
const docsUrl = "https://docs.priveria.dev";
const emailSupport = "support@priveria.dev";

const supportChannels = [
  {
    title: "Community Slack",
    description:
      "Join our public Slack workspace to ask questions, share feedback, and connect with other privacy practitioners and contributors.",
    icon: MessageCircle,
    action: {
      label: "Join Slack Channel",
      href: slackInviteUrl,
      variant: "default" as const,
    },
    badge: "Most Active",
    details: ["Real-time help from maintainers", "Feature roadmap discussions", "Community threat-modeling sessions"],
  },
  {
    title: "GitHub Discussions",
    description:
      "Browse existing questions, report bugs, request features, and follow the open-source roadmap.",
    icon: Github,
    action: {
      label: "Open GitHub",
      href: githubUrl,
      variant: "outline" as const,
    },
    details: ["Issue tracking & bug reports", "Feature requests & RFCs", "Release notes & changelogs"],
  },
  {
    title: "Documentation",
    description:
      "Comprehensive guides for DPIA workflows, threat modeling, AI module configuration, and API integrations.",
    icon: BookOpen,
    action: {
      label: "Read Docs",
      href: docsUrl,
      variant: "outline" as const,
    },
    details: ["Step-by-step wizard guides", "STRIDE / LINDDUN / MAESTRO how-tos", "Edge function deployment guides"],
  },
  {
    title: "Email Support",
    description:
      "For enterprise, security-sensitive, or private inquiries that should not be shared in public channels.",
    icon: Mail,
    action: {
      label: "Email Us",
      href: `mailto:${emailSupport}`,
      variant: "outline" as const,
    },
    details: ["SLA-backed for enterprise tiers", "Security vulnerability reports", "Custom integration consulting"],
  },
];

const faqs = [
  {
    question: "Who can join the Slack community?",
    answer:
      "Anyone interested in privacy engineering, DPIAs, or AI governance. Practitioners, DPOs, security engineers, and contributors are all welcome.",
  },
  {
    question: "Is there a code of conduct?",
    answer:
      "Yes. We follow the Contributor Covenant. Be respectful, inclusive, and constructive. Harassment or discrimination of any kind is not tolerated.",
  },
  {
    question: "Can I get commercial support?",
    answer:
      "Enterprise support with SLA, custom deployments, and private training is available. Reach out via email or the Slack #enterprise channel.",
  },
  {
    question: "How do I report a security issue?",
    answer:
      "Please do not open public issues for security vulnerabilities. Email security@priveria.dev or DM a maintainer in Slack privately.",
  },
];

const Community = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Community & Support"
        description="Connect with privacy practitioners, get help, and contribute to Priveria."
        action={{
          label: "Join Slack",
          onClick: () => window.open(slackInviteUrl, "_blank"),
          icon: <MessageCircle className="w-4 h-4" />,
        }}
      />

      <div className="px-6 py-8 max-w-6xl mx-auto space-y-8">
        {/* Hero CTA */}
        <Card className="relative overflow-hidden border-border/60">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          <CardContent className="py-10 px-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="flex-1 text-center md:text-left space-y-3">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <h2 className="text-2xl font-bold">Priveria Community</h2>
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20">
                    <span className="relative flex h-2 w-2 mr-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    Online now
                  </Badge>
                </div>
                <p className="text-muted-foreground max-w-xl">
                  Join privacy engineers, DPOs, and security researchers collaborating on
                  threat-informed DPIAs and AI governance. Ask questions, share use cases, and
                  shape the roadmap.
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                  <Button onClick={() => window.open(slackInviteUrl, "_blank")} className="gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Join Slack Channel
                  </Button>
                  <Button variant="outline" onClick={() => window.open(githubUrl, "_blank")} className="gap-2">
                    <Github className="w-4 h-4" />
                    Star on GitHub
                  </Button>
                </div>
              </div>
              <div className="hidden lg:flex flex-col items-end gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Privacy-first discussions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Weekly community calls</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary" />
                  <span>Open-source & free forever</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support channels grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {supportChannels.map((channel) => {
            const Icon = channel.icon;
            return (
              <Card
                key={channel.title}
                className="group border-border/60 hover:border-primary/40 hover:shadow-lg transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{channel.title}</CardTitle>
                      </div>
                    </div>
                    {channel.badge && (
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {channel.badge}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{channel.description}</p>
                  <ul className="space-y-1.5">
                    {channel.details.map((d) => (
                      <li key={d} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={channel.action.variant}
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => window.open(channel.action.href, "_blank")}
                  >
                    {channel.action.label}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ */}
        <Card className="border-border/60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              <CardTitle>Frequently Asked Questions</CardTitle>
            </div>
            <CardDescription>Common questions about community participation and support.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="p-4 rounded-lg bg-muted/50 border border-border/40 space-y-1.5"
              >
                <h4 className="text-sm font-semibold">{faq.question}</h4>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Community;
