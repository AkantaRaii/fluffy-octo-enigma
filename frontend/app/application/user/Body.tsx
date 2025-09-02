"use client";

import StatCard from "@/components/StatCard";
import CustomTooltip from "@/components/CustomTooltip";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type DashboardData = {
  total_exams: number;
  completed: number;
  pending: number;
  avg_score: number;
  passed: number;
  failed: number;
  last_attempts: {
    exam__title: string;
    score: number;
    status: string;
    submitted_at: string;
  }[];
};

const COLORS = ["#91a92a", "#E31313"]; // green for passed, red for failed

export default function Body({ data }: { data: DashboardData }) {
  const pieData = [
    { name: "Passed", value: data.passed },
    { name: "Failed", value: data.failed },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-2 px-1">
        <h1 className="text-xl font-semibold">User Dashboard</h1>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Exams"
          value={data.total_exams}
          href="/application/user/upcoming"
        />
        <StatCard
          title="Completed"
          value={data.completed}
          href="/application/user/upcoming"
        />
        <StatCard title="Pending" value={data.pending} />
        <StatCard title="Avg Score" value={data.avg_score} />
      </div>
      <div className="grid grid-cols-12 gap-4">
        {/* Last Attempts */}
        <div className="bg-white p-2 overflow-x-auto border-gray-200 border-1 rounded-xl col-span-7">
          <h2 className="text-lg font-semibold px-6 py-4 border-b border-gray-200">
            Last Attempts
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
                  <th className="py-3 px-4">Exam</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {data.last_attempts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-500">
                      No attempts yet.
                    </td>
                  </tr>
                ) : (
                  data.last_attempts.map((a, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-300 last:border-b-0 hover:bg-gray-200 transition"
                    >
                      <td className="py-3 px-4">{a.exam__title}</td>
                      <td className="py-3 px-4">{a.score}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            a.status === "passed"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(a.submitted_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Passed vs Failed Chart */}
        <div className="border border-gray-200 rounded-xl shadow-sm p-6 bg-white col-span-5">
          <h2 className="text-lg font-semibold mb-4">Exam Performance</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  label
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                {/* <Tooltip content={<CustomTooltip />} /> */}
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
