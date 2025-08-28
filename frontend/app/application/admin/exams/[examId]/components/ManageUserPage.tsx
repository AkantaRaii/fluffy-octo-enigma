"use client";
import { ExamAttempt, ExamInvitation } from "@/types/Exam";
import UserInvitationTable from "./UserTable";
import { useState } from "react";
interface Props {
  examInvitations: ExamInvitation[];
  examAttempts: ExamAttempt[];
}
export default function ManageUserPage({ examInvitations,examAttempts }: Props) {
  const [examInvitationsList, setExamInvitationsList] =
    useState<ExamInvitation[]>(examInvitations);
  return (
    <div className="h-full min-h-[350px]">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Manage Users</h2>
      <UserInvitationTable
        examInvitations={examInvitationsList}
        setInvitations={setExamInvitationsList}
        examAttempts={examAttempts}
      />
    </div>
  );
}
