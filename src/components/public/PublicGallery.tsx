'use client';

import { useState, useEffect } from 'react';

interface IGalleryImage {
  _id: string;
  url: string;
  caption?: string;
}

export default function PublicGallery({ festId }: { festId: string }) {
  const [images, setImages] = useState<IGalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<IGalleryImage | null>(null);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch(`/api/fests/${festId}/gallery`);
        if (res.ok) {
          const data = await res.json();
          setImages(data.gallery || []);
        }
      } catch (err) {
        console.error('Failed to load gallery', err);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, [festId]);

  if (loading) {
    return <div className="py-6 text-center text-slate-400 text-sm">Loading gallery photos...</div>;
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img._id}
            onClick={() => setSelectedImage(img)}
            className="group relative aspect-square bg-slate-900 rounded-xl overflow-hidden cursor-pointer border border-slate-800 hover:border-emerald-500/50 transition duration-300"
          >
            <img
              src={img.url}
              alt={img.caption || 'Festival Photo'}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              loading="lazy"
            />
            {img.caption && (
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end">
                <p className="text-xs text-slate-200 line-clamp-2">{img.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal / Lightbox */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-2">
            <img
              src={selectedImage.url}
              alt={selectedImage.caption || 'Festival Photo'}
              className="max-h-[80vh] w-auto mx-auto rounded-lg object-contain"
            />
            {selectedImage.caption && (
              <p className="mt-2 text-center text-sm text-slate-300 px-4 py-1">
                {selectedImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
