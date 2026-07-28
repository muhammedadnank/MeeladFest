'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import FestAdminNav from '@/components/FestAdminNav';
import { HelpCircle, Plus, Trash2, Edit2, Loader2, AlertCircle, Check } from 'lucide-react';

interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  order: number;
}

export default function FaqsAdminPage() {
  const params = useParams();
  const festId = params.festId as string;

  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [order, setOrder] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/fests/${festId}/faqs`);
      const data = await res.json();
      if (res.ok) {
        setFaqs(data.faqs || []);
      } else {
        setError(data.error || 'Failed to fetch FAQs');
      }
    } catch (err) {
      setError('An error occurred while loading FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (festId) fetchFaqs();
  }, [festId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    setSubmitting(true);
    setError('');
    setSuccessMsg('');

    try {
      const url = editingId
        ? `/api/fests/${festId}/faqs/${editingId}`
        : `/api/fests/${festId}/faqs`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim(), answer: answer.trim(), order }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(editingId ? 'FAQ updated successfully!' : 'FAQ created successfully!');
        resetForm();
        fetchFaqs();
      } else {
        setError(data.error || 'Failed to save FAQ');
      }
    } catch (err) {
      setError('An error occurred while submitting');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (faq: FaqItem) => {
    setEditingId(faq._id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setOrder(faq.order);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (faqId: string) => {
    if (!confirm('Are you sure you want to delete this FAQ item?')) return;

    try {
      const res = await fetch(`/api/fests/${festId}/faqs/${faqId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('FAQ deleted successfully');
        setFaqs(faqs.filter((item) => item._id !== faqId));
      } else {
        setError(data.error || 'Failed to delete FAQ');
      }
    } catch (err) {
      setError('An error occurred while deleting');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setQuestion('');
    setAnswer('');
    setOrder(faqs.length);
  };

  return (
    <div className="min-h-screen bg-emerald-950 text-emerald-50">
      <FestAdminNav festId={festId} activeTab="faqs" />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald-100 flex items-center gap-3">
              <HelpCircle className="w-8 h-8 text-emerald-400" />
              Manage FAQs
            </h1>
            <p className="text-emerald-300 text-sm mt-1">
              Add frequently asked questions and answers displayed on the public festival page.
            </p>
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

        {/* Create / Edit Form */}
        <div className="bg-emerald-900/40 border border-emerald-800/80 backdrop-blur-md rounded-2xl p-6 mb-10 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-emerald-200 flex items-center gap-2">
              {editingId ? <Edit2 className="w-5 h-5 text-emerald-400" /> : <Plus className="w-5 h-5 text-emerald-400" />}
              {editingId ? 'Edit FAQ Item' : 'Add New FAQ'}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-emerald-400 hover:text-emerald-300 underline"
              >
                Cancel Editing
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2">
                Question *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. When will the inauguration start?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-2.5 bg-emerald-950/80 border border-emerald-700/70 rounded-xl text-emerald-100 placeholder-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2">
                Answer *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Provide a detailed explanation..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full px-4 py-2.5 bg-emerald-950/80 border border-emerald-700/70 rounded-xl text-emerald-100 placeholder-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                className="w-32 px-4 py-2 bg-emerald-950/80 border border-emerald-700/70 rounded-xl text-emerald-100 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !question.trim() || !answer.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-emerald-950 font-semibold text-sm rounded-xl transition shadow-lg shadow-emerald-950/50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : editingId ? (
                <>
                  <Check className="w-4 h-4" />
                  Update FAQ
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Save FAQ
                </>
              )}
            </button>
          </form>
        </div>

        {/* FAQ List */}
        <h2 className="text-xl font-bold text-emerald-100 mb-4">
          Existing FAQs ({faqs.length})
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-emerald-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-12 bg-emerald-900/20 border border-emerald-800/40 rounded-2xl">
            <HelpCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <p className="text-emerald-400 text-sm">No FAQs added yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq._id}
                className="bg-emerald-900/40 border border-emerald-800/60 rounded-2xl p-5 backdrop-blur-sm flex items-start justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded-md text-xs font-mono border border-emerald-800/60">
                      Order: {faq.order}
                    </span>
                    <h3 className="text-base font-semibold text-emerald-100">
                      {faq.question}
                    </h3>
                  </div>
                  <p className="text-emerald-300 text-sm leading-relaxed whitespace-pre-line">
                    {faq.answer}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(faq)}
                    className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/60 rounded-lg transition"
                    title="Edit FAQ"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq._id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-lg transition"
                    title="Delete FAQ"
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
