'use client';

import { useState, useEffect } from 'react';

interface IFaq {
  _id: string;
  question: string;
  answer: string;
}

export default function PublicFaqAccordion({ festId }: { festId: string }) {
  const [faqs, setFaqs] = useState<IFaq[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFaqs() {
      try {
        const res = await fetch(`/api/fests/${festId}/faqs`);
        if (res.ok) {
          const data = await res.json();
          setFaqs(data.faqs || []);
        }
      } catch (err) {
        console.error('Failed to load FAQs', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFaqs();
  }, [festId]);

  if (loading) {
    return <div className="py-6 text-center text-slate-400 text-sm">Loading FAQs...</div>;
  }

  if (faqs.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={faq._id}
            className="border border-slate-800 rounded-xl bg-slate-900/60 overflow-hidden transition"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full px-5 py-4 text-left flex justify-between items-center text-slate-200 font-medium hover:text-emerald-400 transition"
            >
              <span>{faq.question}</span>
              <span className="text-emerald-400 text-xl font-bold ml-2">
                {isOpen ? '−' : '+'}
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-4 text-slate-400 text-sm border-t border-slate-800/60 pt-3 leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
