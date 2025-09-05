"use client";
import { User } from "@/types/User";
import UserTable from "../../../../../../../components/UserTable";
import { useState } from "react";
interface Props {
  users: User[];
}
export default function Body({ users }: Props) {
  return (
    <div>
      <UserTable data={users} />
    </div>
  );
}
