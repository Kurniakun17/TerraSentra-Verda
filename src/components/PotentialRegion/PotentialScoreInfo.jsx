import { BarChart2 } from "lucide-react";
import React from "react";

export default function PotentialScoreInfo() {
  return (
    <div className="bg-gradient-to-r bg-white  p-6 rounded-lg border border-gray-200  mb-6">
      <h3 className="text-lg font-medium text-gray-800 flex items-center mb-3">
        <BarChart2 size={20} className="mr-2 text-blue-500" />
        Understanding the Potential Score
      </h3>

      <div className="space-y-3 text-sm">
        <p>
          The Regional Potential Score identifies areas that would most benefit
          from targeted investment and development initiatives.
        </p>

        <div className="bg-gray-100/70 p-3 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">
            What affects the score:
          </h4>
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="w-2 h-2 bg-red-400 rounded-full mt-1.5 mr-2"></div>
              <span>
                Higher air pollution levels indicate environmental challenges
              </span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-1.5 mr-2"></div>
              <span>
                Higher poverty index shows greater socioeconomic needs
              </span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 mr-2"></div>
              <span>Environmental metrics indicate ecosystem conditions</span>
            </li>
          </ul>
        </div>

        <p className="italic text-gray-600">
          A higher score means the region has greater development needs and more
          significant potential for positive impact.
        </p>
      </div>
    </div>
  );
}
