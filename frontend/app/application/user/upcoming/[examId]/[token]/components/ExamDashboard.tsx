"use client";
import { useState, useEffect, useMemo } from "react";
import ProgressPill from "./ProgressPill";
import QuestionCard from "./QuestionCard";
import apiClient from "@/utils/axiosClient";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
type Option = { id: number; text: string };
type QuestionType = "MCQ_SINGLE" | "MCQ_MULTI";
export type Question = {
  id: number;
  department_names: string[];
  type: QuestionType;
  text: string;
  marks: number;
  options: Option[];
};
export type ExamData = {
  exam_title: string;
  attempt_id: number;
  questions: Question[];
};
export default function ExamDashboard({
  exam,
  examId,
}: {
  exam: ExamData;
  examId: string;
}) {
  const router = useRouter();
  const storageKey = `exam-answers-${exam.attempt_id}`;
  const [answers, setAnswers] = useState<Record<number, number | number[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [summaryMode, setSummaryMode] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setAnswers(JSON.parse(saved));
      } catch {
        console.warn("Invalid saved answers, ignoring.");
      }
    }
  }, [storageKey]);
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(answers));
  }, [answers, storageKey]);
  const totalMarks = useMemo(
    () => exam.questions.reduce((sum, q) => sum + (q.marks || 0), 0),
    [exam.questions]
  );
  const answeredCount = useMemo(
    () =>
      exam.questions.filter((q) => {
        const val = answers[q.id];
        return Array.isArray(val) ? val.length > 0 : val !== undefined;
      }).length,
    [answers, exam.questions]
  );

  function updateSingle(qid: number, optionId: number) {
    setAnswers((prev) => ({ ...prev, [qid]: optionId }));
  }

  function updateMulti(qid: number, optionId: number) {
    setAnswers((prev) => {
      const curr = (prev[qid] as number[] | undefined) ?? [];
      const next = curr.includes(optionId)
        ? curr.filter((id) => id !== optionId)
        : [...curr, optionId];
      return { ...prev, [qid]: next };
    });
  }
  function handleContinue() {
    if (exam.questions.length === answeredCount) {
      setSummaryMode(true);
    } else {
      toast.error("Please answer all questions before continuing.");
    }
  }
  async function handleSubmit() {
    setSubmitting(true);
    if (exam.questions.length === answeredCount) {
      try {
        const payload = {
          attempt_id: exam.attempt_id,
          responses: exam.questions.map((q) => {
            const value = answers[q.id];
            return {
              question_id: q.id,
              selected_option_ids: Array.isArray(value)
                ? value
                : value
                ? [value]
                : [],
            };
          }),
        };
        console.log("Submitting:", payload);
        // send with apiClient
        const res = await apiClient.post(
          "/api/v1/examsession/responses/bulk_save/",
          payload
        );
        console.log(exam);
        const examRes = await apiClient.patch(
          `/api/v1/examsession/attempts/${exam.attempt_id}/`,
          {
            is_submitted: true,
          }
        );

        console.log("Saved responses:", res.data);
        router.push(`/application/user/upcoming/result/${examId}`);
      } catch (err: any) {
        console.error("Bulk save error:", err.response?.data || err.message);
      } finally {
        setSubmitting(false);
      }
    } else {
      toast.error("Please answer all questions before submitting.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen  text-neutral-900">
      <style jsx global>{`
        :root {
          --color-theme: #91a92a;
        }
        .accent {
          color: var(--color-theme);
        }
        .bg-accent {
          background-color: var(--color-theme);
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-300 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
          <div className="flex-1">
            <h1 className="text-xl font-semibold tracking-tight accent">
              {exam.exam_title}
            </h1>
            <p className="text-xs text-neutral-600"></p>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {/* <StatusPill started /> */}
            <ProgressPill
              current={answeredCount}
              total={exam.questions.length}
            />
            {summaryMode ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-xl px-4 py-2 text-sm font-medium text-white bg-accent hover:opacity-90 disabled:opacity-50 hover:cursor-pointer"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            ) : (
              <button
                onClick={handleContinue}
                className="rounded-xl px-4 py-2 text-sm font-medium text-white bg-accent hover:opacity-90 disabled:opacity-50 hover:cursor-pointer"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="w-full py-6 grid grid-cols-1 gap-4 lg:grid-cols-6">
        <section className="space-y-4 lg:col-span-4">
          {exam.questions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              q={q}
              idx={idx}
              summary={summaryMode}
              answers={answers}
              updateSingle={updateSingle}
              updateMulti={updateMulti}
            />
          ))}
        </section>
        <aside className="lg:col-span-2 lg:sticky lg:top-[72px] h-max space-y-4 w-full">
          <div className="rounded-2xl border border-gray-300 bg-white shadow-sm p-4">
            <h3 className="text-sm font-semibold mb-2">Overview</h3>
            <div className="flex justify-center gap-15 items-center">
              <div className="text-sm col flex flex-col items-center">
                <h1 className="text-3xl">{exam.questions.length}</h1>
                <h1 className="text-sm text-gray-400">Questions</h1>
              </div>
              <div className="text-sm col flex flex-col items-center">
                <h1 className="text-3xl">{answeredCount}</h1>
                <h1 className="text-sm text-gray-400">Answered</h1>
              </div>
              <div className="text-sm col flex flex-col items-center">
                <h1 className="text-3xl">{totalMarks}</h1>
                <h1 className="text-sm text-gray-400">Total Marks</h1>
              </div>
            </div>
            {/* <StatusPill started block /> */}
            {summaryMode ? (
              <div className="flex flex-row gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={
                    submitting && exam.questions.length !== answeredCount
                  }
                  className="mt-4 w-full rounded-xl px-4 py-2 text-sm font-medium text-white bg-accent hover:opacity-90 disabled:opacity-50 hover:cursor-pointer"
                >
                  {submitting ? "Submitting..." : "Submit Exam"}
                </button>
                <button
                  onClick={() => setSummaryMode(false)}
                  className="mt-4 w-full rounded-xl px-4 py-2 text-sm font-medium text-white bg-gray-500 hover:opacity-90 disabled:opacity-50 hover:cursor-pointer"
                >
                  Back
                </button>
              </div>
            ) : (
              <button
                onClick={handleContinue}
                className="mt-4 w-full rounded-xl px-4 py-2 text-sm font-medium text-white bg-accent hover:opacity-90 disabled:opacity-50 hover:cursor-pointer"
              >
                Continue
              </button>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
