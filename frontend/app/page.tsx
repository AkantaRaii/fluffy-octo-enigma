export default async function Home() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/hello/`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  const data = await res.json();
  return <div className="text-3xl">kadnfakdsjfn</div>;
}
