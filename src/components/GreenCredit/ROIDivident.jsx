import { DollarSign, Calculator } from "lucide-react";
import React, { useState, useEffect } from "react";
import useGreenCreditStore from "../../store/greenCreditStore";
import { formatCurrency } from "../../utils/functions";

export default function ROIDivident() {
  const { creditDetail } = useGreenCreditStore();
  
  // Set minimum investment to one unit price
  const minInvestment = creditDetail.per_unit_price || 1000000;
  
  // Set maximum investment to the total fund required or a reasonable multiple of min price
  const maxInvestment = creditDetail.fundrequired || minInvestment * 10;
  
  // Initial investment defaults to minimum (one unit)
  const [investment, setInvestment] = useState(minInvestment);
  
  // Calculate units based on investment amount
  const units = Math.floor(investment / creditDetail.per_unit_price) || 1;
  
  // Calculate dividend and related values
  const dividendPerUnit = (creditDetail.per_unit_price * creditDetail.roi) / 100 || 1000;
  const actualInvestment = units * creditDetail.per_unit_price; // Actual investment after rounding to full units
  const totalDividend = units * dividendPerUnit;
  const monthlyDividend = totalDividend / 12;

  // Handle investment input change
  const handleInvestmentChange = (value) => {
    // Ensure value is within valid range
    const numValue = Number(value.toString().replace(/[^0-9]/g, ''));
    const newValue = Math.max(minInvestment, Math.min(maxInvestment, numValue));
    setInvestment(newValue);
  };

  // Format investment for display in input
  const formattedInvestment = investment.toLocaleString();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm col-span-2">
      <div className="flex items-center mb-4">
        <DollarSign className="w-5 h-5 text-teal-700 mr-2" />
        <h3 className="font-medium text-lg">ROI & Dividend Calculator</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-1">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Investment Amount
          </h4>
          
          {/* Investment-based slider */}
          <div className="mb-4">
            <input
              type="range"
              min={minInvestment}
              max={maxInvestment}
              step={creditDetail.per_unit_price}
              value={investment}
              onChange={(e) => handleInvestmentChange(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>{formatCurrency(minInvestment)}</span>
              <span>{formatCurrency(maxInvestment)}</span>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Amount to Invest
            </label>
            <div className="mt-1 relative rounded-md border border-gray-300">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">Rp</span>
              </div>
              <input
                type="text"
                value={formattedInvestment}
                onChange={(e) => handleInvestmentChange(e.target.value)}
                className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 px-4 py-3 sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Units to purchase: {units} {units > 1 ? 'units' : 'unit'}
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Investment Results
          </h4>
          <div className="bg-teal-50 border border-teal-100 rounded-lg p-4">
            <div className="flex flex-col">
              <div className="mb-3">
                <div className="text-sm text-gray-600">ROI Rate</div>
                <div className="text-xl font-bold text-teal-700">
                  {creditDetail.roi}%{" "}
                  <span className="text-xs font-normal">per year</span>
                </div>
              </div>

              <div className="mb-3">
                <div className="text-sm text-gray-600">Annual Dividend</div>
                <div className="text-xl font-bold text-teal-700">
                  {formatCurrency(totalDividend)}
                </div>
              </div>

              <div className="pt-3 border-t border-teal-200">
                <div className="text-sm text-gray-600">Monthly Income</div>
                <div className="text-2xl font-bold text-teal-800">
                  {formatCurrency(monthlyDividend)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center mb-2">
          <Calculator className="w-4 h-4 text-gray-500 mr-2" />
          <h4 className="text-sm font-medium text-gray-700">
            Investment Summary
          </h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Initial Investment</p>
            <p className="font-medium">{formatCurrency(actualInvestment)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Annual Return</p>
            <p className="font-medium">{formatCurrency(totalDividend)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}