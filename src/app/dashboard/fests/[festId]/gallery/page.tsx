'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import FestAdminNav from '@/components/admin/FestAdminNav';
import { Image as ImageIcon, Trash2, Plus, Loader2, AlertCircle, ExternalLink } from 'lucide-react';

interface GalleryItem {
  _id: string;
  imageUrl: string;
  caption?: string;
  uploadedAt: string;
}

export default function GalleryAdminPage() {
  const params = useParams();
  const festId = params.festId as string;

  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form state
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/fests/${festId}/gallery`);
      const data = await res.json();
      if (res.ok) {
        setImages(data.images || []);
      } else {
        setError(data.error || 'Failed to fetch gallery images');
      }
    } catch (err) {
      setError('An error occurred while loading gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (festId) fetchGallery();
  }, [festId]);

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    setSubmitting(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch(`/api/fests/${festId}/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: imageUrl.trim(),
          caption: caption.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('Photo added to gallery!');
        setImageUrl('');
        setCaption('');
        fetchGallery();
      } else {
        setError(data.error || 'Failed to add image');
      }
    } catch (err) {
      setError('An error occurred while submitting');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this photo from the gallery?')) return;

    try {
      const res = await fetch(`/api/fests/${festId}/gallery/${imageId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('Photo deleted successfully');
        setImages(images.filter((img) => img._id !== imageId));
      } else {
        setError(data.error || 'Failed to delete photo');
      }
    } catch (err) {
      setError('An error occurred while deleting');
    }
  };

  return (
    <div className="min-h-screen bg-emerald-950 text-emerald-50">
      <FestAdminNav festId={festId} activeTab="gallery" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald-100 flex items-center gap-3">
              <ImageIcon className="w-8 h-8 text-emerald-400" />
              Manage Photo Gallery
            </h1>
            <p className="text-emerald-300 text-sm mt-1">
              Add image URLs and captions to showcase highlights from the festival.
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

        {/* Add Image Form */}
        <div className="bg-emerald-900/40 border border-emerald-800/80 backdrop-blur-md rounded-2xl p-6 mb-10 shadow-xl">
          <h2 className="text-lg font-semibold text-emerald-200 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-400" />
            Add New Photo
          </h2>

          <form onSubmit={handleAddImage} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2">
                Image URL *
              </label>
              <input
                type="url"
                required
                placeholder="https://example.com/photo.jpg or Cloudinary URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-emerald-950/80 border border-emerald-700/70 rounded-xl text-emerald-100 placeholder-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2">
                Caption (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Inauguration ceremony, Stage performance"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-4 py-2.5 bg-emerald-950/80 border border-emerald-700/70 rounded-xl text-emerald-100 placeholder-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !imageUrl.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-emerald-950 font-semibold text-sm rounded-xl transition shadow-lg shadow-emerald-950/50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding Photo...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Publish Photo
                </>
              )}
            </button>
          </form>
        </div>

        {/* Gallery Grid */}
        <h2 className="text-xl font-bold text-emerald-100 mb-4">
          Gallery Photos ({images.length})
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-emerald-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 bg-emerald-900/20 border border-emerald-800/40 rounded-2xl">
            <ImageIcon className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <p className="text-emerald-400 text-sm">No photos added to the gallery yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img) => (
              <div
                key={img._id}
                className="bg-emerald-900/40 border border-emerald-800/60 rounded-2xl overflow-hidden flex flex-col group"
              >
                <div className="relative aspect-video bg-emerald-950 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.imageUrl}
                    alt={img.caption || 'Gallery image'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <a
                    href={img.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute top-2 right-2 p-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 rounded-lg backdrop-blur-sm transition opacity-0 group-hover:opacity-100"
                    title="Open full size"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-emerald-200 text-sm font-medium line-clamp-2">
                      {img.caption || <span className="italic text-emerald-500">No caption</span>}
                    </p>
                    <p className="text-xs text-emerald-400 mt-2">
                      {new Date(img.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-emerald-800/40 flex justify-end">
                    <button
                      onClick={() => handleDeleteImage(img._id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-lg transition"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
