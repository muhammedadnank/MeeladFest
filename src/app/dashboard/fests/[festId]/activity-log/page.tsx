'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import FestAdminNav from '@/components/FestAdminNav';
import { History, ShieldAlert, User, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

interface ActivityLogItem {
  _id: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  action: string;
  details?: string;
  entityType?: string;
  createdAt: string;
}

export default function ActivityLogAdminPage() {
  const params = useParams();
  const festId = params.festId as string;

  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);

  const fetchLogs = async (p = 1) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/fests/${festId}/activity-logs?page=${p}&limit=20`);
      const data = await res.json();
      if (res.ok) {
        setLogs(data.logs || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalLogs(data.pagination?.total || 0);
        setPage(p);
      } else {
        setError(data.error || 'Failed to fetch activity logs');
      }
    } catch (err) {
      setError('An error occurred while loading activity logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (festId) fetchLogs(1);
  }, [festId]);

  return (
    <div className="min-h-screen bg-emerald-950 text-emerald-50">
      <FestAdminNav festId={festId} activeTab="activity-log" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald-100 flex items-center gap-3">
              <History className="w-8 h-8 text-emerald-400" />
              Activity Audit Log
            </h1>
            <p className="text-emerald-300 text-sm mt-1">
              Audit trail recording actions taken by admins and sub-admins for this festival.
            </p>
          </div>

          <div className="bg-emerald-900/60 border border-emerald-700/60 rounded-2xl px-5 py-2.5">
            <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider block">Total Logged Events</span>
            <span className="text-xl font-bold text-emerald-100">{totalLogs}</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/80 border border-red-800 text-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Logs Table */}
        <div className="bg-emerald-900/40 border border-emerald-800/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-emerald-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-16">
              <ShieldAlert className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <p className="text-emerald-400 text-sm">No activity logs recorded yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-emerald-200">
                <thead className="bg-emerald-950/90 text-emerald-400 uppercase text-xs tracking-wider border-b border-emerald-800/80">
                  <tr>
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-800/40">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-emerald-900/30 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-emerald-400 font-mono">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-emerald-800/80 flex items-center justify-center text-emerald-300">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-emerald-100">
                              {log.userId?.name || 'System / Unknown'}
                            </p>
                            <p className="text-xs text-emerald-400">{log.userId?.email || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-semibold font-mono">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-emerald-200 max-w-md truncate">
                        {log.details || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-emerald-800/60 bg-emerald-950/60 flex items-center justify-between text-sm">
              <span className="text-emerald-400">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1 || loading}
                  onClick={() => fetchLogs(page - 1)}
                  className="p-2 bg-emerald-900/60 border border-emerald-700/60 rounded-xl text-emerald-200 hover:bg-emerald-800 disabled:opacity-50 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page >= totalPages || loading}
                  onClick={() => fetchLogs(page + 1)}
                  className="p-2 bg-emerald-900/60 border border-emerald-700/60 rounded-xl text-emerald-200 hover:bg-emerald-800 disabled:opacity-50 transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
