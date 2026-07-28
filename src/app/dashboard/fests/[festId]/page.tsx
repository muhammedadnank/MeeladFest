'use client';

import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import {
  Users,
  Layers,
  Award,
  ShieldCheck,
  UserPlus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
  Edit,
  Save,
  Building2,
  MapPin,
  Calendar,
} from 'lucide-react';

interface FestData {
  _id: string;
  festName: string;
  madrasaName: string;
  area: string;
  district: string;
  date?: string;
  venue?: string;
  description?: string;
  slug: string;
}

interface FestPermissions {
  isOwner: boolean;
  role: 'owner' | 'subadmin' | null;
  canParticipants: boolean;
  canResults: boolean;
  canUpdates: boolean;
  canGallery: boolean;
}

interface SubAdmin {
  _id: string;
  invitedEmail: string;
  status: 'pending' | 'accepted' | 'revoked';
  permissions: {
    participants: boolean;
    results: boolean;
    updates: boolean;
    gallery: boolean;
  };
  userId?: {
    name: string;
    email: string;
  };
}

export default function FestOverviewPage({ params }: { params: Promise<{ festId: string }> }) {
  const { festId } = use(params);
  const { data: session } = useSession();

  const [fest, setFest] = useState<FestData | null>(null);
  const [permissions, setPermissions] = useState<FestPermissions | null>(null);
  const [subadmins, setSubadmins] = useState<SubAdmin[]>([]);
  const [stats, setStats] = useState({ teams: 0, categories: 0, items: 0 });

  const [loading, setLoading] = useState(true);
  const [savingFest, setSavingFest] = useState(false);
  const [editingFest, setEditingFest] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fest Edit Form State
  const [editForm, setEditForm] = useState({
    festName: '',
    madrasaName: '',
    area: '',
    district: '',
    date: '',
    venue: '',
    description: '',
  });

  // Sub-admin Invite Form State
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePerms, setInvitePerms] = useState({
    participants: true,
    results: true,
    updates: false,
    gallery: false,
  });
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    fetchFestData();
  }, [festId]);

  const fetchFestData = async () => {
    try {
      setLoading(true);
      const [festRes, teamsRes, catRes, itemsRes, subRes] = await Promise.all([
        fetch(`/api/fests/${festId}`),
        fetch(`/api/fests/${festId}/teams`),
        fetch(`/api/fests/${festId}/categories`),
        fetch(`/api/fests/${festId}/items`),
        fetch(`/api/fests/${festId}/subadmins`),
      ]);

      const festData = await festRes.json();
      if (festRes.ok) {
        setFest(festData.fest);
        setPermissions(festData.permissions);
        setEditForm({
          festName: festData.fest.festName,
          madrasaName: festData.fest.madrasaName,
          area: festData.fest.area,
          district: festData.fest.district,
          date: festData.fest.date || '',
          venue: festData.fest.venue || '',
          description: festData.fest.description || '',
        });
      }

      if (teamsRes.ok) {
        const teamsData = await teamsRes.json();
        setStats((prev) => ({ ...prev, teams: teamsData.teams?.length || 0 }));
      }
      if (catRes.ok) {
        const catData = await catRes.json();
        setStats((prev) => ({ ...prev, categories: catData.categories?.length || 0 }));
      }
      if (itemsRes.ok) {
        const itemsData = await itemsRes.json();
        setStats((prev) => ({ ...prev, items: itemsData.items?.length || 0 }));
      }
      if (subRes.ok) {
        const subData = await subRes.json();
        setSubadmins(subData.subadmins || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingFest(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/fests/${festId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (res.ok) {
        setFest(data.fest);
        setEditingFest(false);
        setMessage({ type: 'success', text: 'Festival details updated successfully.' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update festival' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setSavingFest(false);
    }
  };

  const handleInviteSubAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/fests/${festId}/subadmins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, permissions: invitePerms }),
      });
      const data = await res.json();
      if (res.ok) {
        setInviteEmail('');
        setMessage({ type: 'success', text: 'Sub-admin invitation sent!' });
        fetchFestData();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to invite sub-admin' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to send invite' });
    } finally {
      setInviting(false);
    }
  };

  const handleRevokeSubAdmin = async (adminId: string) => {
    if (!confirm('Are you sure you want to revoke access for this sub-admin?')) return;
    try {
      const res = await fetch(`/api/fests/${festId}/subadmins/${adminId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Sub-admin access revoked.' });
        fetchFestData();
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to revoke sub-admin' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error revoking sub-admin' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Alert Messages */}
      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white">
            ×
          </button>
        </div>
      )}

      {/* Header & Overview Stats */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">{fest?.festName}</h1>
        <p className="text-xs text-slate-400 mt-1">
          {fest?.madrasaName} • {fest?.area}, {fest?.district}
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Teams</p>
              <p className="text-2xl font-extrabold text-white mt-1">{stats.teams}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Categories</p>
              <p className="text-2xl font-extrabold text-white mt-1">{stats.categories}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Items / Events</p>
              <p className="text-2xl font-extrabold text-white mt-1">{stats.items}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Festival Settings Form */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white">Festival Details</h2>
            <p className="text-xs text-slate-400">Basic details displayed on the public fest page.</p>
          </div>

          {permissions?.isOwner && !editingFest && (
            <button
              onClick={() => setEditingFest(true)}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit Details
            </button>
          )}
        </div>

        {editingFest ? (
          <form onSubmit={handleUpdateFest} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Fest Name
                </label>
                <input
                  type="text"
                  required
                  value={editForm.festName}
                  onChange={(e) => setEditForm({ ...editForm, festName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Madrasa / Institution
                </label>
                <input
                  type="text"
                  required
                  value={editForm.madrasaName}
                  onChange={(e) => setEditForm({ ...editForm, madrasaName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Area / Mahallu
                </label>
                <input
                  type="text"
                  required
                  value={editForm.area}
                  onChange={(e) => setEditForm({ ...editForm, area: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  District
                </label>
                <input
                  type="text"
                  required
                  value={editForm.district}
                  onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Date
                </label>
                <input
                  type="text"
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  placeholder="e.g. Oct 24, 2026"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Venue
                </label>
                <input
                  type="text"
                  value={editForm.venue}
                  onChange={(e) => setEditForm({ ...editForm, venue: e.target.value })}
                  placeholder="e.g. Main Auditorium"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingFest(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingFest}
                className="px-5 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-emerald-400 transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {savingFest ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Institution</p>
                <p className="font-semibold text-slate-200 mt-0.5">{fest?.madrasaName}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Location</p>
                <p className="font-semibold text-slate-200 mt-0.5">
                  {fest?.area}, {fest?.district}
                </p>
              </div>
            </div>

            {fest?.date && (
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Date & Venue</p>
                  <p className="font-semibold text-slate-200 mt-0.5">
                    {fest?.date} {fest?.venue ? `(${fest.venue})` : ''}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sub-Admins & Permissions Section (Owner Only) */}
      {permissions?.isOwner && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Sub-Admins & Permissions
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Invite team members to manage participants, enter results, post live updates, or upload gallery photos.
            </p>
          </div>

          {/* Invite Form */}
          <form onSubmit={handleInviteSubAdmin} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-emerald-400" />
              Invite New Sub-Admin
            </h3>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="enter.subadmin@email.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <button
                type="submit"
                disabled={inviting}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
              >
                {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                Send Invite
              </button>
            </div>

            {/* Permission Toggles */}
            <div className="pt-2">
              <p className="text-[11px] text-slate-400 font-semibold mb-2">Assign Permissions:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={invitePerms.participants}
                    onChange={(e) => setInvitePerms({ ...invitePerms, participants: e.target.checked })}
                    className="accent-emerald-500 rounded"
                  />
                  <span className="text-slate-300">Participants</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={invitePerms.results}
                    onChange={(e) => setInvitePerms({ ...invitePerms, results: e.target.checked })}
                    className="accent-emerald-500 rounded"
                  />
                  <span className="text-slate-300">Results Entry</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={invitePerms.updates}
                    onChange={(e) => setInvitePerms({ ...invitePerms, updates: e.target.checked })}
                    className="accent-emerald-500 rounded"
                  />
                  <span className="text-slate-300">Live Updates</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={invitePerms.gallery}
                    onChange={(e) => setInvitePerms({ ...invitePerms, gallery: e.target.checked })}
                    className="accent-emerald-500 rounded"
                  />
                  <span className="text-slate-300">Gallery</span>
                </label>
              </div>
            </div>
          </form>

          {/* Sub-Admins List */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active & Pending Invites ({subadmins.length})
            </h3>

            {subadmins.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">No sub-admins invited yet.</p>
            ) : (
              <div className="space-y-2">
                {subadmins.map((sub) => (
                  <div
                    key={sub._id}
                    className="bg-slate-950/40 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200">
                          {sub.userId?.name || sub.invitedEmail}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            sub.status === 'accepted'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : sub.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>
                      {sub.userId?.name && (
                        <p className="text-[10px] text-slate-400 mt-0.5">{sub.invitedEmail}</p>
                      )}

                      {/* Permissions badges */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {sub.permissions.participants && (
                          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                            Participants
                          </span>
                        )}
                        {sub.permissions.results && (
                          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                            Results
                          </span>
                        )}
                        {sub.permissions.updates && (
                          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                            Updates
                          </span>
                        )}
                        {sub.permissions.gallery && (
                          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                            Gallery
                          </span>
                        )}
                      </div>
                    </div>

                    {sub.status !== 'revoked' && (
                      <button
                        onClick={() => handleRevokeSubAdmin(sub._id)}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors self-end sm:self-auto cursor-pointer"
                        title="Revoke Access"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
