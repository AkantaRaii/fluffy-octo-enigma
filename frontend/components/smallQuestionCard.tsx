import { Question } from "@/types/QuestionOption";

interface Props {
  question: Question;
  button: React.ReactNode;
}
export default function SmallQuestionCard({ question, button }: Props) {
  return (
    <div
      key={question.id}
      className="border rounded p-2 shadow-sm hover:bg-gray-50 cursor-pointer flex justify-between items-center"
    >
      <div className="">
        <p className="text-sm font-medium">{question.text}</p>
        <p className="text-xs text-gray-500">
          Dept: {question.department_names?.join(", ") || "N/A"}
        </p>
      </div>
      {button}
    </div>
  );
}
