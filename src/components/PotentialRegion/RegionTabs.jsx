import { useState } from "react";
import {
  TrendingUp,
  Droplet,
  Wind,
  Leaf,
  Clock,
  Bolt,
  Building,
  Target,
  Award,
  Users,
  CreditCard,
  Info,
  ChartBar,
  Factory,
  Database,
  Flame,
  ChevronUp,
  ChevronDown,
  Droplets,
  MapPin,
  Briefcase,
} from "lucide-react";
import GaugeProgressbar from "../shared/GaugeProgressbar";
import EnvironmentalDashboard from "./EnvironmentalDashboard";
import PotentialScoreInfo from "./PotentialScoreInfo";

export default function RegionTabs({ data }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showJobs, setShowJobs] = useState(false);

  const getScoreRating = (score) => {
    if (score > 50) return "High";
    if (score >= 30 && score <= 50) return "Medium";
    return "Low";
  };

  const getColor = (value) => {
    if (value > 10) return "text-emerald-500";
    if (value >= 5 && value <= 10) return "text-yellow-500";
    return "text-red-500";
  };

  const getAqiClass = (aqi) => {
    if (aqi <= 50) return "bg-green-100 text-green-800";
    if (aqi <= 100) return "bg-yellow-100 text-yellow-800";
    if (aqi <= 150) return "bg-orange-100 text-orange-800";
    if (aqi <= 200) return "bg-red-100 text-red-800";
    if (aqi <= 300) return "bg-purple-100 text-purple-800";
    return "bg-rose-100 text-rose-800";
  };

  const getAqiLabel = (aqi) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  const getColorClass = (pollutant, value) => {
    // Set thresholds for different pollutants
    const thresholds = {
      NO2: { low: 40, high: 100 },
      SO2: { low: 100, high: 300 },
      CO: { low: 10, high: 30 },
      O3: { low: 0.1, high: 0.2 },
      PM25: { low: 25, high: 50 },
    };

    if (pollutant in thresholds) {
      if (value < thresholds[pollutant].low) return "border-green-500";
      if (value < thresholds[pollutant].high) return "border-yellow-500";
      return "border-red-500";
    }

    return "border-gray-300";
  };

  const showTooltip = (pollutant, e) => {
    const descriptions = {
      NO2: "Nitrogen dioxide - impacts respiratory health",
      SO2: "Sulfur dioxide - causes acid rain and respiratory issues",
      CO: "Carbon monoxide - reduces oxygen carrying capacity of blood",
      O3: "Ozone - irritates respiratory system and damages plants",
      PM25: "Fine particulate matter - enters bloodstream via lungs",
    };

    setTooltipContent(descriptions[pollutant]);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

  const hideTooltip = () => {
    setTooltipContent(null);
  };

  return (
    <>
      <div className=" rounded-lg  mb-6 overflow-hidden">
        <div className="flex bg-white justify-center p-4 border border-gray-200 ">
          <div className="inline-flex bg-gray-100 p-1 rounded-full">
            <button
              className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === "overview"
                  ? "bg-tertiary text-white "
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              <Info className="w-4 h-4 mr-2" />
              Overview & Impact
            </button>
            <button
              className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === "green project"
                  ? "bg-tertiary text-white "
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("green project")}
            >
              <ChartBar className="w-4 h-4 mr-2" />
              Green Project
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg border border-gray-200">
        {activeTab === "overview" && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Left column */}
              <div className="lg:col-span-2">
                <div className="flex items-center mb-4">
                  <Target size={24} className="text-tertiary mr-2" />
                  <h2 className="text-xl font-bold text-tertiary">
                    Potential Score Overview
                  </h2>
                </div>

                {/* Overall Potential Score Card */}
                <div className="bg-gradient-to-r from-tertiary to-tertiary/50 p-6 rounded-lg  mb-6 text-white">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Overall Potential Score
                      </h3>
                      <div className="flex items-center gap-2">
                        <Award size={24} />
                        <span className="text-3xl font-bold">
                          {data.ai_investment_score}
                        </span>
                      </div>
                      <p className="mt-1 text-white/70">
                        Rating: {getScoreRating(data.ai_investment_score)}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="flex justify-end mt-2">
                        <span className="px-2 py-1 bg-white/20 text-xs rounded-full">
                          Based on Environmental, AQI & Poverty Index
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <PotentialScoreInfo />

                {/* Air Quality Index */}
                <div className="bg-white p-6 rounded-lg  mb-6 border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 flex items-center mb-4">
                    <Wind size={18} className="mr-2 text-blue-500" />
                    Air Quality Index (AQI)
                  </h3>

                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1">
                      <div className="mx-auto w-fit">
                        <GaugeProgressbar percentage={data.aqi} />
                        <p className="text-xs mt-2 text-gray-600 text-center -translate-y-5">
                          Current AQI:{" "}
                          <span
                            className={getAqiClass(data.aqi)
                              .replace("bg-", "text-")
                              .replace("-100", "-600")}
                          >
                            {getAqiLabel(data.aqi)}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="grid grid-cols-2 gap-4">
                        <div
                          className={`flex justify-between border ${getColorClass(
                            "NO2",
                            data.no2
                          )} rounded-full px-3 py-2 cursor-help relative hover:bg-gray-50 transition-colors`}
                          onMouseEnter={(e) => showTooltip("NO2", e)}
                          onMouseMove={(e) => showTooltip("NO2", e)}
                          onMouseLeave={hideTooltip}
                        >
                          <p className="text-xs text-gray-600">NO₂</p>
                          <p className="text-xs text-gray-600">
                            {data.no2.toFixed(1)} µg/m³
                          </p>
                        </div>
                        <div
                          className={`flex justify-between border ${getColorClass(
                            "SO2",
                            data.so2
                          )} rounded-full px-3 py-2 cursor-help relative hover:bg-gray-50 transition-colors`}
                          onMouseEnter={(e) => showTooltip("SO2", e)}
                          onMouseMove={(e) => showTooltip("SO2", e)}
                          onMouseLeave={hideTooltip}
                        >
                          <p className="text-xs text-gray-600">SO₂</p>
                          <p className="text-xs text-gray-600">
                            {data.so2.toFixed(1)} µg/m³
                          </p>
                        </div>
                        <div
                          className={`flex justify-between border ${getColorClass(
                            "CO",
                            data.co
                          )} rounded-full px-3 py-2 cursor-help relative hover:bg-gray-50 transition-colors`}
                          onMouseEnter={(e) => showTooltip("CO", e)}
                          onMouseMove={(e) => showTooltip("CO", e)}
                          onMouseLeave={hideTooltip}
                        >
                          <p className="text-xs text-gray-600">CO</p>
                          <p className="text-xs text-gray-600">
                            {data.co.toFixed(1)} µg/m³
                          </p>
                        </div>
                        <div
                          className={`flex justify-between border ${getColorClass(
                            "O3",
                            data.o3
                          )} rounded-full px-3 py-2 cursor-help relative hover:bg-gray-50 transition-colors`}
                          onMouseEnter={(e) => showTooltip("O3", e)}
                          onMouseMove={(e) => showTooltip("O3", e)}
                          onMouseLeave={hideTooltip}
                        >
                          <p className="text-xs text-gray-600">O₃</p>
                          <p className="text-xs text-gray-600">
                            {data.o3.toFixed(3)} µg/m³
                          </p>
                        </div>
                        <div
                          className={`flex justify-between border ${getColorClass(
                            "PM25",
                            data.pm25
                          )} rounded-full px-3 py-2 cursor-help relative hover:bg-gray-50 transition-colors col-span-2`}
                          onMouseEnter={(e) => showTooltip("PM25", e)}
                          onMouseMove={(e) => showTooltip("PM25", e)}
                          onMouseLeave={hideTooltip}
                        >
                          <p className="text-xs text-gray-600">PM2.5</p>
                          <p className="text-xs text-gray-600">
                            {data.pm25} µg/m³
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <EnvironmentalDashboard data={data} />
              </div>

              {/* Right column */}
              <div>
                <div className="bg-white p-6 rounded-lg  mb-6 border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 flex items-center mb-4">
                    <CreditCard size={18} className="mr-2 text-yellow-500" />
                    Economic Indicators
                  </h3>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium flex items-center">
                        <Users size={16} className="mr-2 text-blue-500" />
                        Poverty Index
                      </h4>
                      <span
                        className={`text-lg font-bold ${getColor(
                          data.poverty_index
                        )}`}
                      >
                        {data.poverty_index}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                      <div
                        className={`h-2.5 rounded-full ${getColor(
                          data.poverty_index
                        ).replace("text-", "bg-")}`}
                        style={{
                          width: `${Math.min(100, data.poverty_index * 6.5)}%`,
                        }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>5</span>
                      <span>10</span>
                      <span>15</span>
                    </div>

                    <p className="text-xs text-gray-600 mt-2">
                      Higher index indicates better investment potential
                    </p>
                  </div>

                  <div className="flex items-center mb-1">
                    <Clock size={18} className="text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">
                      Data period: {data.period}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Info size={18} className="text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">
                      Region level: {data.level}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg  border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 flex items-center mb-4">
                    <Bolt size={18} className="mr-2 text-yellow-500" />
                    Regional Resources
                  </h3>

                  <div className="space-y-4">
                    <div className="bg-tertiary-light p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">
                        Top Human Resource
                      </h4>
                      <div className="flex items-center">
                        <Users size={18} className="text-purple-500 mr-2" />
                        <span className="text-sm">
                          {data.details.top_human_resource_skill}
                        </span>
                      </div>
                    </div>

                    <div className="bg-tertiary-light p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">
                        Top Natural Resource
                      </h4>
                      <div className="flex items-center">
                        <Droplet size={18} className="text-green-500 mr-2" />
                        <span className="text-sm">
                          {data.details.top_natural_resource}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "green project" && (
          <div className=" mx-auto  bg-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Leaf className="text-green-500" size={28} />
                <h1 className="text-xl font-bold  text-green-500">
                  Green Project Recommendation
                </h1>
              </div>
              
            </div>

            {/* Regional Resources */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                <div className="flex items-center mb-3">
                  <Factory size={20} className="text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Top Human Resource
                  </h2>
                </div>
                <div className="flex items-center pl-2">
                  <Users size={16} className="text-blue-600 mr-2" />
                  <span className="text-gray-700">
                    {data.details.top_human_resource_skill}
                  </span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 bg-amber-50">
                <div className="flex items-center mb-3">
                  <Database size={20} className="text-amber-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Top Natural Resource
                  </h2>
                </div>
                <div className="flex items-center pl-2">
                  <Flame size={16} className="text-amber-600 mr-2" />
                  <span className="text-gray-700">
                    {data.details.top_natural_resource}
                  </span>
                </div>
              </div>
            </div>

            {/* Project Card */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
              <div className="bg-green-100 p-4">
                <div className="flex items-center">
                  <Leaf size={20} className="text-green-600 mr-2" />
                  <h2 className="text-lg font-bold text-gray-800">
                    {data.details.green_project.name}
                  </h2>
                </div>
              </div>

              <div className="p-5">
                {/* Justification */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-700 mb-2">
                    Project Justification
                  </h3>
                  <p className="text-gray-600">
                    {data.details.green_project.justification}
                  </p>
                </div>

                {/* Environmental Impact */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-700 mb-2 flex items-center">
                    <Wind size={18} className="text-green-500 mr-2" />
                    Environmental Impact
                  </h3>
                  <div className="bg-green-50 p-4 rounded-md border border-green-100">
                    <p className="text-gray-600">
                      {data.details.green_project.environmental_impact}
                    </p>
                  </div>
                </div>

                {/* Jobs Section */}
                <div>
                  <button
                    onClick={() => setShowJobs(!showJobs)}
                    className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-md border border-gray-200 text-left font-medium text-gray-700 hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <Briefcase size={18} className="text-blue-600 mr-2" />
                      <span>
                        Short Term Jobs (
                        {data.details.green_project.short_terms_jobs.length})
                      </span>
                    </div>
                    {showJobs ? (
                      <ChevronUp size={18} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-500" />
                    )}
                  </button>

                  {showJobs && (
                    <div className="mt-3 grid grid-cols-1 gap-3">
                      {data.details.green_project.short_terms_jobs.map((job, index) => (
                        <div
                          key={index}
                          className="p-4 border border-gray-200 rounded-md"
                        >
                          <h4 className="text-md font-semibold text-gray-800 mb-1">
                            {job.title}
                          </h4>
                          <p className="text-gray-600">{job.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center border-t border-gray-200 pt-4">
              <Droplets size={16} className="text-blue-500 mr-1" />
              <span className="text-sm text-gray-500">
                Recommended based on regional resources and environmental needs
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-300/80 rounded-lg  overflow-hidden">
        {/* Tooltip for pollutant info */}
        {tooltipContent && (
          <div
            className="fixed bg-black/80 text-white px-3 py-2 rounded  text-xs max-w-xs z-50 pointer-events-none"
            style={{
              left: `${tooltipPosition.x + 10}px`,
              top: `${tooltipPosition.y - 10}px`,
            }}
          >
            {tooltipContent}
          </div>
        )}
      </div>
    </>
  );
}
