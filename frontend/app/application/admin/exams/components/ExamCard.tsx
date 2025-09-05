// const ExamCard = ({ exam }: { exam: any }) => {
//   const formatDateTime = (dateString: any) => {
//     return new Date(dateString).toLocaleString("en-US", {
//       weekday: "short",
//       month: "short",
//       day: "numeric",
//       hour: "numeric",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 m-4 max-w-md w-full border border-gray-100 hover:border-blue-200">
//       <div className="flex justify-between items-start mb-4">
//         <h2 className="text-xl font-semibold text-gray-800 truncate">
//           {exam.title}
//         </h2>
//         <span
//           className={`px-2 py-1 rounded-full text-xs font-medium ${
//             exam.is_active
//               ? "bg-green-100 text-green-700"
//               : "bg-gray-100 text-gray-700"
//           }`}
//         >
//           {exam.is_active ? "Active" : "Inactive"}
//         </span>
//       </div>

//       <div className="space-y-3">
//         <div className="flex items-center text-gray-600">
//           <svg
//             className="w-5 h-5 mr-2"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           </svg>
//           <span>{exam.duration_minutes} minutes</span>
//         </div>

//         <div className="flex items-center text-gray-600">
//           <svg
//             className="w-5 h-5 mr-2"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//             />
//           </svg>
//           <span>Start: {formatDateTime(exam.scheduled_start)}</span>
//         </div>

//         <div className="flex items-center text-gray-600">
//           <svg
//             className="w-5 h-5 mr-2"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//             />
//           </svg>
//           <span>End: {formatDateTime(exam.scheduled_end)}</span>
//         </div>

//         <div className="flex items-center text-gray-600">
//           <svg
//             className="w-5 h-5 mr-2"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           </svg>
//           <span>Passing Score: {exam.passing_score}%</span>
//         </div>
//       </div>

//       {exam.instructions && (
//         <div className="mt-4 pt-4 border-t border-gray-200">
//           <p className="text-sm text-gray-600 line-clamp-2">
//             {exam.instructions}
//           </p>
//         </div>
//       )}

//       <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
//         View Exam Details
//       </button>
//     </div>
//   );
// };

// export default ExamCard;
