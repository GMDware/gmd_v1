import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { INITIAL_SEED_DATA } from '../src/lib/db/seed-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Initiating Phase 1 Database Seeding...');

  // 1. Clear Existing Records in Dependency Order
  await prisma.rolePermission.deleteMany({});
  await prisma.userRole.deleteMany({});
  await prisma.permission.deleteMany({});
  await prisma.role.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.contactSubmission.deleteMany({});
  await prisma.projectGalleryItem.deleteMany({});
  await prisma.caseStudy.deleteMany({});
  await prisma.projectTechnology.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.projectCategory.deleteMany({});
  await prisma.serviceTechnology.deleteMany({});
  await prisma.serviceFeature.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.technology.deleteMany({});
  await prisma.teamMemberSocial.deleteMany({});
  await prisma.teamMember.deleteMany({});
  await prisma.teamRole.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.insight.deleteMany({});
  await prisma.insightCategory.deleteMany({});
  await prisma.companyValue.deleteMany({});
  await prisma.processStep.deleteMany({});
  await prisma.fAQ.deleteMany({});
  await prisma.navigationItem.deleteMany({});
  await prisma.socialLink.deleteMany({});
  await prisma.siteSetting.deleteMany({});
  await prisma.sEOSetting.deleteMany({});
  await prisma.adminUser.deleteMany({});

  console.log('🧹 Cleaned existing database tables');

  // 2. Seed Permissions
  const permissionsList = [
    { action: 'projects.read', description: 'View project listings and details' },
    { action: 'projects.create', description: 'Create new project entries' },
    { action: 'projects.update', description: 'Modify project details' },
    { action: 'projects.delete', description: 'Archive or delete projects' },
    { action: 'team.read', description: 'View team and founder records' },
    { action: 'team.create', description: 'Add new team members or founders' },
    { action: 'team.update', description: 'Edit team members or founders' },
    { action: 'team.delete', description: 'Archive or delete team members' },
    { action: 'services.read', description: 'View services and features' },
    { action: 'services.create', description: 'Create services' },
    { action: 'services.update', description: 'Update services' },
    { action: 'services.delete', description: 'Delete services' },
    { action: 'technologies.read', description: 'View technology catalog' },
    { action: 'technologies.create', description: 'Add technology items' },
    { action: 'technologies.update', description: 'Edit technology items' },
    { action: 'technologies.delete', description: 'Delete technology items' },
    { action: 'content.read', description: 'View content items (values, process, faqs, insights)' },
    { action: 'content.update', description: 'Update content items' },
    { action: 'contact.read', description: 'View inbound client inquiries' },
    { action: 'contact.update', description: 'Update inquiry status and triage notes' },
    { action: 'settings.read', description: 'View site settings and SEO defaults' },
    { action: 'settings.update', description: 'Modify global site and SEO settings' },
    { action: 'media.read', description: 'Browse media library assets' },
    { action: 'media.upload', description: 'Upload media assets' },
    { action: 'media.delete', description: 'Delete media assets' },
    { action: 'users.manage', description: 'Create, update, and manage administrative users' },
  ];

  const createdPermissions = new Map<string, string>();
  for (const perm of permissionsList) {
    const p = await prisma.permission.create({ data: perm });
    createdPermissions.set(p.action, p.id);
  }
  console.log(`✅ Created ${createdPermissions.size} granular permissions`);

  // 3. Seed Roles (Administrator, Editor, Viewer)
  const roleAdmin = await prisma.role.create({
    data: {
      name: 'Administrator',
      description: 'Unrestricted administrative access to all entities and settings',
    },
  });

  const roleEditor = await prisma.role.create({
    data: {
      name: 'Editor',
      description: 'Can manage content, projects, services, and team members; cannot manage users or delete records',
    },
  });

  const roleViewer = await prisma.role.create({
    data: {
      name: 'Viewer',
      description: 'Read-only administrative inspection access',
    },
  });

  // Assign all permissions to Administrator
  for (const permId of createdPermissions.values()) {
    await prisma.rolePermission.create({
      data: { roleId: roleAdmin.id, permissionId: permId },
    });
  }

  // Assign editor permissions
  const editorPermActions = [
    'projects.read', 'projects.create', 'projects.update',
    'team.read', 'team.create', 'team.update',
    'services.read', 'services.create', 'services.update',
    'technologies.read', 'technologies.create', 'technologies.update',
    'content.read', 'content.update',
    'contact.read', 'contact.update',
    'media.read', 'media.upload',
    'settings.read',
  ];
  for (const act of editorPermActions) {
    const permId = createdPermissions.get(act);
    if (permId) {
      await prisma.rolePermission.create({
        data: { roleId: roleEditor.id, permissionId: permId },
      });
    }
  }

  // Assign viewer permissions (all .read)
  for (const [act, permId] of createdPermissions.entries()) {
    if (act.endsWith('.read')) {
      await prisma.rolePermission.create({
        data: { roleId: roleViewer.id, permissionId: permId },
      });
    }
  }

  console.log('✅ Created roles: Administrator, Editor, Viewer');

  // 4. Seed Administrative Users
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@gmdware.com').toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || 'GMDware2026!';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const superAdmin = await prisma.adminUser.create({
    data: {
      email: adminEmail,
      passwordHash,
      name: 'Principal Administrator',
      roles: { create: [{ roleId: roleAdmin.id }] },
    },
  });

  const editorUser = await prisma.adminUser.create({
    data: {
      email: 'editor@gmdware.com',
      passwordHash,
      name: 'Content Editor',
      roles: { create: [{ roleId: roleEditor.id }] },
    },
  });

  const viewerUser = await prisma.adminUser.create({
    data: {
      email: 'viewer@gmdware.com',
      passwordHash,
      name: 'System Inspector (Viewer)',
      roles: { create: [{ roleId: roleViewer.id }] },
    },
  });

  console.log(`✅ Created administrative users: ${adminEmail}, editor@gmdware.com, viewer@gmdware.com`);

  // 5. Seed Departments & Roles
  const deptEng = await prisma.department.create({
    data: { name: 'Engineering Department', slug: 'engineering', order: 1 },
  });
  const deptArch = await prisma.department.create({
    data: { name: 'Systems Architecture', slug: 'systems-architecture', order: 2 },
  });

  const roleCtO = await prisma.teamRole.create({
    data: { title: 'Chief Architect', department: 'Systems Architecture' },
  });
  const roleStaff = await prisma.teamRole.create({
    data: { title: 'Principal Engineer', department: 'Engineering Department' },
  });

  // 6. Seed Baseline Team Members & Leadership Profiles
  await prisma.teamMember.create({
    data: {
      name: '[Leadership Profile Pending Configuration]',
      displayName: 'Co-Founder & Chief Architect',
      isFounder: true,
      founderTitle: 'Co-Founder & Chief Technology Officer',
      roleId: roleCtO.id,
      departmentId: deptArch.id,
      shortBio: 'Directs technical standards, systems architecture, and core engineering philosophy.',
      fullBio: 'Directs technical standards and core architecture principles with focus on distributed topologies, zero-compromise security, and runtime resilience.',
      skills: ['Distributed Systems', 'PostgreSQL', 'TypeScript', 'Next.js'],
      githubUrl: 'https://github.com/GMDware',
      linkedinUrl: 'https://www.linkedin.com/company/gmdware/',
      isFeatured: true,
      displayOrder: 1,
      isActive: true,
    },
  });

  await prisma.teamMember.create({
    data: {
      name: '[Engineering Lead Profile Pending]',
      displayName: 'Principal Software Engineer',
      isFounder: false,
      roleId: roleStaff.id,
      departmentId: deptEng.id,
      shortBio: 'Leading end-to-end web applications, microservices integration, and real-time interactive systems.',
      skills: ['Cloud Architecture', 'Docker', 'Prisma', 'API Design'],
      isFeatured: true,
      displayOrder: 2,
      isActive: true,
    },
  });

  // 7. Seed Technologies
  const techTs = await prisma.technology.create({
    data: {
      name: 'TypeScript',
      slug: 'typescript',
      category: 'Frontend',
      description: 'Strict static type checking across client and server.',
      isFeatured: true,
      displayOrder: 1,
    },
  });

  const techNext = await prisma.technology.create({
    data: {
      name: 'Next.js',
      slug: 'nextjs',
      category: 'Frontend',
      description: 'App Router architecture with streaming server components.',
      isFeatured: true,
      displayOrder: 2,
    },
  });

  const techPg = await prisma.technology.create({
    data: {
      name: 'PostgreSQL',
      slug: 'postgresql',
      category: 'Backend',
      description: 'ACID-compliant relational persistence layer.',
      isFeatured: true,
      displayOrder: 3,
    },
  });

  // 8. Seed Services
  const srv1 = await prisma.service.create({
    data: {
      title: 'Enterprise Software Development',
      slug: 'enterprise-software-development',
      summary: 'Tailored enterprise software architecture engineered for mission-critical reliability.',
      content: 'Bespoke enterprise software engineered from first principles with uncompromising focus on performance, fault tolerance, and domain boundaries.',
      iconName: 'Code2',
      displayOrder: 1,
      isFeatured: true,
      isActive: true,
      features: {
        create: [
          { title: 'Domain-Driven Design', description: 'Clear architectural boundary isolation.', displayOrder: 1 },
          { title: 'Type Soundness', description: 'Zero any types from database to UI.', displayOrder: 2 },
        ],
      },
      technologies: {
        create: [
          { technologyId: techTs.id },
          { technologyId: techNext.id },
        ],
      },
    },
  });

  // 9. Seed Project Categories & Projects
  const categoryIdMap = new Map<string, string>();
  for (const cat of INITIAL_SEED_DATA.projectCategories) {
    const createdCat = await prisma.projectCategory.create({
      data: { name: cat.name, slug: cat.slug, order: cat.order },
    });
    categoryIdMap.set(cat.id, createdCat.id);
    categoryIdMap.set(cat.slug, createdCat.id);
  }

  const techIdMap = new Map<string, string>([
    ['tech-ts', techTs.id],
    ['tech-next', techNext.id],
    ['tech-pg', techPg.id],
  ]);

  for (const p of INITIAL_SEED_DATA.projects) {
    const resolvedCatId =
      categoryIdMap.get(p.categoryId) ||
      categoryIdMap.get((p as any).categorySlug) ||
      Array.from(categoryIdMap.values())[0];

    const techIds = ((p as any).technologyIds || [])
      .map((id: string) => techIdMap.get(id))
      .filter(Boolean) as string[];

    const {
      caseStudy,
      technologyIds,
      categorySlug,
      uxApproach,
      uiApproach,
      liveUrl,
      href,
      isConcept,
      conceptBadge,
      archetype,
      ...projData
    } = p as any;

    await prisma.project.create({
      data: {
        ...projData,
        categoryId: resolvedCatId,
        technologies: techIds.length
          ? {
              create: techIds.map((tId) => ({ technologyId: tId })),
            }
          : undefined,
        caseStudy: caseStudy
          ? {
              create: {
                summary: caseStudy.summary || '',
                metrics: caseStudy.metrics,
                testimonial: caseStudy.testimonial,
                status: p.status || 'PUBLISHED',
              },
            }
          : undefined,
      },
    });
  }

  // 10. Seed Content: Process Steps, Values, FAQs, Insights, Settings
  const processData = [
    { stepNumber: 1, title: 'Discover: Domain Modeling & Discovery', phase: 'Discover', description: 'Auditing organizational bottlenecks, domain constraints, and requirements.', deliverables: ['Domain Problem Audit', 'System Requirements Spec', 'Feasibility Model'] },
    { stepNumber: 2, title: 'Strategize: Systems Architecture & Topologies', phase: 'Strategize', description: 'Constructing type-safe domain boundaries, data models, and API contracts.', deliverables: ['Architecture Blueprint', 'Database ERD', 'API Specification'] },
    { stepNumber: 3, title: 'Design: UI/UX & Design Systems', phase: 'Design', description: 'Translating complex workflows into intuitive digital flagships with ergonomic motion.', deliverables: ['Design Tokens', 'Figma Interactive Prototype', 'Viewport Matrix'] },
    { stepNumber: 4, title: 'Build: Core Engineering & Concurrency Pipelines', phase: 'Build', description: 'Full-stack engineering, strict type safety, clean abstractions, and concurrency queues.', deliverables: ['Type-Safe Backend Services', 'Next.js Client Application', 'Automated Test Suite'] },
    { stepNumber: 5, title: 'Test: Automated Verification & Load Hardening', phase: 'Test', description: 'Subjecting the platform to penetration testing, peak load benchmarking, and query tuning.', deliverables: ['Security Audit Report', 'Load & Stress Benchmarks', 'Query Optimization'] },
    { stepNumber: 6, title: 'Deploy: Zero-Downtime Multi-Region Cutover', phase: 'Deploy', description: 'Coordinating zero-downtime production deployment with multi-region edge routing.', deliverables: ['Zero-Downtime Blue/Green Release', 'Multi-Region Routing', 'Automated Disaster Recovery'] },
    { stepNumber: 7, title: 'Evolve: Observability, Scaling & Stewardship', phase: 'Evolve', description: 'Long-term proactive stewardship, APM telemetry monitoring, and performance profiling.', deliverables: ['Real-Time APM Dashboards', 'Security Patching Protocol', 'SLA Health Guarantees'] },
  ];
  for (const step of processData) {
    await prisma.processStep.create({ data: step });
  }

  const valuesData = [
    { title: 'Architectural Integrity', summary: 'Every architectural decision is rooted in first principles.', displayOrder: 1 },
    { title: 'Zero-Compromise Security', summary: 'Cryptographic session protection and strict input sanitization.', displayOrder: 2 },
  ];
  for (const val of valuesData) {
    await prisma.companyValue.create({ data: val });
  }

  await prisma.fAQ.create({
    data: {
      question: 'How is data managed dynamically on the platform?',
      answer: 'All projects, services, team members, and settings are fully manageable through the protected Admin Dashboard.',
      category: 'General',
      displayOrder: 1,
    },
  });

  const insightCat = await prisma.insightCategory.create({
    data: { name: 'Engineering Insights', slug: 'engineering-insights' },
  });

  await prisma.insight.create({
    data: {
      title: 'First-Principles Architecture in Modern Web Platforms',
      slug: 'first-principles-architecture',
      summary: 'Exploring why clean domain boundaries and strict type-safety matter under scale.',
      content: 'Detailed article content exploring systems engineering principles.',
      categoryId: insightCat.id,
      authorId: superAdmin.id,
      readTimeMin: 5,
      tags: ['Architecture', 'TypeScript', 'Systems Design'],
      status: 'PUBLISHED',
      isFeatured: true,
      publishedAt: new Date(),
    },
  });

  // 11. Seed Site Settings & Social Links
  const settingsData = [
    { key: 'brand_name', value: 'GMDware', group: 'branding', description: 'Official corporate entity name' },
    { key: 'tagline', value: 'Architecting High-Performance Digital Solutions & Enterprise Software', group: 'branding', description: 'Corporate tagline' },
    { key: 'contact_email', value: 'gmdware@gmail.com', group: 'contact', description: 'Official corporate and inquiries inbox' },
    { key: 'office_location', value: '[Corporate Headquarters Pending Configuration]', group: 'contact', description: 'Office location' },
    { key: 'mission_statement', value: 'To engineer resilient, scalable, and mathematically sound digital infrastructure that accelerates enterprise transformation.', group: 'company', description: 'Mission statement' },
    { key: 'vision_statement', value: 'Setting the benchmark for modern software craftsmanship, zero-compromise security, and cinematic digital user experiences.', group: 'company', description: 'Vision statement' },
  ];
  for (const s of settingsData) {
    await prisma.siteSetting.create({ data: s });
  }

  await prisma.socialLink.create({
    data: { platform: 'Instagram', url: 'https://www.instagram.com/gmdware?stkn=MWx5aWQ3bzVvcmVxZg==', displayOrder: 1, isEnabled: true },
  });
  await prisma.socialLink.create({
    data: { platform: 'Facebook', url: 'https://www.facebook.com/share/1C9HwYw9HR/', displayOrder: 2, isEnabled: true },
  });
  await prisma.socialLink.create({
    data: { platform: 'TikTok', url: 'https://www.tiktok.com/@gmdwareofficial?_r=1&_t=ZS-99ZsGCjCz4b', displayOrder: 3, isEnabled: true },
  });
  await prisma.socialLink.create({
    data: { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/gmdware/', displayOrder: 4, isEnabled: true },
  });
  await prisma.socialLink.create({
    data: { platform: 'GitHub', url: 'https://github.com/GMDware', displayOrder: 5, isEnabled: true },
  });

  await prisma.navigationItem.create({
    data: { label: 'Services', path: '/services', location: 'header', displayOrder: 1 },
  });
  await prisma.navigationItem.create({
    data: { label: 'Work', path: '/projects', location: 'header', displayOrder: 2 },
  });
  await prisma.navigationItem.create({
    data: { label: 'About', path: '/about', location: 'header', displayOrder: 3 },
  });
  await prisma.navigationItem.create({
    data: { label: 'Contact', path: '/contact', location: 'header', displayOrder: 4 },
  });

  console.log('✨ Seeding successfully completed! All models populated with clean Version 1.0 production data.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
