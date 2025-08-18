// components/ExamQuestionList.tsx
"use client";

import SmallQuestionCard from "@/components/smallQuestionCard";
import { ExamQuestion } from "@/types/QuestionOption";

interface Props {
  questions: ExamQuestion[];
  onRemove: (id: number) => void;
}

export default function ExamQuestionList({ questions, onRemove }: Props) {
  return (
    <div className="space-y-2">
      {questions.map((q) => (
        <SmallQuestionCard
          key={q.id}
          question={q.question}
          button={
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(q.question.id);
              }}
              className="bg-red-700 hover:bg-red-800 py-1 px-2 rounded-md 
                         transform hover:scale-105 cursor-pointer text-white"
            >
              Remove
            </button>
          }
        />
      ))}
    </div>
  );
}
