'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus,
  Sparkles,
  Calendar,
  MapPin,
  Building2,
  ShieldCheck,
  ExternalLink,
  Trash2,
  LogOut,
  Loader2,
  AlertCircle,
  X,
  Settings,
} from 'lucide-react';

interface FestItem {
  _id: string;
  slug: string;
  festName: string;
  madrasaName: string;
  area: string;
  district: string;
  date?: string;
  venue?: string;
  description?: string;
  role: 'owner' | 'subadmin';
  isActive: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [fests, setFests] = useState<FestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Create Modal State
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    festName: '',
    madrasaName: '',
    area: '',
    district: '',
    date: '',
    venue: '',
    description: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchFests();
    }
  }, [status, router]);

  const fetchFests = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/fests');
      const data = await res.json();
      if (res.ok) {
        setFests(data.fests || []);
      } else {
        setError(data.error || 'Failed to load festivals');
      }
    } catch (err) {
      setError('Failed to load festivals');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFest = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/fests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setShowModal(false);
        setFormData({
          festName: '',
          madrasaName: '',
          area: '',
          district: '',
          date: '',
          venue: '',
          description: '',
        });
        fetchFests();
      } else {
        alert(data.error || 'Failed to create festival');
      }
    } catch (err) {
      alert('Error creating festival');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteFest = async (festId: string, festName: string) => {
    if (!confirm(`Are you sure you want to delete "${festName}"? This action can be undone later by owner.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/fests/${festId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchFests();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete festival');
      }
    } catch (err) {
      alert('Error deleting festival');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              MeeladFest
            </span>
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </Link>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-200">{session?.user?.name}</p>
              <p className="text-xs text-slate-400">{session?.user?.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-slate-300 hover:text-slate-100 transition-colors flex items-center gap-2 text-xs font-medium cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner Title & Create Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Festival Management
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Select a festival to manage participants, entries, live results, and updates.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="py-3 px-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-5 h-5" />
            Create New Fest
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Fest Cards Grid */}
        {fests.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center max-w-xl mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-emerald-400">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">No Festivals Found</h3>
            <p className="mt-2 text-sm text-slate-400">
              You haven't created or been added to any festival yet. Click below to launch your first festival.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold rounded-xl border border-emerald-500/30 transition-colors text-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create Festival
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fests.map((fest) => (
              <div
                key={fest._id}
                className="group bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-6 transition-all shadow-xl hover:shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        fest.role === 'owner'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {fest.role === 'owner' ? 'Owner' : 'Sub-Admin'}
                    </span>

                    {fest.isActive ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        Active
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500 font-medium">Inactive</span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {fest.festName}
                  </h3>

                  <p className="text-xs font-medium text-slate-400 mt-1 flex items-center gap-1.5 line-clamp-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    {fest.madrasaName}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        {fest.area}, {fest.district}
                      </span>
                    </div>

                    {fest.date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{fest.date}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/fests/${fest._id}`}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/10"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      Manage
                    </Link>

                    <Link
                      href={`/fests/${fest.slug}`}
                      target="_blank"
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 rounded-xl transition-colors text-xs"
                      title="Public Festival Site"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>

                  {fest.role === 'owner' && (
                    <button
                      onClick={() => handleDeleteFest(fest._id, fest.festName)}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                      title="Delete Festival"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Festival Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-100 mb-1">Create New Festival</h2>
            <p className="text-xs text-slate-400 mb-6">
              Fill in the festival details below to initialize management tools.
            </p>

            <form onSubmit={handleCreateFest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Fest Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.festName}
                  onChange={(e) => setFormData({ ...formData, festName: e.target.value })}
                  placeholder="e.g. Meelad Fest 2026"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Madrasa / Institution Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.madrasaName}
                  onChange={(e) => setFormData({ ...formData, madrasaName: e.target.value })}
                  placeholder="e.g. Busthanul Uloom Madrasa"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Area / Mahallu *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="e.g. Manjeri"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    District *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="e.g. Malappuram"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g. 12 Rabiul Awwal"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="e.g. Madrasa Auditorium"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional brief note about the fest..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Create Fest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
