type QuestionType = "MCQ_SINGLE" | "MCQ_MULTI";

interface ExamOption {
  id: number;
  text: string;
}

interface ExamQuestion {
  id: number;
  departments: number[];
  department_names: string[];
  type: QuestionType;
  text: string;
  marks: number;
  options: ExamOption[];
}

interface ExamSession {
  exam_title: string;
  scheduled_start: string; // ISO datetime string
  scheduled_end: string; // ISO datetime string
  attempt_id: number;
  questions: ExamQuestion[];
}
