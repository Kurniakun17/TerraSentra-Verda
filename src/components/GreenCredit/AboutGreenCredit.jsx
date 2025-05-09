import React from "react";
import useGreenCreditStore from "../../store/greenCreditStore";

export default function AboutGreenCredit() {
  const { creditDetail } = useGreenCreditStore();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-3">About Green Projects</h2>
          <p className="text-gray-600">{creditDetail.description}</p>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-3">
            How can this project giving an impact?
          </h2>
          <p className="text-gray-600">{creditDetail.green_impact}</p>
        </div>
      </div>
    </div>
  );
}
