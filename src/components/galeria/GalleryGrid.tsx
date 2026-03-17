"use client";

import { useState } from "react";
import { GalleryItem } from "./GalleryItem";
import { FolderHeart } from "lucide-react";

interface Photo {
  id: number;
  imagen_url: string;
  descripcion: string;
  categoria?: string;
}

interface GalleryGridProps {
  photos: Photo[];
}

export function GalleryGrid({ photos }: GalleryGridProps) {
  const [activeFilter, setActiveFilter] = useState("TODAS");

  const categories = ["TODAS", ...new Set(photos.map(p => p.categoria || "Mística").filter(Boolean))];

  const filteredPhotos = activeFilter === "TODAS"
    ? photos
    : photos.filter(p => (p.categoria || "Mística") === activeFilter);

  return (
    <div>
      {/* Filtros de Categoría */}
      <div className="mb-12 flex flex-wrap items-center justify-center gap-3 border-b border-zinc-200 pb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
              activeFilter === cat
                ? "bg-red-600 text-white"
                : "bg-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grilla de Fotos */}
      {filteredPhotos.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {filteredPhotos.map((photo) => (
            <GalleryItem
              key={photo.id}
              photoUrl={photo.imagen_url}
              description={photo.descripcion}
              category={photo.categoria}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-zinc-200 text-center">
            <FolderHeart className="h-12 w-12 text-zinc-300 mb-4" />
            <p className="text-sm uppercase tracking-widest text-zinc-400 font-bold">No hay fotos en esta categoría.</p>
        </div>
      )}
    </div>
  );
}