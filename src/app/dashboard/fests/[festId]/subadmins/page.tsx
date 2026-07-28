'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import FestAdminNav from '@/components/admin/FestAdminNav';
import { UserPlus, Shield, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface ISubAdmin {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  permissions: {
    canManageParticipants: boolean;
    canManageResults: boolean;
    canManageUpdates: boolean;
    canManageGallery: boolean;
  };
}

export default function SubAdminsPage() {
  const params = useParams();
  const festId = params.festId as string;

  const [fest, setFest] = useState<any>(null);
  const [subadmins, setSubadmins] = useState<ISubAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [canManageParticipants, setCanManageParticipants] = useState(true);
  const [canManageResults, setCanManageResults] = useState(true);
  const [canManageUpdates, setCanManageUpdates] = useState(true);
  const [canManageGallery, setCanManageGallery] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function loadData() {
    try {
      const [festRes, subRes] = await Promise.all([
        fetch(`/api/fests/${festId}`),
        fetch(`/api/fests/${festId}/subadmins`),
      ]);

      if (festRes.ok) {
        const fData = await festRes.json();
        setFest(fData.fest);
      }
      if (subRes.ok) {
        const sData = await subRes.json();
        setSubadmins(sData.subadmins || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [festId]);

  const handleCreateSubAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/fests/${festId}/subadmins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          permissions: {
            canManageParticipants,
            canManageResults,
            canManageUpdates,
            canManageGallery,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add subadmin');

      setName('');
      setEmail('');
      setPassword('');
      loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubAdmin = async (subadminId: string) => {
    if (!confirm('Are you sure you want to remove this sub-admin?')) return;
    try {
      const res = await fetch(`/api/fests/${festId}/subadmins/${subadminId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-sm text-slate-400">Loading sub-admins...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <FestAdminNav
        festId={festId}
        slug={fest?.slug || ''}
        festName={fest?.festName || 'Fest Admin'}
        permissions={{
          isOwner: true,
          canManageParticipants: true,
          canManageResults: true,
          canManageUpdates: true,
          canManageGallery: true,
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-emerald-400" /> Sub-Admin Delegation
            </h2>
            <p className="text-xs text-slate-400">
              Grant assistant administrators role-based permissions to manage festival operations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create SubAdmin Form */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 backdrop-blur-sm space-y-4">
            <h3 className="font-bold text-slate-200 text-base">Add New Sub-Admin</h3>

            {error && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateSubAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ahmed Raza"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ahmed@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Initial Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="block text-xs font-semibold text-slate-400 uppercase">
                  Permissions
                </span>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={canManageParticipants}
                    onChange={(e) => setCanManageParticipants(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  Manage Participants & Entries
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={canManageResults}
                    onChange={(e) => setCanManageResults(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  Enter Results & Scores
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={canManageUpdates}
                    onChange={(e) => setCanManageUpdates(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  Post Live Updates
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={canManageGallery}
                    onChange={(e) => setCanManageGallery(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  Upload Gallery Photos
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg text-sm transition shadow-lg shadow-emerald-950 disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Create Sub-Admin'}
              </button>
            </form>
          </div>

          {/* SubAdmins List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-slate-200 text-base">Active Sub-Admins</h3>

            {subadmins.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-500 text-sm">
                No sub-admins assigned to this festival yet.
              </div>
            ) : (
              <div className="space-y-3">
                {subadmins.map((sub) => (
                  <div
                    key={sub._id}
                    className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-wrap justify-between items-center gap-4"
                  >
                    <div>
                      <div className="font-bold text-slate-100 text-sm">{sub.user.name}</div>
                      <div className="text-xs text-slate-400 font-mono">{sub.user.email}</div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded border ${
                            sub.permissions.canManageParticipants
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                              : 'bg-slate-950 text-slate-600 border-slate-800'
                          }`}
                        >
                          Participants
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded border ${
                            sub.permissions.canManageResults
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                              : 'bg-slate-950 text-slate-600 border-slate-800'
                          }`}
                        >
                          Results
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded border ${
                            sub.permissions.canManageUpdates
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                              : 'bg-slate-950 text-slate-600 border-slate-800'
                          }`}
                        >
                          Updates
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded border ${
                            sub.permissions.canManageGallery
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                              : 'bg-slate-950 text-slate-600 border-slate-800'
                          }`}
                        >
                          Gallery
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteSubAdmin(sub._id)}
                      className="p-2 text-rose-400 hover:bg-rose-950/60 rounded-lg transition border border-rose-900/40"
                      title="Remove Sub-Admin"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
