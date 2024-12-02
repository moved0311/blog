"use client";

import { useState, useRef, useEffect, memo } from "react";
import type { CompositionEvent } from "react";
import Image from "next/image";

import Play from "/public/icons/play.svg";
import Stop from "/public/icons/stop.svg";
import Pause from "/public/icons/pause.svg";
import Record from "/public/icons/record.svg";

type Record = { end: number; duration: number; title?: string };

const formatTime = (time: number) => {
  const seconds = Math.floor((time / 1000) % 60);
  const minutes = Math.floor((time / (1000 * 60)) % 60);
  const hours = Math.floor(time / (1000 * 60 * 60));

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [records, setRecords] = useState<Record[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = `${formatTime(time)}`;
  }, [time]);

  const onStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1000);
      }, 1000);
    }
  };

  const onStop = () => {
    if (isRunning) {
      clearInterval(timerRef.current || 0);
      setIsRunning(false);
    }
  };

  const onReset = () => {
    clearInterval(timerRef.current || 0);
    setIsRunning(false);
    setTime(0);
  };

  const onRecord = () => {
    if (time === 0) return;
    const now = Date.now();
    setRecords((prev) => [
      ...prev,
      { end: now, duration: time, title: inputRef.current?.value },
    ]);
    onReset();
    setTimeout(() => {
      if (inputRef.current) inputRef.current.value = "";
    }, 0);

  };

  const [isCompositionEnd, setIsCompositionEnd] = useState(true);
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const key = event.key;
    if (key === "Enter" && isCompositionEnd) {
      onRecord();
    }
    if (key === "Enter" && !isRunning) {
      onStart()
    }
  };

  const onComposition = (event: CompositionEvent<HTMLInputElement>) => {
    if (event.type === "compositionend") {
      setIsCompositionEnd(true);
    } else if (event.type === "compositionstart") {
      setIsCompositionEnd(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center">
        <div className="text-[32px] w-[150px]">{formatTime(time)}</div>
        <div className="flex items-center gap-2">
          {isRunning ? (
            <button onClick={onStop}>
              <Image src={Pause} alt="pause-icon" />
            </button>
          ) : (
            <button onClick={onStart}>
              <Image src={Play} alt="play-icon" />
            </button>
          )}
          <button onClick={onReset}>
            <Image src={Stop} alt="stop-icon" />
          </button>
          <button onClick={onRecord}>
            <Image src={Record} alt="record-icon" />
          </button>
        </div>
        <input
          ref={inputRef}
          onCompositionStart={onComposition}
          onCompositionEnd={onComposition}
          onKeyDown={onKeyDown}
          className="ml-4 w-[100px] h-6 bg-transparent text-white text-sm px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
        />
      </div>
      <Records records={records} />
    </div>
  );
};

const Records = memo(({ records }: { records: Record[] }) => {
  const formatRecord = (timestamp: number) => {
    const format = new Date(timestamp).toLocaleTimeString("zh-tw", {
      hour12: false,
      hourCycle: "h23",
      hour: "2-digit",
      minute: "2-digit",
    });
    return format;
  };

  Records.displayName = "Records";

  return (
    <ul className="mt-3 text-lg">
      {records.map(({ title, end, duration }) => (
        <li key={end}>
          {`${formatRecord(end - duration)} - ${formatRecord(end)} ${formatTime(duration)} ${title}`}
        </li>
      ))}
    </ul>
  );
});

export default Stopwatch;
