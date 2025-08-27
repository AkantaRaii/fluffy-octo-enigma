"use client";

import { Question } from "./ExamDashboard";

export default function MinimalQuestionCard({
  q,
  idx,
  answers,
  summary = false,
  updateSingle,
  updateMulti,
}: {
  q: Question;
  idx: number;
  answers: Record<number, number | number[]>;
  summary?: boolean;
  updateSingle?: (qid: number, optionId: number) => void;
  updateMulti?: (qid: number, optionId: number) => void;
}) {
  const selectedOptions =
    q.type === "MCQ_SINGLE"
      ? q.options.filter((opt) => opt.id === answers[q.id])
      : q.options.filter(
          (opt) =>
            Array.isArray(answers[q.id]) &&
            (answers[q.id] as number[]).includes(opt.id)
        );

  return (
    <article
      id={`q-${q.id}`}
      className="rounded-2xl border border-gray-200 bg-white shadow-md transition hover:shadow-lg"
    >
      <div className="p-5 select-none">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-4">
          <h2 className="text-base md:text-lg font-semibold leading-snug text-gray-800">
            <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-md bg-lime-100 text-lime-700 text-sm font-bold">
              {idx + 1}
            </span>
            {q.text}
          </h2>
          <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
            {q.marks} marks
          </span>
        </div>

        {/* Summary mode */}
        {summary ? (
          selectedOptions.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {selectedOptions.map((opt) => (
                <li
                  key={opt.id}
                  className="rounded-xl border border-lime-200 bg-lime-50 px-3 py-2"
                >
                  <span className="text-sm md:text-[15px] font-medium text-lime-800">
                    {opt.text}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-3 rounded-xl border border-red-400 bg-red-50 px-4 py-6 text-sm text-red-700">
              Not answered.
            </div>
          )
        ) : (
          // Normal mode
          <>
            {q.options.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {q.options.map((opt) => {
                  const checked =
                    q.type === "MCQ_SINGLE"
                      ? answers[q.id] === opt.id
                      : Array.isArray(answers[q.id]) &&
                        (answers[q.id] as number[]).includes(opt.id);

                  return (
                    <li key={opt.id}>
                      <label
                        className={`flex items-start gap-3 rounded-xl border px-3 py-2 cursor-pointer transition 
                          ${
                            checked
                              ? "border-lime-500 bg-lime-50"
                              : "border-gray-200 bg-white hover:border-lime-300 hover:bg-lime-50/40"
                          }`}
                      >
                        {q.type === "MCQ_SINGLE" ? (
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            className="mt-1 text-lime-600 focus:ring-lime-500"
                            checked={checked}
                            onChange={() => updateSingle?.(q.id, opt.id)}
                          />
                        ) : (
                          <input
                            type="checkbox"
                            className="mt-1 text-lime-600 focus:ring-lime-500"
                            checked={checked}
                            onChange={() => updateMulti?.(q.id, opt.id)}
                          />
                        )}
                        <span
                          className={`leading-relaxed text-sm md:text-[15px] ${
                            checked ? "font-medium text-lime-700" : "text-gray-700"
                          }`}
                        >
                          {opt.text}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="mt-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm text-gray-500">
                No options provided.
              </div>
            )}
          </>
        )}
      </div>
    </article>
  );
}
