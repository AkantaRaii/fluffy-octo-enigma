"use client";

import React from "react";

interface InfoTileProps {
  label: string;
  value: string | number;
}

const InfoTile: React.FC<InfoTileProps> = ({ label, value }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-md w-32 h-24">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-xl font-semibold">{value}</span>
    </div>
  );
};

export default InfoTile;
