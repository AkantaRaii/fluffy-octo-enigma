import { Question } from "@/types/QuestionOption";
import DateText from "@/utils/DateText";

interface Props {
  question: Question;
  button: React.ReactNode | null;
}
export default function BigQuestionCard({ question, button = null }: Props) {
  return (
    <>
      <div
        key={question.id}
        className="border rounded-lg p-4 bg-gray-50 shadow-sm hover:bg-gray-100"
      >
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold">{question.text}</h4>
          <span className="text-sm text-gray-500">Marks: {question.marks}</span>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          Departments:{" "}
          {question.department_names?.length
            ? question.department_names.join(", ")
            : "—"}
        </p>

        <div className="space-y-1">
          {question.options?.map((opt) => (
            <div
              key={opt.id}
              className={`px-2 py-1 rounded-md text-sm ${
                opt.is_correct
                  ? "bg-theme text-white font-medium"
                  : "bg-gray-200"
              }`}
            >
              {opt.text}
            </div>
          ))}
        </div>

        <div className="flex justify-between py-3">
          <p className="text-xs text-gray-400 mt-2">
            By {question.created_by_email} •{" "}
            <DateText date={question.created_at} />
          </p>
          {button}
        </div>
      </div>
    </>
  );
}
