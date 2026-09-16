'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';
import { useAdminToast } from '@/components/admin/AdminToast';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import {
  Plus,
  Search,
  Filter,
  ExternalLink,
  Edit3,
  Archive,
  Trash2,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Star,
  StarOff,
  Eye,
  EyeOff,
  Layers,
  Sparkles,
  Image as ImageIcon,
  Globe,
  X,
  FileText,
  Save,
  Check,
  RotateCcw,
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  categoryId: string;
  category?: { id: string; name: string; slug?: string };
  clientName?: string | null;
  clientVisibility: boolean;
  projectType: string;
  heroImageId?: string | null;
  heroImage?: { id: string; url: string; originalName: string } | null;
  challenge?: string | null;
  strategy?: string | null;
  designApproach?: string | null;
  architecture?: string | null;
  development?: string | null;
  infrastructure?: string | null;
  results?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords: string[];
  isFeatured: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  displayOrder: number;
  technologies?: Array<{ technology: { id: string; name: string } }>;
  caseStudy?: {
    id?: string;
    summary: string;
    metrics?: any;
    testimonial?: any;
  } | null;
}

interface Category {
  id: string;
  name: string;
  slug?: string;
}

interface Technology {
  id: string;
  name: string;
  slug: string;
  category: string;
}

export default function AdminProjectsPage() {
  const { success, error } = useAdminToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Editor Modal states
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [saving, setSaving] = useState(false);

  // Category creation & direct image URL input
  const [newCatInput, setNewCatInput] = useState('');
  const [showAddCat, setShowAddCat] = useState(false);
  const [creatingCat, setCreatingCat] = useState(false);

  const [heroUrlInput, setHeroUrlInput] = useState('');
  const [applyingHeroUrl, setApplyingHeroUrl] = useState(false);

  // Delete / Archive Modal
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    projectId: string;
    title: string;
    isPermanent: boolean;
  }>({
    open: false,
    projectId: '',
    title: '',
    isPermanent: false,
  });

  // Media Picker modal
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [projRes, techRes, catRes] = await Promise.all([
        fetch('/api/v1/projects'),
        fetch('/api/v1/technologies'),
        fetch('/api/v1/projects/categories'),
      ]);

      const projJson = await projRes.json();
      const techJson = await techRes.json();
      const catJson = await catRes.json();

      let loadedCategories: Category[] = [];
      if (catJson.success && Array.isArray(catJson.data) && catJson.data.length > 0) {
        loadedCategories = catJson.data;
        setCategories(loadedCategories);
      }

      if (projJson.success && projJson.data) {
        const rawProjects: Project[] = Array.isArray(projJson.data)
          ? projJson.data
          : (projJson.data.projects || []);
        setProjects(rawProjects);

        if (loadedCategories.length === 0) {
          const catMap = new Map<string, Category>();
          rawProjects.forEach((p: Project) => {
            if (p.category) {
              catMap.set(p.category.id, p.category);
            }
          });
          if (catMap.size > 0) {
            setCategories(Array.from(catMap.values()));
          }
        }
      }

      if (techJson.success && techJson.data) {
        setTechnologies(Array.isArray(techJson.data) ? techJson.data : []);
      }
    } catch {
      error('Failed to load project database');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCatInput.trim()) return;
    setCreatingCat(true);
    try {
      const res = await fetch('/api/v1/projects/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatInput.trim() }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        const createdCat = json.data;
        setCategories((prev) => [...prev, createdCat]);
        setEditingProject((prev) => (prev ? { ...prev, categoryId: createdCat.id } : null));
        setNewCatInput('');
        setShowAddCat(false);
        success(`Category "${createdCat.name}" created`);
      } else {
        error(json.error || 'Failed to create category');
      }
    } catch {
      error('Error creating category');
    } finally {
      setCreatingCat(false);
    }
  };

  const handleApplyHeroUrl = async () => {
    if (!heroUrlInput.trim()) return;
    setApplyingHeroUrl(true);
    try {
      const res = await fetch('/api/v1/media/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: heroUrlInput.trim() }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        const asset = json.data;
        setEditingProject((prev) =>
          prev
            ? {
                ...prev,
                heroImageId: asset.id,
                heroImage: {
                  id: asset.id,
                  url: asset.url || asset.storageUrl,
                  originalName: asset.originalName || asset.fileName || 'Showcase Image',
                },
              }
            : null
        );
        setHeroUrlInput('');
        success('Showcase image loaded successfully');
      } else {
        error(json.error?.message || 'Failed to import image from URL');
      }
    } catch {
      error('Error importing image from URL');
    } finally {
      setApplyingHeroUrl(false);
    }
  };

  // Open editor for new project
  const handleNewProject = () => {
    const defaultCatId = categories[0]?.id || '';

    setEditingProject({
      title: '',
      slug: '',
      shortDescription: '',
      fullDescription: '',
      categoryId: defaultCatId,
      projectType: 'Enterprise Web Platform',
      clientName: '',
      clientVisibility: false,
      heroImageId: null,
      heroImage: null,
      challenge: '',
      strategy: '',
      designApproach: '',
      architecture: '',
      development: '',
      infrastructure: '',
      results: '',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: [],
      isFeatured: false,
      status: 'DRAFT',
      displayOrder: projects.length + 1,
      technologies: [],
      caseStudy: {
        summary: '',
        metrics: [
          { label: 'Latency', value: '< 100ms' },
          { label: 'Availability', value: '99.99%' },
        ],
        testimonial: {
          quote: '',
          author: '',
          role: '',
          organization: '',
        },
      },
    });
    setNewCatInput('');
    setShowAddCat(false);
    setHeroUrlInput('');
    setActiveTab('basic');
    setEditorOpen(true);
  };

  // Open editor for existing project
  const handleEditProject = (project: Project) => {
    setEditingProject({
      ...project,
      caseStudy: project.caseStudy || {
        summary: '',
        metrics: [
          { label: 'Latency', value: '< 100ms' },
          { label: 'Availability', value: '99.99%' },
        ],
        testimonial: {
          quote: '',
          author: '',
          role: '',
          organization: '',
        },
      },
    });
    setNewCatInput('');
    setShowAddCat(false);
    setHeroUrlInput('');
    setActiveTab('basic');
    setEditorOpen(true);
  };

  // Slug generator helper
  const handleGenerateSlug = () => {
    if (!editingProject?.title) return;
    const generated = editingProject.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setEditingProject((prev) => (prev ? { ...prev, slug: generated } : null));
  };

  // Save Project (Create or Update)
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    if (!editingProject.title?.trim()) {
      error('Please enter Project Title');
      setActiveTab('basic');
      return;
    }

    const title = editingProject.title.trim();
    const slug =
      editingProject.slug?.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    let finalCategoryId = editingProject.categoryId;
    if (!finalCategoryId && categories.length > 0) {
      finalCategoryId = categories[0].id;
    }

    if (!finalCategoryId) {
      error('Please select or create a Category');
      setActiveTab('basic');
      return;
    }

    const shortDesc =
      editingProject.shortDescription?.trim() ||
      `${title} — technical case study and platform architecture.`;
    const fullDesc =
      editingProject.fullDescription?.trim() ||
      shortDesc;

    setSaving(true);
    try {
      const isNew = !editingProject.id;
      const url = isNew ? '/api/v1/projects' : `/api/v1/projects/${editingProject.id}`;
      const method = isNew ? 'POST' : 'PUT';

      // Extract technology IDs
      const selectedTechIds = (editingProject.technologies || []).map((t) => t.technology.id);

      const payload = {
        ...editingProject,
        title,
        slug,
        categoryId: finalCategoryId,
        shortDescription: shortDesc,
        fullDescription: fullDesc,
        heroImageId: editingProject.heroImageId || null,
        technologyIds: selectedTechIds,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        success(isNew ? 'Project created successfully' : 'Project updated successfully');
        setEditorOpen(false);
        setEditingProject(null);
        await loadData();
      } else {
        const errorMsg =
          json.details?.fieldErrors
            ? Object.entries(json.details.fieldErrors)
                .map(([field, errs]: [string, any]) => `${field}: ${Array.isArray(errs) ? errs.join(', ') : errs}`)
                .join(' | ')
            : json.error?.message || json.error || 'Failed to save project';
        error(errorMsg);
      }
    } catch {
      error('Network error occurred while saving project');
    } finally {
      setSaving(false);
    }
  };

  // Toggle publish/unpublish
  const handleTogglePublish = async (project: Project) => {
    try {
      const res = await fetch(`/api/v1/projects/${project.id}/publish`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        success(`Project status changed to ${json.data.status}`);
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, status: json.data.status } : p))
        );
      }
    } catch {
      error('Failed to toggle publish status');
    }
  };

  // Toggle featured
  const handleToggleFeature = async (project: Project) => {
    try {
      const res = await fetch(`/api/v1/projects/${project.id}/feature`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        success(json.data.isFeatured ? 'Project featured' : 'Project removed from featured');
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, isFeatured: json.data.isFeatured } : p))
        );
      }
    } catch {
      error('Failed to toggle featured status');
    }
  };

  // Reorder projects (move up or down)
  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const newProjects = [...projects];
    const [moved] = newProjects.splice(index, 1);
    newProjects.splice(targetIndex, 0, moved);

    // Update display orders
    const items = newProjects.map((p, idx) => ({ id: p.id, displayOrder: idx + 1 }));
    setProjects(newProjects.map((p, idx) => ({ ...p, displayOrder: idx + 1 })));

    try {
      const res = await fetch('/api/v1/projects/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const json = await res.json();
      if (json.success) {
        success('Project ordering saved');
      }
    } catch {
      error('Failed to update project ordering');
      loadData();
    }
  };

  // Delete project
  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`/api/v1/projects/${confirmModal.projectId}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        success('Project archived successfully');
        setProjects((prev) => prev.filter((p) => p.id !== confirmModal.projectId));
      } else {
        error(json.error || 'Failed to archive project');
      }
    } catch {
      error('Error archiving project');
    }
  };

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      (p.title && p.title.toLowerCase().includes(search.toLowerCase())) ||
      (p.slug && p.slug.toLowerCase().includes(search.toLowerCase())) ||
      (p.shortDescription && p.shortDescription.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesCat = categoryFilter === 'ALL' || p.categoryId === categoryFilter;

    return matchesSearch && matchesStatus && matchesCat;
  });

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Portfolio & Projects' }]} />

      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Portfolio & Case Studies Manager
          </h1>
          <p className="text-xs text-slate-400">
            Publish, edit, reorder, and structure technical case studies without touching source code.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={handleNewProject}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create Project
        </Button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0A0E17]/60 p-3 rounded-xl border border-white/5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by title, slug, or challenge..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F2FE]"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#05070B] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-[#00F2FE]"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#05070B] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-[#00F2FE]"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 font-mono text-xs">
          Loading project catalog from database...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl space-y-3 bg-[#0A0E17]/20">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No projects found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {search || statusFilter !== 'ALL'
              ? 'Try adjusting your search criteria or active filters.'
              : 'Start by creating your first flagship engineering project.'}
          </p>
          <Button size="sm" variant="primary" onClick={handleNewProject} leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Create Project
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project, index) => {
            const isPublished = project.status === 'PUBLISHED';
            const isArchived = project.status === 'ARCHIVED';

            return (
              <div
                key={project.id}
                className="glass-panel p-5 rounded-xl border border-white/10 hover:border-white/20 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0A0E17]/40"
              >
                {/* Left: Reorder & Info */}
                <div className="flex items-start gap-4 min-w-0">
                  {/* Up / Down reorder arrows */}
                  <div className="flex flex-col gap-1 shrink-0 pt-0.5">
                    <button
                      type="button"
                      onClick={() => handleReorder(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-20 transition-colors"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReorder(index, 'down')}
                      disabled={index === projects.length - 1}
                      className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-20 transition-colors"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Thumbnail / placeholder */}
                  <div className="w-16 h-12 rounded-lg bg-[#05070B] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                    {project.heroImage?.url ? (
                      <img
                        src={project.heroImage.url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Layers className="w-5 h-5 text-slate-600" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-white tracking-tight truncate max-w-md">
                        {project.title}
                      </h3>

                      {isPublished && <Badge variant="emerald" size="sm">PUBLISHED</Badge>}
                      {project.status === 'DRAFT' && <Badge variant="neutral" size="sm">DRAFT</Badge>}
                      {isArchived && <Badge variant="rose" size="sm">ARCHIVED</Badge>}
                      {project.isFeatured && <Badge variant="cyan" size="sm">FEATURED</Badge>}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400">
                      <span>TYPE: <strong className="text-slate-300">{project.projectType}</strong></span>
                      <span>•</span>
                      <span>CLIENT: <strong className="text-slate-300">{project.clientName || 'Confidential'}</strong></span>
                      <span>•</span>
                      <span className="text-[#00F2FE]">/work/{project.slug}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap items-center gap-2 self-end lg:self-center shrink-0">
                  {/* Public preview */}
                  <a
                    href={`/work/${project.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    title="View live case study"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  {/* Feature toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleFeature(project)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      project.isFeatured
                        ? 'bg-[#00F2FE]/10 border-[#00F2FE]/30 text-[#00F2FE]'
                        : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'
                    }`}
                    title={project.isFeatured ? 'Remove featured flag' : 'Mark as featured'}
                  >
                    <Star className="w-4 h-4" />
                  </button>

                  {/* Publish toggle */}
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(project)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isPublished
                        ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]'
                        : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'
                    }`}
                    title={isPublished ? 'Unpublish to DRAFT' : 'Publish live'}
                  >
                    {isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* Edit button */}
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEditProject(project)}
                    leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                  >
                    Edit
                  </Button>

                  {/* Archive button */}
                  <button
                    type="button"
                    onClick={() =>
                      setConfirmModal({
                        open: true,
                        projectId: project.id,
                        title: project.title,
                        isPermanent: false,
                      })
                    }
                    className="p-1.5 rounded-lg hover:bg-[#F43F5E]/10 text-slate-500 hover:text-[#F43F5E] transition-colors"
                    title="Archive project"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
        onConfirm={handleConfirmDelete}
        title="Archive Project"
        message={`Are you sure you want to archive "${confirmModal.title}"? It will be withdrawn from the public showcase.`}
        confirmLabel="Archive Project"
        variant="danger"
      />

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        selectedId={editingProject?.heroImageId || undefined}
        onSelect={(asset) => {
          const resolvedUrl = asset.url || (asset as any).storageUrl || '';
          setEditingProject((prev) =>
            prev
              ? {
                  ...prev,
                  heroImageId: asset.id,
                  heroImage: { id: asset.id, url: resolvedUrl, originalName: asset.originalName || asset.filename },
                }
              : null
          );
        }}
      />

      {/* Project Editor Modal */}
      {editorOpen && editingProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in"
        >
          <div className="relative w-full max-w-4xl bg-[#0A0E17] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-[#06090F]">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#00F2FE]" />
                  <span>{editingProject.id ? 'Edit Case Study' : 'Create New Case Study'}</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Fill in the structured dimensions for the public portfolio.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="px-6 bg-[#06090F] shrink-0">
              <AdminTabs
                tabs={[
                  { id: 'basic', label: '1. Basic Info' },
                  { id: 'casestudy', label: '2. Case Study Architecture' },
                  { id: 'tech', label: '3. Technologies' },
                  { id: 'media', label: '4. Media' },
                  { id: 'seo', label: '5. SEO & Publishing' },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
              />
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProject} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: BASIC INFORMATION */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">
                        Project Title <span className="text-[#F43F5E]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProject.title || ''}
                        onChange={(e) =>
                          setEditingProject((prev) => (prev ? { ...prev, title: e.target.value } : null))
                        }
                        placeholder="e.g. Autonomous Real-Time Telemetry Platform"
                        className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono text-slate-300">
                          Slug URL <span className="text-[#F43F5E]">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={handleGenerateSlug}
                          className="text-[10px] text-[#00F2FE] hover:underline font-mono"
                        >
                          Auto-generate
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={editingProject.slug || ''}
                        onChange={(e) =>
                          setEditingProject((prev) => (prev ? { ...prev, slug: e.target.value } : null))
                        }
                        placeholder="real-time-telemetry-platform"
                        className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#00F2FE]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono text-slate-300">
                          Category <span className="text-[#F43F5E]">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowAddCat(!showAddCat)}
                          className="text-[10px] text-[#00F2FE] hover:underline font-mono flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> {showAddCat ? 'Cancel' : 'Add New'}
                        </button>
                      </div>

                      {showAddCat && (
                        <div className="flex items-center gap-1.5 p-2 bg-[#06090F] border border-[#00F2FE]/30 rounded-lg">
                          <input
                            type="text"
                            value={newCatInput}
                            onChange={(e) => setNewCatInput(e.target.value)}
                            placeholder="New Category name..."
                            className="flex-1 px-2.5 py-1 bg-[#0A0E17] border border-white/10 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F2FE]"
                            autoFocus
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="primary"
                            isLoading={creatingCat}
                            onClick={handleCreateCategory}
                            className="text-xs px-2.5 py-1"
                          >
                            Save
                          </Button>
                        </div>
                      )}

                      <select
                        value={editingProject.categoryId || ''}
                        onChange={(e) =>
                          setEditingProject((prev) => (prev ? { ...prev, categoryId: e.target.value } : null))
                        }
                        className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-[#00F2FE]"
                      >
                        {categories.length === 0 ? (
                          <option value="">No categories available — click "Add New" above</option>
                        ) : (
                          categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">Project Type</label>
                      <input
                        type="text"
                        value={editingProject.projectType || ''}
                        onChange={(e) =>
                          setEditingProject((prev) => (prev ? { ...prev, projectType: e.target.value } : null))
                        }
                        placeholder="e.g. Distributed Cloud Platform"
                        className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">Client / Partner Name</label>
                      <input
                        type="text"
                        value={editingProject.clientName || ''}
                        onChange={(e) =>
                          setEditingProject((prev) => (prev ? { ...prev, clientName: e.target.value } : null))
                        }
                        placeholder="e.g. Confidential Enterprise Partner"
                        className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Short Summary (Index Cards)</label>
                    <textarea
                      rows={2}
                      value={editingProject.shortDescription || ''}
                      onChange={(e) =>
                        setEditingProject((prev) => (prev ? { ...prev, shortDescription: e.target.value } : null))
                      }
                      placeholder="Brief overview displayed on card previews..."
                      className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Full Description</label>
                    <textarea
                      rows={4}
                      value={editingProject.fullDescription || ''}
                      onChange={(e) =>
                        setEditingProject((prev) => (prev ? { ...prev, fullDescription: e.target.value } : null))
                      }
                      placeholder="Comprehensive project narrative and context..."
                      className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: STRUCTURED CASE STUDY */}
              {activeTab === 'casestudy' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-[#00F2FE] uppercase">The Challenge</label>
                      <textarea
                        rows={3}
                        value={editingProject.challenge || ''}
                        onChange={(e) =>
                          setEditingProject((prev) => (prev ? { ...prev, challenge: e.target.value } : null))
                        }
                        placeholder="What specific architectural difficulty did the partner face?"
                        className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-[#00F2FE] uppercase">Architectural Strategy</label>
                      <textarea
                        rows={3}
                        value={editingProject.strategy || ''}
                        onChange={(e) =>
                          setEditingProject((prev) => (prev ? { ...prev, strategy: e.target.value } : null))
                        }
                        placeholder="How did GMDware engineer the solution?"
                        className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-[#00F2FE] uppercase">UX & UI Execution (Design Approach)</label>
                      <textarea
                        rows={3}
                        value={editingProject.designApproach || ''}
                        onChange={(e) =>
                          setEditingProject((prev) => (prev ? { ...prev, designApproach: e.target.value } : null))
                        }
                        placeholder="Visual hierarchy, responsiveness, and interaction ergonomics..."
                        className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-[#00F2FE] uppercase">Infrastructure & Deployment</label>
                      <textarea
                        rows={3}
                        value={editingProject.infrastructure || ''}
                        onChange={(e) =>
                          setEditingProject((prev) => (prev ? { ...prev, infrastructure: e.target.value } : null))
                        }
                        placeholder="Cloud topography, Docker, Kubernetes, CI/CD..."
                        className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#10B981] uppercase">Measured Results</label>
                    <textarea
                      rows={2}
                      value={editingProject.results || ''}
                      onChange={(e) =>
                        setEditingProject((prev) => (prev ? { ...prev, results: e.target.value } : null))
                      }
                      placeholder="Empirical outcomes, latency reduction, and reliability metrics..."
                      className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#10B981]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: TECHNOLOGIES */}
              {activeTab === 'tech' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-400">
                    Select the technologies and architectural frameworks used in this deployment:
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                    {technologies.map((tech) => {
                      const isSelected = (editingProject.technologies || []).some(
                        (t) => t.technology.id === tech.id
                      );

                      return (
                        <button
                          key={tech.id}
                          type="button"
                          onClick={() => {
                            setEditingProject((prev) => {
                              if (!prev) return null;
                              const current = prev.technologies || [];
                              const exists = current.some((t) => t.technology.id === tech.id);
                              const updated = exists
                                ? current.filter((t) => t.technology.id !== tech.id)
                                : [...current, { technology: tech }];
                              return { ...prev, technologies: updated };
                            });
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-mono text-left flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-[#00F2FE]/10 border-[#00F2FE] text-white'
                              : 'bg-[#05070B] border-white/10 text-slate-400 hover:border-white/20'
                          }`}
                        >
                          <span className="truncate">{tech.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#00F2FE] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: MEDIA */}
              {activeTab === 'media' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-300 block">Hero / Showcase Image</label>

                    <div className="flex items-start gap-4 p-4 rounded-xl border border-white/10 bg-[#05070B]">
                      <div className="w-36 h-24 rounded-lg bg-[#0A0E17] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                        {editingProject.heroImage?.url ? (
                          <img
                            src={editingProject.heroImage.url}
                            alt="Hero preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-slate-600" />
                        )}
                      </div>

                      <div className="space-y-3 flex-1">
                        <div>
                          <span className="text-xs text-white font-medium block truncate">
                            {editingProject.heroImage?.originalName || 'No image attached'}
                          </span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            Upload a hero banner from your device or paste a public image URL
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => setMediaPickerOpen(true)}
                            leftIcon={<ImageIcon className="w-3.5 h-3.5" />}
                          >
                            Select / Upload from Library
                          </Button>
                          {editingProject.heroImageId && (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                setEditingProject((prev) =>
                                  prev ? { ...prev, heroImageId: null, heroImage: null } : null
                                )
                              }
                              className="text-slate-400 hover:text-[#F43F5E]"
                            >
                              Remove Image
                            </Button>
                          )}
                        </div>

                        {/* Direct Image URL input */}
                        <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                          <input
                            type="url"
                            placeholder="Or paste direct image URL (https://... or data:...)"
                            value={heroUrlInput}
                            onChange={(e) => setHeroUrlInput(e.target.value)}
                            className="flex-1 px-3 py-1.5 bg-[#0A0E17] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F2FE]"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="primary"
                            isLoading={applyingHeroUrl}
                            onClick={handleApplyHeroUrl}
                            disabled={!heroUrlInput.trim()}
                          >
                            Apply URL
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SEO & PUBLISHING */}
              {activeTab === 'seo' && (
                <div className="space-y-6">
                  <div className="space-y-4 border-b border-white/5 pb-6">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Search Engine Optimization
                    </h4>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">Custom SEO Title</label>
                      <input
                        type="text"
                        value={editingProject.seoTitle || ''}
                        onChange={(e) =>
                          setEditingProject((prev) => (prev ? { ...prev, seoTitle: e.target.value } : null))
                        }
                        placeholder="Leave empty to use project title"
                        className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">Custom Meta Description</label>
                      <textarea
                        rows={2}
                        value={editingProject.seoDescription || ''}
                        onChange={(e) =>
                          setEditingProject((prev) =>
                            prev ? { ...prev, seoDescription: e.target.value } : null
                          )
                        }
                        placeholder="Meta description for search engine previews..."
                        className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Publishing State & Controls
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-slate-300">Publication Status</label>
                        <select
                          value={editingProject.status || 'DRAFT'}
                          onChange={(e) =>
                            setEditingProject((prev) =>
                              prev ? { ...prev, status: e.target.value as any } : null
                            )
                          }
                          className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-[#00F2FE]"
                        >
                          <option value="DRAFT">DRAFT (Unpublished)</option>
                          <option value="PUBLISHED">PUBLISHED (Live on Website)</option>
                          <option value="ARCHIVED">ARCHIVED</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-slate-300">Display Order</label>
                        <input
                          type="number"
                          value={editingProject.displayOrder || 1}
                          onChange={(e) =>
                            setEditingProject((prev) =>
                              prev ? { ...prev, displayOrder: parseInt(e.target.value) || 1 } : null
                            )
                          }
                          className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProject.isFeatured || false}
                          onChange={(e) =>
                            setEditingProject((prev) =>
                              prev ? { ...prev, isFeatured: e.target.checked } : null
                            )
                          }
                          className="w-4 h-4 rounded bg-[#05070B] border-white/10 text-[#00F2FE] focus:ring-0"
                        />
                        <span className="text-xs text-white">Feature in Flagship Highlights</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProject.clientVisibility || false}
                          onChange={(e) =>
                            setEditingProject((prev) =>
                              prev ? { ...prev, clientVisibility: e.target.checked } : null
                            )
                          }
                          className="w-4 h-4 rounded bg-[#05070B] border-white/10 text-[#00F2FE] focus:ring-0"
                        />
                        <span className="text-xs text-white">Display Client Name Publicly</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="p-6 border-t border-white/5 flex items-center justify-between bg-[#06090F] shrink-0 -mx-6 -mb-6 mt-6">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditorOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>

                <div className="flex items-center gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={saving}
                    leftIcon={<Save className="w-3.5 h-3.5" />}
                  >
                    Save Project
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
