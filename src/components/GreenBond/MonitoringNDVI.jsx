import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import useGreenBondStore from "../../store/greenBondStore";

export default function MonitoringNDVI() {
  const [data, setData] = useState([]);
  const [currentNdvi, setCurrentNdvi] = useState(null);
  const { bondDetail } = useGreenBondStore();

  useEffect(() => {
    console.log(bondDetail.ndvi)
    const ndviData = Array.isArray(bondDetail.ndvi) ? bondDetail.ndvi : [{ "2025-04-25": 0.4 }];
    const formattedData = ndviData.map((item) => {
      const date = Object.keys(item)[0];
      const value = item[date];

      return {
        date: date,
        ndvi: value,
      };
    });

    const historicalData = [
      { date: "2024-11-25", ndvi: 0.28 },
      { date: "2024-12-25", ndvi: 0.32 },
      { date: "2025-01-25", ndvi: 0.35 },
      { date: "2025-02-25", ndvi: 0.37 },
      { date: "2025-03-25", ndvi: 0.39 },
      { date: "2025-04-25", ndvi: 0.4 },
    ];

    setData(formattedData.length < 2 ? historicalData : formattedData);
    setCurrentNdvi(0.4);
  }, []);

  const getNdviStatusText = (value) => {
    if (value < 0.2) return "Sparse vegetation";
    if (value < 0.4) return "Moderate vegetation";
    if (value < 0.6) return "Dense vegetation";
    return "Very dense vegetation";
  };

  const getNdviStatusColor = (value) => {
    if (value < 0.2) return "text-yellow-600";
    if (value < 0.4) return "text-green-500";
    if (value < 0.6) return "text-green-600";
    return "text-green-800";
  };

  return (
    <div className="w-full p-6 bg-white mb-6 rounded-lg  border border-gray-200">
      <h2 className="text-xl font-bold text-[#407487] mb-4">
        NDVI Monitoring for {bondDetail.name}
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        The Normalized Difference Vegetation Index (NDVI) tracks vegetation
        health around the project area, helping monitor the environmental impact
        of our clean energy initiative.
      </p>

      <div className="h-72 bg-[#a0def419] p-4 rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 5, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#555" }}
              axisLine={{ stroke: "#888" }}
            />
            <YAxis
              domain={[0, 1]}
              tickCount={6}
              tick={{ fill: "#555" }}
              axisLine={{ stroke: "#888" }}
            />
            <Tooltip
              formatter={(value) => [
                `${value} (${getNdviStatusText(value)})`,
                "NDVI",
              ]}
              contentStyle={{ backgroundColor: "#fff", borderColor: "#559795" }}
            />
            <Legend />

            {/* Reference lines for NDVI status categories */}
            <ReferenceLine y={0.2} stroke="#d97706" strokeDasharray="3 3" />
            <ReferenceLine y={0.4} stroke="#059669" strokeDasharray="3 3" />
            <ReferenceLine y={0.6} stroke="#047857" strokeDasharray="3 3" />

            <Line
              type="monotone"
              dataKey="ndvi"
              stroke="#559795"
              strokeWidth={3}
              name="NDVI Value"
              dot={{ r: 6, fill: "#62afcb" }}
              activeDot={{ r: 8, fill: "#407487" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 p-4 bg-[#a0def419] rounded-md border border-[#62afcb]">
        <h3 className="font-medium text-[#407487] mb-2">
          NDVI Status Interpretation:
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">0.1 - 0.2: Sparse</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-400 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">0.2 - 0.4: Moderate</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-600 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">0.4 - 0.6: Dense</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-800 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">0.6 - 0.9: Very dense</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-700">
              Current NDVI:{" "}
              <span className={`font-bold ${getNdviStatusColor(currentNdvi)}`}>
                {currentNdvi || "N/A"}
              </span>{" "}
              <span className="text-gray-600">
                ({getNdviStatusText(currentNdvi)})
              </span>
            </p>
          </div>
          <div className="text-xs text-right text-gray-500">
            <p>Last updated: April 25, 2025</p>
            <p>Next measurement: May 25, 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}
