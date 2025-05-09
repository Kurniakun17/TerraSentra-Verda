import { Sun } from "lucide-react";
import React from "react";
import useGreenCreditStore from "../../store/greenCreditStore";

export default function Sustainability() {
  const { creditDetail } = useGreenCreditStore();
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center mb-3">
        <Sun className="w-5 h-5 text-teal-700 mr-2" />
        <h3 className="font-medium">Sustainability</h3>
      </div>
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm text-gray-500">Sustainability Score</p>
        <div className="w-10 h-10 rounded-full bg-teal-700 flex items-center justify-center">
          <span className="text-white font-bold">
            {creditDetail.sustainability_score}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {["Solar Panel", "Net Metering", "Energy Monitoring"].map(
          (tech, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded-full"
            >
              {tech}
            </span>
          )
        )}
      </div>
    </div>
  );
}
