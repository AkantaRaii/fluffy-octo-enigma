// components/ExamQuestionList.tsx
"use client";

import ExpandableQuestionCard from "@/components/ExpandibleQuestionCard";
import { ExamQuestion } from "@/types/QuestionOption";
import { CircleMinus } from "lucide-react";

interface Props {
  questions: ExamQuestion[];
  onRemove: (id: number) => void;
}

export default function ExamQuestionList({ questions, onRemove }: Props) {
  return (
    <div className="space-y-2">
      {questions.map((q) => (
        <ExpandableQuestionCard
          key={q.id}
          question={q.question}
          button={
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(q.question.id);
              }}
              className="hover:cursor-pointer text-gray-500 hover:bg-white hover:text-gray-600 text-center rounded-full p-2"
            >
              <CircleMinus />
            </button>
          }
        />
      ))}
    </div>
  );
}
