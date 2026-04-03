"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: string[];
  title: string;
}

export function NoticiaSlider({ images, title }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  if (images.length === 0) return null;

  return (
    <div className="relative group w-full mb-10 overflow-hidden shadow-2xl border-b-4 border-red-600 bg-zinc-100">
      {/* Contenedor de Imágenes */}
      <div 
        className="flex transition-transform duration-500 ease-out h-[300px] md:h-[600px]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((url, index) => (
          <Image
            key={index}
            src={url}
            alt={`${title} - ${index + 1}`}
            width={1600}
            height={900}
            className="w-full h-full object-cover flex-shrink-0"
          />
        ))}
      </div>

      {/* Controles (Solo si hay más de una imagen) */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-red-600 text-white p-2 rounded-full transition-colors z-10 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-red-600 text-white p-2 rounded-full transition-colors z-10 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicador de posición (ej: 1 / 5) */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest italic">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Miniaturas o "Dots" */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <div
                key={index}
                className={`h-1 w-6 transition-all ${
                  currentIndex === index ? "bg-red-600" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
