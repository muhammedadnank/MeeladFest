'use client';

import { useState, useEffect, use } from 'react';
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  Search,
  Layers,
  User,
  Users,
  Filter,
} from 'lucide-react';

interface CategoryItem {
  _id: string;
  name: string;
  ageRange?: string;
}

interface ItemData {
  _id: string;
  name: string;
  description?: string;
  type: 'single' | 'group';
  maxParticipantsPerTeam?: number;
  categoryId: CategoryItem | string;
  createdAt: string;
}

export default function ItemsManagementPage({ params }: { params: Promise<{ festId: string }> }) {
  const { festId } = use(params);

  const [items, setItems] = useState<ItemData[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: '',
    name: '',
    description: '',
    type: 'single' as 'single' | 'group',
    maxParticipantsPerTeam: '',
  });

  useEffect(() => {
    fetchInitialData();
  }, [festId]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [itemsRes, catRes] = await Promise.all([
        fetch(`/api/fests/${festId}/items`),
        fetch(`/api/fests/${festId}/categories`),
      ]);

      const itemsData = await itemsRes.json();
      const catData = await catRes.json();

      if (itemsRes.ok) {
        setItems(itemsData.items || []);
      }
      if (catRes.ok) {
        setCategories(catData.categories || []);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to fetch items or categories' });
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await fetch(`/api/fests/${festId}/items`);
      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      categoryId: categories.length > 0 ? categories[0]._id : '',
      name: '',
      description: '',
      type: 'single',
      maxParticipantsPerTeam: '',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (item: ItemData) => {
    setEditingItem(item);
    const catId = typeof item.categoryId === 'object' ? item.categoryId._id : item.categoryId;
    setFormData({
      categoryId: catId || '',
      name: item.name,
      description: item.description || '',
      type: item.type || 'single',
      maxParticipantsPerTeam: item.maxParticipantsPerTeam ? String(item.maxParticipantsPerTeam) : '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.categoryId) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const url = editingItem
        ? `/api/fests/${festId}/items/${editingItem._id}`
        : `/api/fests/${festId}/items`;
      const method = editingItem ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setShowModal(false);
        setMessage({
          type: 'success',
          text: editingItem ? 'Item updated successfully.' : 'Item created successfully.',
        });
        fetchItems();
      } else {
        setMessage({ type: 'error', text: data.error || 'Operation failed.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred while saving item.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item: ItemData) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;

    setMessage(null);
    try {
      const res = await fetch(`/api/fests/${festId}/items/${item._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Item deleted successfully.' });
        fetchItems();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete item.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error deleting item.' });
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const itemCatId = typeof item.categoryId === 'object' ? item.categoryId._id : item.categoryId;
    const matchesCat = selectedCategoryFilter === 'all' || itemCatId === selectedCategoryFilter;
    const matchesType = selectedTypeFilter === 'all' || item.type === selectedTypeFilter;

    return matchesSearch && matchesCat && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-400" />
            Items & Contests Setup
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage stage and off-stage competition items assigned to age categories (sorted alphabetically).
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          disabled={categories.length === 0}
          className="py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer self-start sm:self-auto disabled:opacity-50 disabled:cursor-not-allowed"
          title={categories.length === 0 ? 'Create a category first' : ''}
        >
          <Plus className="w-4 h-4" />
          Add Item / Contest
        </button>
      </div>

      {categories.length === 0 && !loading && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium flex items-center justify-between">
          <span>You need to create at least one Category before adding items.</span>
        </div>
      )}

      {/* Alert Messages */}
      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white">
            ×
          </button>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items by name..."
            className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategoryFilter}
          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          className="bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Type Filter */}
        <select
          value={selectedTypeFilter}
          onChange={(e) => setSelectedTypeFilter(e.target.value)}
          className="bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <option value="all">All Item Types</option>
          <option value="single">Single Items</option>
          <option value="group">Group Items</option>
        </select>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center">
          <Award className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">No items found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {searchQuery || selectedCategoryFilter !== 'all' || selectedTypeFilter !== 'all'
              ? 'No items match your filter criteria.'
              : 'Click above to create your first competition item.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const catName = typeof item.categoryId === 'object' ? item.categoryId.name : 'Unknown Category';

            return (
              <div
                key={item._id}
                className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                      <Layers className="w-3 h-3" />
                      {catName}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.type === 'group'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}
                    >
                      {item.type === 'group' ? <Users className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {item.type}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                    {item.name}
                  </h3>

                  {item.description && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                  )}

                  {item.type === 'single' && item.maxParticipantsPerTeam && (
                    <p className="text-[11px] text-amber-400/90 font-medium mt-2">
                      Max {item.maxParticipantsPerTeam} participant(s) per team
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-end gap-1">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Edit Item"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Delete Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Item Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-100 mb-1">
              {editingItem ? 'Edit Item / Contest' : 'Add New Item / Contest'}
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Fill in contest configuration details below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} {c.ageRange ? `(${c.ageRange})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Qira'at, Song, Speech, Duff, Quiz"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional contest rules or topic notes..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Event Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as 'single' | 'group' })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="single">Single (Individual)</option>
                    <option value="group">Group (Team Entry)</option>
                  </select>
                </div>

                {formData.type === 'single' && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Max Participants / Team
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxParticipantsPerTeam}
                      onChange={(e) =>
                        setFormData({ ...formData, maxParticipantsPerTeam: e.target.value })
                      }
                      placeholder="Optional limit (e.g. 2)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-emerald-400 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {editingItem ? 'Update Item' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
