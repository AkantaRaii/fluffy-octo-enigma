"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Exam, ExamInvitation } from "@/types/Exam";

interface Props {
  exam: Exam;
  examInvitation: ExamInvitation | null;
}

export default function StartExamLanding({ exam, examInvitation }: Props) {
  const router = useRouter();

  const examStartTime = new Date(exam.scheduled_start).getTime();
  const initialDiff = examStartTime - Date.now();

  const [examAvailable, setExamAvailable] = useState(initialDiff <= 0);
  const [timeLeft, setTimeLeft] = useState<number | null>(
    initialDiff > 0 ? initialDiff : 0
  );

  // Countdown logic
  useEffect(() => {
    if (initialDiff <= 0) return; // already started, no timer

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = examStartTime - now;
      if (diff <= 0) {
        setExamAvailable(true);
        setTimeLeft(0);
        clearInterval(interval);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [examStartTime]);

  function formatTime(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  function handleStart() {
    router.push(
      `/application/user/upcoming/${exam.id}/${examInvitation?.token}`
    );
  }
  console.log(examInvitation);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      {!examAvailable && timeLeft !== null ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">
            Get Ready For you Exam: {exam.title}
          </h1>
          <p className="mb-2 text-neutral-600">Exam will start in:</p>
          <p className="text-3xl font-mono font-bold">{formatTime(timeLeft)}</p>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">Welcome to : {exam.title}</h1>
          <p className="mb-6 text-neutral-700 select-none">
            You may now start your exam.
          </p>
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-accent  rounded-sm bg-theme text-white hover:scale-105 transition duration-200 hover:cursor-pointer"
          >
            Start Exam
          </button>
        </div>
      )}
    </div>
  );
}
