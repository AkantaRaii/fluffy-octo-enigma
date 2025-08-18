"use client";
import QuestionList from "@/app/application/admin/exams/[examId]/components/QuestionList";
import { Exam } from "@/types/Exam";
import { ExamQuestion, Question } from "@/types/QuestionOption";
import apiClient from "@/utils/axiosClient";
import { useEffect, useState, useMemo } from "react";
import ExamQuestionList from "./ExamQuestionList";
import { Department } from "@/types/Depertment";

interface Props {
  examQuestions?: ExamQuestion[];
  exam: Exam;
  departments: Department[];
}

export default function ManageQuestionPage({
  examQuestions = [],
  exam,
  departments,
}: Props) {
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(
      departments.find((department) => department.id === exam.department) ||
        null
    );
  const [departmentQuestions, setDepartmentQuestions] = useState<Question[]>(
    []
  );
  const [examQuestionsState, setExamQuestionsState] =
    useState<ExamQuestion[]>(examQuestions);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const departmentRes = await apiClient.get(
          `/api/v1/exams/questionswithoptions/?departments=${selectedDepartment?.id}`
        );
        setDepartmentQuestions(departmentRes.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuestions();
  }, [selectedDepartment]);

  // 👇 Filter out questions already added to exam
  const availableQuestions = useMemo(() => {
    const examIds = new Set(examQuestionsState.map((eq) => eq.question.id));
    return departmentQuestions.filter((q) => !examIds.has(q.id));
  }, [departmentQuestions, examQuestionsState]);

  // Handlers
  const handleAddQuestion = async (question: Question) => {
    try {
      const payload = { exam: exam.id, question_id: question.id };
      const res = await apiClient.post(`/api/v1/exams/examquestions/`, payload);

      // If backend returns the created relation or success status
      if (res.status === 201) {
        setExamQuestionsState((prev) => [...prev, res.data]);
      }
    } catch (error) {
      console.error("Failed to add question:", error);
    }
  };

  const handleRemoveQuestion = async (id: number) => {
    try {
      const examAndQuestion = examQuestionsState.find(
        (eq) => eq.question.id === id
      );
      if (examAndQuestion) {
        const res = await apiClient.delete(
          `/api/v1/exams/examquestions/${examAndQuestion.id}/`
        );

        if (res.status == 204) {
          setExamQuestionsState((prev) =>
            prev.filter((eq) => eq.question.id !== id)
          );
        }
      }
    } catch (error) {}
  };

  return (
    <div className="pt-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Manage Questions
      </h2>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: All Department Questions */}
        <div className="col-span-7 bg-white shadow-md rounded-xl p-4 h-[600px] overflow-y-auto relative">
          <div className=" sticky top-0 flex flex-row justify-between">
            <h3 className="text-lg font-semibold mb-4">All Questions</h3>
            <div>
              {" "}
              <select
                value={selectedDepartment?.id || "all"}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "all") {
                    setSelectedDepartment(null);
                  } else {
                    const dept =
                      departments.find((d) => d.id === Number(val)) || null;
                    setSelectedDepartment(dept);
                  }
                }}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <QuestionList
            questions={availableQuestions}
            onAdd={handleAddQuestion}
          />
        </div>

        {/* Right: Added Exam Questions */}
        <div className="col-span-5 bg-white shadow-md rounded-xl p-4 overflow-y-auto h-[600px]">
          <h3 className="text-lg font-semibold mb-4">Added to Exam</h3>
          {examQuestionsState.length ? (
            <ExamQuestionList
              questions={examQuestionsState}
              onRemove={handleRemoveQuestion}
            />
          ) : (
            <p className="text-sm text-gray-500">No questions added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
