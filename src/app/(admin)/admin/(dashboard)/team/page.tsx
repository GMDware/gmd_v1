'use client';

import React, { useState, useEffect } from 'react';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';
import { useAdminToast } from '@/components/admin/AdminToast';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  CheckCircle2,
  Users,
  Shield,
  Briefcase,
  Layers,
  Image as ImageIcon,
  Save,
  X,
  Check,
  Globe,
  Mail,
  Eye,
  EyeOff,
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  displayName: string;
  isFounder: boolean;
  founderTitle?: string | null;
  roleId: string;
  role?: { id: string; title: string };
  departmentId: string;
  department?: { id: string; name: string };
  shortBio: string;
  fullBio?: string | null;
  imageId?: string | null;
  image?: { id: string; url: string; originalName: string } | null;
  skills: string[];
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  websiteUrl?: string | null;
  email?: string | null;
  showEmail: boolean;
  isFeatured: boolean;
  displayOrder: number;
  isActive: boolean;
}

interface Department {
  id: string;
  name: string;
  slug: string;
  order: number;
}

interface TeamRole {
  id: string;
  title: string;
}

export default function AdminTeamPage() {
  const { success, error } = useAdminToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<TeamRole[]>([]);
  const [loading, setLoading] = useState(true);

  // Tabs: all, founders, departments
  const [currentTab, setCurrentTab] = useState<'all' | 'founders' | 'departments'>('all');
  const [search, setSearch] = useState('');

  // Editor Modal
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);

  // Inline creation state
  const [newDeptInput, setNewDeptInput] = useState('');
  const [showAddDept, setShowAddDept] = useState(false);
  const [creatingDept, setCreatingDept] = useState(false);

  const [newRoleInput, setNewRoleInput] = useState('');
  const [showAddRole, setShowAddRole] = useState(false);
  const [creatingRole, setCreatingRole] = useState(false);

  const [avatarUrlInput, setAvatarUrlInput] = useState('');
  const [applyingAvatarUrl, setApplyingAvatarUrl] = useState(false);

  // Media Picker
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  // Delete modal
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string; name: string }>({
    open: false,
    id: '',
    name: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [teamRes, deptRes, rolesRes] = await Promise.all([
        fetch('/api/v1/team'),
        fetch('/api/v1/departments'),
        fetch('/api/v1/team/roles'),
      ]);

      const teamJson = await teamRes.json();
      const deptJson = await deptRes.json();
      const rolesJson = await rolesRes.json();

      if (teamJson.success && teamJson.data) {
        setMembers(teamJson.data || []);
      }

      let loadedDepts: Department[] = [];
      if (deptJson.success && Array.isArray(deptJson.data) && deptJson.data.length > 0) {
        loadedDepts = deptJson.data;
        setDepartments(loadedDepts);
      }

      let loadedRoles: TeamRole[] = [];
      if (rolesJson.success && Array.isArray(rolesJson.data) && rolesJson.data.length > 0) {
        loadedRoles = rolesJson.data;
        setRoles(loadedRoles);
      } else if (teamJson.success && teamJson.data) {
        const roleMap = new Map<string, TeamRole>();
        (teamJson.data || []).forEach((m: TeamMember) => {
          if (m.role) roleMap.set(m.role.id, m.role);
        });
        loadedRoles = Array.from(roleMap.values());
        setRoles(loadedRoles);
      }
    } catch {
      error('Failed to load team directory');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDepartment = async () => {
    if (!newDeptInput.trim()) return;
    setCreatingDept(true);
    try {
      const res = await fetch('/api/v1/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newDeptInput.trim() }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        const createdDept = json.data;
        setDepartments((prev) => [...prev, createdDept]);
        setEditingMember((prev) => (prev ? { ...prev, departmentId: createdDept.id } : null));
        setNewDeptInput('');
        setShowAddDept(false);
        success(`Department "${createdDept.name}" created`);
      } else {
        error(json.error || 'Failed to create department');
      }
    } catch {
      error('Error creating department');
    } finally {
      setCreatingDept(false);
    }
  };

  const handleCreateRole = async () => {
    if (!newRoleInput.trim()) return;
    setCreatingRole(true);
    try {
      const res = await fetch('/api/v1/team/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newRoleInput.trim() }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        const createdRole = json.data;
        setRoles((prev) => [...prev, createdRole]);
        setEditingMember((prev) => (prev ? { ...prev, roleId: createdRole.id } : null));
        setNewRoleInput('');
        setShowAddRole(false);
        success(`Role "${createdRole.title}" created`);
      } else {
        error(json.error || 'Failed to create role');
      }
    } catch {
      error('Error creating role');
    } finally {
      setCreatingRole(false);
    }
  };

  const handleApplyAvatarUrl = async () => {
    if (!avatarUrlInput.trim()) return;
    setApplyingAvatarUrl(true);
    try {
      const res = await fetch('/api/v1/media/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: avatarUrlInput.trim() }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        const asset = json.data;
        setEditingMember((prev) =>
          prev
            ? {
                ...prev,
                imageId: asset.id,
                image: {
                  id: asset.id,
                  url: asset.url || asset.storageUrl,
                  originalName: asset.originalName || asset.fileName || 'Avatar Photo',
                },
              }
            : null
        );
        setAvatarUrlInput('');
        success('Avatar photo loaded successfully');
      } else {
        error(json.error?.message || 'Failed to load avatar from URL');
      }
    } catch {
      error('Error loading avatar from URL');
    } finally {
      setApplyingAvatarUrl(false);
    }
  };

  const handleNewMember = () => {
    const defaultDeptId = departments[0]?.id || '';
    const defaultRoleId = roles[0]?.id || '';

    setEditingMember({
      name: '',
      displayName: '',
      isFounder: currentTab === 'founders',
      founderTitle: '',
      departmentId: defaultDeptId,
      roleId: defaultRoleId,
      shortBio: '',
      fullBio: '',
      imageId: null,
      image: null,
      skills: ['TypeScript', 'Distributed Systems'],
      githubUrl: '',
      linkedinUrl: '',
      websiteUrl: '',
      email: '',
      showEmail: false,
      isFeatured: false,
      displayOrder: members.length + 1,
      isActive: true,
    });
    setNewDeptInput('');
    setShowAddDept(false);
    setNewRoleInput('');
    setShowAddRole(false);
    setAvatarUrlInput('');
    setEditorOpen(true);
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember({ ...member });
    setNewDeptInput('');
    setShowAddDept(false);
    setNewRoleInput('');
    setShowAddRole(false);
    setAvatarUrlInput('');
    setEditorOpen(true);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    if (!editingMember.name?.trim() || !editingMember.displayName?.trim()) {
      error('Please enter Full Legal Name and Public Display Name');
      return;
    }

    let finalDeptId = editingMember.departmentId;
    if (!finalDeptId && departments.length > 0) {
      finalDeptId = departments[0].id;
    }

    let finalRoleId = editingMember.roleId;
    if (!finalRoleId && roles.length > 0) {
      finalRoleId = roles[0].id;
    }

    if (!finalDeptId) {
      error('Please select or create a Department');
      return;
    }

    if (!finalRoleId) {
      error('Please select or create a Role / Title');
      return;
    }

    setSaving(true);
    try {
      const isNew = !editingMember.id;
      const url = isNew ? '/api/v1/team' : `/api/v1/team/${editingMember.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const payload = {
        name: editingMember.name.trim(),
        displayName: editingMember.displayName.trim(),
        isFounder: editingMember.isFounder ?? false,
        founderTitle: editingMember.founderTitle || null,
        departmentId: finalDeptId,
        roleId: finalRoleId,
        shortBio: editingMember.shortBio || '',
        fullBio: editingMember.fullBio || null,
        imageId: editingMember.imageId || null,
        skills: editingMember.skills || [],
        githubUrl: editingMember.githubUrl || '',
        linkedinUrl: editingMember.linkedinUrl || '',
        websiteUrl: editingMember.websiteUrl || '',
        email: editingMember.email || '',
        showEmail: editingMember.showEmail ?? false,
        isFeatured: editingMember.isFeatured ?? false,
        displayOrder: editingMember.displayOrder ?? 0,
        isActive: editingMember.isActive ?? true,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        success(isNew ? 'Team member added successfully' : 'Team profile updated successfully');
        setEditorOpen(false);
        setEditingMember(null);
        await loadData();
      } else {
        error(json.error || 'Failed to save team member');
      }
    } catch {
      error('Network error while saving team profile');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (member: TeamMember) => {
    try {
      const res = await fetch(`/api/v1/team/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !member.isActive }),
      });
      const json = await res.json();
      if (json.success) {
        success(member.isActive ? 'Member deactivated' : 'Member activated');
        setMembers((prev) =>
          prev.map((m) => (m.id === member.id ? { ...m, isActive: !member.isActive } : m))
        );
      }
    } catch {
      error('Failed to toggle active state');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`/api/v1/team/${confirmDelete.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        success('Team member profile removed');
        setMembers((prev) => prev.filter((m) => m.id !== confirmDelete.id));
      } else {
        error(json.error || 'Failed to remove member');
      }
    } catch {
      error('Error deleting member');
    }
  };

  const handleAddSkill = () => {
    if (!skillInput.trim() || !editingMember) return;
    const current = editingMember.skills || [];
    if (!current.includes(skillInput.trim())) {
      setEditingMember({ ...editingMember, skills: [...current, skillInput.trim()] });
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    if (!editingMember) return;
    setEditingMember({
      ...editingMember,
      skills: (editingMember.skills || []).filter((s) => s !== skill),
    });
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.displayName.toLowerCase().includes(search.toLowerCase()) ||
      m.shortBio.toLowerCase().includes(search.toLowerCase());

    const matchesTab =
      currentTab === 'all' ? true : currentTab === 'founders' ? m.isFounder : true;

    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Founders & Team' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Leadership & Engineering Staff
          </h1>
          <p className="text-xs text-slate-400">
            Manage profiles, roles, skills, social links, and organizational departments.
          </p>
        </div>

        <Button size="sm" variant="primary" onClick={handleNewMember} leftIcon={<Plus className="w-4 h-4" />}>
          Add Member
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 gap-2">
        <button
          type="button"
          onClick={() => setCurrentTab('all')}
          className={`px-4 py-2 text-xs font-mono font-medium border-b-2 transition-all ${
            currentTab === 'all'
              ? 'border-[#00F2FE] text-[#00F2FE]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          All Members ({members.length})
        </button>
        <button
          type="button"
          onClick={() => setCurrentTab('founders')}
          className={`px-4 py-2 text-xs font-mono font-medium border-b-2 transition-all ${
            currentTab === 'founders'
              ? 'border-[#00F2FE] text-[#00F2FE]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Founders & Leadership ({members.filter((m) => m.isFounder).length})
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search team by name, title, or biography..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-[#0A0E17] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F2FE]"
        />
      </div>

      {/* Team Member Cards */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 font-mono text-xs">
          Loading team roster from database...
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl space-y-3 bg-[#0A0E17]/20">
          <Users className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No members found</h3>
          <Button size="sm" variant="primary" onClick={handleNewMember} leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Add First Member
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className={`glass-panel p-5 rounded-xl border transition-all flex flex-col justify-between space-y-4 bg-[#0A0E17]/50 ${
                member.isActive ? 'border-white/10 hover:border-white/25' : 'border-white/5 opacity-60'
              }`}
            >
              <div className="space-y-3">
                {/* Header with avatar & role badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-[#05070B] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                      {(member.image?.url || (member.image as any)?.storageUrl) ? (
                        <img
                          src={member.image?.url || (member.image as any)?.storageUrl}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-mono text-xs font-bold text-[#00F2FE]">
                          {member.name.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white truncate">{member.name}</h3>
                      <p className="text-[11px] font-mono text-[#00F2FE] truncate">
                        {member.isFounder && member.founderTitle
                          ? member.founderTitle
                          : member.role?.title || 'Engineer'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {member.isFounder && <Badge variant="cyan" size="sm">FOUNDER</Badge>}
                    {member.isActive ? (
                      <Badge variant="emerald" size="sm">ACTIVE</Badge>
                    ) : (
                      <Badge variant="rose" size="sm">INACTIVE</Badge>
                    )}
                  </div>
                </div>

                {/* Short Bio */}
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {member.shortBio}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {(member.skills || []).slice(0, 4).map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 font-mono text-[10px] text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                  {(member.skills || []).length > 4 && (
                    <span className="text-[10px] text-slate-500 font-mono self-center">
                      +{member.skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(member)}
                    className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                    title={member.isActive ? 'Deactivate member' : 'Activate member'}
                  >
                    {member.isActive ? <Eye className="w-4 h-4 text-[#10B981]" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEditMember(member)}
                    leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                  >
                    Edit
                  </Button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete({ open: true, id: member.id, name: member.name })}
                    className="p-1.5 rounded-lg hover:bg-[#F43F5E]/10 text-slate-500 hover:text-[#F43F5E] transition-colors"
                    title="Remove member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDelete.open}
        onClose={() => setConfirmDelete((prev) => ({ ...prev, open: false }))}
        onConfirm={handleConfirmDelete}
        title="Remove Team Member"
        message={`Are you sure you want to remove "${confirmDelete.name}" from the active team roster?`}
        confirmLabel="Remove Member"
        variant="danger"
      />

      {/* Media Picker */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        selectedId={editingMember?.imageId || undefined}
        onSelect={(asset) => {
          const imageUrl = asset.url || (asset as any).storageUrl;
          setEditingMember((prev) =>
            prev
              ? {
                  ...prev,
                  imageId: asset.id,
                  image: {
                    id: asset.id,
                    url: imageUrl,
                    originalName: asset.originalName || asset.filename || (asset as any).fileName,
                  },
                }
              : null
          );
        }}
      />

      {/* Member Editor Modal */}
      {editorOpen && editingMember && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in"
        >
          <div className="relative w-full max-w-2xl bg-[#0A0E17] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-[#06090F]">
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#00F2FE]" />
                <span>{editingMember.id ? 'Edit Team Profile' : 'Add Team Member'}</span>
              </h2>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveMember} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">
                    Full Legal Name <span className="text-[#F43F5E]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.name || ''}
                    onChange={(e) =>
                      setEditingMember((prev) => (prev ? { ...prev, name: e.target.value } : null))
                    }
                    placeholder="e.g. Alexander Vance"
                    className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">
                    Public Display Name <span className="text-[#F43F5E]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.displayName || ''}
                    onChange={(e) =>
                      setEditingMember((prev) => (prev ? { ...prev, displayName: e.target.value } : null))
                    }
                    placeholder="e.g. Alex Vance"
                    className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>
              </div>

              {/* Founder Flag & Founder Title */}
              <div className="p-4 rounded-xl bg-[#05070B] border border-white/5 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingMember.isFounder || false}
                    onChange={(e) =>
                      setEditingMember((prev) => (prev ? { ...prev, isFounder: e.target.checked } : null))
                    }
                    className="w-4 h-4 rounded bg-[#0A0E17] border-white/10 text-[#00F2FE] focus:ring-0"
                  />
                  <span className="text-xs font-bold text-white">This person is a Company Founder</span>
                </label>

                {editingMember.isFounder && (
                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-mono text-[#00F2FE]">
                      Founder Title
                    </label>
                    <input
                      type="text"
                      value={editingMember.founderTitle || ''}
                      onChange={(e) =>
                        setEditingMember((prev) => (prev ? { ...prev, founderTitle: e.target.value } : null))
                      }
                      placeholder="e.g. Co-Founder & Chief Technology Officer"
                      className="w-full px-3.5 py-2 bg-[#0A0E17] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                    />
                  </div>
                )}
              </div>

              {/* Department & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-slate-300">
                      Department <span className="text-[#F43F5E]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddDept(!showAddDept)}
                      className="text-[11px] font-mono text-[#00F2FE] hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> {showAddDept ? 'Cancel' : 'Add New'}
                    </button>
                  </div>

                  {showAddDept && (
                    <div className="flex items-center gap-1.5 p-2 bg-[#06090F] border border-[#00F2FE]/30 rounded-lg">
                      <input
                        type="text"
                        value={newDeptInput}
                        onChange={(e) => setNewDeptInput(e.target.value)}
                        placeholder="Department name..."
                        className="flex-1 px-2.5 py-1 bg-[#0A0E17] border border-white/10 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F2FE]"
                        autoFocus
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="primary"
                        isLoading={creatingDept}
                        onClick={handleCreateDepartment}
                        className="text-xs px-2.5 py-1"
                      >
                        Save
                      </Button>
                    </div>
                  )}

                  <select
                    value={editingMember.departmentId || ''}
                    onChange={(e) =>
                      setEditingMember((prev) => (prev ? { ...prev, departmentId: e.target.value } : null))
                    }
                    className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-[#00F2FE]"
                  >
                    {departments.length === 0 ? (
                      <option value="">No departments available — click "Add New" above</option>
                    ) : (
                      departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-slate-300">
                      Role / Title <span className="text-[#F43F5E]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddRole(!showAddRole)}
                      className="text-[11px] font-mono text-[#00F2FE] hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> {showAddRole ? 'Cancel' : 'Add New'}
                    </button>
                  </div>

                  {showAddRole && (
                    <div className="flex items-center gap-1.5 p-2 bg-[#06090F] border border-[#00F2FE]/30 rounded-lg">
                      <input
                        type="text"
                        value={newRoleInput}
                        onChange={(e) => setNewRoleInput(e.target.value)}
                        placeholder="Role title (e.g. Lead Architect)..."
                        className="flex-1 px-2.5 py-1 bg-[#0A0E17] border border-white/10 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F2FE]"
                        autoFocus
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="primary"
                        isLoading={creatingRole}
                        onClick={handleCreateRole}
                        className="text-xs px-2.5 py-1"
                      >
                        Save
                      </Button>
                    </div>
                  )}

                  <select
                    value={editingMember.roleId || ''}
                    onChange={(e) =>
                      setEditingMember((prev) => (prev ? { ...prev, roleId: e.target.value } : null))
                    }
                    className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-[#00F2FE]"
                  >
                    {roles.length === 0 ? (
                      <option value="">No roles available — click "Add New" above</option>
                    ) : (
                      roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.title}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* Short Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Short Bio</label>
                <textarea
                  rows={2}
                  value={editingMember.shortBio || ''}
                  onChange={(e) =>
                    setEditingMember((prev) => (prev ? { ...prev, shortBio: e.target.value } : null))
                  }
                  placeholder="Primary executive/engineering bio..."
                  className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                />
              </div>

              {/* Skills Tag Input */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-300">Core Technical Capabilities (Skills)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Type skill & hit Enter..."
                    className="flex-1 px-3.5 py-1.5 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                  />
                  <Button type="button" size="sm" variant="secondary" onClick={handleAddSkill}>
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(editingMember.skills || []).map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#00F2FE]/10 border border-[#00F2FE]/20 text-[11px] font-mono text-white"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-[#F43F5E]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Avatar / Profile Photo */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-mono text-slate-300 block">Avatar Photo</label>
                <div className="p-3.5 rounded-xl bg-[#05070B] border border-white/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-[#0A0E17] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                      {(editingMember.image?.url || (editingMember.image as any)?.storageUrl) ? (
                        <img
                          src={editingMember.image?.url || (editingMember.image as any)?.storageUrl}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-slate-600" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-white font-medium block truncate">
                        {editingMember.image?.originalName ||
                          (editingMember.image as any)?.fileName ||
                          (editingMember.imageId ? 'Selected photo' : 'No image selected')}
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Upload an image or paste a direct public image link
                      </span>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => setMediaPickerOpen(true)}
                        >
                          Select / Upload Photo
                        </Button>
                        {editingMember.imageId && (
                          <button
                            type="button"
                            onClick={() =>
                              setEditingMember((prev) =>
                                prev ? { ...prev, imageId: null, image: null } : null
                              )
                            }
                            className="px-2.5 py-1 text-xs text-slate-400 hover:text-[#F43F5E] transition-colors"
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Direct Image URL input */}
                  <div className="pt-2.5 border-t border-white/5 flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="Or paste direct image URL (https://... or data:...)"
                      value={avatarUrlInput}
                      onChange={(e) => setAvatarUrlInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-[#0A0E17] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F2FE]"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="primary"
                      isLoading={applyingAvatarUrl}
                      onClick={handleApplyAvatarUrl}
                      disabled={!avatarUrlInput.trim()}
                    >
                      Apply URL
                    </Button>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">GitHub Profile URL</label>
                  <input
                    type="url"
                    value={editingMember.githubUrl || ''}
                    onChange={(e) =>
                      setEditingMember((prev) => (prev ? { ...prev, githubUrl: e.target.value } : null))
                    }
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-1.5 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={editingMember.linkedinUrl || ''}
                    onChange={(e) =>
                      setEditingMember((prev) => (prev ? { ...prev, linkedinUrl: e.target.value } : null))
                    }
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-1.5 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>
              </div>

              {/* Footer controls */}
              <div className="p-6 border-t border-white/5 flex items-center justify-between bg-[#06090F] shrink-0 -mx-6 -mb-6 mt-6">
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditorOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={saving} leftIcon={<Save className="w-3.5 h-3.5" />}>
                  Save Profile
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
