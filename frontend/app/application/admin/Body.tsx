"use client";
import StatCard from "@/components/StatCard";
type DashboardData = {
  total_exams: number;
  active_exams: number;
  total_users: number;
  pass_rate: number;
  recent_attempts: {
    user__email: string;
    exam__title: string;
    score: number;
    status: string;
    submitted_at: string;
  }[];
  department_stats: {
    name: string;
    total_exams: number;
    active_exams: number;
  }[];
};

export default function Body({ data }: { data: DashboardData }) {
  return (
    <div className="space-y-8 py-2">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">
          Overview of exams, users, and performance
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Exams"
          value={data.total_exams}
          href="/application/admin/exams"
        />
        <StatCard
          title="Active Exams"
          value={data.active_exams}
          href="/application/admin/exams"
        />
        <StatCard
          title="Total Users"
          value={data.total_users}
          href="/application/admin/users"
        />
        <StatCard title="Pass Rate" value={`${data.pass_rate}%`} />
      </div>

      {/* Recent Attempts */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <h2 className="text-lg font-semibold px-6 py-4 border-b border-gray-200">
          Recent Attempts
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-6 text-left font-medium">User</th>
                <th className="py-3 px-6 text-left font-medium">Exam</th>
                <th className="py-3 px-6 text-left font-medium">Score</th>
                <th className="py-3 px-6 text-left font-medium">Status</th>
                <th className="py-3 px-6 text-left font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.recent_attempts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    No attempts yet.
                  </td>
                </tr>
              ) : (
                data.recent_attempts.map((a, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-6">{a.user__email}</td>
                    <td className="py-3 px-6">{a.exam__title}</td>
                    <td className="py-3 px-6 font-semibold text-gray-800">
                      {a.score}
                    </td>
                    <td className="py-3 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          a.status === "passed"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-gray-500">
                      {new Date(a.submitted_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Stats */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <h2 className="text-lg font-semibold px-6 py-4 border-b border-gray-200">
          Department Stats
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wider">
                <th className="py-3 px-6 text-left font-semibold">
                  Department
                </th>
                <th className="py-3 px-6 text-left font-semibold">
                  Total Exams
                </th>
                <th className="py-3 px-6 text-left font-semibold">
                  Active Exams
                </th>
              </tr>
            </thead>
            <tbody>
              {data.department_stats.map((d, i) => (
                <tr
                  key={i}
                  className={`transition-colors ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-indigo-50`}
                >
                  <td className="py-4 px-6 font-medium text-gray-800">
                    {d.name}
                  </td>
                  <td className="py-4 px-6 text-gray-600">{d.total_exams}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        d.active_exams > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {d.active_exams}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
