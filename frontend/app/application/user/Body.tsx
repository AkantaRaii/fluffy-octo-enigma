"use client";

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

export default function Body({ data }: { data: DashboardData }) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-2 px-1">
        <h1 className="text-xl font-semibold">User Dashboard</h1>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total Exams" value={data.total_exams} />
        <StatCard title="Completed" value={data.completed} />
        <StatCard title="Pending" value={data.pending} />
        <StatCard title="Avg Score" value={data.avg_score} />
        <StatCard title="Passed" value={data.passed} />
        <StatCard title="Failed" value={data.failed} />
      </div>

      {/* Last Attempts */}
      <div className="overflow-x-auto border-gray-200 border-1 rounded-xl">
        <h2 className="text-lg font-semibold px-4 py-2 border-b bg-gray-200">
          Last Attempts
        </h2>
        <table className="min-w-full border-collapse">
          <thead>
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
  );
}

function StatCard({ title, value }: { title: string; value: any }) {
  return (
    <div className="border border-gray-200 rounded-xl shadow-sm p-4 bg-white">
      <h3 className="text-sm text-gray-600">{title}</h3>
      <p className="text-xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}
