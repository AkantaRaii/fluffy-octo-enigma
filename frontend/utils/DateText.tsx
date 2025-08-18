"use client";
import { useEffect, useState } from "react";

export default function DateText({ date }: { date: string }) {
  const [formatted, setFormatted] = useState(date);

  useEffect(() => {
    setFormatted(new Date(date).toLocaleString());
  }, [date]);

  return <>{formatted}</>;
}
