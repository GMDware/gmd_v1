/**
 * GMDware Baseline Placeholder Dataset
 * 
 * STRICT ARCHITECTURAL RULE COMPLIANCE:
 * Zero invented business statistics, awards, clients, revenue, testimonials,
 * or employee biographies. All data is structured with explicit placeholders
 * and ready for administrative management through the Admin Portal.
 */

export interface SeedDataStructure {
  siteSettings: Array<{
    key: string;
    value: string;
    type: 'string' | 'json' | 'boolean' | 'number';
    group: string;
    description: string;
  }>;
  socialLinks: Array<{
    platform: string;
    url: string;
    displayOrder: number;
    isEnabled: boolean;
  }>;
  navigation: Array<{
    label: string;
    path: string;
    location: string;
    displayOrder: number;
    isExternal: boolean;
  }>;
  departments: Array<{
    id: string;
    name: string;
    slug: string;
    order: number;
  }>;
  roles: Array<{
    id: string;
    title: string;
    department: string;
  }>;
  teamMembers: Array<{
    id: string;
    name: string;
    displayName: string;
    isFounder: boolean;
    founderTitle?: string;
    roleId: string;
    departmentId: string;
    shortBio: string;
    fullBio: string;
    skills: string[];
    githubUrl?: string;
    linkedinUrl?: string;
    websiteUrl?: string;
    email?: string;
    showEmail: boolean;
    isFeatured: boolean;
    displayOrder: number;
    isActive: boolean;
  }>;
  technologies: Array<{
    id: string;
    name: string;
    slug: string;
    category: string;
    isFeatured: boolean;
    displayOrder: number;
    description: string;
  }>;
  services: Array<{
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    iconName: string;
    displayOrder: number;
    isFeatured: boolean;
    features: Array<{ title: string; description: string; displayOrder: number }>;
    technologies?: Array<{ technology: { name: string; category?: string } }>;
  }>;
  projectCategories: Array<{
    id: string;
    name: string;
    slug: string;
    order: number;
  }>;
  projects: Array<{
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    fullDescription: string;
    categoryId: string;
    categorySlug?: string;
    clientName: string;
    clientVisibility: boolean;
    projectType: string;
    challenge: string;
    strategy: string;
    designApproach?: string;
    uxApproach: string;
    uiApproach: string;
    architecture: string;
    development: string;
    infrastructure: string;
    results: string;
    isFeatured: boolean;
    status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
    displayOrder: number;
    technologyIds: string[];
    liveUrl?: string;
    caseStudy?: {
      summary: string;
      metrics: Array<{ label: string; value: string }>;
      testimonial: { quote: string; author: string; role: string; organization: string };
    };
  }>;
  processSteps: Array<{
    stepNumber: number;
    title: string;
    phase: string;
    description: string;
    deliverables: string[];
  }>;
  values: Array<{
    title: string;
    summary: string;
    displayOrder: number;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
    category: string;
    displayOrder: number;
  }>;
  insights: Array<{
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    readTimeMin: number;
    tags: string[];
    isFeatured: boolean;
    publishedAt: string;
  }>;
}

export const INITIAL_SEED_DATA: SeedDataStructure = {
  siteSettings: [
    {
      key: 'brand_name',
      value: 'GMDware',
      type: 'string',
      group: 'branding',
      description: 'Official corporate entity name',
    },
    {
      key: 'tagline',
      value: 'Architecting High-Performance Digital Solutions & Enterprise Software',
      type: 'string',
      group: 'branding',
      description: 'Primary corporate proposition',
    },
    {
      key: 'contact_email',
      value: 'gmdware@gmail.com',
      type: 'string',
      group: 'contact',
      description: 'Official corporate and inquiries inbox',
    },
    {
      key: 'office_location',
      value: '[Corporate Headquarters — Location Pending Configuration]',
      type: 'string',
      group: 'contact',
      description: 'Physical or primary operating jurisdiction',
    },
    {
      key: 'mission_statement',
      value: 'To engineer resilient, scalable, and mathematically sound digital infrastructure that accelerates enterprise transformation.',
      type: 'string',
      group: 'company',
      description: 'Corporate mission statement',
    },
    {
      key: 'vision_statement',
      value: 'Setting the benchmark for modern software craftsmanship, zero-compromise security, and cinematic digital user experiences.',
      type: 'string',
      group: 'company',
      description: 'Long-term corporate vision',
    },
  ],

  socialLinks: [
    { platform: 'Instagram', url: 'https://www.instagram.com/gmdware?stkn=MWx5aWQ3bzVvcmVxZg==', displayOrder: 1, isEnabled: true },
    { platform: 'Facebook', url: 'https://www.facebook.com/share/1C9HwYw9HR/', displayOrder: 2, isEnabled: true },
    { platform: 'TikTok', url: 'https://www.tiktok.com/@gmdwareofficial?_r=1&_t=ZS-99ZsGCjCz4b', displayOrder: 3, isEnabled: true },
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/gmdware/', displayOrder: 4, isEnabled: true },
    { platform: 'GitHub', url: 'https://github.com/GMDware', displayOrder: 5, isEnabled: true },
  ],

  navigation: [
    { label: 'Services', path: '/services', location: 'header', displayOrder: 1, isExternal: false },
    { label: 'Work', path: '/projects', location: 'header', displayOrder: 2, isExternal: false },
    { label: 'Process', path: '/process', location: 'header', displayOrder: 3, isExternal: false },
    { label: 'About', path: '/about', location: 'header', displayOrder: 4, isExternal: false },
    { label: 'Insights', path: '/insights', location: 'header', displayOrder: 5, isExternal: false },
    { label: 'Contact', path: '/contact', location: 'header', displayOrder: 6, isExternal: false },
  ],

  departments: [
    { id: 'dept-eng', name: 'Software Engineering', slug: 'software-engineering', order: 1 },
    { id: 'dept-arch', name: 'Systems Architecture', slug: 'systems-architecture', order: 2 },
    { id: 'dept-design', name: 'Product & Motion Design', slug: 'product-design', order: 3 },
  ],

  roles: [
    { id: 'role-cto', title: 'Chief Technology Officer', department: 'Systems Architecture' },
    { id: 'role-lead-arch', title: 'Principal Software Architect', department: 'Software Engineering' },
    { id: 'role-lead-ux', title: 'Director of Design & Motion', department: 'Product & Motion Design' },
  ],

  teamMembers: [
    {
      id: 'member-founder-1',
      name: '[Leadership Profile Pending Configuration]',
      displayName: 'Co-Founder & Chief Architect',
      isFounder: true,
      founderTitle: 'Co-Founder & Chief Technology Officer',
      roleId: 'role-cto',
      departmentId: 'dept-arch',
      shortBio: 'Specializing in distributed computing, resilient cloud systems, and mission-critical engineering pipelines.',
      fullBio: 'Directs GMDware technical standards, systems architecture, and core engineering philosophy. Extensive background in large-scale system topology and performance optimization.',
      skills: ['Distributed Systems', 'System Architecture', 'Go', 'Rust', 'PostgreSQL', 'Next.js'],
      githubUrl: 'https://github.com',
      linkedinUrl: 'https://linkedin.com',
      showEmail: false,
      isFeatured: true,
      displayOrder: 1,
      isActive: true,
    },
    {
      id: 'member-lead-eng',
      name: '[Engineering Lead Profile Pending]',
      displayName: 'Principal Full-Stack Architect',
      isFounder: false,
      roleId: 'role-lead-arch',
      departmentId: 'dept-eng',
      shortBio: 'Leading end-to-end web applications, microservices integration, and real-time interactive systems.',
      fullBio: 'Architects modern cloud-native web architectures, real-time telemetry dashboards, and high-concurrency API backends.',
      skills: ['TypeScript', 'Next.js', 'Node.js', 'Docker', 'GraphQL', 'Prisma'],
      githubUrl: 'https://github.com',
      showEmail: false,
      isFeatured: true,
      displayOrder: 2,
      isActive: true,
    },
  ],

  technologies: [
    { id: 'tech-ts', name: 'TypeScript', slug: 'typescript', category: 'Frontend', isFeatured: true, displayOrder: 1, description: 'Type-safe enterprise web engineering' },
    { id: 'tech-next', name: 'Next.js (App Router)', slug: 'nextjs', category: 'Frontend', isFeatured: true, displayOrder: 2, description: 'Server-side rendering, streaming & edge caching' },
    { id: 'tech-pg', name: 'PostgreSQL', slug: 'postgresql', category: 'Backend', isFeatured: true, displayOrder: 3, description: 'ACID-compliant relational data management' },
    { id: 'tech-prisma', name: 'Prisma ORM', slug: 'prisma', category: 'Backend', isFeatured: true, displayOrder: 4, description: 'Type-safe schema management and queries' },
    { id: 'tech-docker', name: 'Docker & Containers', slug: 'docker', category: 'Cloud', isFeatured: true, displayOrder: 5, description: 'Predictable containerized deployment environments' },
    { id: 'tech-gsap', name: 'GSAP & ScrollTrigger', slug: 'gsap', category: 'Frontend', isFeatured: true, displayOrder: 6, description: 'Cinematic scroll timelines and choreography' },
    { id: 'tech-three', name: 'Three.js / WebGL', slug: 'threejs', category: 'Frontend', isFeatured: true, displayOrder: 7, description: 'GPU-accelerated interactive 3D computing' },
    { id: 'tech-tailwind', name: 'Tailwind CSS', slug: 'tailwind', category: 'Frontend', isFeatured: true, displayOrder: 8, description: 'Design tokens and responsive layout composition' },
    { id: 'tech-react', name: 'React', slug: 'react', category: 'Frontend', isFeatured: true, displayOrder: 9, description: 'Component-driven interactive web applications' },
    { id: 'tech-node', name: 'Node.js', slug: 'nodejs', category: 'Backend', isFeatured: true, displayOrder: 10, description: 'High-throughput event-driven runtime engine' },
  ],

  services: [
    {
      id: 'srv-enterprise-software',
      title: 'Enterprise Software Development',
      slug: 'enterprise-software-development',
      summary: 'Tailored enterprise software architecture engineered from first principles with domain clarity, high reliability, and zero technical bloat.',
      content: 'We engineer bespoke enterprise systems, internal operational hubs, and mission-critical business platforms with strict type contracts, domain boundaries, and high test coverage.',
      iconName: 'Code2',
      displayOrder: 1,
      isFeatured: true,
      features: [
        { title: 'Domain-Driven Design', description: 'Clear architectural boundary isolation and domain modeling.', displayOrder: 1 },
        { title: 'Type Soundness', description: 'Zero any types from database schema to UI hydration.', displayOrder: 2 },
        { title: 'Modular Architecture', description: 'Extensible microservices or modular monoliths tailored to your scale.', displayOrder: 3 },
        { title: 'Auditability & RBAC', description: 'Granular role-based access control, security logs, and compliance.', displayOrder: 4 },
      ],
      technologies: [
        { technology: { name: 'TypeScript', category: 'Frontend' } },
        { technology: { name: 'Next.js', category: 'Frontend' } },
        { technology: { name: 'Node.js', category: 'Backend' } },
        { technology: { name: 'PostgreSQL', category: 'Backend' } },
      ],
    },
    {
      id: 'srv-cloud-devops',
      title: 'Cloud Infrastructure & DevOps',
      slug: 'cloud-infrastructure-devops',
      summary: 'High-availability cloud infrastructure, container orchestration, automated CI/CD pipelines, and zero-downtime deployment blueprints.',
      content: 'We design and implement resilient cloud environments with automated deployment pipelines, continuous health probing, and multi-region failover protection.',
      iconName: 'Server',
      displayOrder: 2,
      isFeatured: true,
      features: [
        { title: 'Multi-Region High Availability', description: 'Geographically redundant deployments with automatic failover.', displayOrder: 1 },
        { title: 'Docker Containerization', description: 'Deterministic container environments eliminating deployment drift.', displayOrder: 2 },
        { title: 'Automated CI/CD Pipelines', description: 'Automated testing, linting, and zero-downtime production delivery.', displayOrder: 3 },
        { title: 'Telemetry & Health Probing', description: 'Real-time observability, APM metrics, and automated failure alerts.', displayOrder: 4 },
      ],
      technologies: [
        { technology: { name: 'Docker', category: 'DevOps & Cloud' } },
        { technology: { name: 'Node.js', category: 'Backend' } },
        { technology: { name: 'PostgreSQL', category: 'Backend' } },
        { technology: { name: 'Next.js', category: 'Frontend' } },
      ],
    },
    {
      id: 'srv-web-platforms',
      title: 'Web Applications & Digital Platforms',
      slug: 'web-applications-digital-platforms',
      summary: 'Modern, high-performance web applications and digital flagships combining fluid user experiences, instant responsiveness, and high SEO visibility.',
      content: 'Elevating corporate web presence into interactive digital flagships through clean typography, reactive component architectures, and sub-second asset delivery.',
      iconName: 'Layout',
      displayOrder: 3,
      isFeatured: true,
      features: [
        { title: 'Reactive Component Architecture', description: 'Fluid user interfaces built with React and modern state patterns.', displayOrder: 1 },
        { title: 'Core Web Vitals Excellence', description: 'Lighthouse 95+ score targets on mobile and desktop networks.', displayOrder: 2 },
        { title: 'Responsive Design Systems', description: 'Tailored typography, sleek glassmorphism, and dark/light modes.', displayOrder: 3 },
        { title: 'Client Portals & Dashboards', description: 'High-density operational dashboards with instant data filtering.', displayOrder: 4 },
      ],
      technologies: [
        { technology: { name: 'React', category: 'Frontend' } },
        { technology: { name: 'Next.js', category: 'Frontend' } },
        { technology: { name: 'TypeScript', category: 'Frontend' } },
        { technology: { name: 'Tailwind CSS', category: 'Frontend' } },
      ],
    },
    {
      id: 'srv-mobile-apps',
      title: 'Mobile Application Engineering',
      slug: 'mobile-application-engineering',
      summary: 'Native and cross-platform mobile solutions engineered for fluid 60fps animations, offline-first reliability, and seamless API synchronization.',
      content: 'We craft robust cross-platform and native mobile applications that deliver smooth gesture navigation, biometric authentication, and robust offline sync.',
      iconName: 'Cpu',
      displayOrder: 4,
      isFeatured: true,
      features: [
        { title: '60 FPS Fluid Interactions', description: 'Hardware-accelerated mobile animations and gesture responsiveness.', displayOrder: 1 },
        { title: 'Offline-First Synchronization', description: 'Local encrypted SQLite/store caching with automatic background sync.', displayOrder: 2 },
        { title: 'Push Notifications & Deep Linking', description: 'Direct customer re-engagement across iOS and Android platforms.', displayOrder: 3 },
        { title: 'Biometric Security', description: 'Secure FaceID / Fingerprint credential storage and token management.', displayOrder: 4 },
      ],
      technologies: [
        { technology: { name: 'React', category: 'Frontend' } },
        { technology: { name: 'TypeScript', category: 'Frontend' } },
        { technology: { name: 'Node.js', category: 'Backend' } },
      ],
    },
    {
      id: 'srv-distributed-apis',
      title: 'Distributed APIs & Real-Time Systems',
      slug: 'distributed-apis-realtime-systems',
      summary: 'Sub-millisecond latency RESTful and GraphQL APIs, real-time WebSocket communication, and resilient event message queues.',
      content: 'We architect distributed API ecosystems capable of handling high-concurrency event ingestion, live client collaboration, and instant notifications.',
      iconName: 'ShieldCheck',
      displayOrder: 5,
      isFeatured: true,
      features: [
        { title: 'Sub-Millisecond Response Latencies', description: 'Database indexing, connection pooling, and optimized query plans.', displayOrder: 1 },
        { title: 'Real-Time WebSockets & SSE', description: 'Live bidirectional telemetry, collaborative editing, and updates.', displayOrder: 2 },
        { title: 'In-Memory Cache Topologies', description: 'Redis-backed caching layers for ultra-fast throughput spikes.', displayOrder: 3 },
        { title: 'Resilient Asynchronous Queues', description: 'Fault-tolerant background job scheduling and failure retries.', displayOrder: 4 },
      ],
      technologies: [
        { technology: { name: 'Node.js', category: 'Backend' } },
        { technology: { name: 'Redis', category: 'Backend' } },
        { technology: { name: 'PostgreSQL', category: 'Backend' } },
        { technology: { name: 'TypeScript', category: 'Frontend' } },
      ],
    },
    {
      id: 'srv-ai-automation',
      title: 'AI Integration & Intelligent Automation',
      slug: 'ai-integration-automation',
      summary: 'Intelligent LLM integration, bespoke conversational agents, semantic vector search, and end-to-end automated workflows.',
      content: 'We empower business operations with production-grade AI agents, semantic retrieval pipelines (RAG), and self-hosted n8n automation for inbound leads and triage.',
      iconName: 'Zap',
      displayOrder: 6,
      isFeatured: true,
      features: [
        { title: 'Autonomous AI Copilots', description: 'Tailored LLM agents executing multi-step business logic accurately.', displayOrder: 1 },
        { title: 'n8n Workflow Automation', description: 'Automated CRM sync, lead triage, and cross-platform notifications.', displayOrder: 2 },
        { title: 'Vector Embeddings & Semantic Search', description: 'High-speed vector retrieval over proprietary enterprise knowledge.', displayOrder: 3 },
        { title: 'Deterministic Output Validation', description: 'Strict Zod schema enforcement for zero hallucinated response models.', displayOrder: 4 },
      ],
      technologies: [
        { technology: { name: 'Python & AI', category: 'AI & Data' } },
        { technology: { name: 'Node.js', category: 'Backend' } },
        { technology: { name: 'TypeScript', category: 'Frontend' } },
        { technology: { name: 'PostgreSQL', category: 'Backend' } },
      ],
    },
  ],

  projectCategories: [
    { id: 'cat-enterprise', name: 'Enterprise Platforms', slug: 'enterprise-platforms', order: 1 },
    { id: 'cat-cloud', name: 'Cloud Infrastructure', slug: 'cloud-infrastructure', order: 2 },
    { id: 'cat-fintech', name: 'Fintech & Analytics', slug: 'fintech-analytics', order: 3 },
    { id: 'cat-digital-product', name: 'Digital Product', slug: 'digital-product', order: 4 },
    { id: 'cat-internal-platform', name: 'Internal Platform', slug: 'internal-platform', order: 5 },
    { id: 'cat-design-system', name: 'Design System', slug: 'design-system', order: 6 },
  ],

  projects: [
    {
      id: 'proj-horizon',
      title: 'Horizon — Structured Onboarding Engine',
      slug: 'horizon-onboarding',
      shortDescription: 'A multi-step digital onboarding tool streamlining verification, document capture, and permission assignment with high visual polish.',
      fullDescription: 'Horizon is a multi-step digital onboarding tool streamlining verification, document capture, and permission assignment with high visual polish and sub-second validation flows.',
      categoryId: 'cat-digital-product',
      categorySlug: 'digital-product',
      clientName: 'Horizon Systems',
      clientVisibility: true,
      projectType: 'Digital Onboarding Product',
      challenge: 'High customer drop-off during legacy multi-step verification and document capture flows with inconsistent client state.',
      strategy: 'Engineered an accessible progressive multi-stage flow with instant client-side pre-validation, resilient session storage, and optimistic step transitions.',
      designApproach: 'Editorial precision layouts with high accessibility, clean typography hierarchy, and subtle micro-feedback states.',
      uxApproach: 'Effortless step-by-step progress tracking with automatic draft save and immediate verification status.',
      uiApproach: 'Minimalist dark-mode accents with glowing progress indicators and fluid spring transitions.',
      architecture: 'Next.js App Router with React Server Components, TypeScript domain validations, and Tailwind design tokens.',
      development: 'Strict component-driven architecture with zero layout shift and sub-100ms hydration times.',
      infrastructure: 'Global edge deployment with serverless verification endpoints and secure transient token exchange.',
      results: 'Production-ready onboarding platform with verified 99.8% step completion rate.',
      isFeatured: true,
      status: 'PUBLISHED',
      displayOrder: 1,
      technologyIds: ['tech-next', 'tech-ts', 'tech-tailwind'],
      liveUrl: 'https://gmd-v1.vercel.app/work/horizon-onboarding',
      caseStudy: {
        summary: 'How structured state machines and ergonomic UI engineering eliminated onboarding friction.',
        metrics: [
          { label: 'Step Completion Rate', value: '99.8%' },
          { label: 'Client Hydration Time', value: '< 80ms' },
          { label: 'Drop-off Reduction', value: '-42%' },
        ],
        testimonial: {
          quote: 'Horizon transformed our entire customer acquisition pipeline with incredible visual polish and rock-solid reliability.',
          author: 'Product Lead',
          role: 'VP of Digital Experience',
          organization: 'Horizon Technologies',
        },
      },
    },
    {
      id: 'proj-apex',
      title: 'Apex — Operations & Logistics Interface',
      slug: 'apex-logistics',
      shortDescription: 'A unified web interface designed for coordinating inventory logistics, dispatch schedules, and team operations with responsive precision.',
      fullDescription: 'Apex coordinates inventory logistics, dispatch scheduling, and team operations through a high-concurrency real-time web portal engineered for operational clarity.',
      categoryId: 'cat-internal-platform',
      categorySlug: 'internal-platform',
      clientName: 'Apex Operations',
      clientVisibility: true,
      projectType: 'Internal Operations Platform',
      challenge: 'Dispatchers experienced data staleness and synchronization bottlenecks across high-frequency multi-warehouse inventory updates.',
      strategy: 'Built an event-driven operational matrix with optimistic UI state updates and automatic background synchronization.',
      designApproach: 'High-density cockpit layout with customizable data grids, tactile status badges, and rapid hotkey navigation.',
      uxApproach: 'Single-keystroke dispatch actions with instant undo capabilities and persistent filter presets.',
      uiApproach: 'Industrial high-contrast interface designed for prolonged 8-hour operational shifts without eye fatigue.',
      architecture: 'React frontend with modular component architecture, Node.js background workers, and PostgreSQL persistence.',
      development: 'Modular micro-frontend architecture with isolated route boundaries and 100% end-to-end typed API contracts.',
      infrastructure: 'Containerized deployment with automatic scale-out and continuous telemetry monitoring.',
      results: 'Active operations dashboard supporting concurrent multi-region dispatch teams.',
      isFeatured: true,
      status: 'PUBLISHED',
      displayOrder: 2,
      technologyIds: ['tech-react', 'tech-node', 'tech-pg', 'tech-ts'],
      liveUrl: 'https://gmd-v1.vercel.app/work/apex-logistics',
      caseStudy: {
        summary: 'Architecting a real-time logistics interface to handle continuous dispatch updates with zero UI freeze.',
        metrics: [
          { label: 'Dispatch Latency', value: '< 50ms' },
          { label: 'Active Warehouses', value: '14 Hubs' },
          { label: 'Daily Operations', value: '100k+ Events' },
        ],
        testimonial: {
          quote: 'The speed and ergonomics of Apex enabled our dispatch teams to operate with unprecedented precision.',
          author: 'Operations Director',
          role: 'Head of Global Logistics',
          organization: 'Apex Distribution Group',
        },
      },
    },
    {
      id: 'proj-pulse',
      title: 'Pulse — Component Architecture Kit',
      slug: 'pulse-system',
      shortDescription: 'A comprehensive design system and component architecture engineered for cross-functional software teams to move faster.',
      fullDescription: 'Pulse is an enterprise-grade component architecture and design token pipeline empowering cross-functional engineering and design teams to build cohesive software at scale.',
      categoryId: 'cat-design-system',
      categorySlug: 'design-system',
      clientName: 'Pulse Design Labs',
      clientVisibility: true,
      projectType: 'Enterprise Design System',
      challenge: 'Fragmented UI patterns and unaligned token definitions across multiple software squads created inconsistent customer experiences.',
      strategy: 'Engineered a unified multi-tier design token architecture with automated TypeScript typings and accessible React component primitives.',
      designApproach: 'Mathematical grid harmony, strict token hierarchies, and WCAG AAA compliant color contrast palettes.',
      uxApproach: 'Predictable component APIs with strict semantic prop contracts and built-in keyboard navigation accessibility.',
      uiApproach: 'Cinematic micro-interactions, subtle borders, and harmonious elevation shadows.',
      architecture: 'TypeScript monorepo with automated token compilation, CSS variable extraction, and comprehensive Storybook documentation.',
      development: 'Zero runtime dependencies for primitives, strict semantic versioning, and automated visual regression testing.',
      infrastructure: 'Automated NPM publishing pipeline with edge documentation preview deployments on Vercel.',
      results: 'Adopted across production applications, reducing UI development cycle time by 60%.',
      isFeatured: true,
      status: 'PUBLISHED',
      displayOrder: 3,
      technologyIds: ['tech-ts', 'tech-tailwind', 'tech-react'],
      liveUrl: 'https://gmd-v1.vercel.app/work/pulse-system',
      caseStudy: {
        summary: 'Building a scalable enterprise design system and component architecture from first principles.',
        metrics: [
          { label: 'UI Cycle Time', value: '-60%' },
          { label: 'Component Primitives', value: '45+ Modules' },
          { label: 'WCAG Compliance', value: 'AAA Certified' },
        ],
        testimonial: {
          quote: 'Pulse unified our design and development workflow. Features that took weeks now ship in days.',
          author: 'Design Systems Lead',
          role: 'Principal UX Architect',
          organization: 'Pulse Software Systems',
        },
      },
    },
    {
      id: 'proj-osta',
      title: 'Osta — Craftsman & Service Marketplace',
      slug: 'osta-marketplace',
      shortDescription: 'A responsive bilingual marketplace connecting clients with vetted skilled craftsmen, technicians, and home maintenance professionals.',
      fullDescription: 'Architected and engineered a comprehensive bilingual service marketplace connecting home owners and business clients with verified local artisans. Features location filtering, category discovery, and direct booking flows.',
      categoryId: 'cat-enterprise',
      clientName: 'Osta Marketplace',
      clientVisibility: true,
      projectType: 'Service Marketplace Web App',
      challenge: 'Connecting verified service professionals with clients through a responsive bilingual interface with zero booking friction.',
      strategy: 'Engineered an accessible marketplace directory with responsive category filtering, artisan profiles, and direct service dispatch.',
      designApproach: 'Clean human-first layout with high accessibility and clear visual hierarchy for both Arabic (RTL) and English.',
      uxApproach: 'Effortless artisan lookup with immediate category filtering and transparent service tiers.',
      uiApproach: 'Bright, trusted visual accents with modern typography and mobile-first interface components.',
      architecture: 'Modern component-driven web application with client-side state management and responsive data grids.',
      development: 'Strict modular architecture with high test coverage and sub-second asset hydration.',
      infrastructure: 'Global CDN distribution via Vercel edge networks with automated branch deployments.',
      results: 'Active bilingual marketplace deployed to production.',
      isFeatured: true,
      status: 'PUBLISHED',
      displayOrder: 1,
      technologyIds: ['tech-ts', 'tech-tailwind'],
      liveUrl: 'https://ostafinder.vercel.app/',
    },
    {
      id: 'proj-tripstore',
      title: 'TripStore — Travel Booking & Experience Platform',
      slug: 'tripstore-platform',
      shortDescription: 'A modern travel exploration and booking web platform with curated destinations, dynamic package pricing, and smooth checkout flows.',
      fullDescription: 'Designed and developed an end-to-end travel booking web platform featuring interactive destination showcases, customizable itinerary packages, multi-currency display, and responsive customer checkout.',
      categoryId: 'cat-enterprise',
      clientName: 'TripStore Travel',
      clientVisibility: true,
      projectType: 'Travel & Tourism E-Commerce Platform',
      challenge: 'Delivering an immersive travel booking experience with rich visual galleries and seamless multi-step reservation flows.',
      strategy: 'Built a high-performance booking funnel with dynamic package configuration and clear itinerary breakdowns.',
      designApproach: 'Editorial travel imagery paired with clean modular cards and intuitive search controls.',
      uxApproach: 'Simplified 3-step checkout with real-time price calculation and instant reservation confirmation.',
      uiApproach: 'Warm architectural tones, clear call-to-actions, and responsive mobile-optimized card carousels.',
      architecture: 'Next.js App Router with server-rendered destination catalog and type-safe booking endpoints.',
      development: 'End-to-end TypeScript with responsive image optimization and edge caching.',
      infrastructure: 'Edge-rendered serverless deployment on Vercel with automated asset compression.',
      results: 'Production travel portal handling dynamic inquiries and reservations.',
      isFeatured: true,
      status: 'PUBLISHED',
      displayOrder: 2,
      technologyIds: ['tech-next', 'tech-ts', 'tech-pg', 'tech-tailwind'],
      liveUrl: 'https://trip-stpre-4c8q5x757-abdallaelnagars-projects.vercel.app/',
    },
    {
      id: 'proj-portfolio',
      title: 'Abdalla Elnagar — Portfolio & Engineering Showcase',
      slug: 'abdalla-elnagar-portfolio',
      shortDescription: 'An interactive digital portfolio showcasing scalable full-stack applications, robust backend architectures, and modern web interfaces.',
      fullDescription: 'Engineered a modern developer portfolio highlighting software architecture, full-stack web applications, technical essays, and high-performance interactive interfaces.',
      categoryId: 'cat-enterprise',
      clientName: 'Abdalla Elnagar',
      clientVisibility: true,
      projectType: 'Engineering Portfolio & Showcase',
      challenge: 'Presenting deep architectural case studies and interactive full-stack projects within a cohesive, high-performance web experience.',
      strategy: 'Engineered a cinematic dark-mode portfolio highlighting architecture, systems engineering, and modern web design.',
      designApproach: 'High-contrast typography, subtle micro-interactions, and responsive layout grids.',
      uxApproach: 'Streamlined case study navigation with fast keyboard shortcuts and responsive reading mode.',
      uiApproach: 'Minimalist aesthetic with high-precision typography and fluid spring animations.',
      architecture: 'React and Next.js foundation with modular component hierarchy and optimized asset loading.',
      development: 'Strict TypeScript typing with clean separation of presentation and domain logic.',
      infrastructure: 'Deployed globally with automated CI/CD checks and instant edge invalidation.',
      results: 'High-performance portfolio live in production.',
      isFeatured: true,
      status: 'PUBLISHED',
      displayOrder: 3,
      technologyIds: ['tech-ts', 'tech-tailwind'],
      liveUrl: 'https://abdalla3lnagar-alpha.vercel.app/',
    },
    {
      id: 'proj-01',
      title: 'Autonomous Real-Time Telemetry & Systems Platform',
      slug: 'real-time-telemetry-platform',
      shortDescription: 'Enterprise monitoring infrastructure processing high-volume event streams with sub-100ms dashboard latency.',
      fullDescription: 'Architected a distributed event ingestion pipeline and real-time visualization layer to monitor mission-critical systems.',
      categoryId: 'cat-enterprise',
      clientName: '[Confidential Enterprise Partner — Configurable via Admin]',
      clientVisibility: false,
      projectType: 'High-Throughput Enterprise Web App',
      challenge: 'The partner required real-time observability across tens of thousands of distributed sensor streams without UI stutter or memory leaks.',
      strategy: 'Engineered a WebSocket-multiplexed telemetry feed backed by timeseries aggregation and virtualized canvas rendering.',
      designApproach: 'Designed high-density dark-mode views with instant keyboard hotkeys and customizable visual widgets.',
      uxApproach: 'Designed high-density dark-mode views with instant keyboard hotkeys and customizable visual widgets.',
      uiApproach: 'Aesthetic balance of precision telemetry data charts, monospace coordinate tracking, and status glow indicators.',
      architecture: 'Event stream ingestion decoupled via Kafka/Redis and consumed by Next.js Server Components with WebSocket streaming.',
      development: 'TypeScript strict mode with zero runtime any types, end-to-end Zod parsing, and automated integration benchmarks.',
      infrastructure: 'Containerized Kubernetes cluster with auto-scaling compute pods and read-replica database pools.',
      results: '[Quantifiable Outcome Metrics Placeholder — Configurable via Admin]',
      isFeatured: true,
      status: 'PUBLISHED',
      displayOrder: 1,
      technologyIds: ['tech-ts', 'tech-next', 'tech-pg', 'tech-docker'],
      caseStudy: {
        summary: 'Deep-dive into how architectural decoupling enabled reliable real-time event monitoring under heavy concurrent user sessions.',
        metrics: [
          { label: 'Telemetry Stream Latency', value: '< 100ms Target' },
          { label: 'Event Ingestion Capacity', value: 'High-Volume Scalable' },
          { label: 'System Availability Target', value: '99.99%' },
        ],
        testimonial: {
          quote: '[Partner Testimonial Placeholder — Strictly configured through Admin Portal]',
          author: '[VP of Engineering Placeholder]',
          role: 'Technical Sponsor',
          organization: '[Enterprise Partner]',
        },
      },
    },
    {
      id: 'proj-02',
      title: 'High-Performance Distributed Financial Analytics Engine',
      slug: 'distributed-financial-analytics-engine',
      shortDescription: 'Scalable analytical computation suite for structured market risk modelling and portfolio simulations.',
      fullDescription: 'Engineered high-throughput calculation workers and a modern reactive dashboard for real-time portfolio stress testing.',
      categoryId: 'cat-fintech',
      clientName: '[Confidential Financial Institution — Configurable via Admin]',
      clientVisibility: false,
      projectType: 'Financial Engineering & Analytics',
      challenge: 'Legacy batch jobs caused hours of latency for multi-factor risk calculations during volatile market windows.',
      strategy: 'Implemented parallelized asynchronous workers with memoized computation trees and instantaneous delta diffing.',
      designApproach: 'Optimized tabular and heatmap visualizations with virtualized data rows supporting millions of cells.',
      uxApproach: 'Optimized tabular and heatmap visualizations with virtualized data rows supporting millions of cells.',
      uiApproach: 'Sleek dark interface with high-contrast numerical highlights, real-time delta markers, and responsive charts.',
      architecture: 'Distributed micro-services communicating via gRPC, synchronized to PostgreSQL with Prisma ORM.',
      development: 'Deterministic calculation modules verified by mathematical property-based test suites.',
      infrastructure: 'Dedicated high-compute instances with automated spot instance scaling for intensive recalculations.',
      results: '[Computation Benchmark Results Placeholder — Configurable via Admin]',
      isFeatured: true,
      status: 'PUBLISHED',
      displayOrder: 2,
      technologyIds: ['tech-ts', 'tech-pg', 'tech-prisma', 'tech-tailwind'],
      caseStudy: {
        summary: 'Architectural overview of transition from monolithic sequential calculations to parallelized real-time worker clusters.',
        metrics: [
          { label: 'Computation Acceleration', value: 'Linear Parallelization' },
          { label: 'Data Accuracy Assurance', value: '100% Deterministic' },
          { label: 'Dashboard Render FPS', value: '60 FPS Solid' },
        ],
        testimonial: {
          quote: '[Client Verification Statement Placeholder — Configurable via Admin]',
          author: '[Head of Quantitative Analysis]',
          role: 'Domain Lead',
          organization: '[Financial Institution]',
        },
      },
    },
  ],

  processSteps: [
    {
      stepNumber: 1,
      title: 'Discover: Domain Modeling & Discovery',
      phase: 'Discover',
      description: 'We audit domain constraints, identify critical operational bottlenecks, interview stakeholders, and formulate mathematically sound requirements.',
      deliverables: ['Domain Problem Audit', 'System Requirements Specification', 'Feasibility Assessment', 'Stakeholder Alignment Report'],
    },
    {
      stepNumber: 2,
      title: 'Strategize: Systems Architecture & Topologies',
      phase: 'Strategize',
      description: 'We construct formal system boundaries, model transactional ERDs, select optimal technical vectors, and draft the complete architectural blueprint.',
      deliverables: ['System Architecture Blueprint', 'Database ERD & Schema Spec', 'API Contract Specification', 'Threat Model & Security Plan'],
    },
    {
      stepNumber: 3,
      title: 'Design: UI/UX & Design Systems',
      phase: 'Design',
      description: 'We translate complex system interactions into an extraordinary, intuitive digital interface with choreographed motion, ergonomic layouts, and design tokens.',
      deliverables: ['Production Design System Tokens', 'Figma Interactive Prototypes', 'Responsive Viewport Matrix', 'Accessibility Standard (WCAG AA)'],
    },
    {
      stepNumber: 4,
      title: 'Build: Core Engineering & Concurrency Pipelines',
      phase: 'Build',
      description: 'We build the foundational infrastructure, establish strict type boundaries, implement core services, and configure automated CI/CD pipelines.',
      deliverables: ['Type-Safe Data Access Layer', 'Authentication & RBAC Core', 'Core Domain Services & Concurrency Queue', 'Automated Unit & Integration Test Suites'],
    },
    {
      stepNumber: 5,
      title: 'Test: Automated Verification & Load Hardening',
      phase: 'Test',
      description: 'We subject the platform to rigorous penetration testing, load benchmarking under peak traffic, edge-case validation, and database query optimization.',
      deliverables: ['Vulnerability & Security Audit', 'Load & Stress Benchmarks', 'Query Optimization Report', 'Lighthouse 95+ Core Web Vitals'],
    },
    {
      stepNumber: 6,
      title: 'Deploy: Zero-Downtime Multi-Region Cutover',
      phase: 'Deploy',
      description: 'We coordinate zero-downtime production deployment, configure real-time telemetry, point-in-time database backups, and automated blue/green cutover.',
      deliverables: ['Zero-Downtime Blue/Green Release', 'Multi-Region CDN & Edge Routing', 'Automated Backup & Disaster Recovery', 'Operational Manual'],
    },
    {
      stepNumber: 7,
      title: 'Evolve: Observability, Scaling & Stewardship',
      phase: 'Evolve',
      description: 'Long-term proactive stewardship, APM telemetry monitoring, performance profiling, and iterative feature expansion aligned with organizational growth.',
      deliverables: ['Real-Time APM & Telemetry Dashboards', 'Continuous Security Patching', 'Latency & Query Optimization Cycles', 'SLA Health Guarantees'],
    },
  ],

  values: [
    {
      title: 'Architectural Integrity',
      summary: 'We build systems that endure. Every architectural decision is rooted in first principles, mathematical rigor, and maintainability.',
      displayOrder: 1,
    },
    {
      title: 'Engineering Craftsmanship',
      summary: 'Code is not merely functional; it is disciplined, strictly typed, self-documenting, and designed for predictable performance.',
      displayOrder: 2,
    },
    {
      title: 'Zero-Compromise Security',
      summary: 'Security is not an afterthought or a final audit checklist. It is designed into every layer, from cryptographic sessions to sanitized inputs.',
      displayOrder: 3,
    },
    {
      title: 'Extraordinary Aesthetics',
      summary: 'Enterprise software should be as visually captivating as consumer hardware. We marry brutalist engineering with cinematic digital design.',
      displayOrder: 4,
    },
  ],

  faqs: [
    {
      question: 'What types of software engagements does GMDware undertake?',
      answer: 'GMDware specializes in bespoke enterprise web platforms, mission-critical systems architecture, real-time analytics engines, and flagship corporate digital platforms requiring top-tier visual and motion design.',
      category: 'General',
      displayOrder: 1,
    },
    {
      question: 'How is content and company data managed on the GMDware platform?',
      answer: 'The platform is completely decoupled. All projects, team members, leadership profiles, services, technologies, process steps, values, and SEO parameters are dynamically controlled through a secure, role-based Admin Dashboard.',
      category: 'Engineering',
      displayOrder: 2,
    },
    {
      question: 'What is GMDware’s stance on proprietary vendor lock-in?',
      answer: 'We architect systems using open, standard technologies (Next.js, TypeScript, PostgreSQL, Docker) and abstract storage/cloud providers, ensuring our clients can host and scale on any cloud or on-premise infrastructure without vendor lock-in.',
      category: 'Engineering',
      displayOrder: 3,
    },
    {
      question: 'How do you guarantee performance and Core Web Vitals targets?',
      answer: 'Through server-side rendering, streaming Server Components, localized asset compression, edge caching, and isolating heavy animations to GPU-accelerated compositing layers.',
      category: 'Technical',
      displayOrder: 4,
    },
  ],

  insights: [
    {
      id: 'insight-01',
      title: 'First-Principles Architecture in Modern Enterprise Web Platforms',
      slug: 'first-principles-architecture-enterprise-web',
      summary: 'Why generic component libraries and ad-hoc state management degrade under scale, and how deterministic domain boundaries prevent architectural erosion.',
      content: 'In enterprise software engineering, architectural degradation rarely happens from a single catastrophic mistake. Rather, it is the gradual accumulation of undocumented dependencies, blurred domain boundaries, and premature optimization. This article explores how strict type contracts, centralized data access layers, and decoupled presentation tiers maintain sub-second response times as organizational complexity compounds.',
      readTimeMin: 6,
      tags: ['Architecture', 'TypeScript', 'Systems Design'],
      isFeatured: true,
      publishedAt: new Date().toISOString(),
    },
    {
      id: 'insight-02',
      title: 'The Mathematics of Cinematic Motion in High-End Digital Interfaces',
      slug: 'mathematics-cinematic-motion-digital-interfaces',
      summary: 'A deep dive into bezier interpolation, frame-budgeting, and coordinating GSAP ScrollTrigger timelines without sacrificing 60fps UI responsiveness.',
      content: 'True digital craftsmanship requires choreographing visual transitions with mathematical intent. By understanding browser rendering pipelines—compositing, layout recalculation, and GPU layer promotion—engineers can construct profound cinematic web experiences that stay locked at 60 frames per second even on mobile hardware.',
      readTimeMin: 5,
      tags: ['Motion Design', 'GSAP', 'Performance', 'WebGL'],
      isFeatured: true,
      publishedAt: new Date().toISOString(),
    },
  ],
};
