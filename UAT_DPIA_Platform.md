# User Acceptance Tests (UAT) - DPIA Platform
## Document Information

| Field | Details |
|-------|---------|
| **Document Title** | User Acceptance Tests - DPIA Platform |
| **Document ID** | UAT-DPIA-001 |
| **Version** | 2.0 |
| **Test Date** | [Date] |
| **Test Environment** | [Environment] |

---

## Test Execution Summary

| Test Suite | Total Tests | Pass | Fail | Blocked | Not Tested |
|------------|-------------|------|------|---------|------------|
| Core DPIA Workflow | TBD | | | | |
| Vendor Management | TBD | | | | |
| AI Intelligence | TBD | | | | |
| Cloud Infrastructure | TBD | | | | |
| Human-in-the-Loop | TBD | | | | |
| Change Management | TBD | | | | |
| Reporting & Analytics | TBD | | | | |

---

## 1. Core DPIA Workflow Tests

### UAT-001: DPIA Initiation & Screening
**Objective:** Verify DPIA screening questionnaire correctly identifies when full DPIA is required

**Prerequisites:**
- User logged in with appropriate permissions
- Access to DPIA creation wizard

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 1.1 | Navigate to "New Assessment" | DPIA screening wizard opens | | |
| 1.2 | Select Category "CAT-01: AI/ML Processing" | Category selected, risk indicators shown | | |
| 1.3 | Answer "Yes" to automated decision-making | System flags as requiring full DPIA | | |
| 1.4 | Complete screening questions | Risk score calculated automatically | | |
| 1.5 | View DPIA recommendation | System recommends full DPIA with justification | | |
| 1.6 | Click "Proceed to Full DPIA" | Full DPIA wizard opens with pre-filled data | | |

**Acceptance Criteria:**
- ✅ Screening correctly identifies DPIA triggers per GDPR Art. 35(3)
- ✅ Risk score calculation is accurate and transparent
- ✅ Data carries forward from screening to full DPIA
- ✅ User can save draft at any point

---

### UAT-002: 18 Category Classification
**Objective:** Verify all 18 DPIA categories are available and properly configured

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 2.1 | Open category selection dropdown | All 18 categories listed | | |
| 2.2 | Select "CAT-02: Biometric Data Processing" | Category-specific questions appear | | |
| 2.3 | Verify primary risk domain shown | "Special category data" displayed | | |
| 2.4 | Check regulatory triggers | Shows "GDPR Art. 9, CPRA §1798.140(v)" | | |
| 2.5 | Select "CAT-06: Employee Monitoring" | Different questions appear | | |
| 2.6 | Verify category-specific controls | ISO 27701 controls shown | | |

**Acceptance Criteria:**
- ✅ All 18 categories present and selectable
- ✅ Each category has unique risk profile
- ✅ Regulatory references are accurate
- ✅ Category-specific questions load correctly

---

### UAT-003: Multi-Step Wizard Completion
**Objective:** Verify complete DPIA can be created through all wizard steps

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 3.1 | Complete Step 1: Basic Information | Data saved, progress indicator shows 20% | | |
| 3.2 | Complete Step 2: Data Processing Details | Legal basis validation works | | |
| 3.3 | Complete Step 3: Risk Assessment | Risk matrix calculates automatically | | |
| 3.4 | Complete Step 4: AI/ML Assessment | Conditional - only if AI involved | | |
| 3.5 | Complete Step 5: Mitigation Measures | Control catalog loads | | |
| 3.6 | Click "Submit Assessment" | Confirmation dialog appears | | |
| 3.7 | Confirm submission | DPIA created with status "Pending Review" | | |

**Acceptance Criteria:**
- ✅ Can navigate forward and backward through steps
- ✅ Data persists between steps
- ✅ Validation prevents incomplete submission
- ✅ Draft auto-saves every 60 seconds
- ✅ DPIA receives unique ID (format: DPIA-YYYY-NNNN)

---

### UAT-004: AI/ML Specific Assessment
**Objective:** Verify AI-specific fields appear only when AI/ML is involved

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 4.1 | Start new DPIA, select non-AI category | Step 4 (AI Assessment) is hidden | | |
| 4.2 | Go back, change to "CAT-01: AI/ML" | Step 4 now appears in wizard | | |
| 4.3 | In Step 4, select EU AI Act Classification | Dropdown shows: Unacceptable/High/Limited/Minimal | | |
| 4.4 | Select "High Risk" | ISO 42001 requirements section expands | | |
| 4.5 | Fill in Training Data Provenance | Character limit 2000, markdown supported | | |
| 4.6 | Complete Bias & Fairness Analysis | Required field validation triggers | | |
| 4.7 | Submit DPIA | System flags for additional AI review | | |

**Acceptance Criteria:**
- ✅ AI step conditionally shown based on category/answers
- ✅ EU AI Act risk levels accurately defined
- ✅ ISO 42001 requirements auto-populate
- ✅ All AI fields have proper validation
- ✅ High-risk AI triggers additional approval workflow

---

## 2. Vendor Management Tests

### UAT-005: Vendor Profile Creation
**Objective:** Verify comprehensive vendor profiles can be created with full tech stack

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 5.1 | Navigate to "Third-Party" page | Vendor list loads | | |
| 5.2 | Click "Add Vendor" | Vendor creation form opens | | |
| 5.3 | Enter vendor basic info | Name, type, jurisdiction fields | | |
| 5.4 | Add cloud infrastructure | Can add AWS, Azure, GCP resources | | |
| 5.5 | Add database systems | Can specify DB type, encryption, data classification | | |
| 5.6 | Add authentication systems | Can document SSO, MFA, API auth methods | | |
| 5.7 | Upload vendor documents | Accepts PDF, DOCX, supports DPA, security certs | | |
| 5.8 | Save vendor profile | Profile created with unique vendor ID | | |

**Acceptance Criteria:**
- ✅ All vendor fields editable and validated
- ✅ Cloud infrastructure supports multi-cloud
- ✅ Database inventory tracks encryption status
- ✅ Auth systems documented with protocols
- ✅ Document upload with version control

---

### UAT-006: Vendor-DPIA Linking with Context
**Objective:** Verify vendors can be linked to DPIAs with detailed usage context

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 6.1 | Open existing DPIA | DPIA details page loads | | |
| 6.2 | Click "Link Vendor" button | Vendor selection dialog opens | | |
| 6.3 | Search for vendor "AWS" | Search results filter correctly | | |
| 6.4 | Select AWS, click "Link" | Context form appears | | |
| 6.5 | Enter usage context | Rich text editor with 500 char minimum | | |
| 6.6 | Select data flow direction | Options: Inbound/Outbound/Bidirectional | | |
| 6.7 | Specify AWS services used | Can tag: EC2, S3, RDS, Lambda, etc. | | |
| 6.8 | Add data categories processed | Checkboxes for personal/sensitive/financial | | |
| 6.9 | Save vendor linkage | Link created with full context | | |
| 6.10 | View DPIA vendor list | AWS shown with context summary | | |

**Acceptance Criteria:**
- ✅ Vendor search works with autocomplete
- ✅ Context fields capture sufficient detail
- ✅ Data flow direction tracked accurately
- ✅ Service-level detail captured
- ✅ Can link multiple vendors to one DPIA
- ✅ Can see all DPIAs using a vendor from vendor page

---

### UAT-007: Vendor Risk Assessment
**Objective:** Verify vendor risk scoring integrates with DPIA risk

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 7.1 | Open vendor profile with compliance score | Score visible (e.g., 87%) | | |
| 7.2 | View risk indicators | Shows: SOC 2, ISO 27001, GDPR certification | | |
| 7.3 | Check last assessment date | Date shown, with days since last review | | |
| 7.4 | Click "Assess Risk" | Risk assessment questionnaire opens | | |
| 7.5 | Complete security controls check | 25 controls assessed | | |
| 7.6 | Review auto-calculated risk score | Score: 0-100, with color coding | | |
| 7.7 | View risk level | Shows: Critical/High/Medium/Low | | |
| 7.8 | Check DPIA impact | Linked DPIAs flagged if vendor risk increases | | |

**Acceptance Criteria:**
- ✅ Risk scoring algorithm transparent
- ✅ Vendor risk propagates to linked DPIAs
- ✅ Compliance certifications tracked with expiry
- ✅ Risk thresholds trigger notifications
- ✅ Historical risk scores tracked

---

### UAT-008: Sub-Processor Management
**Objective:** Verify sub-processor relationships and consent tracking

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 8.1 | Open primary processor vendor (e.g., Salesforce) | Vendor profile loads | | |
| 8.2 | Navigate to "Sub-Processors" tab | Tab visible and clickable | | |
| 8.3 | Click "Add Sub-Processor" | Dialog opens with sub-processor form | | |
| 8.4 | Search and select sub-processor | Can select existing vendor or create new | | |
| 8.5 | Specify sub-processor purpose | Text field with description | | |
| 8.6 | Set consent requirement | Checkbox: "Prior consent required" | | |
| 8.7 | Upload sub-processor agreement | File upload with metadata | | |
| 8.8 | Save sub-processor link | Relationship created | | |
| 8.9 | View hierarchy visualization | Tree view shows processor > sub-processor | | |

**Acceptance Criteria:**
- ✅ Multi-level sub-processor chains supported
- ✅ Consent tracking with date stamps
- ✅ Visual hierarchy diagram
- ✅ Sub-processor changes trigger notifications
- ✅ Can see all DPIAs affected by sub-processor

---

## 3. AI Intelligence Features Tests

### UAT-009: AI-Powered Risk Scoring
**Objective:** Verify AI automatically scores DPIA risk with human approval

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 9.1 | Complete DPIA risk section manually | Manual scores entered | | |
| 9.2 | Click "AI Risk Analysis" button | AI analysis modal opens | | |
| 9.3 | Review AI-suggested risk scores | AI provides likelihood/impact scores with reasoning | | |
| 9.4 | Compare AI vs. manual scores | Variance highlighted with explanation | | |
| 9.5 | Accept AI recommendation | Click "Apply AI Scores" | | |
| 9.6 | Verify approval required | Status: "Pending Risk Approval" | | |
| 9.7 | DPO reviews and approves | Risk scores confirmed | | |
| 9.8 | Check audit trail | AI recommendation and human decision logged | | |

**Acceptance Criteria:**
- ✅ AI provides transparent reasoning
- ✅ Human can override AI recommendation
- ✅ Approval workflow enforced
- ✅ Audit trail captures both AI and human decisions
- ✅ AI learns from human corrections (if ML enabled)

---

### UAT-010: Intelligent Vendor Recommendations
**Objective:** Verify AI recommends optimal vendors for processing activities

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 10.1 | In DPIA wizard, describe processing activity | Enter: "Customer email marketing automation" | | |
| 10.2 | Click "Suggest Vendors" | AI analyzes description | | |
| 10.3 | View vendor recommendations | List shows 3-5 vendors with match scores | | |
| 10.4 | Review recommendation reasoning | Shows: certifications, risk score, past usage | | |
| 10.5 | Click on recommended vendor | Vendor profile opens in sidebar | | |
| 10.6 | Compare vendors | Side-by-side comparison view | | |
| 10.7 | Select vendor with "Not in list" | Can request new vendor | | |
| 10.8 | Check human approval requirement | Vendor selection requires DPO approval | | |

**Acceptance Criteria:**
- ✅ Recommendations contextually relevant
- ✅ Match scores explained clearly
- ✅ Can compare multiple vendors
- ✅ Request new vendor workflow exists
- ✅ All AI recommendations require human approval

---

### UAT-011: Document Analysis & Extraction
**Objective:** Verify AI extracts structured data from vendor documents

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 11.1 | Upload DPA (PDF) to vendor profile | File uploads successfully | | |
| 11.2 | Click "Analyze with AI" | AI processing begins | | |
| 11.3 | Wait for analysis completion | Progress indicator shown, completes in <30s | | |
| 11.4 | Review extracted data | Shows: retention periods, security measures, liability | | |
| 11.5 | Verify confidence scores | Each extraction has confidence % | | |
| 11.6 | Flag low-confidence extraction | User marks extraction as incorrect | | |
| 11.7 | Manually correct extraction | Edit extracted data | | |
| 11.8 | Submit for human review | DPO receives notification | | |
| 11.9 | DPO approves extractions | Data populated into vendor profile | | |

**Acceptance Criteria:**
- ✅ Supports PDF, DOCX, scanned images (OCR)
- ✅ Extraction accuracy >90% for standard DPA clauses
- ✅ Confidence scores accurate
- ✅ Human review workflow mandatory
- ✅ Extractions link back to source document

---

### UAT-012: AI Data Flow Diagram Generation
**Objective:** Verify AI generates data flow diagrams from descriptions

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 12.1 | In DPIA, enter processing description | Text: "Users submit forms, data stored in AWS S3, processed by Lambda, sent to Salesforce" | | |
| 12.2 | Click "Generate Data Flow" | AI processes description | | |
| 12.3 | Review generated diagram | Visual flowchart with nodes and connections | | |
| 12.4 | Verify components identified | Shows: User, Form, S3, Lambda, Salesforce | | |
| 12.5 | Check data flow arrows | Directional arrows with data labels | | |
| 12.6 | Edit diagram manually | Can drag nodes, add/remove connections | | |
| 12.7 | Apply risk color coding | High-risk nodes highlighted in red/orange | | |
| 12.8 | Export diagram | Download as PNG, PDF, or SVG | | |
| 12.9 | Save to DPIA | Diagram attached to assessment | | |

**Acceptance Criteria:**
- ✅ Accurate component extraction from text
- ✅ Logical data flow representation
- ✅ Risk visualization overlay
- ✅ Manual editing supported
- ✅ Multiple export formats
- ✅ Version control for diagram updates

---

### UAT-013: Natural Language Query Interface
**Objective:** Verify AI answers privacy questions in natural language

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 13.1 | Open "AI Assistant" panel | Chat interface appears | | |
| 13.2 | Ask: "How many high-risk DPIAs do we have?" | AI responds with count and list | | |
| 13.3 | Ask: "Which vendors process biometric data?" | AI lists vendors with CAT-02 linkages | | |
| 13.4 | Ask: "Show DPIAs pending review over 30 days" | AI generates filtered list with dates | | |
| 13.5 | Ask: "What's our compliance rate for CAT-01?" | AI calculates and explains metric | | |
| 13.6 | Click on reference link in AI response | Navigates to referenced DPIA | | |
| 13.7 | Export conversation | Download as PDF with citations | | |

**Acceptance Criteria:**
- ✅ Understands domain-specific terminology
- ✅ Provides accurate data from live database
- ✅ Includes citations and links
- ✅ Handles follow-up questions
- ✅ Privacy-safe (no unauthorized data disclosure)

---

## 4. Cloud Infrastructure & Database Tests

### UAT-014: Cloud Asset Discovery
**Objective:** Verify automatic discovery of AWS/Azure/GCP resources

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 14.1 | Navigate to Settings > Cloud Integration | Integration page loads | | |
| 14.2 | Click "Connect AWS Account" | OAuth/IAM role setup wizard | | |
| 14.3 | Enter AWS credentials | Validates and connects | | |
| 14.4 | Click "Discover Resources" | Scan begins across regions | | |
| 14.5 | Wait for discovery completion | Progress bar, completes in <2 minutes | | |
| 14.6 | Review discovered resources | Lists: EC2, RDS, S3, Lambda, etc. | | |
| 14.7 | Check resource metadata | Shows: region, tags, encryption status | | |
| 14.8 | Link resource to DPIA | Select resource, choose DPIA from dropdown | | |
| 14.9 | Verify auto-sync | Resource changes sync daily | | |

**Acceptance Criteria:**
- ✅ Supports AWS, Azure, GCP
- ✅ Multi-account/subscription support
- ✅ Discovers all relevant resource types
- ✅ Captures metadata (tags, encryption, region)
- ✅ Auto-sync with configurable frequency
- ✅ Detects configuration drift

---

### UAT-015: Database Inventory Management
**Objective:** Verify comprehensive database tracking with schema details

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 15.1 | Navigate to "Database Inventory" | List of databases loads | | |
| 15.2 | Click "Add Database" | Database creation form | | |
| 15.3 | Enter database details | Name, type (Postgres/MySQL/etc), host | | |
| 15.4 | Specify data classification | Dropdown: Public/Internal/Confidential/Restricted | | |
| 15.5 | Document encryption status | Checkboxes: At-rest, In-transit, Field-level | | |
| 15.6 | Add table schemas | Can import from DB or enter manually | | |
| 15.7 | Tag personal data fields | Mark fields as PII/Special category | | |
| 15.8 | Link database to DPIAs | Multi-select DPIAs | | |
| 15.9 | Set retention policies | Enter retention period per data type | | |

**Acceptance Criteria:**
- ✅ Supports all major database types
- ✅ Schema import via connection string
- ✅ Field-level data classification
- ✅ Encryption status tracked
- ✅ Links to multiple DPIAs
- ✅ Retention policies enforced

---

### UAT-016: Authentication Systems Inventory
**Objective:** Verify documentation of all auth systems and methods

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 16.1 | Navigate to "Authentication Systems" | Auth systems list | | |
| 16.2 | Click "Add Auth System" | Form opens | | |
| 16.3 | Select system type | Options: SSO, SAML, OAuth, JWT, API Key, MFA | | |
| 16.4 | Document SSO provider | Enter: Okta, Auth0, Azure AD, etc. | | |
| 16.5 | Specify MFA methods | Checkboxes: SMS, Authenticator, Biometric | | |
| 16.6 | Add API authentication | Document: API keys, tokens, certificates | | |
| 16.7 | Link to applications | Multi-select which apps use this auth | | |
| 16.8 | Set password policies | Min length, complexity, rotation period | | |
| 16.9 | Link to DPIAs | Select relevant DPIAs | | |

**Acceptance Criteria:**
- ✅ All common auth types supported
- ✅ Multi-factor methods documented
- ✅ API authentication tracked
- ✅ Links to applications and DPIAs
- ✅ Password policies configurable
- ✅ Compliance checks (NIST, OWASP)

---

## 5. Human-in-the-Loop Control Tests

### UAT-017: Approval Workflow - Risk Scores
**Objective:** Verify all AI risk scores require human approval

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 17.1 | AI generates risk score for DPIA | Score calculated, status: "Pending Approval" | | |
| 17.2 | DPO receives notification | Email/in-app notification sent | | |
| 17.3 | DPO opens approval queue | Sees DPIA in pending list | | |
| 17.4 | Review AI reasoning | Can see full AI analysis and inputs | | |
| 17.5 | DPO disagrees with score | Clicks "Reject" | | |
| 17.6 | Enter rejection reason | Text field required | | |
| 17.7 | Manually adjust score | Override AI score | | |
| 17.8 | Submit decision | DPIA updated with human-approved score | | |
| 17.9 | Check audit trail | AI score, rejection reason, manual score all logged | | |

**Acceptance Criteria:**
- ✅ No AI score auto-applies without approval
- ✅ Approval notification sent immediately
- ✅ DPO can reject with reason
- ✅ Manual override always possible
- ✅ Full audit trail of AI and human decisions

---

### UAT-018: Approval Workflow - Vendor Recommendations
**Objective:** Verify AI vendor suggestions require human approval

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 18.1 | AI suggests vendor for DPIA | Vendor recommendation shown | | |
| 18.2 | User clicks "Accept Recommendation" | Triggers approval workflow | | |
| 18.3 | Privacy team receives notification | Notification sent to approvers | | |
| 18.4 | Approver reviews recommendation | Can see AI reasoning and vendor details | | |
| 18.5 | Approver requests more info | Adds comment, sends back to user | | |
| 18.6 | User provides additional context | Updates vendor justification | | |
| 18.7 | Approver approves | Vendor linked to DPIA | | |
| 18.8 | Check audit trail | Full conversation and decision logged | | |

**Acceptance Criteria:**
- ✅ Vendor links require approval
- ✅ Approvers can request clarification
- ✅ Conversation thread maintained
- ✅ Can escalate to higher authority
- ✅ Approval delegations supported

---

### UAT-019: Override Capability
**Objective:** Verify humans can override any AI decision

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 19.1 | View DPIA with AI-generated data | AI fields marked with icon | | |
| 19.2 | Hover over AI field | Tooltip shows "AI-generated, click to override" | | |
| 19.3 | Click override button | Field becomes editable | | |
| 19.4 | Change value | Edit and save | | |
| 19.5 | Enter override justification | Required text field | | |
| 19.6 | Save override | Original AI value preserved in history | | |
| 19.7 | View field history | Shows: AI value, override value, justification | | |
| 19.8 | Revert to AI value | Option to undo override | | |

**Acceptance Criteria:**
- ✅ All AI fields have override button
- ✅ Override justification required
- ✅ Version history maintained
- ✅ Can revert to AI suggestion
- ✅ Override flagged in reports

---

## 6. Change Management & Monitoring Tests

### UAT-020: Change Detection - Vendor Updates
**Objective:** Verify system detects vendor changes and triggers workflows

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 20.1 | Edit vendor profile (change risk score) | Save changes | | |
| 20.2 | System detects change | Change detection triggered | | |
| 20.3 | View change notification | Alert shown: "Vendor risk score changed" | | |
| 20.4 | Check linked DPIAs | All DPIAs using vendor flagged for review | | |
| 20.5 | System creates review tasks | Tasks assigned to DPIA owners | | |
| 20.6 | DPIA owner receives notification | Email sent with change details | | |
| 20.7 | Owner reviews DPIA | Can approve or request update | | |
| 20.8 | If update needed, workflow triggered | "Update DPIA" task created | | |

**Acceptance Criteria:**
- ✅ All vendor changes tracked
- ✅ Impact analysis performed automatically
- ✅ Affected DPIAs identified
- ✅ Review tasks auto-created
- ✅ Escalation if not reviewed within SLA

---

### UAT-021: DPIA Update vs. New DPIA Decision
**Objective:** Verify AI helps determine when to update vs. create new DPIA

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 21.1 | Change processing purpose in existing DPIA | Edit description significantly | | |
| 21.2 | Click "Analyze Change" | AI analyzes scope of change | | |
| 21.3 | AI recommends action | Shows: "Update existing" or "Create new DPIA" | | |
| 21.4 | View AI reasoning | Explains why based on threshold criteria | | |
| 21.5 | Accept AI recommendation | User clicks "Accept" | | |
| 21.6 | Privacy officer reviews | Approval request sent | | |
| 21.7 | Officer can override | Option to change decision | | |
| 21.8 | Approve final decision | Action executed (update or new DPIA) | | |
| 21.9 | Check audit trail | Decision logic and approval logged | | |

**Acceptance Criteria:**
- ✅ AI evaluates change materiality correctly
- ✅ Threshold criteria transparent and configurable
- ✅ Human approval required for final decision
- ✅ Can override AI recommendation
- ✅ Creates proper linkages between versions

---

### UAT-022: Real-Time Compliance Monitoring
**Objective:** Verify system monitors compliance status and alerts on gaps

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 22.1 | Navigate to Compliance Dashboard | Real-time dashboard loads | | |
| 22.2 | View compliance rate | Shows current rate (e.g., 94.2%) | | |
| 22.3 | Check DPIAs needing review | List of overdue reviews | | |
| 22.4 | Simulate review date passing | Fast-forward system clock | | |
| 22.5 | Verify alert triggered | Alert shown in dashboard | | |
| 22.6 | Check notification sent | Email/SMS sent to responsible party | | |
| 22.7 | View compliance trend | Graph shows rate over time | | |
| 22.8 | Export compliance report | Download detailed report | | |

**Acceptance Criteria:**
- ✅ Real-time compliance calculation
- ✅ Automated alerts for overdue items
- ✅ Escalation for critical gaps
- ✅ Historical trending
- ✅ Exportable reports

---

### UAT-023: Incident-Triggered DPIA Review
**Objective:** Verify data breaches/incidents trigger DPIA reviews

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 23.1 | Create data breach incident | Enter breach details | | |
| 23.2 | Tag affected processing activities | Select DPIAs involved | | |
| 23.3 | System flags DPIAs for review | Status changes to "Incident Review Required" | | |
| 23.4 | Notifications sent | DPIA owners notified | | |
| 23.5 | Owner reviews DPIA | Can see incident details | | |
| 23.6 | Update risk assessment | Adjust scores based on learnings | | |
| 23.7 | Document remediation | Enter corrective actions | | |
| 23.8 | Submit updated DPIA | Approval workflow triggered | | |
| 23.9 | Link incident to DPIA permanently | Incident visible in DPIA history | | |

**Acceptance Criteria:**
- ✅ Incidents link to DPIAs
- ✅ Automatic review flags
- ✅ Incident context preserved
- ✅ Learnings captured
- ✅ Remediation tracked

---

## 7. Reporting & Analytics Tests

### UAT-024: Executive Dashboard
**Objective:** Verify executive dashboard shows key metrics

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 24.1 | Navigate to Dashboard | Dashboard loads in <2 seconds | | |
| 24.2 | View total DPIAs metric | Shows current count (e.g., 247) | | |
| 24.3 | Check high-risk DPIAs | Shows count and percentage | | |
| 24.4 | Review pending reviews | Count and list clickable | | |
| 24.5 | Check compliance rate | Shows % with trend arrow | | |
| 24.6 | View recent assessments | List of last 5 DPIAs | | |
| 24.7 | Check risk overview chart | Donut chart with risk distribution | | |
| 24.8 | View compliance frameworks | Bars showing GDPR, CPRA, AI Act status | | |

**Acceptance Criteria:**
- ✅ All metrics accurate and real-time
- ✅ Visual charts load correctly
- ✅ Clickable elements navigate properly
- ✅ Responsive on mobile
- ✅ Auto-refreshes every 5 minutes

---

### UAT-025: DPIA Category Analytics
**Objective:** Verify analytics broken down by 18 categories

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 25.1 | Navigate to Analytics > Categories | Category breakdown page | | |
| 25.2 | View category distribution | Chart shows DPIA count per category | | |
| 25.3 | Click on "CAT-01: AI/ML" | Drills down to AI-specific DPIAs | | |
| 25.4 | Check AI risk distribution | Shows EU AI Act risk levels | | |
| 25.5 | Filter by risk level | Select "High Risk" | | |
| 25.6 | View filtered results | Only high-risk AI DPIAs shown | | |
| 25.7 | Export category report | Download as Excel/PDF | | |

**Acceptance Criteria:**
- ✅ All 18 categories represented
- ✅ Drill-down navigation works
- ✅ Filters apply correctly
- ✅ Export includes all filtered data
- ✅ Charts interactive and informative

---

### UAT-026: Vendor Analytics
**Objective:** Verify vendor usage and risk analytics

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 26.1 | Navigate to Analytics > Vendors | Vendor analytics page | | |
| 26.2 | View most-used vendors | Chart shows top 10 by DPIA count | | |
| 26.3 | Check vendor risk distribution | Risk level breakdown | | |
| 26.4 | View vendors without current DPA | Alert list shown | | |
| 26.5 | Check sub-processor map | Visual hierarchy of processor chains | | |
| 26.6 | Filter by jurisdiction | Select "EU" | | |
| 26.7 | View compliance scores | Sorted list with scores | | |
| 26.8 | Export vendor risk report | Download with all details | | |

**Acceptance Criteria:**
- ✅ Vendor usage accurately tracked
- ✅ Risk metrics calculated correctly
- ✅ Sub-processor relationships visualized
- ✅ Geographic filtering works
- ✅ Compliance tracking accurate

---

### UAT-027: Audit Trail & History
**Objective:** Verify comprehensive audit logging for compliance

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 27.1 | Navigate to Audit Log | Log page loads | | |
| 27.2 | Filter by user | Select specific user | | |
| 27.3 | Filter by action type | Select "DPIA Modified" | | |
| 27.4 | Filter by date range | Last 30 days | | |
| 27.5 | View audit entry details | Shows: user, timestamp, before/after values | | |
| 27.6 | Check AI decision logs | AI recommendations visible | | |
| 27.7 | Verify approval logs | All approvals/rejections logged | | |
| 27.8 | Export audit log | Download as CSV with all entries | | |
| 27.9 | Verify tamper-proof | Logs are read-only | | |

**Acceptance Criteria:**
- ✅ All actions logged automatically
- ✅ AI and human decisions both tracked
- ✅ Filters work correctly
- ✅ Detailed before/after states
- ✅ Export for compliance audits
- ✅ Logs immutable

---

## 8. Integration Tests

### UAT-028: OneTrust API Integration
**Objective:** Verify two-way sync with OneTrust platform

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 28.1 | Navigate to Settings > Integrations | Integration page loads | | |
| 28.2 | Click "Configure OneTrust" | API configuration form | | |
| 28.3 | Enter API credentials | Validates and connects | | |
| 28.4 | Click "Test Connection" | Success message shown | | |
| 28.5 | Enable "Sync DPIAs to OneTrust" | Toggle on | | |
| 28.6 | Create new DPIA | Complete DPIA | | |
| 28.7 | Verify sync to OneTrust | DPIA appears in OneTrust within 5 min | | |
| 28.8 | Edit DPIA in OneTrust | Make changes in OneTrust UI | | |
| 28.9 | Verify sync back | Changes appear in platform | | |
| 28.10 | Check sync log | All syncs logged with status | | |

**Acceptance Criteria:**
- ✅ Two-way sync works reliably
- ✅ Sync happens within 5 minutes
- ✅ Conflict resolution handles duplicates
- ✅ Field mapping configurable
- ✅ Sync errors logged and alerted

---

### UAT-029: Email Notifications
**Objective:** Verify all notification types work correctly

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 29.1 | Create DPIA requiring approval | Submit DPIA | | |
| 29.2 | Check approver receives email | Email sent within 1 minute | | |
| 29.3 | Verify email content | Includes: DPIA name, link, details | | |
| 29.4 | Click email link | Navigates to approval page | | |
| 29.5 | Test reminder notification | Wait for configured time | | |
| 29.6 | Verify reminder sent | Follow-up email sent | | |
| 29.7 | Test escalation notification | Wait for escalation threshold | | |
| 29.8 | Verify escalation sent | Email sent to manager | | |
| 29.9 | Test compliance alert | Simulate overdue review | | |
| 29.10 | Verify alert email | Alert sent to responsible party | | |

**Acceptance Criteria:**
- ✅ All notification types functional
- ✅ Emails sent within SLA
- ✅ Email content accurate and actionable
- ✅ Links work correctly
- ✅ Escalations follow configured rules
- ✅ Users can customize notification preferences

---

### UAT-030: Export & Reporting
**Objective:** Verify comprehensive export capabilities

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 30.1 | Open DPIA detail page | DPIA loads | | |
| 30.2 | Click "Export" dropdown | Options shown: PDF, Word, Excel | | |
| 30.3 | Select "Export as PDF" | PDF generation dialog | | |
| 30.4 | Choose sections to include | Checkboxes for all sections | | |
| 30.5 | Generate PDF | PDF downloads in <10 seconds | | |
| 30.6 | Open PDF | All sections formatted correctly | | |
| 30.7 | Verify branding | Company logo and colors applied | | |
| 30.8 | Test bulk export | Select multiple DPIAs, bulk export | | |
| 30.9 | Verify ZIP file | All DPIAs included correctly | | |

**Acceptance Criteria:**
- ✅ Multiple export formats supported
- ✅ Customizable export templates
- ✅ Branding applied correctly
- ✅ Bulk export works for >100 DPIAs
- ✅ Export performance acceptable
- ✅ Exported files are valid and readable

---

## 9. Security & Access Control Tests

### UAT-031: Role-Based Access Control
**Objective:** Verify RBAC permissions enforced correctly

**Test Roles:**
- Admin
- DPO (Data Protection Officer)
- Privacy Manager
- DPIA Owner
- Viewer

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 31.1 | Login as Viewer | Dashboard accessible | | |
| 31.2 | Try to create DPIA | Button disabled/not visible | | |
| 31.3 | Try to edit DPIA | Edit buttons not shown | | |
| 31.4 | Try to approve DPIA | No approval options | | |
| 31.5 | Login as DPIA Owner | Can edit own DPIAs | | |
| 31.6 | Try to edit other's DPIA | Access denied | | |
| 31.7 | Login as Privacy Manager | Can edit all DPIAs | | |
| 31.8 | Cannot delete DPIAs | Delete restricted to Admin | | |
| 31.9 | Login as DPO | Full approval rights | | |
| 31.10 | Login as Admin | All permissions granted | | |

**Acceptance Criteria:**
- ✅ All roles properly restricted
- ✅ No unauthorized access possible
- ✅ Permissions enforced on API level
- ✅ Clear error messages for denied actions
- ✅ Role changes take effect immediately

---

### UAT-032: Data Privacy & Encryption
**Objective:** Verify sensitive data is encrypted and secured

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 32.1 | Check database encryption | Data at rest encrypted | | |
| 32.2 | Verify HTTPS | All connections use TLS 1.3 | | |
| 32.3 | Test API authentication | Requires valid JWT token | | |
| 32.4 | Try API without auth | 401 Unauthorized | | |
| 32.5 | Check password storage | Bcrypt/Argon2 hashed | | |
| 32.6 | Test session timeout | Expires after 30 min inactivity | | |
| 32.7 | Verify file upload security | Virus scanning enabled | | |
| 32.8 | Test SQL injection | Parameterized queries prevent injection | | |
| 32.9 | Test XSS protection | Input sanitization works | | |

**Acceptance Criteria:**
- ✅ All data encrypted at rest and in transit
- ✅ Strong authentication required
- ✅ Sessions managed securely
- ✅ Common vulnerabilities mitigated
- ✅ Security headers properly configured

---

## 10. Performance & Scale Tests

### UAT-033: Large Dataset Performance
**Objective:** Verify system performs well with large datasets

**Test Data:**
- 1000+ DPIAs
- 500+ Vendors
- 10,000+ Audit logs

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 33.1 | Load dashboard with 1000 DPIAs | Loads in <3 seconds | | |
| 33.2 | Search across all DPIAs | Results in <1 second | | |
| 33.3 | Filter by multiple criteria | Instant filtering | | |
| 33.4 | Generate report for 1000 DPIAs | Completes in <30 seconds | | |
| 33.5 | Export 1000 DPIAs | Download in <2 minutes | | |
| 33.6 | Scroll through long lists | Smooth scrolling (virtual list) | | |
| 33.7 | Concurrent user test | 50 users simultaneously | | |
| 33.8 | Check database query performance | All queries <200ms | | |

**Acceptance Criteria:**
- ✅ Page load times <3 seconds
- ✅ Search/filter <1 second
- ✅ Supports 1000+ concurrent users
- ✅ Database queries optimized
- ✅ No memory leaks
- ✅ Efficient pagination

---

## Test Sign-Off

### Approvals

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Privacy Officer | | | |
| QA Lead | | | |
| Development Lead | | | |
| Business Stakeholder | | | |

### Test Environment Details

| Component | Version | Configuration |
|-----------|---------|---------------|
| Frontend | | |
| Backend | | |
| Database | | |
| Browser(s) | | |
| Test Data | | |

### Outstanding Issues

| Issue ID | Description | Severity | Status | Notes |
|----------|-------------|----------|--------|-------|
| | | | | |

---

## Appendix

### Test Data Requirements
- 50 sample DPIAs across all 18 categories
- 30 vendor profiles with varying risk levels
- 10 cloud accounts (AWS, Azure, GCP)
- Sample DPAs, security certificates, and documents
- Test users for each role type

### Test Environment Setup
1. Fresh database with seed data
2. AI models configured with test API keys
3. OneTrust sandbox environment
4. Email testing service (e.g., Mailtrap)
5. Cloud provider test accounts

### Success Criteria
- 95%+ tests pass
- All critical/high severity issues resolved
- Performance metrics met
- Security scan shows no critical vulnerabilities
- Stakeholder sign-off obtained
