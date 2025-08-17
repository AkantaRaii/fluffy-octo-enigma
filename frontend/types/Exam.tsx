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
//   {
//     "id": 1,
//     "title": "test",
//     "department": 1,
//     "department_name": "maths",
//     "creator": 1,
//     "creator_email": "admin@admin.com",
//     "duration_minutes": 60,
//     "scheduled_start": "2025-08-12T06:56:00Z",
//     "scheduled_end": "2025-08-11T19:56:00Z",
//     "repeat_after_days": null,
//     "is_active": true,
//     "instructions": "",
//     "celery_task_id": null,
//     "passing_score": 60
// },
