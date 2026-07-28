'use client';

import { useState, useEffect, use } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  Search,
  Calendar,
} from 'lucide-react';

interface CategoryItem {
  _id: string;
  name: string;
  ageRange?: string;
  createdAt: string;
}

export default function CategoriesManagementPage({ params }: { params: Promise<{ festId: string }> }) {
  const { festId } = use(params);

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    ageRange: '',
  });

  useEffect(() => {
    fetchCategories();
  }, [festId]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/fests/${festId}/categories`);
      const data = await res.json();
      if (res.ok) {
        setCategories(data.categories || []);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to fetch categories' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to fetch categories' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', ageRange: '' });
    setShowModal(true);
  };

  const handleOpenEditModal = (category: CategoryItem) => {
    setEditingCategory(category);
    setFormData({ name: category.name, ageRange: category.ageRange || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const url = editingCategory
        ? `/api/fests/${festId}/categories/${editingCategory._id}`
        : `/api/fests/${festId}/categories`;
      const method = editingCategory ? 'PATCH' : 'POST';

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
          text: editingCategory ? 'Category updated successfully.' : 'Category created successfully.',
        });
        fetchCategories();
      } else {
        setMessage({ type: 'error', text: data.error || 'Operation failed.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred while saving.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (category: CategoryItem) => {
    if (!confirm(`Are you sure you want to delete category "${category.name}"?`)) return;

    setMessage(null);
    try {
      const res = await fetch(`/api/fests/${festId}/categories/${category._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Category deleted successfully.' });
        fetchCategories();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete category.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error deleting category.' });
    }
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.ageRange && c.ageRange.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-400" />
            Categories Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Define age-group categories (e.g. Sub-Junior, Junior, Senior) for items & participants.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

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

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search categories by name or age range..."
          className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        />
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center">
          <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">No categories found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {searchQuery
              ? 'No categories match your search query.'
              : 'Click above to create your first age-group category.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <div
              key={category._id}
              className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all flex items-center justify-between group"
            >
              <div>
                <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                  {category.name}
                </h3>
                {category.ageRange ? (
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {category.ageRange}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-500 italic mt-1">No age limit specified</p>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEditModal(category)}
                  className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Edit Category"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category)}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-100 mb-1">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Specify category name and optional age restriction criteria.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sub-Junior, Junior, Senior, General"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Age Range / Criteria
                </label>
                <input
                  type="text"
                  value={formData.ageRange}
                  onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                  placeholder="e.g. Below 12 years, Class 5-7"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
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
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
