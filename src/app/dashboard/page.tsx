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
import { GeometricPattern } from '@/components/ui/GeometricPattern';

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
      <div className="min-h-screen flex items-center justify-center bg-cream text-text-dark">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-800 animate-spin" />
          <p className="text-sm text-emerald-950/70 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-text-dark flex flex-col font-inter">
      {/* Header Bar */}
      <header className="bg-emerald-950 text-white border-b border-emerald-900 sticky top-0 z-40 shadow-sm relative overflow-hidden">
        <GeometricPattern className="absolute -top-12 -right-12 w-48 h-48 opacity-[0.06] text-white pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between relative z-10">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="font-amiri text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="text-gold-500 text-xl">☽</span> MeeladFest
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-gold-500/20 text-gold-200 border border-gold-500/30">
              Admin Portal
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-white">{session?.user?.name}</p>
              <p className="text-[11px] text-emerald-200/70">{session?.user?.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-100 transition-colors flex items-center gap-2 text-xs font-medium cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 text-gold-500" />
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
            <h1 className="font-amiri text-3xl sm:text-4xl font-bold tracking-tight text-emerald-950">
              Festival Management
            </h1>
            <p className="mt-1 text-sm text-emerald-950/70">
              Select a festival to manage participants, entries, live results, and updates.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="py-2.5 px-5 bg-gold-500 hover:bg-[#b07d20] text-white font-medium rounded-lg shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Create New Fest
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            {error}
          </div>
        )}

        {/* Fest Cards Grid */}
        {fests.length === 0 ? (
          <div className="bg-white border border-border-warm rounded-card p-12 text-center max-w-xl mx-auto my-12 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-800">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="font-amiri text-xl font-bold text-emerald-950">No Festivals Found</h3>
            <p className="mt-2 text-sm text-emerald-950/70">
              You haven't created or been added to any festival yet. Click below to launch your first festival.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-950 text-white font-medium rounded-lg transition-colors text-sm cursor-pointer shadow-sm"
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
                className="group bg-white border border-border-warm hover:border-emerald-800 rounded-card overflow-hidden transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                {/* Top Dark Emerald Header */}
                <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 p-5 text-white relative overflow-hidden">
                  <GeometricPattern className="absolute -top-10 -right-10 w-36 h-36 opacity-[0.08] text-white pointer-events-none" />

                  <div className="flex items-start justify-between gap-2 mb-3 relative z-10">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        fest.role === 'owner'
                          ? 'bg-gold-500/20 text-gold-200 border border-gold-500/40'
                          : 'bg-emerald-100/20 text-emerald-200 border border-emerald-100/30'
                      }`}
                    >
                      <ShieldCheck className="w-3 h-3 text-gold-500" />
                      {fest.role === 'owner' ? 'Owner' : 'Sub-Admin'}
                    </span>

                    {fest.isActive ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-200 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Active
                      </span>
                    ) : (
                      <span className="text-[11px] text-emerald-200/50 font-medium">Inactive</span>
                    )}
                  </div>

                  <h3 className="font-amiri text-2xl font-bold text-white group-hover:text-gold-200 transition-colors line-clamp-1 relative z-10">
                    {fest.festName}
                  </h3>

                  <p className="text-xs font-medium text-emerald-200/80 mt-1 flex items-center gap-1.5 line-clamp-1 relative z-10">
                    <Building2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                    {fest.madrasaName}
                  </p>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-white text-text-dark">
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center gap-2 text-text-dark/80">
                      <MapPin className="w-4 h-4 text-emerald-800 shrink-0" />
                      <span className="font-medium">
                        {fest.area}, {fest.district}
                      </span>
                    </div>

                    {fest.date && (
                      <div className="flex items-center gap-2 text-text-dark/80">
                        <Calendar className="w-4 h-4 text-emerald-800 shrink-0" />
                        <span>{fest.date}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Actions Footer */}
                  <div className="mt-6 pt-4 border-t border-border-warm flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/fests/${fest._id}`}
                        className="px-4 py-2 bg-emerald-800 hover:bg-emerald-950 text-white font-medium rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Settings className="w-3.5 h-3.5 text-gold-500" />
                        Manage
                      </Link>

                      <Link
                        href={`/fests/${fest.slug}`}
                        target="_blank"
                        className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg transition-colors text-xs"
                        title="Public Festival Site"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>

                    {fest.role === 'owner' && (
                      <button
                        onClick={() => handleDeleteFest(fest._id, fest.festName)}
                        className="p-2 text-text-dark/40 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Festival"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Festival Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-border-warm rounded-card w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-text-dark/60 hover:text-text-dark p-1 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-amiri text-2xl font-bold text-emerald-950 mb-1">Create New Festival</h2>
            <p className="text-xs text-text-dark/70 mb-6">
              Fill in the festival details below to initialize management tools.
            </p>

            <form onSubmit={handleCreateFest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-950 mb-1">
                  Fest Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.festName}
                  onChange={(e) => setFormData({ ...formData, festName: e.target.value })}
                  placeholder="e.g. Meelad Fest 2026"
                  className="w-full bg-cream/60 border border-border-warm rounded-lg px-3.5 py-2.5 text-text-dark placeholder-text-dark/40 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-emerald-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-950 mb-1">
                  Madrasa / Institution Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.madrasaName}
                  onChange={(e) => setFormData({ ...formData, madrasaName: e.target.value })}
                  placeholder="e.g. Busthanul Uloom Madrasa"
                  className="w-full bg-cream/60 border border-border-warm rounded-lg px-3.5 py-2.5 text-text-dark placeholder-text-dark/40 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-emerald-800 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-950 mb-1">
                    Area / Mahallu *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="e.g. Manjeri"
                    className="w-full bg-cream/60 border border-border-warm rounded-lg px-3.5 py-2.5 text-text-dark placeholder-text-dark/40 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-emerald-800 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-950 mb-1">
                    District *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="e.g. Malappuram"
                    className="w-full bg-cream/60 border border-border-warm rounded-lg px-3.5 py-2.5 text-text-dark placeholder-text-dark/40 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-emerald-800 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-950 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g. 12 Rabiul Awwal"
                    className="w-full bg-cream/60 border border-border-warm rounded-lg px-3.5 py-2.5 text-text-dark placeholder-text-dark/40 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-emerald-800 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-950 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="e.g. Madrasa Auditorium"
                    className="w-full bg-cream/60 border border-border-warm rounded-lg px-3.5 py-2.5 text-text-dark placeholder-text-dark/40 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-emerald-800 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-950 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional brief note about the fest..."
                  className="w-full bg-cream/60 border border-border-warm rounded-lg px-3.5 py-2.5 text-text-dark placeholder-text-dark/40 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-emerald-800 text-sm resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border-warm">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-medium rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 bg-gold-500 hover:bg-[#b07d20] text-white font-medium rounded-lg text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
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
