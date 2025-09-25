"use client";
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";

// Types TypeScript
interface SwiperItem {
  id: string | number;
  content: ReactNode;
}

interface ContinuousSwiperProps {
  items: SwiperItem[];
  speed?: number;
  className?: string;
}

const ContinuousSwiper: React.FC<ContinuousSwiperProps> = ({
  items,
  speed = 50,
  className = "",
}) => {
  const swiperRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const currentTranslateRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const pausedTranslateRef = useRef<number>(0);

  // Fonction pour calculer la taille des slides (toujours carrés)
  const getSlideSize = (): number => {
    const screenWidth = window.innerWidth;
    //const containerPadding = 0; // Pas de padding car on occupe toute la largeur

    if (screenWidth < 768) {
      return screenWidth / 1.1; // Mobile → 2.5 slides visibles
    }
    return 380; // Desktop → taille fixe
  };

  const [slideSize, setSlideSize] = useState<number>(getSlideSize);

  // Largeur totale d'une série complète
  const totalWidth = items.length * slideSize;

  // Animation continue avec boucle parfaite
  const animate = useCallback((): void => {
    if (!isDraggingRef.current && swiperRef.current) {
      const currentTime = Date.now();
      if (startTimeRef.current === 0) {
        startTimeRef.current = currentTime;
      }
      const elapsedTime = (currentTime - startTimeRef.current) / 1000;
      const distance =
        (elapsedTime * speed + pausedTranslateRef.current) % totalWidth;

      currentTranslateRef.current = -distance;
      swiperRef.current.style.transform = `translateX(${currentTranslateRef.current}px)`;
    }
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, totalWidth]);

  // Gestion du début du drag
  const handleStart = useCallback(
    (clientX: number): void => {
      isDraggingRef.current = true;
      startXRef.current = clientX;
      pausedTranslateRef.current =
        Math.abs(currentTranslateRef.current) % totalWidth;

      if (swiperRef.current) {
        swiperRef.current.style.cursor = "grabbing";
      }
    },
    [totalWidth]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent): void => {
      handleStart(e.clientX);
    },
    [handleStart]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent): void => {
      handleStart(e.touches[0].clientX);
    },
    [handleStart]
  );

  // Gestion du mouvement pendant le drag
  const handleMove = useCallback(
    (clientX: number): void => {
      if (!isDraggingRef.current || !swiperRef.current) return;

      const deltaX = clientX - startXRef.current;
      const newTranslate = currentTranslateRef.current + deltaX;

      const normalizedTranslate = newTranslate % totalWidth;
      swiperRef.current.style.transform = `translateX(${normalizedTranslate}px)`;
    },
    [totalWidth]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent): void => {
      e.preventDefault();
      handleMove(e.clientX);
    },
    [handleMove]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent): void => {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    },
    [handleMove]
  );

  // Gestion de la fin du drag
  const handleEnd = useCallback(
    (clientX: number): void => {
      if (!isDraggingRef.current) return;

      isDraggingRef.current = false;
      const deltaX = clientX - startXRef.current;

      const newPosition =
        Math.abs(currentTranslateRef.current + deltaX) % totalWidth;
      pausedTranslateRef.current = newPosition;

      startTimeRef.current = Date.now();

      if (swiperRef.current) {
        swiperRef.current.style.cursor = "grab";
      }
    },
    [totalWidth]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent): void => {
      handleEnd(e.clientX);
    },
    [handleEnd]
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent): void => {
      handleEnd(e.changedTouches[0].clientX);
    },
    [handleEnd]
  );

  // Gestion du redimensionnement
  const handleResize = useCallback((): void => {
    const newSlideSize = getSlideSize();
    setSlideSize(newSlideSize);
    pausedTranslateRef.current = 0;
    startTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    startTimeRef.current = Date.now();
    animate();

    const handleGlobalMouseMove = (e: MouseEvent) => handleMouseMove(e);
    const handleGlobalMouseUp = (e: MouseEvent) => handleMouseUp(e);
    const handleGlobalTouchMove = (e: TouchEvent) => handleTouchMove(e);
    const handleGlobalTouchEnd = (e: TouchEvent) => handleTouchEnd(e);

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);
    document.addEventListener("touchmove", handleGlobalTouchMove, {
      passive: false,
    });
    document.addEventListener("touchend", handleGlobalTouchEnd);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);

      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("touchmove", handleGlobalTouchMove);
      document.removeEventListener("touchend", handleGlobalTouchEnd);
    };
  }, [
    animate,
    handleMouseMove,
    handleMouseUp,
    handleResize,
    handleTouchEnd,
    handleTouchMove,
  ]);

  // Génération des slides
  const generateSlides = (): Array<SwiperItem & { uniqueId: string }> => {
    const multipliedSlides: Array<SwiperItem & { uniqueId: string }> = [];
    for (let repeat = 0; repeat < 6; repeat++) {
      items.forEach((item, index) => {
        multipliedSlides.push({
          ...item,
          uniqueId: `${item.id}-${repeat}-${index}`,
        });
      });
    }
    return multipliedSlides;
  };

  const allSlides = generateSlides();

  if (items.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <div className="text-center text-gray-500 py-8">
          Aucun élément à afficher
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full relative ${className}`}>
      {/* Container du carousel avec effet de flou sur les côtés */}
      <div
        className="relative overflow-hidden bg-transparent"
        style={{
          height: `${slideSize}px`,
          mask: "linear-gradient(to right, transparent 0%, black 1%, black 99%, transparent 100%)",
          WebkitMask:
            "linear-gradient(to right, transparent 0%, black 1%, black 99%, transparent 100%)",
        }}
      >
        {/* Container des slides */}
        <div
          ref={swiperRef}
          className="flex cursor-grab select-none h-full"
          style={{ width: `${allSlides.length * slideSize}px` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {allSlides.map((slide) => (
            <div
              key={slide.uniqueId}
              className="flex-shrink-0 flex items-center justify-center"
              style={{ width: `${slideSize}px`, height: `${slideSize}px` }}
            >
              {slide.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContinuousSwiper;
