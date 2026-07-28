'use client';

import { useState } from 'react';

export default function PublicFeedbackForm({ festId }: { festId: string }) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/fests/${festId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rating, comment }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      setMessage({ type: 'success', text: data.message || 'Thank you for your feedback!' });
      setName('');
      setRating(5);
      setComment('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Something went wrong' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
      <h3 className="text-xl font-bold text-slate-100 mb-2">Leave Feedback</h3>
      <p className="text-sm text-slate-400 mb-6">
        Share your experience or suggestions for this festival.
      </p>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm mb-4 ${
            message.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
              : 'bg-rose-950/60 border border-rose-800 text-rose-300'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl transition ${
                  star <= rating ? 'text-amber-400 scale-110' : 'text-slate-700 hover:text-slate-500'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Your Name (Optional)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Muhammed"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Comment / Message
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what you liked or how we can improve..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg text-sm transition shadow-lg shadow-emerald-950 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}
