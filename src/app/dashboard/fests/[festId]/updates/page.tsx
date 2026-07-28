'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import FestAdminNav from '@/components/admin/FestAdminNav';
import { Radio, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

interface IUpdate {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
}

export default function UpdatesAdminPage() {
  const params = useParams();
  const festId = params.festId as string;

  const [fest, setFest] = useState<any>(null);
  const [updates, setUpdates] = useState<IUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function loadData() {
    try {
      const [festRes, updatesRes] = await Promise.all([
        fetch(`/api/fests/${festId}`),
        fetch(`/api/fests/${festId}/updates`),
      ]);

      if (festRes.ok) {
        const fData = await festRes.json();
        setFest(fData.fest);
      }
      if (updatesRes.ok) {
        const uData = await updatesRes.json();
        setUpdates(uData.updates || []);
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

  const handleCreateUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/fests/${festId}/updates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, imageUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post update');

      setTitle('');
      setContent('');
      setImageUrl('');
      loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUpdate = async (updateId: string) => {
    if (!confirm('Are you sure you want to delete this update?')) return;
    try {
      const res = await fetch(`/api/fests/${festId}/updates/${updateId}`, {
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
        <div className="text-sm text-slate-400">Loading updates...</div>
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
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Radio className="w-6 h-6 text-emerald-400" /> Live Announcements & Updates
          </h2>
          <p className="text-xs text-slate-400">
            Publish real-time news, stage announcements, and results notifications to the public page.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Post Update Form */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 backdrop-blur-sm space-y-4">
            <h3 className="font-bold text-slate-200 text-base">Post Announcement</h3>

            {error && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Headline / Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Stage 1 Qira'at competition starting now"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Content / Details
                </label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Provide detailed announcement information..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Optional Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg text-sm transition shadow-lg shadow-emerald-950 disabled:opacity-50"
              >
                {submitting ? 'Posting...' : 'Publish Update'}
              </button>
            </form>
          </div>

          {/* Published Updates List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-slate-200 text-base">Published Feed ({updates.length})</h3>

            {updates.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-500 text-sm">
                No live updates published yet.
              </div>
            ) : (
              <div className="space-y-4">
                {updates.map((update) => (
                  <div
                    key={update._id}
                    className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-slate-100 text-base">{update.title}</h4>
                        <span className="text-xs text-slate-500">
                          {new Date(update.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteUpdate(update._id)}
                        className="p-1.5 text-rose-400 hover:bg-rose-950/60 rounded-lg transition"
                        title="Delete Update"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line mb-3">
                      {update.content}
                    </p>

                    {update.imageUrl && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-slate-800 max-h-60">
                        <img
                          src={update.imageUrl}
                          alt={update.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
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
