'use client';

import { useState, useEffect, use } from 'react';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  Search,
  Palette,
} from 'lucide-react';

interface TeamItem {
  _id: string;
  name: string;
  color: string;
  createdAt: string;
}

const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#6366F1', // Indigo
  '#F97316', // Orange
  '#84CC16', // Lime
];

export default function TeamsManagementPage({ params }: { params: Promise<{ festId: string }> }) {
  const { festId } = use(params);

  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6',
  });

  useEffect(() => {
    fetchTeams();
  }, [festId]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/fests/${festId}/teams`);
      const data = await res.json();
      if (res.ok) {
        setTeams(data.teams || []);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to fetch teams' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to fetch teams' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingTeam(null);
    setFormData({ name: '', color: PRESET_COLORS[teams.length % PRESET_COLORS.length] });
    setShowModal(true);
  };

  const handleOpenEditModal = (team: TeamItem) => {
    setEditingTeam(team);
    setFormData({ name: team.name, color: team.color || '#3B82F6' });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const url = editingTeam
        ? `/api/fests/${festId}/teams/${editingTeam._id}`
        : `/api/fests/${festId}/teams`;
      const method = editingTeam ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setShowModal(false);
        setMessage({
          type: 'success',
          text: editingTeam ? 'Team updated successfully.' : 'Team created successfully.',
        });
        fetchTeams();
      } else {
        setMessage({ type: 'error', text: data.error || 'Operation failed.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred while saving.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (team: TeamItem) => {
    if (!confirm(`Are you sure you want to delete "${team.name}"?`)) return;

    setMessage(null);
    try {
      const res = await fetch(`/api/fests/${festId}/teams/${team._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Team deleted successfully.' });
        fetchTeams();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete team.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error deleting team.' });
    }
  };

  const filteredTeams = teams.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" />
            Teams Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage festival house teams and their display colors (sorted alphabetically).
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Team
        </button>
      </div>

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

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search teams by name..."
          className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        />
      </div>

      {/* Teams Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center">
          <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">No teams found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {searchQuery ? 'No teams match your search query.' : 'Click above to create your first team.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeams.map((team) => (
            <div
              key={team._id}
              className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md"
                  style={{ backgroundColor: team.color }}
                >
                  {team.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                    {team.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    {team.color}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEditModal(team)}
                  className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Edit Team"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(team)}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Delete Team"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Team Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-100 mb-1">
              {editingTeam ? 'Edit Team' : 'Add New Team'}
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Specify team title and identification theme color.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Team Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Al-Fath, Emerald, Badr"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-emerald-400" />
                  Team Color
                </label>

                {/* Color Palette Selectors */}
                <div className="flex flex-wrap gap-2.5 mb-3">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: c })}
                      className={`w-7 h-7 rounded-lg border-2 transition-transform cursor-pointer ${
                        formData.color.toLowerCase() === c.toLowerCase()
                          ? 'border-white scale-110 shadow-md'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-9 h-9 rounded-lg border-0 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs uppercase font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-emerald-400 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {editingTeam ? 'Update Team' : 'Create Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
