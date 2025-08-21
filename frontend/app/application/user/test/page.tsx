// app/application/user/upcoming/[token]/page.tsx
import ExamDashboard from "./components/ExamDashboard";

export default async function TokenPage({
  params,
}: {
  params: { token: string };
}) {
  // In a real app you’ll fetch exam data using params.token
  const exam: ExamSession = {
    exam_title: "Math Exam",
    scheduled_start: "2025-08-20T06:16:01Z",
    scheduled_end: "2025-08-22T00:15:00Z",
    attempt_id: 1,
    questions: [
      {
        id: 3,
        departments: [1, 3, 4],
        department_names: ["maths", "healt", "healt"],
        type: "MCQ_SINGLE",
        text: "will you wash your hand",
        marks: 2,
        options: [
          {
            id: 1,
            text: "yes",
          },
          {
            id: 2,
            text: "no",
          },
          {
            id: 3,
            text: "idk",
          },
          {
            id: 4,
            text: "who knows",
          },
        ],
      },
      {
        id: 4,
        departments: [1],
        department_names: ["maths"],
        type: "MCQ_SINGLE",
        text: "kya ?",
        marks: 2,
        options: [
          {
            id: 5,
            text: "yes",
          },
          {
            id: 6,
            text: "no",
          },
          {
            id: 7,
            text: "idk",
          },
          {
            id: 8,
            text: "who knows",
          },
        ],
      },
      {
        id: 5,
        departments: [1],
        department_names: ["maths"],
        type: "MCQ_SINGLE",
        text: "formula of water",
        marks: 2,
        options: [
          {
            id: 9,
            text: "h2o",
          },
          {
            id: 10,
            text: "nh3",
          },
          {
            id: 11,
            text: "nh4",
          },
          {
            id: 12,
            text: "who knows",
          },
        ],
      },
      {
        id: 6,
        departments: [1],
        department_names: ["maths"],
        type: "MCQ_MULTI",
        text: "describe the sand choose multiple correct answer",
        marks: 2,
        options: [
          {
            id: 13,
            text: "dry",
          },
          {
            id: 14,
            text: "homogenous",
          },
          {
            id: 15,
            text: "oncuntable",
          },
          {
            id: 16,
            text: "brittle",
          },
        ],
      },
      {
        id: 7,
        departments: [1],
        department_names: ["maths"],
        type: "MCQ_MULTI",
        text: "is hydrogen ?",
        marks: 1,
        options: [],
      },
      {
        id: 9,
        departments: [1],
        department_names: ["maths"],
        type: "MCQ_SINGLE",
        text: "10.01 is ?",
        marks: 1,
        options: [
          {
            id: 17,
            text: "integer",
          },
          {
            id: 18,
            text: "float",
          },
          {
            id: 19,
            text: "imaganary",
          },
          {
            id: 20,
            text: "infinite",
          },
        ],
      },
      {
        id: 10,
        departments: [1],
        department_names: ["maths"],
        type: "MCQ_SINGLE",
        text: "waht is water",
        marks: 1,
        options: [
          {
            id: 21,
            text: "pani",
          },
          {
            id: 22,
            text: "paaiiii",
          },
          {
            id: 23,
            text: "jal",
          },
          {
            id: 24,
            text: "tdk",
          },
        ],
      },
    ],
  };

  return <ExamDashboard exam={exam} />;
}
