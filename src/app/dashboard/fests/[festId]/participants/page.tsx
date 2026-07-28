'use client';

import { useState, useEffect, use } from 'react';
import {
  UserCheck,
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Download,
  Filter,
  Loader2,
  AlertCircle,
  X,
  Check,
  Layers,
  Award,
  Phone,
  Hash,
  UserPlus,
} from 'lucide-react';

interface Team {
  _id: string;
  name: string;
  code?: string;
  color?: string;
}

interface Category {
  _id: string;
  name: string;
}

interface Item {
  _id: string;
  name: string;
  categoryId: string | Category;
  type: 'single' | 'group';
  maxParticipantsPerTeam?: number;
}

interface Participant {
  _id: string;
  chestNo: string;
  name: string;
  phone?: string;
  teamId: Team;
  categoryId: Category;
  itemIds: Item[];
}

interface GroupParticipant {
  name: string;
  chestNo?: string;
}

interface GroupEntry {
  _id: string;
  itemId: Item;
  teamId: Team;
  participants: GroupParticipant[];
}

export default function ParticipantsManagementPage({
  params,
}: {
  params: Promise<{ festId: string }>;
}) {
  const { festId } = use(params);

  const [activeTab, setActiveTab] = useState<'single' | 'group'>('single');

  // Common Data
  const [teams, setTeams] = useState<Team[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  // Single Participants State
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loadingSingle, setLoadingSingle] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');

  // Group Entries State
  const [groupEntries, setGroupEntries] = useState<GroupEntry[]>([]);
  const [loadingGroup, setLoadingGroup] = useState(true);
  const [groupTeamFilter, setGroupTeamFilter] = useState('');
  const [groupItemFilter, setGroupItemFilter] = useState('');

  // Single Modal State
  const [isSingleModalOpen, setIsSingleModalOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [singleForm, setSingleForm] = useState({
    chestNo: '',
    name: '',
    phone: '',
    teamId: '',
    categoryId: '',
    itemIds: [] as string[],
  });
  const [savingSingle, setSavingSingle] = useState(false);
  const [singleError, setSingleError] = useState('');

  // Group Modal State
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroupEntry, setEditingGroupEntry] = useState<GroupEntry | null>(null);
  const [groupForm, setGroupForm] = useState({
    itemId: '',
    teamId: '',
    participants: [{ name: '', chestNo: '' }] as GroupParticipant[],
  });
  const [savingGroup, setSavingGroup] = useState(false);
  const [groupError, setGroupError] = useState('');

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'single' | 'group';
    id: string;
    name: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchAuxiliaryData();
    fetchParticipants();
    fetchGroupEntries();
  }, [festId]);

  const fetchAuxiliaryData = async () => {
    try {
      const [teamsRes, catRes, itemsRes] = await Promise.all([
        fetch(`/api/fests/${festId}/teams`),
        fetch(`/api/fests/${festId}/categories`),
        fetch(`/api/fests/${festId}/items`),
      ]);

      if (teamsRes.ok) {
        const d = await teamsRes.json();
        setTeams(d.teams || []);
      }
      if (catRes.ok) {
        const d = await catRes.json();
        setCategories(d.categories || []);
      }
      if (itemsRes.ok) {
        const d = await itemsRes.json();
        setItems(d.items || []);
      }
    } catch (err) {
      console.error('Failed to load auxiliary data:', err);
    }
  };

  const fetchParticipants = async () => {
    try {
      setLoadingSingle(true);
      const res = await fetch(`/api/fests/${festId}/participants`);
      const data = await res.json();
      if (res.ok) {
        setParticipants(data.participants || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSingle(false);
    }
  };

  const fetchGroupEntries = async () => {
    try {
      setLoadingGroup(true);
      const res = await fetch(`/api/fests/${festId}/group-entries`);
      const data = await res.json();
      if (res.ok) {
        setGroupEntries(data.groupEntries || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGroup(false);
    }
  };

  // Single Modal Handlers
  const handleOpenSingleModal = (participant: Participant | null = null) => {
    setSingleError('');
    if (participant) {
      setEditingParticipant(participant);
      setSingleForm({
        chestNo: participant.chestNo,
        name: participant.name,
        phone: participant.phone || '',
        teamId: typeof participant.teamId === 'object' ? participant.teamId._id : participant.teamId,
        categoryId:
          typeof participant.categoryId === 'object'
            ? participant.categoryId._id
            : participant.categoryId,
        itemIds: participant.itemIds.map((item) => (typeof item === 'object' ? item._id : item)),
      });
    } else {
      setEditingParticipant(null);
      setSingleForm({
        chestNo: '',
        name: '',
        phone: '',
        teamId: teams[0]?._id || '',
        categoryId: categories[0]?._id || '',
        itemIds: [],
      });
    }
    setIsSingleModalOpen(true);
  };

  const handleSaveSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSingleError('');
    setSavingSingle(true);

    try {
      const url = editingParticipant
        ? `/api/fests/${festId}/participants/${editingParticipant._id}`
        : `/api/fests/${festId}/participants`;

      const method = editingParticipant ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(singleForm),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSingleModalOpen(false);
        fetchParticipants();
      } else {
        setSingleError(data.error || 'Failed to save participant');
      }
    } catch (err: any) {
      setSingleError(err.message || 'An error occurred');
    } finally {
      setSavingSingle(false);
    }
  };

  // Group Modal Handlers
  const handleOpenGroupModal = (entry: GroupEntry | null = null) => {
    setGroupError('');
    if (entry) {
      setEditingGroupEntry(entry);
      setGroupForm({
        itemId: typeof entry.itemId === 'object' ? entry.itemId._id : entry.itemId,
        teamId: typeof entry.teamId === 'object' ? entry.teamId._id : entry.teamId,
        participants: entry.participants.length > 0 ? entry.participants : [{ name: '', chestNo: '' }],
      });
    } else {
      setEditingGroupEntry(null);
      const groupItems = items.filter((i) => i.type === 'group');
      setGroupForm({
        itemId: groupItems[0]?._id || '',
        teamId: teams[0]?._id || '',
        participants: [{ name: '', chestNo: '' }],
      });
    }
    setIsGroupModalOpen(true);
  };

  const handleSaveGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setGroupError('');
    setSavingGroup(true);

    try {
      const url = editingGroupEntry
        ? `/api/fests/${festId}/group-entries/${editingGroupEntry._id}`
        : `/api/fests/${festId}/group-entries`;

      const method = editingGroupEntry ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(groupForm),
      });

      const data = await res.json();

      if (res.ok) {
        setIsGroupModalOpen(false);
        fetchGroupEntries();
      } else {
        setGroupError(data.error || 'Failed to save group entry');
      }
    } catch (err: any) {
      setGroupError(err.message || 'An error occurred');
    } finally {
      setSavingGroup(false);
    }
  };

  // Delete Action
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const url =
        deleteTarget.type === 'single'
          ? `/api/fests/${festId}/participants/${deleteTarget.id}`
          : `/api/fests/${festId}/group-entries/${deleteTarget.id}`;

      const res = await fetch(url, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok) {
        setDeleteTarget(null);
        if (deleteTarget.type === 'single') fetchParticipants();
        else fetchGroupEntries();
      } else {
        alert(data.error || 'Deletion failed');
      }
    } catch (err) {
      alert('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  // Filtering
  const filteredParticipants = participants.filter((p) => {
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.chestNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.phone && p.phone.includes(searchQuery));

    const matchesTeam =
      !selectedTeamFilter ||
      (typeof p.teamId === 'object' ? p.teamId._id === selectedTeamFilter : p.teamId === selectedTeamFilter);

    const matchesCat =
      !selectedCategoryFilter ||
      (typeof p.categoryId === 'object'
        ? p.categoryId._id === selectedCategoryFilter
        : p.categoryId === selectedCategoryFilter);

    return matchesSearch && matchesTeam && matchesCat;
  });

  const filteredGroupEntries = groupEntries.filter((g) => {
    const matchesTeam =
      !groupTeamFilter ||
      (typeof g.teamId === 'object' ? g.teamId._id === groupTeamFilter : g.teamId === groupTeamFilter);

    const matchesItem =
      !groupItemFilter ||
      (typeof g.itemId === 'object' ? g.itemId._id === groupItemFilter : g.itemId === groupItemFilter);

    return matchesTeam && matchesItem;
  });

  // Export CSV
  const exportSingleCSV = () => {
    if (filteredParticipants.length === 0) return;
    const headers = ['Chest No', 'Name', 'Phone', 'Team', 'Category', 'Single Items'];
    const rows = filteredParticipants.map((p) => [
      `"${p.chestNo}"`,
      `"${p.name}"`,
      `"${p.phone || ''}"`,
      `"${typeof p.teamId === 'object' ? p.teamId.name : ''}"`,
      `"${typeof p.categoryId === 'object' ? p.categoryId.name : ''}"`,
      `"${p.itemIds.map((i) => (typeof i === 'object' ? i.name : '')).join(', ')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `participants_single_${festId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportGroupCSV = () => {
    if (filteredGroupEntries.length === 0) return;
    const headers = ['Group Item', 'Team', 'Member Name', 'Chest No'];
    const rows: string[][] = [];

    filteredGroupEntries.forEach((g) => {
      const itemName = typeof g.itemId === 'object' ? g.itemId.name : '';
      const teamName = typeof g.teamId === 'object' ? g.teamId.name : '';
      g.participants.forEach((m) => {
        rows.push([`"${itemName}"`, `"${teamName}"`, `"${m.name}"`, `"${m.chestNo || ''}"`]);
      });
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `participants_group_${festId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper for single modal items available in category
  const availableSingleItems = items.filter((item) => {
    if (item.type !== 'single') return false;
    if (!singleForm.categoryId) return true;
    const itemCatId = typeof item.categoryId === 'object' ? item.categoryId._id : item.categoryId;
    return itemCatId === singleForm.categoryId;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-emerald-400" />
            Participants & Entries
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Register individual contestants and team group entries for festival competitions.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-900/90 border border-slate-800 p-1 rounded-xl flex items-center gap-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'single'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Single Participants ({participants.length})
          </button>
          <button
            onClick={() => setActiveTab('group')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'group'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Group Entries ({groupEntries.length})
          </button>
        </div>
      </div>

      {/* SINGLE PARTICIPANTS TAB */}
      {activeTab === 'single' && (
        <div className="space-y-5">
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl">
            <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search name, chest no, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              {/* Team Filter */}
              <select
                value={selectedTeamFilter}
                onChange={(e) => setSelectedTeamFilter(e.target.value)}
                className="w-full sm:w-44 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="">All Teams</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="w-full sm:w-44 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportSingleCSV}
                disabled={filteredParticipants.length === 0}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
              <button
                onClick={() => handleOpenSingleModal()}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Participant
              </button>
            </div>
          </div>

          {/* Table */}
          {loadingSingle ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-7 h-7 text-emerald-400 animate-spin" />
              <p className="text-xs text-slate-400 font-medium">Loading participants...</p>
            </div>
          ) : filteredParticipants.length === 0 ? (
            <div className="py-16 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8">
              <UserCheck className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-300">No Participants Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No single contest participants match your search criteria or none have been added yet.
              </p>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Chest No</th>
                      <th className="px-5 py-3.5">Participant Name</th>
                      <th className="px-5 py-3.5">Team</th>
                      <th className="px-5 py-3.5">Category</th>
                      <th className="px-5 py-3.5">Single Items ({filteredParticipants.reduce((acc, p) => acc + p.itemIds.length, 0)})</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredParticipants.map((p) => {
                      const team = typeof p.teamId === 'object' ? p.teamId : null;
                      const cat = typeof p.categoryId === 'object' ? p.categoryId : null;

                      return (
                        <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-5 py-4 font-mono font-bold text-emerald-400">
                            <span className="bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                              #{p.chestNo}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="font-bold text-white text-sm">{p.name}</div>
                            {p.phone && (
                              <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3 text-slate-500" />
                                {p.phone}
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            {team ? (
                              <span
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                                style={{
                                  backgroundColor: `${team.color || '#10b981'}15`,
                                  color: team.color || '#10b981',
                                  borderColor: `${team.color || '#10b981'}30`,
                                  borderWidth: '1px',
                                }}
                              >
                                <span
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: team.color || '#10b981' }}
                                />
                                {team.name}
                              </span>
                            ) : (
                              <span className="text-slate-500">-</span>
                            )}
                          </td>
                          <td className="px-5 py-4 font-medium text-slate-300">
                            {cat ? cat.name : '-'}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {p.itemIds.length === 0 ? (
                                <span className="text-slate-500 italic text-[11px]">No items selected</span>
                              ) : (
                                p.itemIds.map((item) => (
                                  <span
                                    key={typeof item === 'object' ? item._id : item}
                                    className="bg-slate-800 text-slate-300 border border-slate-700/80 px-2 py-0.5 rounded text-[11px] font-medium"
                                  >
                                    {typeof item === 'object' ? item.name : 'Item'}
                                  </span>
                                ))
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenSingleModal(p)}
                                className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                title="Edit Participant"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteTarget({
                                    type: 'single',
                                    id: p._id,
                                    name: `${p.name} (Chest #${p.chestNo})`,
                                  })
                                }
                                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                title="Delete Participant"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* GROUP ENTRIES TAB */}
      {activeTab === 'group' && (
        <div className="space-y-5">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl">
            <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
              {/* Group Team Filter */}
              <select
                value={groupTeamFilter}
                onChange={(e) => setGroupTeamFilter(e.target.value)}
                className="w-full sm:w-52 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="">All Teams</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>

              {/* Group Item Filter */}
              <select
                value={groupItemFilter}
                onChange={(e) => setGroupItemFilter(e.target.value)}
                className="w-full sm:w-56 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="">All Group Items</option>
                {items
                  .filter((i) => i.type === 'group')
                  .map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportGroupCSV}
                disabled={filteredGroupEntries.length === 0}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
              <button
                onClick={() => handleOpenGroupModal()}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                Add Group Entry
              </button>
            </div>
          </div>

          {/* Group Entries List */}
          {loadingGroup ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-7 h-7 text-emerald-400 animate-spin" />
              <p className="text-xs text-slate-400 font-medium">Loading group entries...</p>
            </div>
          ) : filteredGroupEntries.length === 0 ? (
            <div className="py-16 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8">
              <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-300">No Group Entries Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No team group entries recorded yet or matching selected filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGroupEntries.map((entry) => {
                const item = typeof entry.itemId === 'object' ? entry.itemId : null;
                const team = typeof entry.teamId === 'object' ? entry.teamId : null;
                const category = item && typeof item.categoryId === 'object' ? item.categoryId : null;

                return (
                  <div
                    key={entry._id}
                    className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/80 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {category ? (category as Category).name : 'Group Item'}
                          </span>
                          <h3 className="text-base font-bold text-white mt-1.5">
                            {item ? item.name : 'Unknown Item'}
                          </h3>
                        </div>

                        {team && (
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold shadow-sm"
                            style={{
                              backgroundColor: `${team.color || '#10b981'}20`,
                              color: team.color || '#10b981',
                              borderColor: `${team.color || '#10b981'}40`,
                              borderWidth: '1px',
                            }}
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: team.color || '#10b981' }}
                            />
                            {team.name}
                          </span>
                        )}
                      </div>

                      {/* Members List */}
                      <div className="mt-4 bg-slate-950/60 border border-slate-800/60 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 border-b border-slate-800 pb-1.5">
                          <span>Team Members</span>
                          <span>{entry.participants.length} Participants</span>
                        </div>

                        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                          {entry.participants.map((member, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs text-slate-200 py-1 border-b border-slate-900 last:border-0"
                            >
                              <span className="font-medium">{member.name}</span>
                              {member.chestNo && (
                                <span className="font-mono text-[11px] text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                  #{member.chestNo}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenGroupModal(entry)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit Members
                      </button>
                      <button
                        onClick={() =>
                          setDeleteTarget({
                            type: 'group',
                            id: entry._id,
                            name: `Group entry for ${team?.name || 'Team'} in ${item?.name || 'Item'}`,
                          })
                        }
                        className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold rounded-lg transition-colors border border-rose-500/20 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SINGLE PARTICIPANT MODAL */}
      {isSingleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                {editingParticipant ? 'Edit Participant' : 'New Participant Registration'}
              </h2>
              <button
                onClick={() => setIsSingleModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSingle} className="p-6 space-y-4">
              {singleError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{singleError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Chest Number / Fest ID <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 101 or A-12"
                      value={singleForm.chestNo}
                      onChange={(e) => setSingleForm({ ...singleForm, chestNo: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Participant's name"
                    value={singleForm.name}
                    onChange={(e) => setSingleForm({ ...singleForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="tel"
                    placeholder="Contact number for SMS/updates"
                    value={singleForm.phone}
                    onChange={(e) => setSingleForm({ ...singleForm, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Select Team <span className="text-rose-400">*</span>
                  </label>
                  <select
                    required
                    value={singleForm.teamId}
                    onChange={(e) => setSingleForm({ ...singleForm, teamId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="" disabled>
                      Select Team
                    </option>
                    {teams.map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Select Category <span className="text-rose-400">*</span>
                  </label>
                  <select
                    required
                    value={singleForm.categoryId}
                    onChange={(e) =>
                      setSingleForm({ ...singleForm, categoryId: e.target.value, itemIds: [] })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Single Items Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Single Contests Multi-Select
                </label>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 max-h-48 overflow-y-auto space-y-2">
                  {availableSingleItems.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">
                      {singleForm.categoryId
                        ? 'No single items found for selected category.'
                        : 'Select a category first.'}
                    </p>
                  ) : (
                    availableSingleItems.map((item) => {
                      const isChecked = singleForm.itemIds.includes(item._id);
                      return (
                        <label
                          key={item._id}
                          className="flex items-center justify-between p-2 hover:bg-slate-900 rounded-lg cursor-pointer text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSingleForm({
                                    ...singleForm,
                                    itemIds: [...singleForm.itemIds, item._id],
                                  });
                                } else {
                                  setSingleForm({
                                    ...singleForm,
                                    itemIds: singleForm.itemIds.filter((id) => id !== item._id),
                                  });
                                }
                              }}
                              className="w-4 h-4 rounded border-slate-800 text-emerald-500 focus:ring-emerald-500/20 bg-slate-900"
                            />
                            <span className="font-semibold text-slate-200">{item.name}</span>
                          </div>
                          {item.maxParticipantsPerTeam && item.maxParticipantsPerTeam > 0 && (
                            <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                              Limit: {item.maxParticipantsPerTeam}/team
                            </span>
                          )}
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSingleModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSingle}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {savingSingle && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingParticipant ? 'Save Changes' : 'Register Participant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GROUP ENTRY MODAL */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                {editingGroupEntry ? 'Edit Group Entry' : 'New Group Entry'}
              </h2>
              <button
                onClick={() => setIsGroupModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGroup} className="p-6 space-y-4">
              {groupError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{groupError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Select Group Item <span className="text-rose-400">*</span>
                  </label>
                  <select
                    required
                    disabled={!!editingGroupEntry}
                    value={groupForm.itemId}
                    onChange={(e) => setGroupForm({ ...groupForm, itemId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50 disabled:opacity-50"
                  >
                    <option value="" disabled>
                      Select Group Item
                    </option>
                    {items
                      .filter((i) => i.type === 'group')
                      .map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Select Team <span className="text-rose-400">*</span>
                  </label>
                  <select
                    required
                    disabled={!!editingGroupEntry}
                    value={groupForm.teamId}
                    onChange={(e) => setGroupForm({ ...groupForm, teamId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50 disabled:opacity-50"
                  >
                    <option value="" disabled>
                      Select Team
                    </option>
                    {teams.map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic Group Members List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Group Members <span className="text-rose-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setGroupForm({
                        ...groupForm,
                        participants: [...groupForm.participants, { name: '', chestNo: '' }],
                      })
                    }
                    className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Member
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {groupForm.participants.map((member, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        placeholder={`Member #${idx + 1} Name`}
                        value={member.name}
                        onChange={(e) => {
                          const updated = [...groupForm.participants];
                          updated[idx].name = e.target.value;
                          setGroupForm({ ...groupForm, participants: updated });
                        }}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                      />
                      <input
                        type="text"
                        placeholder="Chest No (Optional)"
                        value={member.chestNo || ''}
                        onChange={(e) => {
                          const updated = [...groupForm.participants];
                          updated[idx].chestNo = e.target.value;
                          setGroupForm({ ...groupForm, participants: updated });
                        }}
                        className="w-32 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                      />
                      {groupForm.participants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = groupForm.participants.filter((_, i) => i !== idx);
                            setGroupForm({ ...groupForm, participants: updated });
                          }}
                          className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGroupModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingGroup}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {savingGroup && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingGroupEntry ? 'Save Changes' : 'Save Group Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Confirm Deletion</h3>
            </div>

            <p className="text-xs text-slate-300">
              Are you sure you want to delete <strong className="text-white">{deleteTarget.name}</strong>?
              This action cannot be undone.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
