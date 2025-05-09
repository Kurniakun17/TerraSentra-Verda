import React from "react";

export default function GaugeProgressbar({ percentage = 50 }) {
  const getAqiColor = (value) => {
    if (value <= 50) return "text-green-500";
    if (value <= 100) return "text-yellow-500";
    if (value <= 150) return "text-orange-500";
    if (value <= 200) return "text-red-500";
    if (value <= 300) return "text-purple-600";
    return "text-rose-800";
  };

  const getStrokeColor = (value) => {
    if (value <= 50) return "text-green-500";
    if (value <= 100) return "text-yellow-500";
    if (value <= 150) return "text-orange-500";
    if (value <= 200) return "text-red-500";
    if (value <= 300) return "text-purple-600";
    return "text-rose-800";
  };

  const adjustedPercentage = (percentage / 100) * 75;

  const colorClass = getAqiColor(percentage);
  const strokeColorClass = getStrokeColor(percentage);

  return (
    <div className="relative size-40">
      <svg
        className="rotate-[135deg] size-full"
        viewBox="0 0 36 36"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-current text-gray-200"
          strokeWidth="1.5"
          strokeDasharray="75 100"
          strokeLinecap="round"
        ></circle>

        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className={`stroke-current ${strokeColorClass}`}
          strokeWidth="1.5"
          strokeDasharray={`${adjustedPercentage} 100`}
          strokeLinecap="round"
        ></circle>
      </svg>

      <div className="absolute top-1/2 start-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <span className={`text-4xl font-bold ${colorClass}`}>{percentage}</span>
        <span className={`${colorClass} block`}>Score</span>
      </div>
    </div>
  );
}
