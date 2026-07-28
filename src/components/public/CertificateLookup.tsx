'use client';

import React, { useState } from 'react';
import { Search, Award, Download, CheckCircle2, ShieldCheck, Loader2, FileText } from 'lucide-react';
import { CertificateSearchResult, CertificateData } from '@/types/certificate';

interface CertificateLookupProps {
  festId: string;
}

export const CertificateLookup: React.FC<CertificateLookupProps> = ({ festId }) => {
  const [chestNo, setChestNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [result, setResult] = useState<CertificateSearchResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chestNo.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/fests/${festId}/certificates/lookup?chestNo=${encodeURIComponent(chestNo.trim())}`);
      const data = await res.json();

      if (!res.ok || data.error || !data.success) {
        throw new Error(data.error || 'No certificates found for this Chest Number');
      }

      setResult(data.searchResult);
    } catch (err: any) {
      setError(err.message || 'Failed to search certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (cert: CertificateData) => {
    setDownloadingId(cert.certificateId);
    try {
      const res = await fetch(`/api/fests/${festId}/certificates/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificateData: cert }),
      });

      if (!res.ok) throw new Error('Download failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Certificate_${cert.chestNo}_${cert.itemName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || 'Error downloading PDF certificate');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Search Form */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl text-center">
        <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
          <Award className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Certificate Lookup Engine</h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
          Enter your assigned Chest Number (Fest ID) to view and download your official participation & winner certificates.
        </p>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={chestNo}
              onChange={(e) => setChestNo(e.target.value)}
              placeholder="e.g. 101 or J-05"
              className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder-slate-500 rounded-xl pl-11 pr-4 py-3 text-sm font-medium transition"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-semibold px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Search
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}
      </div>

      {/* Results View */}
      {result && (
        <div className="space-y-6">
          {/* Header summary */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                Participant Record
              </div>
              <h3 className="text-xl font-bold text-white">{result.participantName}</h3>
              <p className="text-slate-400 text-sm mt-0.5">
                Chest No: <span className="text-white font-mono font-semibold">{result.chestNo}</span> | Team:{' '}
                <span className="text-white font-semibold">{result.teamName}</span>
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {result.certificates.length} Certificate{result.certificates.length !== 1 ? 's' : ''} Eligible
            </div>
          </div>

          {/* Certificates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {result.certificates.map((cert) => {
              const isWinner = cert.certificateType === 'winner';
              return (
                <div
                  key={cert.certificateId}
                  className={`bg-slate-900/90 border rounded-2xl p-6 relative flex flex-col justify-between transition ${
                    isWinner
                      ? 'border-amber-500/40 shadow-lg shadow-amber-500/5 hover:border-amber-500/70'
                      : 'border-blue-500/30 hover:border-blue-500/50'
                  }`}
                >
                  <div>
                    {/* Badge & Item Type */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                          isWinner
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                            : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                        }`}
                      >
                        {isWinner ? `🏆 Position #${cert.position}` : 'Participation'}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {cert.itemType.toUpperCase()} ITEM
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-white mb-1">{cert.itemName}</h4>
                    <p className="text-slate-400 text-xs mb-4">{cert.categoryName}</p>

                    <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950/50 rounded-xl p-3 border border-slate-800/80 mb-6">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Issued On:</span>
                        <span className="font-mono">{cert.issueDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Verify Code:</span>
                        <span className="font-mono text-amber-400">{cert.verificationCode}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownload(cert)}
                      disabled={downloadingId === cert.certificateId}
                      className={`flex-1 font-semibold py-2.5 px-4 rounded-xl transition text-sm flex items-center justify-center gap-2 ${
                        isWinner
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      {downloadingId === cert.certificateId ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      Download PDF
                    </button>
                    <a
                      href={`/verify/${cert.verificationCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                      title="Verify Authenticity"
                    >
                      <ShieldCheck className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
