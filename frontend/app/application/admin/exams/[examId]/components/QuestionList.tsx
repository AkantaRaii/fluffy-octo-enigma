import BigQuestionCard from "@/components/BigQuestionCard";
import ExpandableQuestionCard from "@/components/ExpandibleQuestionCard";
import { Question } from "@/types/QuestionOption";

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
                className="bg-theme hover:bg-midTheme py-1 px-2 rounded-md 
                           text-white transform hover:scale-105 cursor-pointer"
              >
                Add
              </button>
            }
          />
        ))
      )}
    </div>
  );
}
