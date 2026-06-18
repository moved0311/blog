"use client";

import { useEffect, useRef, useState } from "react";
import type { CompositionEvent, KeyboardEvent } from "react";
import Image from "next/image";

import Play from "/public/icons/play.svg";
import Stop from "/public/icons/stop.svg";
import Pause from "/public/icons/pause.svg";
import RecordIcon from "/public/icons/record.svg";

type Record = { end: number; duration: number; title: string };

type GroupedRecord = {
  title: string;
  duration: number;
  periods: Array<{ end: number; duration: number }>;
};

const formatTime = (time: number) => {
  const seconds = Math.floor((time / 1000) % 60);
  const minutes = Math.floor((time / (1000 * 60)) % 60);
  const hours = Math.floor(time / (1000 * 60 * 60));

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const formatDuration = (time: number) => {
  const totalMinutes = Math.floor(time / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

const formatRecord = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString("zh-tw", {
    hour12: false,
    hourCycle: "h23",
    hour: "2-digit",
    minute: "2-digit",
  });

const Stopwatch = () => {
  const [items, setItems] = useState<string[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompositionEnd, setIsCompositionEnd] = useState(true);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = activeItem ? `${formatTime(time)} ${activeItem}` : "Timer";
  }, [activeItem, time]);

  useEffect(
    () => () => {
      clearInterval(timerRef.current || 0);
    },
    [],
  );

  const startInterval = () => {
    clearInterval(timerRef.current || 0);
    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setTime((previousTime) => previousTime + 1000);
    }, 1000);
  };

  const saveActivePeriod = () => {
    if (!activeItem || time === 0) return;

    setRecords((previousRecords) => [
      ...previousRecords,
      { end: Date.now(), duration: time, title: activeItem },
    ]);
  };

  const onStart = (title: string) => {
    if (activeItem === title) {
      if (!isRunning) startInterval();
      return;
    }

    saveActivePeriod();
    setActiveItem(title);
    setTime(0);
    startInterval();
  };

  const onPause = () => {
    clearInterval(timerRef.current || 0);
    setIsRunning(false);
  };

  const onDiscard = () => {
    clearInterval(timerRef.current || 0);
    setActiveItem(null);
    setIsRunning(false);
    setTime(0);
  };

  const onRecord = () => {
    saveActivePeriod();
    onDiscard();
  };

  const onAddItem = () => {
    const title = inputRef.current?.value.trim() ?? "";
    if (!title) return;

    setItems((previousItems) =>
      previousItems.includes(title) ? previousItems : [...previousItems, title],
    );
    if (inputRef.current) inputRef.current.value = "";
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && isCompositionEnd) onAddItem();
  };

  const onComposition = (event: CompositionEvent<HTMLInputElement>) => {
    setIsCompositionEnd(event.type === "compositionend");
  };

  const groupedRecords = items.map<GroupedRecord>((title) => {
    const itemRecords = records.filter((record) => record.title === title);

    return {
      title,
      duration: itemRecords.reduce(
        (total, record) => total + record.duration,
        0,
      ),
      periods: itemRecords.map(({ end, duration }) => ({ end, duration })),
    };
  });

  const onCopy = async () => {
    const now = Date.now();
    const content = groupedRecords
      .map(({ title, duration, periods }) => {
        const isActive = activeItem === title;
        const totalDuration = duration + (isActive ? time : 0);
        const detailLines = periods.map(
          ({ end, duration: periodDuration }) =>
            `  - ${formatRecord(end - periodDuration)} - ${formatRecord(end)} (${formatDuration(periodDuration)})`,
        );

        if (isActive && time > 0) {
          detailLines.push(
            `  - ${formatRecord(now - time)} - ${formatRecord(now)} (${formatDuration(time)}) 計時中`,
          );
        }

        return [`${title} (${formatDuration(totalDuration)})`, ...detailLines].join(
          "\n",
        );
      })
      .join("\n\n");

    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }

    window.setTimeout(() => setCopyStatus("idle"), 2000);
  };

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          placeholder="輸入項目"
          onCompositionStart={onComposition}
          onCompositionEnd={onComposition}
          onKeyDown={onKeyDown}
          className="h-9 w-48 rounded border border-slate-600 bg-transparent px-3 text-sm text-white transition focus:border-slate-400 focus:outline-none"
        />
        <button
          onClick={onAddItem}
          className="h-9 rounded bg-slate-700 px-4 text-sm hover:bg-slate-600"
        >
          新增
        </button>
        <button
          onClick={onCopy}
          disabled={items.length === 0}
          className="h-9 rounded border border-slate-600 px-4 text-sm hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copyStatus === "copied"
            ? "已複製"
            : copyStatus === "error"
              ? "複製失敗"
              : "複製"}
        </button>
      </div>

      <ul className="mt-5 space-y-4">
        {groupedRecords.map(({ title, duration, periods }) => {
          const isActive = activeItem === title;
          const totalDuration = duration + (isActive ? time : 0);

          return (
            <li key={title} className="rounded border border-slate-700 p-3">
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1 text-lg">
                  {`${title} (${formatDuration(totalDuration)})`}
                </div>
                {isActive && (
                  <div className="w-24 text-right font-mono text-lg">
                    {formatTime(time)}
                  </div>
                )}
                {isActive && isRunning ? (
                  <button onClick={onPause} title="暫停">
                    <Image src={Pause} alt="暫停" />
                  </button>
                ) : (
                  <button onClick={() => onStart(title)} title="開始計時">
                    <Image src={Play} alt="開始計時" />
                  </button>
                )}
                {isActive && (
                  <>
                    <button onClick={onDiscard} title="取消這次計時">
                      <Image src={Stop} alt="取消這次計時" />
                    </button>
                    <button onClick={onRecord} title="完成並記錄">
                      <Image src={RecordIcon} alt="完成並記錄" />
                    </button>
                  </>
                )}
              </div>

              {periods.length > 0 && (
                <ul className="ml-6 mt-2 list-disc text-base text-slate-300">
                  {periods.map(({ end, duration: periodDuration }) => (
                    <li key={end}>
                      {`${formatRecord(end - periodDuration)} - ${formatRecord(end)} (${formatDuration(periodDuration)})`}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Stopwatch;
