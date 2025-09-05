"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function DownloadPDFButton({ targetId }: { targetId: string }) {
  const handleDownload = async () => {
    const element = document.getElementById(targetId);
    if (!element) return;

    // Take screenshot of the element
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("download.pdf");
  };

  return (
    <button
      onClick={handleDownload}
      className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      Download as PDF
    </button>
  );
}
