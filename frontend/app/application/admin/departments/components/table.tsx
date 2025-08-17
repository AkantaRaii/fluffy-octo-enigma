import React from "react";

interface RowData {
  id: number;
  header: string;
  sectionType: string;
  status: "Done" | "In Process";
  target: number;
  limit: number;
  reviewer: string;
}

interface TableProps {
  data: RowData[];
}

export default function Table({ data }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
            <th className="w-6"></th> {/* drag handle */}
            <th className="py-3 px-4">Header</th>
            <th className="py-3 px-4">Section Type</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Target</th>
            <th className="py-3 px-4">Limit</th>
            <th className="py-3 px-4">Reviewer</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {data.map((row) => (
            <tr
              key={row.id}
              className="border-b last:border-b-0 hover:bg-gray-50 transition"
            >
              <td className="py-3 px-4 cursor-grab text-gray-400">⠿</td>
              <td className="py-3 px-4">{row.header}</td>
              <td className="py-3 px-4">{row.sectionType}</td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    row.status === "Done"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {row.status}
                </span>
              </td>
              <td className="py-3 px-4">{row.target}</td>
              <td className="py-3 px-4">{row.limit}</td>
              <td className="py-3 px-4">{row.reviewer}</td>
              <td className="py-3 px-4 text-gray-500 cursor-pointer">⋮</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
