# GMDware Anti-AI Slop Design & Copy Standard (DESIGN_RULES.md)
**Mandatory Specification for Theme 03 ("GMDware Atelier")**

---

## 1. Core Philosophy: Real Creative Software Studio, Not a Dashboard

Theme 03 must present GMDware as a high-end, thoughtful, modern creative software studio and digital product consultancy—**not** a developer dashboard, telemetry terminal, or AI-generated tech agency template.

The design must feel human, editorial, confident, and grounded in real business value.

---

## 2. Visual & Art Direction Rules

### Background & Surfaces
- **Canvas**: Clean white (`#FFFFFF`) or warm, daylight architectural off-white (`#FBFBFA`, `#F7F7F5`).
- **Surfaces**: High contrast, flat, paper-like clarity.
- **Strictly Prohibited**:
  - NO dark futuristic / matrix / terminal aesthetic.
  - NO purple, neon indigo, cyan, or magenta visual language.
  - NO glowing borders, ambient neon blobs, or radial glow backdrops.
  - NO CSS gradient text or gradient card overlays.
  - NO decorative wireframe diagrams, mock system topologies, or simulated circuit paths.
  - NO glassmorphism overkill (heavy blur, multi-layered glossy transparency).

### Color Discipline
- **Primary Text**: Deep slate/charcoal ink (`#0F172A` or `#111827`).
- **Secondary Text**: Neutral slate (`#475569` or `#64748B`).
- **Single Accent Color**: One restrained, purposeful accent (e.g. Pure Studio Cobalt `#1D4ED8` / `#2563EB` or Crisp Signal `#0F172A` with warm slate accents).
- **Borders**: Hairline neutral borders (`#E2E8F0` or `#E5E7EB`), used sparingly.
- **Rule of Restraint**: Colors must serve clarity, not decoration. Never use colorful badge backgrounds or multicolored rainbow tags.

### Layout & Composition
- **Editorial Whitespace**: Generous, intentional whitespace and clean grid alignment.
- **Fewer Cards**: Avoid wrapping every heading, paragraph, or feature in a rounded card with a border and drop shadow. Prefer text-led layouts with clean dividing lines.
- **Component Geometry**: Consistent, subtle border radius (e.g., `rounded-lg` 6px–8px or `rounded-xl` 12px; never pill-shaped card monstrosities or bubbly 32px radii on standard content containers).
- **Shadows**: Flat or ultra-subtle ambient shadow (`shadow-sm`); NO deep dramatic drop shadows (`shadow-2xl`).
- **Motion & Interaction**: Subtle, instantaneous opacity transitions. NO hovering lift effects (`translate-y-2`), NO hover glows, and NO continuous pulse/scale animations.

---

## 3. Copywriting & Content Standards

### The "No-Slop" Tone of Voice
- Write like an experienced, thoughtful human principal talking to a founder or product VP.
- Concrete, plain, confident, and direct.
- Focus on business outcomes, user utility, clarity of thinking, and dependable delivery.

### Banned Jargon & Prohibited Phrases
Never use the following AI clichés, tech jargon, or telemetry buzzwords:
- ❌ *System Telemetry* / *Live Telemetry* / *System Specimen*
- ❌ *Runtime Intelligence* / *Runtime Performance Ledger*
- ❌ *Mathematical Rigor* / *Algorithmic Foundations* / *Deterministic Execution*
- ❌ *Architectural Permanence* / *High-Throughput Telemetry* / *Coordinate Void*
- ❌ *Next-Generation* / *Supercharge* / *Unleash* / *Empower*
- ❌ *Seamless* / *Synergy* / *Revolutionary* / *Game-changing*
- ❌ *Bespoke Digital Fabric* / *Living Digital Ecosystem*
- ❌ *Genesis, Mechanics, Dynamics* presented as esoteric sci-fi dogma
- ❌ Artificial status codes like `[SYSTEM_OK]`, `// TELEMETRY_ACTIVE`, `EDITION 2026`

### Preferred Vocabulary
Use plain, credible commercial and engineering language:
- ✅ *Websites* & *Web applications*
- ✅ *Internal tools* & *Operations platforms*
- ✅ *Customer portals* & *Client dashboards*
- ✅ *Digital products* & *Mobile-responsive web software*
- ✅ *Product design*, *UX strategy*, & *Prototyping*
- ✅ *Full-stack engineering*, *API development*, & *Cloud deployment*
- ✅ *Code audits*, *Performance optimization*, & *Ongoing technical maintenance*

---

## 4. Typography Rules

- **Typeface**: One primary sans-serif family (Inter / modern grotesque).
- **Monospace Usage**: Strictly restricted to actual code snippets, timestamps, or live metric counter suffixes. NEVER use monospace for general section titles, labels, or paragraphs.
- **Casing**: Sentence case for headings and body. Avoid screaming all-caps (`UPPERCASE`) labels except for standard acronyms (e.g., API, CRM, SLA).
- **Scale**: Controlled and restrained. Headings must not exceed 56px (`text-4xl` to `text-5xl` on desktop). No oversized 72px–96px headlines.
- **Alignment**: Left-aligned body copy for maximum readability. No centered paragraphs of explanatory text.

---

## 5. Structural Breakdown for Theme 03

1. **Header**:
   - Clean typographic wordmark (`GMDware`).
   - Simple text links (Work, Services, Approach, About, Perspectives, Contact).
   - Clean "Start a Project" button.
   - No pulsating status dots, no fake system build tags.

2. **Hero Section**:
   - Confident, human headline stating what GMDware actually builds.
   - Grounded 2-sentence description explaining who we work with and our philosophy.
   - Exactly two actions: Primary ("View our work" / `/work`) and Secondary ("Start a project" / `/contact`).
   - One meaningful visual: real project photograph, browser mockup, or editorial screenshot.
   - Zero card stacks, zero telemetry tabs (no Topology/Contracts/Performance), zero fake terminal windows.

3. **Selected Work**:
   - Curated showcase pulling from real CMS projects.
   - Editorial presentation: Large featured project previews with real titles, client context, and live case study links.
   - No tiny generic uniform cards with fake placeholder badges.

4. **What We Do (Services)**:
   - 3 to 5 core studio services (Web Applications, Digital Products, Internal Tools, Performance & Architecture).
   - Text-led editorial columns or rows separated by clean borders.
   - No colorful icon background circles, no gimmick boxes.

5. **Our Approach / Process**:
   - Plain-English explanation of how engagements work (Discovery, Design & Prototype, Production Build, Release & Support).
   - Focus on collaboration, clear communication, and working software.

6. **Studio & Team (About)**:
   - Genuine, human introduction to the team and ethos.
   - Leadership profiles with real bios and disciplines.
   - No pretentious tech-philosophical manifestos.

7. **Proof Metrics**:
   - Display real, CMS-backed numbers honestly.
   - Total Website Visitors: "Unique visitor sessions" (live database counter or dashboard override).
   - Clients Served & Solutions Built: Simple numeric counters with clear labels.
   - Clean, quiet editorial typography—NOT a futuristic avionics instrument cluster.

8. **Contact Form**:
   - Inviting, straightforward project inquiry form.
   - Complete field preservation: Full Name, Email, Phone (optional), Company, Discipline, Budget, Timeline, Message.
   - Sends payload cleanly to `/api/contact` and preserves n8n webhook.
   - Truthful response note: "Direct technical triage & consultation. We review all inquiries promptly." (No false SLA claims).

9. **Footer**:
   - Clean editorial colophon with studio copyright, contact email, social links, and navigation.
   - No simulated server latency telemetry or fake hardware ping meters.

---

## 6. Non-Negotiable Boundaries

1. **Strict Theme Isolation**: All changes must remain 100% inside `src/themes/atelier/`.
2. **Zero Regressions**: Theme 01 (`SYSTEMS`) and Theme 02 (`NEXUS`) must remain completely untouched.
3. **Internal Theme ID**: The internal key remains `'atelier'`.
4. **Backend Continuity**: Zero schema migrations; preserve all CMS routes, admin dashboards, and n8n webhooks.
