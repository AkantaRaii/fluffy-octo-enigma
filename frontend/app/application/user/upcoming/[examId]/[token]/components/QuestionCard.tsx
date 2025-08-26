"use client";

import { Question } from "./ExamDashboard";

export default function QuestionCard({
  q,
  idx,
  answers,
  updateSingle,
  updateMulti,
}: {
  q: Question;
  idx: number;
  answers: Record<number, number | number[]>;
  updateSingle: (qid: number, optionId: number) => void;
  updateMulti: (qid: number, optionId: number) => void;
}) {
  return (
    <article
      id={`q-${q.id}`}
      className="rounded-2xl border border-gray-300 bg-white shadow-sm"
    >
      <div className="p-4 md:p-5 select-none">
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

        {/* {q.department_names?.length > 0 && (
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
        )} */}

        {q.options.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {q.options.map((opt) => (
              <li key={opt.id}>
                <label className="flex items-start gap-3 rounded-xl border px-3 py-2 hover:border-neutral-300">
                  {q.type === "MCQ_SINGLE" ? (
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      className="mt-1"
                      checked={answers[q.id] === opt.id}
                      onChange={() => updateSingle(q.id, opt.id)}
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
            No options provided.
          </div>
        )}
      </div>
    </article>
  );
}
