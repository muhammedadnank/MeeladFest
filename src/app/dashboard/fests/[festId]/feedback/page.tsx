'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import FestAdminNav from '@/components/admin/FestAdminNav';
import { MessageSquare, Star, Trash2, Loader2, AlertCircle, User } from 'lucide-react';

interface FeedbackItem {
  _id: string;
  name?: string;
  rating: number;
  comment?: string;
  submittedAt: string;
}

export default function FeedbackAdminPage() {
  const params = useParams();
  const festId = params.festId as string;

  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/fests/${festId}/feedback`);
      const data = await res.json();
      if (res.ok) {
        setFeedbacks(data.feedbacks || []);
      } else {
        setError(data.error || 'Failed to fetch feedback entries');
      }
    } catch (err) {
      setError('An error occurred while loading feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (festId) fetchFeedbacks();
  }, [festId]);

  const handleDelete = async (feedbackId: string) => {
    if (!confirm('Are you sure you want to delete this feedback entry?')) return;

    try {
      const res = await fetch(`/api/fests/${festId}/feedback/${feedbackId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('Feedback entry deleted successfully');
        setFeedbacks(feedbacks.filter((item) => item._id !== feedbackId));
      } else {
        setError(data.error || 'Failed to delete feedback');
      }
    } catch (err) {
      setError('An error occurred while deleting feedback');
    }
  };

  const avgRating =
    feedbacks.length > 0
      ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length).toFixed(1)
      : '0.0';

  return (
    <div className="min-h-screen bg-emerald-950 text-emerald-50">
      <FestAdminNav festId={festId} activeTab="feedback" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald-100 flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-emerald-400" />
              Visitor Feedback
            </h1>
            <p className="text-emerald-300 text-sm mt-1">
              Review comments and overall rating submitted by festival visitors.
            </p>
          </div>

          <div className="bg-emerald-900/60 border border-emerald-700/60 rounded-2xl px-5 py-3 flex items-center gap-4">
            <div>
              <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Average Rating</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-amber-300">{avgRating}</span>
                <div className="flex items-center text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(Number(avgRating)) ? 'fill-amber-400' : 'text-emerald-800'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="h-8 w-px bg-emerald-800" />
            <div>
              <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Total Feedback</p>
              <p className="text-2xl font-bold text-emerald-100 mt-1">{feedbacks.length}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/80 border border-red-800 text-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-900/60 border border-emerald-700 text-emerald-200 rounded-xl text-sm">
            {successMsg}
          </div>
        )}

        {/* Feedback List */}
        {loading ? (
          <div className="flex items-center justify-center py-12 text-emerald-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center py-12 bg-emerald-900/20 border border-emerald-800/40 rounded-2xl">
            <MessageSquare className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <p className="text-emerald-400 text-sm">No feedback received from visitors yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {feedbacks.map((item) => (
              <div
                key={item._id}
                className="bg-emerald-900/40 border border-emerald-800/60 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-800/80 flex items-center justify-center text-emerald-300">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-emerald-100">
                          {item.name || 'Anonymous'}
                        </p>
                        <p className="text-xs text-emerald-400">
                          {new Date(item.submittedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center text-amber-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/60">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= item.rating ? 'fill-amber-400' : 'text-emerald-800'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-emerald-200 text-sm leading-relaxed mt-2 whitespace-pre-line">
                    {item.comment || <span className="italic text-emerald-500">No comment provided</span>}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-emerald-800/40 flex justify-end">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-lg transition"
                    title="Delete Feedback"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
