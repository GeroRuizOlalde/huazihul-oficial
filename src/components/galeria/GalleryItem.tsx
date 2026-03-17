import { Camera } from "lucide-react";

interface GalleryItemProps {
  photoUrl: string;
  description: string;
  category?: string;
}

export function GalleryItem({ photoUrl, description, category }: GalleryItemProps) {
  return (
    <div className="group relative aspect-square w-full overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm transition-all hover:border-red-600 hover:shadow-lg">
      <img
        src={photoUrl}
        alt={description}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Superposición degradada y texto */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end">
        <div className="flex items-center gap-2 mb-2 text-red-500 font-bold uppercase tracking-widest text-[9px]">
            <Camera className="w-3 h-3" /> {category || "Mística"}
        </div>
        <p className="text-xs font-medium text-white line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
}