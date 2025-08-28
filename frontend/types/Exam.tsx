import { User } from "./User";

export interface Exam {
  id: number;
  title: string;
  department: number;
  department_name: string;
  creator: number;
  creator_email: string;
  duration_minutes: number;
  scheduled_start: string;
  scheduled_end: string;
  repeat_after_days: number | null;
  is_active: boolean;
  instructions: string;
  celery_task_id: string | null;
  passing_score: number;
}
export interface ExamInvitation {
  id: number;
  exam: number;
  exam_title: string;
  user: User;
  sent_at: string;
  added_by: number;
  token: string;
  is_attempted: boolean;
}
export interface ExamAttempt {
  id: number;
  user: {
    id: number;
    email: string;
  };
  exam: {
    id: number;
    title: string;
    passing_score: number;
  };
  status: "passed" | "failed" | string; // extend if you have more statuses
  score: number;
  is_submitted: boolean;
}
