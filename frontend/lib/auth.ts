import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

// Helper function for use in server components and server actions
export const auth = () => getServerSession(authOptions);
