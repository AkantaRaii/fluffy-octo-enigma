import Link from "next/link";

export default function StatCard({
  title,
  value,
  href,
}: {
  title: string;
  value: any;
  href?: string;
}) {
  return (
    <div className="rounded-xl bg-white shadow-sm p-5 flex flex-col items-center text-center">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      {href && (
        <Link href={href} className="mt-3 text-sm text-theme hover:underline">
          View Details →
        </Link>
      )}
    </div>
  );
}
