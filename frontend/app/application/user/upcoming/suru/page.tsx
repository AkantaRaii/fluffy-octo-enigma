"use client";

import InfoTile from "@/components/InfoTile";
import React, { useEffect, useMemo, useState } from "react";

// ---- Types ----
type Option = { id: number; text: string };
type QuestionType = "MCQ_SINGLE" | "MCQ_MULTI";
type Question = {
  id: number;
  departments: number[];
  department_names: string[];
  type: QuestionType;
  text: string;
  marks: number;
  options: Option[];
};
type ExamData = {
  exam_title: string;
  scheduled_start: string; // ISO string (UTC)
  scheduled_end: string; // ISO string (UTC)
  attempt_id: number;
  questions: Question[];
};

// ---- Sample Data (replace with fetch) ----
const sampleExam: ExamData = {
  exam_title: "Math Exam",
  scheduled_start: "2025-08-20T06:16:01Z",
  scheduled_end: "2025-08-21T00:15:00Z",
  attempt_id: 1,
  questions: [
    {
      id: 3,
      departments: [1, 3, 4],
      department_names: ["maths", "healt", "healt"],
      type: "MCQ_SINGLE",
      text: "will you wash your hand",
      marks: 2,
      options: [
        { id: 1, text: "yes" },
        { id: 2, text: "no" },
        { id: 3, text: "idk" },
        { id: 4, text: "who knows" },
      ],
    },
    {
      id: 4,
      departments: [1],
      department_names: ["maths"],
      type: "MCQ_SINGLE",
      text: "kya ?",
      marks: 2,
      options: [
        { id: 5, text: "yes" },
        { id: 6, text: "no" },
        { id: 7, text: "idk" },
        { id: 8, text: "who knows" },
      ],
    },
    {
      id: 5,
      departments: [1],
      department_names: ["maths"],
      type: "MCQ_SINGLE",
      text: "formula of water",
      marks: 2,
      options: [
        { id: 9, text: "h2o" },
        { id: 10, text: "nh3" },
        { id: 11, text: "nh4" },
        { id: 12, text: "who knows" },
      ],
    },
    {
      id: 6,
      departments: [1],
      department_names: ["maths"],
      type: "MCQ_MULTI",
      text: "describe the sand choose multiple correct answer",
      marks: 2,
      options: [
        { id: 13, text: "dry" },
        { id: 14, text: "homogenous" },
        { id: 15, text: "oncuntable" },
        { id: 16, text: "brittle" },
      ],
    },
    {
      id: 7,
      departments: [1],
      department_names: ["maths"],
      type: "MCQ_MULTI",
      text: "is hydrogen ?",
      marks: 1,
      options: [],
    },
    {
      id: 9,
      departments: [1],
      department_names: ["maths"],
      type: "MCQ_SINGLE",
      text: "10.01 is ?",
      marks: 1,
      options: [
        { id: 17, text: "integer" },
        { id: 18, text: "float" },
        { id: 19, text: "imaganary" },
        { id: 20, text: "infinite" },
      ],
    },
    {
      id: 10,
      departments: [1],
      department_names: ["maths"],
      type: "MCQ_SINGLE",
      text: "waht is water",
      marks: 1,
      options: [
        { id: 21, text: "pani" },
        { id: 22, text: "paaiiii" },
        { id: 23, text: "jal" },
        { id: 24, text: "tdk" },
      ],
    },
  ],
};

// ---- Helpers ----
function formatDuration(ms: number) {
  if (ms <= 0) return "00:00:00";
  const total = Math.floor(ms / 1000);
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

// ---- Main Component ----
export default function StartExamDashboard() {
  // In real app: load from API, e.g. using route param/attempt id
  const exam = sampleExam;

  const [answers, setAnswers] = useState<Record<number, number | number[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [now, setNow] = useState<number>(() => Date.now());

  const endAt = useMemo(
    () => new Date(exam.scheduled_end).getTime(),
    [exam.scheduled_end]
  );
  const startAt = useMemo(
    () => new Date(exam.scheduled_start).getTime(),
    [exam.scheduled_start]
  );
  const started = now >= startAt;
  const endsInMs = Math.max(0, endAt - now);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const totalMarks = useMemo(
    () => exam.questions.reduce((sum, q) => sum + (q.marks || 0), 0),
    [exam.questions]
  );
  const answeredCount = useMemo(
    () =>
      exam.questions.filter(
        (q) =>
          answers[q.id] !== undefined &&
          (Array.isArray(answers[q.id])
            ? (answers[q.id] as number[]).length > 0
            : true)
      ).length,
    [answers, exam.questions]
  );

  function updateSingle(qid: number, optionId: number) {
    setAnswers((prev) => ({ ...prev, [qid]: optionId }));
  }

  function updateMulti(qid: number, optionId: number) {
    setAnswers((prev) => {
      const curr = (prev[qid] as number[] | undefined) ?? [];
      const exists = curr.includes(optionId);
      const next = exists
        ? curr.filter((id) => id !== optionId)
        : [...curr, optionId];
      return { ...prev, [qid]: next };
    });
  }

  async function handleSubmit() {
    if (!started) {
      alert("Exam has not started yet.");
      return;
    }
    if (Date.now() > endAt) {
      alert("Exam time is over.");
      return;
    }

    setSubmitting(true);
    try {
      // Build payload that a typical backend expects
      const payload = {
        attempt_id: exam.attempt_id,
        responses: exam.questions.map((q) => {
          const value = answers[q.id];
          const selected_option_ids = Array.isArray(value)
            ? value
            : typeof value === "number"
            ? [value]
            : [];
          return {
            question_id: q.id,
            selected_option_ids,
          };
        }),
      };

      // TODO: replace with your axios/fetch POST
      console.log("Submitting:", payload);
      await new Promise((r) => setTimeout(r, 800));
      alert("Responses captured (mock). Replace console.log with API call.");
    } catch (e) {
      console.error(e);
      alert("Failed to submit. See console for details.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Accent color variable + light theming */}
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
        .ring-accent {
          --tw-ring-color: var(--color-theme);
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
          <div className="h-9 w-9 rounded-xl bg-accent/10 grid place-items-center">
            <span className="text-lg font-semibold accent">E</span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold tracking-tight">
              {exam.exam_title}
            </h1>
            <p className="text-xs text-neutral-600">
              Attempt #{exam.attempt_id}
            </p>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <TimerPill
              label="Ends in"
              value={formatDuration(endsInMs)}
              danger={endsInMs < 5 * 60 * 1000}
            />
            <StatusPill started={started} />
            <ProgressPill
              current={answeredCount}
              total={exam.questions.length}
            />
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-xl px-4 py-2 text-sm font-medium text-white bg-neutral-900 hover:bg-black disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Questions */}
        <section className="space-y-4">
          {exam.questions.map((q, idx) => (
            <article
              key={q.id}
              className="rounded-2xl border bg-white shadow-sm"
            >
              <div className="p-4 md:p-5">
                <div className="mb-2 flex items-start justify-between gap-4">
                  <h2 className="text-base md:text-lg font-semibold leading-snug">
                    <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-md bg-accent/10 text-sm font-medium accent">
                      {idx + 1}
                    </span>
                    {q.text}
                  </h2>
                  <span className="shrink-0 text-xs text-neutral-600">
                    Marks: {q.marks}
                  </span>
                </div>

                {/* Departments (subtle) */}
                {q.department_names?.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1">
                    {q.department_names.map((d, i) => (
                      <span
                        key={i}
                        className="text-[11px] rounded-md bg-neutral-100 px-2 py-0.5 text-neutral-600"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                )}

                {/* Options */}
                {q.options.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {q.options.map((opt) => (
                      <li key={opt.id} className="">
                        <label className="flex items-start gap-3 rounded-xl border px-3 py-2 hover:border-neutral-300">
                          {q.type === "MCQ_SINGLE" ? (
                            <input
                              type="radio"
                              name={`q-${q.id}`}
                              className="mt-1"
                              checked={answers[q.id] === opt.id}
                              onChange={() => updateSingle(q.id, opt.id)}
                              disabled={!started || Date.now() > endAt}
                            />
                          ) : (
                            <input
                              type="checkbox"
                              className="mt-1"
                              checked={
                                Array.isArray(answers[q.id]) &&
                                (answers[q.id] as number[]).includes(opt.id)
                              }
                              onChange={() => updateMulti(q.id, opt.id)}
                              disabled={!started || Date.now() > endAt}
                            />
                          )}
                          <span className="leading-relaxed text-sm md:text-[15px]">
                            {opt.text}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-3 rounded-xl border border-dashed bg-neutral-50 px-4 py-6 text-sm text-neutral-600">
                    No options provided for this question.
                  </div>
                )}
              </div>
            </article>
          ))}
        </section>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-[72px] h-max space-y-4">
          <div className="rounded-2xl border bg-white shadow-sm p-4">
            <h3 className="text-sm font-semibold mb-2">Overview</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <InfoTile
                label="Questions"
                value={String(exam.questions.length)}
              />
              <InfoTile label="Answered" value={`${answeredCount}`} />
              <InfoTile label="Marks" value={String(totalMarks)} />
            </div>
            <div className="mt-4 border-t pt-4 space-y-2">
              <TimerPill
                label="Ends in"
                value={formatDuration(endsInMs)}
                block
              />
              <StatusPill started={started} block />
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="mt-4 w-full rounded-xl px-4 py-2 text-sm font-medium text-white bg-neutral-900 hover:bg-black disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Exam"}
            </button>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm p-4">
            <h3 className="text-sm font-semibold mb-2">Quick Nav</h3>
            <div className="grid grid-cols-8 gap-2">
              {exam.questions.map((q, i) => {
                const done =
                  answers[q.id] !== undefined &&
                  (Array.isArray(answers[q.id])
                    ? (answers[q.id] as number[]).length > 0
                    : true);
                return (
                  <a
                    key={q.id}
                    href={`#q-${q.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.querySelector(
                        `article:nth-of-type(${i + 1})`
                      );
                      el?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                    className={`grid h-9 w-9 place-items-center rounded-lg border text-xs ${
                      done
                        ? "bg-accent/10 accent border-accent/40"
                        : "bg-neutral-50"
                    }`}
                    title={`Question ${i + 1}`}
                  >
                    {i + 1}
                  </a>
                );
              })}
            </div>
          </div>
        </aside>
      </main>

      {/* Footer bar (mobile actions) */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-white/90 backdrop-blur md:hidden">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
          <ProgressPill current={answeredCount} total={exam.questions.length} />
          <div className="ml-auto flex items-center gap-3">
            <TimerPill label="Ends in" value={formatDuration(endsInMs)} />
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-xl px-4 py-2 text-sm font-medium text-white bg-neutral-900 hover:bg-black disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Small UI Bits (no external libs) ----
function TimerPill({
  label,
  value,
  danger,
  block,
}: {
  label: string;
  value: string;
  danger?: boolean;
  block?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-1.5 text-sm ${
        block ? "w-full text-center" : ""
      } ${
        danger
          ? "border-red-300 text-red-600"
          : "border-neutral-200 text-neutral-800"
      }`}
    >
      <span className="opacity-70 mr-1">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function StatusPill({ started, block }: { started: boolean; block?: boolean }) {
  return (
    <div
      className={`rounded-xl border px-3 py-1.5 text-sm ${
        block ? "w-full text-center" : ""
      } border-neutral-200 text-neutral-800`}
    >
      <span
        className={`inline-block h-2.5 w-2.5 rounded-full mr-2 ${
          started ? "bg-accent" : "bg-neutral-300"
        }`}
      />
      {started ? "In Progress" : "Not Started"}
    </div>
  );
}

function ProgressPill({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / Math.max(1, total)) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="w-28 h-2 rounded-full bg-neutral-200 overflow-hidden">
        <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-neutral-700">
        {current}/{total}
      </span>
    </div>
  );
}
