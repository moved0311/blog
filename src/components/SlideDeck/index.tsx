"use client";

import {
  Children,
  isValidElement,
  type ReactNode,
  type TouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "./SlideDeck.module.css";

type SlideDeckProps = {
  children: ReactNode;
};

type SlideProps = {
  children: ReactNode;
};

export const Slide = ({ children }: SlideProps) => {
  return <>{children}</>;
};

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      d="m15 18-6-6 6-6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      d="m9 18 6-6-6-6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const FullscreenIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const getSlideFromHash = (total: number) => {
  if (typeof window === "undefined") return 0;

  const parsed = Number.parseInt(window.location.hash.slice(1), 10);
  if (Number.isNaN(parsed)) return 0;

  return Math.min(Math.max(parsed - 1, 0), Math.max(total - 1, 0));
};

const SlideDeck = ({ children }: SlideDeckProps) => {
  const slides = Children.toArray(children).filter(isValidElement);
  const total = slides.length;
  const deckRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (total === 0) return;
      setCurrent(Math.min(Math.max(index, 0), total - 1));
    },
    [total],
  );

  const previous = useCallback(() => {
    setCurrent((index) => Math.max(index - 1, 0));
  }, []);

  const next = useCallback(() => {
    setCurrent((index) => Math.min(index + 1, total - 1));
  }, [total]);

  useEffect(() => {
    setCurrent(getSlideFromHash(total));

    const handleHashChange = () => setCurrent(getSlideFromHash(total));
    window.addEventListener("hashchange", handleHashChange);

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [total]);

  useEffect(() => {
    const hash = `#${current + 1}`;
    if (window.location.hash !== hash) {
      window.history.replaceState(null, "", hash);
    }
  }, [current]);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target?.matches(
          "input, textarea, select, [contenteditable='true'], [role='textbox']",
        )
      ) {
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        previous();
      }

      if (
        event.key === "ArrowRight" ||
        event.key === "PageDown" ||
        event.key === " "
      ) {
        event.preventDefault();
        next();
      }

      if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      }

      if (event.key === "End") {
        event.preventDefault();
        goTo(total - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goTo, next, previous, total]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === deckRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!deckRef.current) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await deckRef.current.requestFullscreen();
    }
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;

    const distance = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(distance) < 50) return;
    if (distance > 0) previous();
    else next();
  };

  if (total === 0) return null;

  return (
    <div
      ref={deckRef}
      className="group/deck relative flex h-full w-full flex-col overflow-hidden bg-white shadow-xl shadow-slate-950/10 dark:bg-[#0d1117] dark:shadow-black/30 fullscreen:h-screen"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="h-1 w-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full bg-[#007acc] transition-[width] duration-300"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>

      <main
        className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-7 py-12 sm:px-14 sm:py-16"
        aria-live="polite"
      >
        <div
          key={current}
          className={`${styles.slideContent} prose prose-slate max-w-none dark:prose-invert prose-headings:text-balance prose-h1:text-4xl prose-h1:font-black prose-h1:tracking-tight sm:prose-h1:text-6xl prose-h2:text-3xl sm:prose-h2:text-5xl prose-p:text-lg prose-p:leading-relaxed sm:prose-p:text-xl prose-li:text-lg sm:prose-li:text-xl`}
        >
          {slides[current]}
        </div>
      </main>

      <footer className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400 sm:px-6">
        <span aria-label={`第 ${current + 1} 張，共 ${total} 張`}>
          {current + 1} / {total}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={previous}
            disabled={current === 0}
            aria-label="上一張"
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-700 transition hover:border-[#007acc] hover:text-[#007acc] disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-700 dark:text-slate-200"
          >
            <ArrowLeftIcon />
          </button>
          <button
            type="button"
            onClick={next}
            disabled={current === total - 1}
            aria-label="下一張"
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-700 transition hover:border-[#007acc] hover:text-[#007acc] disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-700 dark:text-slate-200"
          >
            <ArrowRightIcon />
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "離開全螢幕" : "進入全螢幕"}
            className="ml-1 grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-700 transition hover:border-[#007acc] hover:text-[#007acc] dark:border-slate-700 dark:text-slate-200"
          >
            <FullscreenIcon />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default SlideDeck;
