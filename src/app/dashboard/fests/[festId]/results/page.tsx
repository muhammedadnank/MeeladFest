'use client';

import { useState, useEffect, use } from 'react';
import {
  Trophy,
  Award,
  CheckCircle2,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  X,
  Search,
  Filter,
  Medal,
  Users,
  UserCheck,
  ChevronRight,
} from 'lucide-react';

interface Category {
  _id: string;
  name: string;
}

interface Team {
  _id: string;
  name: string;
  code?: string;
  color?: string;
}

interface Item {
  _id: string;
  name: string;
  categoryId: Category | string;
  type: 'single' | 'group';
}

interface Participant {
  _id: string;
  chestNo: string;
  name: string;
  teamId: Team;
  categoryId: Category;
}

interface GroupEntry {
  _id: string;
  itemId: string;
  teamId: Team;
  participants: { name: string; chestNo?: string }[];
}

interface ResultEntry {
  _id?: string;
  itemId: string;
  position: 1 | 2 | 3;
  points: number;
  teamId: Team;
  participantId?: Participant;
  groupEntryId?: GroupEntry;
}

export default function ResultsAdminPage({
  params,
}: {
  params: Promise<{ festId: string }>;
}) {
  const { festId } = use(params);

  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [results, setResults] = useState<ResultEntry[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [groupEntries, setGroupEntries] = useState<GroupEntry[]>([]);

  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchItemQuery, setSearchItemQuery] = useState('');

  // Result Entry Modal state
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form state for positions 1, 2, 3
  const [pos1, setPos1] = useState<{ targetId: string; points: string }>({ targetId: '', points: '' });
  const [pos2, setPos2] = useState<{ targetId: string; points: string }>({ targetId: '', points: '' });
  const [pos3, setPos3] = useState<{ targetId: string; points: string }>({ targetId: '', points: '' });

  useEffect(() => {
    fetchAllData();
  }, [festId]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [catRes, itemsRes, teamsRes, resRes, partRes, groupRes] = await Promise.all([
        fetch(`/api/fests/${festId}/categories`),
        fetch(`/api/fests/${festId}/items`),
        fetch(`/api/fests/${festId}/teams`),
        fetch(`/api/fests/${festId}/results`),
        fetch(`/api/fests/${festId}/participants`),
        fetch(`/api/fests/${festId}/group-entries`),
      ]);

      if (catRes.ok) {
        const d = await catRes.json();
        setCategories(d.categories || []);
      }
      if (itemsRes.ok) {
        const d = await itemsRes.json();
        setItems(d.items || []);
      }
      if (teamsRes.ok) {
        const d = await teamsRes.json();
        setTeams(d.teams || []);
      }
      if (resRes.ok) {
        const d = await resRes.json();
        setResults(d.results || []);
      }
      if (partRes.ok) {
        const d = await partRes.json();
        setParticipants(d.participants || []);
      }
      if (groupRes.ok) {
        const d = await groupRes.json();
        setGroupEntries(d.groupEntries || []);
      }
    } catch (err) {
      console.error(err);
    } fontally: {
      setLoading(false);
    }
  };

  const handleOpenDeclareModal = (item: Item) => {
    setActiveItem(item);
    setErrorMsg('');

    // Check if item already has declared results
    const existing = results.filter((r) => {
      const rItemId = typeof r.itemId === 'object' ? (r.itemId as any)._id : r.itemId;
      return rItemId === item._id;
    });

    const p1 = existing.find((r) => r.position === 1);
    const p2 = existing.find((r) => r.position === 2);
    const p3 = existing.find((r) => r.position === 3);

    const defaultP1Points = item.type === 'single' ? '5' : '10';
    const defaultP2Points = item.type === 'single' ? '3' : '6';
    const defaultP3Points = item.type === 'single' ? '1' : '2';

    if (item.type === 'single') {
      setPos1({
        targetId: p1?.participantId ? p1.participantId._id : '',
        points: p1 ? p1.points.toString() : defaultP1Points,
      });
      setPos2({
        targetId: p2?.participantId ? p2.participantId._id : '',
        points: p2 ? p2.points.toString() : defaultP2Points,
      });
      setPos3({
        targetId: p3?.participantId ? p3.participantId._id : '',
        points: p3 ? p3.points.toString() : defaultP3Points,
      });
    } else {
      setPos1({
        targetId: p1?.groupEntryId ? p1.groupEntryId._id : '',
        points: p1 ? p1.points.toString() : defaultP1Points,
      });
      setPos2({
        targetId: p2?.groupEntryId ? p2.groupEntryId._id : '',
        points: p2 ? p2.points.toString() : defaultP2Points,
      });
      setPos3({
        targetId: p3?.groupEntryId ? p3.groupEntryId._id : '',
        points: p3 ? p3.points.toString() : defaultP3Points,
      });
    }

    setIsModalOpen(true);
  };

  const handleSaveResults = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;

    setErrorMsg('');
    setSaving(true);

    try {
      const entries = [];

      if (pos1.targetId) {
        entries.push({
          position: 1,
          ...(activeItem.type === 'single'
            ? { participantId: pos1.targetId }
            : { groupEntryId: pos1.targetId }),
          points: Number(pos1.points),
        });
      }

      if (pos2.targetId) {
        entries.push({
          position: 2,
          ...(activeItem.type === 'single'
            ? { participantId: pos2.targetId }
            : { groupEntryId: pos2.targetId }),
          points: Number(pos2.points),
        });
      }

      if (pos3.targetId) {
        entries.push({
          position: 3,
          ...(activeItem.type === 'single'
            ? { participantId: pos3.targetId }
            : { groupEntryId: pos3.targetId }),
          points: Number(pos3.points),
        });
      }

      const res = await fetch(`/api/fests/${festId}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: activeItem._id,
          entries,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsModalOpen(false);
        fetchAllData();
      } else {
        setErrorMsg(data.error || 'Failed to save results');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      !selectedCategory ||
      (typeof item.categoryId === 'object'
        ? item.categoryId._id === selectedCategory
        : item.categoryId === selectedCategory);

    const matchesSearch =
      !searchItemQuery || item.name.toLowerCase().includes(searchItemQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const getResultsForItem = (itemId: string) => {
    return results.filter((r) => {
      const rItemId = typeof r.itemId === 'object' ? (r.itemId as any)._id : r.itemId;
      return rItemId === itemId;
    });
  };

  // Options for single vs group
  const getSingleParticipantOptions = (itemId: string, categoryId: string | Category) => {
    const catIdStr = typeof categoryId === 'object' ? categoryId._id : categoryId;
    return participants.filter((p) => {
      const pCatId = typeof p.categoryId === 'object' ? p.categoryId._id : p.categoryId;
      return pCatId === catIdStr;
    });
  };

  const getGroupEntryOptions = (itemId: string) => {
    return groupEntries.filter((g) => {
      const gItemId = typeof g.itemId === 'object' ? (g.itemId as any)._id : g.itemId;
      return gItemId === itemId;
    });
  };

  const totalDeclaredCount = items.filter((i) => getResultsForItem(i._id).length > 0).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-400" />
            Results & Competition Ranks
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish 1st, 2nd, and 3rd rank winners for festival competitions.
          </p>
        </div>

        {/* Stats Summary */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
              Declared Results
            </span>
            <span className="text-base font-extrabold text-emerald-400">
              {totalDeclaredCount} / {items.length} Contests
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
          {/* Search Item */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search contest item..."
              value={searchItemQuery}
              onChange={(e) => setSearchItemQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-48 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500/50"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-7 h-7 text-amber-400 animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Loading contests and results...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8">
          <Award className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">No Contests Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No festival items match your filter criteria or items have not been created yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const itemResults = getResultsForItem(item._id);
            const isDeclared = itemResults.length > 0;
            const category = typeof item.categoryId === 'object' ? item.categoryId : null;

            const p1 = itemResults.find((r) => r.position === 1);
            const p2 = itemResults.find((r) => r.position === 2);
            const p3 = itemResults.find((r) => r.position === 3);

            return (
              <div
                key={item._id}
                className={`bg-slate-900/60 border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                  isDeclared
                    ? 'border-amber-500/30 shadow-lg shadow-amber-500/5'
                    : 'border-slate-800/80 hover:border-slate-700/80'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        {category ? category.name : 'General'}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1.5 line-clamp-1">
                        {item.name}
                      </h3>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        isDeclared
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isDeclared ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-amber-400" />
                          Declared
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 text-slate-500" />
                          Pending
                        </>
                      )}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 flex items-center gap-2 mb-4">
                    <span className="capitalize bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-semibold text-slate-300">
                      {item.type} Contest
                    </span>
                  </div>

                  {/* Declared Winners Preview */}
                  {isDeclared ? (
                    <div className="space-y-2 bg-slate-950/60 border border-slate-800/60 rounded-xl p-3">
                      {/* 1st Place */}
                      <div className="flex items-center justify-between text-xs py-1 border-b border-slate-900">
                        <div className="flex items-center gap-2 truncate">
                          <Medal className="w-4 h-4 text-amber-400 shrink-0" />
                          <span className="font-bold text-white truncate">
                            {p1?.participantId
                              ? `${p1.participantId.name} (#${p1.participantId.chestNo})`
                              : p1?.groupEntryId
                              ? `Team ${(p1.teamId as any)?.name}`
                              : 'None'}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          +{p1?.points || 0} pts
                        </span>
                      </div>

                      {/* 2nd Place */}
                      <div className="flex items-center justify-between text-xs py-1 border-b border-slate-900">
                        <div className="flex items-center gap-2 truncate">
                          <Medal className="w-4 h-4 text-slate-300 shrink-0" />
                          <span className="font-semibold text-slate-300 truncate">
                            {p2?.participantId
                              ? `${p2.participantId.name} (#${p2.participantId.chestNo})`
                              : p2?.groupEntryId
                              ? `Team ${(p2.teamId as any)?.name}`
                              : 'None'}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                          +{p2?.points || 0} pts
                        </span>
                      </div>

                      {/* 3rd Place */}
                      <div className="flex items-center justify-between text-xs py-1">
                        <div className="flex items-center gap-2 truncate">
                          <Medal className="w-4 h-4 text-amber-700 shrink-0" />
                          <span className="font-medium text-slate-400 truncate">
                            {p3?.participantId
                              ? `${p3.participantId.name} (#${p3.participantId.chestNo})`
                              : p3?.groupEntryId
                              ? `Team ${(p3.teamId as any)?.name}`
                              : 'None'}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded">
                          +{p3?.points || 0} pts
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
                      <p className="text-xs text-slate-500">Winners not declared yet</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-end">
                  <button
                    onClick={() => handleOpenDeclareModal(item)}
                    className={`w-full py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isDeclared
                        ? 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/20'
                        : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-md shadow-amber-500/10'
                    }`}
                  >
                    {isDeclared ? <Edit2 className="w-3.5 h-3.5" /> : <Trophy className="w-3.5 h-3.5" />}
                    {isDeclared ? 'Edit Result' : 'Declare Result'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DECLARE RESULT MODAL */}
      {isModalOpen && activeItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  Declare Winners: {activeItem.name}
                </h2>
                <p className="text-xs text-slate-400 capitalize mt-0.5">
                  Type: {activeItem.type} contest
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResults} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 1st Place Position */}
              <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                  <span className="flex items-center gap-1.5">
                    <Medal className="w-4 h-4" /> 1st Place (Gold Winner)
                  </span>
                  <span>Points</span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={pos1.targetId}
                    onChange={(e) => setPos1({ ...pos1, targetId: e.target.value })}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="">-- Select Winner --</option>
                    {activeItem.type === 'single'
                      ? getSingleParticipantOptions(activeItem._id, activeItem.categoryId).map((p) => (
                          <option key={p._id} value={p._id}>
                            #{p.chestNo} - {p.name} ({(p.teamId as any)?.name})
                          </option>
                        ))
                      : getGroupEntryOptions(activeItem._id).map((g) => (
                          <option key={g._id} value={g._id}>
                            Team {(g.teamId as any)?.name} ({g.participants.length} members)
                          </option>
                        ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    value={pos1.points}
                    onChange={(e) => setPos1({ ...pos1, points: e.target.value })}
                    className="w-20 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-400 text-center focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              {/* 2nd Place Position */}
              <div className="bg-slate-800/40 border border-slate-700/80 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Medal className="w-4 h-4 text-slate-300" /> 2nd Place (Silver Winner)
                  </span>
                  <span>Points</span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={pos2.targetId}
                    onChange={(e) => setPos2({ ...pos2, targetId: e.target.value })}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="">-- Select Winner --</option>
                    {activeItem.type === 'single'
                      ? getSingleParticipantOptions(activeItem._id, activeItem.categoryId).map((p) => (
                          <option key={p._id} value={p._id}>
                            #{p.chestNo} - {p.name} ({(p.teamId as any)?.name})
                          </option>
                        ))
                      : getGroupEntryOptions(activeItem._id).map((g) => (
                          <option key={g._id} value={g._id}>
                            Team {(g.teamId as any)?.name} ({g.participants.length} members)
                          </option>
                        ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    value={pos2.points}
                    onChange={(e) => setPos2({ ...pos2, points: e.target.value })}
                    className="w-20 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-200 text-center focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              {/* 3rd Place Position */}
              <div className="bg-amber-950/20 border border-amber-900/30 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-600">
                  <span className="flex items-center gap-1.5">
                    <Medal className="w-4 h-4 text-amber-700" /> 3rd Place (Bronze Winner)
                  </span>
                  <span>Points</span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={pos3.targetId}
                    onChange={(e) => setPos3({ ...pos3, targetId: e.target.value })}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="">-- Select Winner --</option>
                    {activeItem.type === 'single'
                      ? getSingleParticipantOptions(activeItem._id, activeItem.categoryId).map((p) => (
                          <option key={p._id} value={p._id}>
                            #{p.chestNo} - {p.name} ({(p.teamId as any)?.name})
                          </option>
                        ))
                      : getGroupEntryOptions(activeItem._id).map((g) => (
                          <option key={g._id} value={g._id}>
                            Team {(g.teamId as any)?.name} ({g.participants.length} members)
                          </option>
                        ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    value={pos3.points}
                    onChange={(e) => setPos3({ ...pos3, points: e.target.value })}
                    className="w-20 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-600 text-center focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Publish Results
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
