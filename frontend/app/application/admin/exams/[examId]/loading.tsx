// app/loading.tsx
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 z-50">
      <div className="w-32 h-32 mb-4 animate-bounce">
        <Image
          src="/gtnlogo.png"
          alt="Loading"
          width={150}
          height={150}
          priority
        />
      </div>
    
      <p className="text-green-600 dark:text-green-400 font-semibold text-lg">
        Loading...
      </p>

      <div className="mt-6 flex space-x-2">
        <div className="w-3 h-3 bg-green-600 rounded-full animate-ping" />
        <div className="w-3 h-3 bg-green-600 rounded-full animate-ping animation-delay-200" />
        <div className="w-3 h-3 bg-green-600 rounded-full animate-ping animation-delay-400" />
      </div>
    </div>
  );
}
