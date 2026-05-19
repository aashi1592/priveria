import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Users, MessageSquare, ShieldCheck, FileText, Lock, Unlock } from "lucide-react";
import { useAssessments } from "@/contexts/AssessmentsContext";
import { useReviewState, type ReviewerRole } from "@/hooks/useReviewState";
import { edpbRegulator } from "@/lib/exportTemplates/edpbRegulator";
import { toast } from "sonner";

const ROLES: ReviewerRole[] = ["Privacy", "Security", "Engineering", "Legal"];

const loadThreats = (id: string) => {
  try {
    return JSON.parse(localStorage.getItem(`priveria.threatRegister.${id}`) || "[]");
  } catch {
    return [];
  }
};

export const ReportReviewPanel = () => {
  const { assessments } = useAssessments();
  const [assessmentId, setAssessmentId] = useState(assessments[0]?.id ?? "");
  const assessment = assessments.find((a) => a.id === assessmentId);
  const threats = assessmentId ? loadThreats(assessmentId) : [];
  const { state, addSignoff, removeSignoff, addComment, approved, status } = useReviewState(assessmentId);

  const [reviewerName, setReviewerName] = useState("");
  const [role, setRole] = useState<ReviewerRole>("Privacy");
  const [commentSection, setCommentSection] = useState("Summary");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentText, setCommentText] = useState("");

  const statusVariant = status === "Approved" ? "default" : status === "In Review" ? "secondary" : "outline";
  const regulatorPreview = assessment ? edpbRegulator.render({ assessment, threats }) : "";

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Collaboration Checkpoint — Human-in-the-loop Review
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={statusVariant as never}>{status}</Badge>
            {approved ? (
              <Badge className="gap-1"><Unlock className="w-3 h-3" /> Policy-as-Code unlocked</Badge>
            ) : (
              <Badge variant="outline" className="gap-1"><Lock className="w-3 h-3" /> Policy-as-Code locked</Badge>
            )}
          </div>
        </div>
        <div className="pt-2 max-w-md">
          <Select value={assessmentId} onValueChange={setAssessmentId}>
            <SelectTrigger>
              <SelectValue placeholder="Assessment under review" />
            </SelectTrigger>
            <SelectContent>
              {assessments.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.id} — {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Holistic view */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4" /> Assessment summary
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              {assessment ? (
                <>
                  <div><span className="text-muted-foreground">Name:</span> {assessment.name}</div>
                  <div><span className="text-muted-foreground">Owner:</span> {assessment.owner}</div>
                  <div><span className="text-muted-foreground">Tier:</span> {assessment.tier} · {assessment.riskLevel} · {assessment.riskScore}</div>
                  <div><span className="text-muted-foreground">Status:</span> {assessment.status}</div>
                </>
              ) : <p className="text-muted-foreground">No assessment selected.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Threat register ({threats.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {threats.length === 0 ? (
                <p className="text-muted-foreground">No threats attached. Use Threat Modeling page to add.</p>
              ) : (
                <ul className="space-y-1 max-h-40 overflow-auto">
                  {threats.map((t: { lens: string; id: string; label: string }) => (
                    <li key={`${t.lens}-${t.id}`} className="flex gap-2">
                      <Badge variant="outline" className="text-xs">{t.lens}</Badge>
                      <span className="truncate">{t.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Regulator-view preview</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs whitespace-pre-wrap font-mono max-h-64 overflow-auto bg-muted/30 p-3 rounded-md border border-border">
                {regulatorPreview || "Select an assessment to preview."}
              </pre>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Sign-offs */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Reviewer sign-offs</h3>
          <p className="text-xs text-muted-foreground">
            Gate: requires <span className="font-medium text-foreground">Privacy</span> plus at least one of Security / Engineering / Legal.
          </p>
          <div className="flex flex-wrap items-end gap-2">
            <div className="space-y-1">
              <label className="text-xs">Role</label>
              <Select value={role} onValueChange={(v) => setRole(v as ReviewerRole)}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1 flex-1 min-w-[200px]">
              <label className="text-xs">Reviewer name</label>
              <Input value={reviewerName} onChange={(e) => setReviewerName(e.target.value)} placeholder="e.g. Sarah Chen" />
            </div>
            <Button
              onClick={() => {
                if (!reviewerName.trim()) { toast.error("Reviewer name required"); return; }
                addSignoff(role, reviewerName.trim());
                setReviewerName("");
                toast.success(`${role} sign-off recorded`);
              }}
              disabled={!assessmentId}
            >
              Sign off
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            {ROLES.map((r) => {
              const s = state.signoffs.find((x) => x.role === r);
              return (
                <div key={r} className={`rounded-md border p-3 ${s ? "border-primary bg-primary/5" : "border-border"}`}>
                  <div className="text-xs text-muted-foreground">{r}</div>
                  {s ? (
                    <>
                      <div className="font-medium text-sm">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{new Date(s.at).toLocaleString()}</div>
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-xs mt-1" onClick={() => removeSignoff(r)}>
                        Revoke
                      </Button>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">Pending</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Comments */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Inline comments</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <Select value={commentSection} onValueChange={setCommentSection}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Summary", "Threat register", "Controls", "Regulator view"].map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input value={commentAuthor} onChange={(e) => setCommentAuthor(e.target.value)} placeholder="Your name" />
            <Textarea
              className="md:col-span-2"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Comment..."
              rows={2}
            />
          </div>
          <Button
            size="sm"
            onClick={() => {
              if (!commentAuthor.trim() || !commentText.trim()) { toast.error("Name and comment required"); return; }
              addComment(commentSection, commentAuthor.trim(), commentText.trim());
              setCommentText("");
              toast.success("Comment added");
            }}
            disabled={!assessmentId}
          >
            Post comment
          </Button>
          <div className="space-y-2">
            {state.comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No comments yet.</p>
            ) : state.comments.map((c) => (
              <div key={c.id} className="border border-border rounded-md p-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">{c.section}</Badge>
                  <span className="font-medium text-foreground">{c.author}</span>
                  <span>{new Date(c.at).toLocaleString()}</span>
                </div>
                <p className="text-sm mt-1">{c.text}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {approved
              ? "All required sign-offs collected. You may proceed to Policy-as-Code."
              : "Policy-as-Code generation is gated until required sign-offs are recorded."}
          </p>
          <Button disabled={!approved} className="gap-2">
            {approved ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            Proceed to Policy-as-Code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
