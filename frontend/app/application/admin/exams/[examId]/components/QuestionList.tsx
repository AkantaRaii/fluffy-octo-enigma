import BigQuestionCard from "@/components/BigQuestionCard";
import ExpandableQuestionCard from "@/components/ExpandibleQuestionCard";
import { Question } from "@/types/QuestionOption";
import { CirclePlus } from "lucide-react";

interface Props {
  questions: Question[];
  title?: string; // optional heading
  height?: string; // configurable scroll height
  onAdd: (value: Question) => void;
}

export default function QuestionList({
  questions,
  title = "Questions List",
  height = "h-[500px]",
  onAdd,
}: Props) {
  return (
    <div className="space-y-4">
      {questions.length === 0 ? (
        <p className="text-gray-500 text-sm">No questions available.</p>
      ) : (
        questions.map((q) => (
          <ExpandableQuestionCard
            key={q.id}
            question={q}
            button={
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd(q);
                }}
                className="hover:cursor-pointer text-gray-500 hover:bg-white hover:text-gray-600 text-center rounded-full p-2"
              >
                <CirclePlus />
              </button>
            }
          />
        ))
      )}
    </div>
  );
}
