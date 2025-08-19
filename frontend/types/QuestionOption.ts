export interface Option {
  id: number;
  text: string;
  is_correct: boolean;
  question: number;
}
export interface NewOption {
  text: string;
  is_correct: boolean; // keep it boolean in the form
}
export interface Question {
  id: number;
  departments: number[];
  department_names: string[];
  type: string;
  text: string;
  marks: number;
  created_by: number;
  created_at: string;
  options: Option[];
  created_by_email: string;
}

export interface ExamQuestion {
  id: number;
  question: Question;
  order: number;
  weight: number;
  total_questions: number;
  exam: number;
}
