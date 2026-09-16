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
  ],

  services: [
    {
      id: 'srv-custom-software',
      title: 'Bespoke Enterprise Software',
      slug: 'enterprise-software-development',
      summary: 'Mission-critical software engineered from first principles to solve complex organizational bottlenecks.',
      content: 'We engineer tailored enterprise solutions with uncompromising focus on performance, fault tolerance, and clean domain boundaries.',
      iconName: 'Code2',
      displayOrder: 1,
      isFeatured: true,
      features: [
        { title: 'Domain-Driven Architecture', description: 'Engineered specifically around organizational logic and workflows.', displayOrder: 1 },
        { title: 'High-Concurrency Backends', description: 'Sub-millisecond API response targets and robust load resilience.', displayOrder: 2 },
        { title: 'Zero Vendor Lock-in', description: 'Clean portable codebases designed to deploy across any cloud infrastructure.', displayOrder: 3 },
      ],
    },
    {
      id: 'srv-cloud-arch',
      title: 'Cloud & Systems Architecture',
      slug: 'cloud-systems-architecture',
      summary: 'Scalable infrastructure blueprints, database optimization, and high-availability cloud configurations.',
      content: 'Resilient cloud topologies designed for high availability, zero downtime deployments, and elastic scalability under heavy spikes.',
      iconName: 'Server',
      displayOrder: 2,
      isFeatured: true,
      features: [
        { title: 'Multi-Region High Availability', description: 'Redundant geographic distribution with automated failover.', displayOrder: 1 },
        { title: 'Database Optimization', description: 'Query tuning, read-replica configuration, and connection pooling.', displayOrder: 2 },
        { title: 'Automated CI/CD Pipelines', description: 'Deterministic build, test, and zero-downtime deployment pipelines.', displayOrder: 3 },
      ],
    },
    {
      id: 'srv-digital-platforms',
      title: 'Cinematic Digital Platforms',
      slug: 'digital-platforms-experience',
      summary: 'Immersive digital flagships combining extraordinary visual design, fluid motion, and sub-second performance.',
      content: 'Elevating corporate web presence into an interactive flagship experience through precision typography, GPU shaders, and reactive interfaces.',
      iconName: 'Layout',
      displayOrder: 3,
      isFeatured: true,
      features: [
        { title: 'Motion Choreography', description: 'Orchestrated GSAP timelines and responsive micro-interactions.', displayOrder: 1 },
        { title: 'Decoupled Content Management', description: 'Dynamic administration without developer bottlenecks.', displayOrder: 2 },
        { title: 'Core Web Vitals Excellence', description: 'Lighthouse 95+ score targets on real-world networks.', displayOrder: 3 },
      ],
    },
  ],

  projectCategories: [
    { id: 'cat-enterprise', name: 'Enterprise Platforms', slug: 'enterprise-platforms', order: 1 },
    { id: 'cat-cloud', name: 'Cloud Infrastructure', slug: 'cloud-infrastructure', order: 2 },
    { id: 'cat-fintech', name: 'Fintech & Analytics', slug: 'fintech-analytics', order: 3 },
  ],

  projects: [
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
