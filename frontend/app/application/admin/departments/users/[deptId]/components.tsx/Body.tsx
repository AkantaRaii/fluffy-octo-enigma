"use client";
import { User } from "@/types/User";
import UserTable from "./UserTable";
import { useState } from "react";
interface Props {
  users: User[];
}
export default function Body({ users }: Props) {
  const [deptUsers, setDeptUsers] = useState<User[]>(users);
  const onDelete = () => {};
  return (
    <div className="py-4">
      <UserTable data={deptUsers} onEdit={() => {}} onDelete={() => {}} />
    </div>
  );
}
