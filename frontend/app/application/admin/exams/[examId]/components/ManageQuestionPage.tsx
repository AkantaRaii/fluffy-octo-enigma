"use client";
import QuestionList from "@/app/application/admin/exams/[examId]/components/QuestionList";
import { Exam } from "@/types/Exam";
import { ExamQuestion, Question } from "@/types/QuestionOption";
import apiClient from "@/utils/axiosClient";
import { useEffect, useState, useMemo } from "react";
import ExamQuestionList from "./ExamQuestionList";
import { Department } from "@/types/Depertment";
import { Plus } from "lucide-react";
import AddQuestion from "@/components/AddQuestion";
import { useModal } from "@/context/ModalContext";

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
  const [createQuestion, setCreateQuestion] = useState(false);
  const { showModal } = useModal();
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
        let url = "/api/v1/exams/questionswithoptions/";
        if (selectedDepartment?.id) {
          url += `?departments=${selectedDepartment.id}`;
        }
        const departmentRes = await apiClient.get(url);
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
  const handleBulkAddQuestions = async (
    examId: number,
    departmentId: number
  ) => {
    try {
      const res = await apiClient.post(
        "/api/v1/exams/examquestions/bulk_create/",
        {
          exam_id: examId,
          department_id: departmentId,
        }
      );

      if (res.status === 201) {
        // Append all created examQuestions to state
        setExamQuestionsState((prev) => [...prev, ...res.data]);
      }
    } catch (error) {
      console.error("Failed to bulk add questions:", error);
    }
  };

  return (
    <div className="pt-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Manage Questions
        </h2>
        <div
          onClick={() => {
            console.log("clicl click");
            setCreateQuestion((prev) => !prev);
          }}
          className="border py-1 h-fit border-gray-300 px-4 rounded-md bg-theme text-white hover:bg-hardTheme flex flex-row items-center justify-around cursor-pointer "
        >
          <Plus width={16} height={16} />
          <p>create Question</p>
        </div>
      </div>

      <div className="grid md:grid-cols-12 grid-cols-1 gap-6">
        {/* Right: Added Exam Questions */}
        <div className="md:col-span-5 col-span-1 bg-white shadow-md rounded-xl p-4 overflow-y-auto h-[600px]">
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
        {/* Left: All Department Questions */}
        <div className="md:col-span-7 col-span-1 bg-white shadow-md rounded-xl px-4    h-[600px] overflow-y-auto relative">
          <div className=" sticky top-0 z-10 pt-2 bg-white flex flex-row  justify-between">
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
              {/* bulk add button */}
              {selectedDepartment && (
                <button
                  className="bg-theme text-white mx-2 rounded-md px-2 py-1 hover:bg-midTheme hover:cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    showModal(
                      () =>
                        handleBulkAddQuestions(exam.id, selectedDepartment.id),
                      {
                        title: "Save Confirmation",
                        message: `Do you want to add all questions of "${selectedDepartment.name}" to "${exam.title}" changes?`,
                        confirmLabel: "Save",
                      }
                    );
                  }}
                >
                  Add All
                </button>
              )}
            </div>
          </div>

          <QuestionList
            questions={availableQuestions}
            onAdd={handleAddQuestion}
          />
        </div>
      </div>
      {createQuestion && (
        <AddQuestion
          setAddQuestionForm={setCreateQuestion}
          handleAddQuestion={handleAddQuestion}
          departments={departments}
        />
      )}
    </div>
  );
}
