import React from "react";
import useGreenBondStore from "../../store/greenBondStore";

export default function AboutGreenBond() {
  const { bondDetail } = useGreenBondStore();
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        About the Project
      </h2>
      <p>{bondDetail.description} </p>
    </div>
  );
}
