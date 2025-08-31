"use client";

export interface Option {
  id: number;
  text: string;
  is_correct: boolean;
  is_selected: boolean;
}

export interface Question {
  id: number;
  text: string;
  marks: number;
  type: "MCQ_SINGLE" | "MCQ_MULTI";
  options: Option[];
  is_correct: boolean;
  weight: number;
}

interface Props {
  q: Question;
  idx: number;
}

export default function ResultQuestionCard({ q, idx }: Props) {
  return (
    <article
      className={`rounded-2xl border ${
        q.is_correct ? "" : "border-red-700 border-dashed bg-red-50"
      } border-gray-200  shadow-md transition w-full`}
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

        {/* Options */}
        {/* Options */}
        <ul className="mt-3 space-y-2">
          {q.options
            .filter((opt) => opt.is_selected || opt.is_correct) // only guessed or correct
            .map((opt) => {
              const checked = opt.is_selected;

              return (
                <li key={opt.id}>
                  <label
                    className={`flex items-start gap-3 rounded-xl border px-3 py-2 cursor-pointer transition
              ${
                checked
                  ? "border-lime-500 bg-lime-50"
                  : "border-gray-200 bg-white "
              }
            `}
                  >
                    {q.type === "MCQ_SINGLE" ? (
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        className="mt-1 text-lime-600 focus:ring-lime-500"
                        checked={checked}
                        readOnly
                      />
                    ) : (
                      <input
                        type="checkbox"
                        className="mt-1 text-lime-600 focus:ring-lime-500"
                        checked={checked}
                        readOnly
                      />
                    )}
                    <span
                      className={`leading-relaxed text-sm md:text-[15px] ${
                        checked ? "font-medium text-lime-700" : "text-gray-700"
                      }`}
                    >
                      {opt.text}
                      {opt.is_correct && (
                        <span className="ml-2 text-xs text-green-600">
                          (Correct)
                        </span>
                      )}
                    </span>
                  </label>
                </li>
              );
            })}
        </ul>
      </div>
    </article>
  );
}
