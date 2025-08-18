"use client";
import { Exam } from "@/types/Exam";
import Table from "./components/table";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Department } from "@/types/Depertment";
import AddExam from "./components/AddExam";
import EditExam from "./components/EditExam";
interface Props {
  examList: Exam[];
  departments: Department[];
}
export default function ExamBody({ examList, departments }: Props) {
  const [addExamForm, setAddExamForm] = useState(false);
  const [editExamForm, setEditExamForm] = useState(false);
  const [exams, setExams] = useState<Exam[]>(examList);
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);

  return (
    <>
      <div className="mb-2 px-1 flex flex-row justify-between">
        <h1 className="text-xl font-semibold ">Exams</h1>
        <div
          onClick={() => setAddExamForm((prev) => !prev)}
          className="border border-gray-300 px-4 rounded-md shadow-gray-300 shadow hover:bg-gray-100 flex flex-row items-center justify-around cursor-pointer "
        >
          <Plus width={16} height={16} />
          <p>Add Exam</p>
        </div>
      </div>
      <Table data={exams} setEditExamForm={setEditExamForm} setCurrentExam={setCurrentExam} setExams={setExams}/>
      {addExamForm && (
        <AddExam
          setAddExamForm={setAddExamForm}
          setExams={setExams}
          departments={departments}
        />
      )}
      {editExamForm && currentExam && (
        <EditExam
          exam={currentExam}
          setEditExamForm={setEditExamForm}
          setExams={setExams}
          departments={departments}
        />
      )}
    </>
  );
}
