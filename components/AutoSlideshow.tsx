"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

export type Slide = {
  src: string;
  alt?: string;
  caption?: string;
};

export default function AutoSlideshow({
  slides,
  interval = 4000,
  className = "",
  maxWidth = 1200,
}: {
  slides: Slide[];
  interval?: number; // ms
  className?: string;
  maxWidth?: number; // px
}) {
  const safeSlides = useMemo(() => slides.filter(Boolean), [slides]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (safeSlides.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % safeSlides.length);
    }, interval);
    return () => clearInterval(id);
  }, [safeSlides.length, interval]);

  if (!safeSlides.length) return null;

  return (
    <div className={`w-full ${className}`.trim()}>
      <div className="relative mx-auto" style={{ maxWidth }}>
        {/* Slides */}
        <div className="relative w-full overflow-hidden rounded-lg">
          {safeSlides.map((slide, i) => {
            const active = i === index;
            return (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  active ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden={!active}
              >
                {/* Use fill for responsive image; parent must be relative */}
                <div className="relative h-64 sm:h-80 md:h-[420px]">
                  <Image
                    src={slide.src}
                    alt={slide.alt || `Slide ${i + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1000px"
                    className="object-cover"
                    priority={i === 0}
                  />
                </div>
                {/* {slide.caption ? (
                  <div className="absolute inset-x-0 bottom-2 px-3 text-center">
                    <span className="inline-block rounded bg-black/50 px-3 py-1 text-sm text-white">
                      {slide.caption}
                    </span>
                  </div>
                ) : null} */}

                {/* Number text like 1 / 3 */}
                {/* <div className="absolute left-2 top-2 rounded bg-black/40 px-2 py-1 text-xs text-white">
                  {i + 1} / {safeSlides.length}
                </div> */}
              </div>
            );
          })}

          {/* Ensure the container has height by rendering a placeholder box */}
          <div className="invisible">
            <div className="h-64 sm:h-80 md:h-[420px]" />
          </div>
        </div>

        {/* Dots */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {safeSlides.map((_, i) => {
            const active = i === index;
            return (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-3.5 w-3.5 rounded-full transition-colors ${
                  active ? "bg-neutral-700" : "bg-neutral-300 hover:bg-neutral-400"
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
