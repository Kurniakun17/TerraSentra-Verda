import React, { useState, useEffect, use } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import Navbar from "../components/LandingPage/Navbar";
import "leaflet/dist/leaflet.css";
import {
  formatTopoJSON,
  getScoreColor,
  getScoreRating,
} from "../utils/functions";
import { APIURL, citiesList } from "../constant/type";
import RegionTabs from "../components/PotentialRegion/RegionTabs";
import { Plus } from "lucide-react";

const RegionDetail = () => {
  let { regionName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [regionData, setRegionData] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    await fetch(
      `${APIURL}/get-city-detail?provinceName=${regionName.toLowerCase()}`
    )
      .then((response) => response.json())
      .then((data) => {
        setData(data[0]);
      })
      .finally(() => setLoading(false));

    // useDummyData();
  };

  const useDummyData = () => {
    setData({
      id: 2522,
      province: "morowali",
      infrastructure: "Wetlands Restoration",
      renewable_energy: "Smart Grids for Clean Energy Integration",
      poverty_index: 7.14,
      ndvi: 0.34,
      precipitation: 12.5,
      sentinel: -4.244,
      no2: 86.977,
      co: 29.634,
      so2: 271.752,
      o3: 0.113,
      pm25: 37,
      ai_investment_score: 58.75,
      period: "2025-05-08",
      level: "city",
      aqi: 77,
      details: {
        region: "Sidoarjo",
        top_human_resource_skill: "Manufacturing",
        top_natural_resource: "Natural Gas",
        green_project: {
          name: "Biogas Production from Wetland Biomass",
          justification:
            "Leverages Sidoarjo's wetland ecosystems and natural gas resources. Wetlands Restoration provides biomass feedstock for biogas production which can be distributed using smart grids. Manufacturing skills can be applied to the construction and maintenance of biogas facilities and smart grids.",
          short_terms_jobs: [
            {
              title: "Wetland Restoration Technician",
              description:
                "Responsible for planting and maintaining wetland vegetation to maximize biomass production.",
            },
            {
              title: "Biogas Plant Construction Worker",
              description:
                "Involved in the physical construction of the biogas production plant.",
            },
            {
              title: "Smart Grid Installer",
              description:
                "Installs and configures smart grid infrastructure for biogas distribution.",
            },
          ],
          environmental_impact:
            "Reduces reliance on fossil fuels, mitigates methane emissions from wetlands, improves air quality (reduces NO2, CO, SO2 and PM25), and promotes biodiversity through wetland restoration. This project helps to decrease the AQI score.",
        },
      },
    });
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    fetchData();

    let fileName;

    citiesList.forEach((item) => {
      const keyName = Object.keys(item)[0];

      const res = item[keyName].some(
        (city) => city.toLowerCase() === regionName.toLowerCase()
      );

      if (res) {
        fileName = keyName;
      }
    });

    fetch(`/provinceTopo/${fileName}-simplified-topo.json`)
      .then((response) => response.json())
      .then((data) => {
        let features = formatTopoJSON(data, fileName);

        const filteredGeoJson = features.features.filter(
          (feature) =>
            feature.properties.kabkot.toLowerCase() === regionName.toLowerCase()
        );

        features["features"] = filteredGeoJson;

        setGeoJsonData(features);

        regionName = regionName == "Dki Jakarta" ? "Jakarta Raya" : regionName;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [regionName, location.search]);

  const investmentScore =
    data?.potential_score ?? data?.ai_investment_score ?? 0;

  const style = () => {
    return {
      fillColor: getScoreColor(investmentScore),
      weight: 4,
      opacity: 1,
      color: "#559795",
      dashArray: "1",
      fillOpacity: 0.7,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-3 py-4">
          <div className="flex items-center justify-center h-64">
            <p className="text-xl text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const getBoundingBox = (feature) => {
    let coords = [];
    if (feature.geometry.type === "Polygon") {
      coords = feature.geometry.coordinates[0];
    } else if (feature.geometry.type === "MultiPolygon") {
      feature.geometry.coordinates.forEach((polygon) => {
        coords = [...coords, ...polygon[0]];
      });
    }

    const lngs = coords.map((c) => c[0]);
    const lats = coords.map((c) => c[1]);

    return [
      Math.min(...lats),
      Math.min(...lngs),
      Math.max(...lats),
      Math.max(...lngs),
    ];
  };

  const findCentroid = () => {
    const regionFeature = geoJsonData.features.find(
      (feature) => feature.properties.kabkot === regionName
    );

    if (regionFeature && regionFeature.geometry) {
      const bbox = getBoundingBox(regionFeature);
      return [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2];
    }

    return [-2.5, 118];
  };

  const onEachFeature = (feature, layer) => {
    layer.bindTooltip(`${data.province}: ${investmentScore}`, {
      permanent: false,
    });
  };

  const center = findCentroid();

  console.log(geoJsonData);

  const handleCreateBond = () => {
    // Prepare the data to save to localStorage
    const locationData = {
      name: "",
      description: "",
      photos: [],
      carbon_absorbed: "",
      current_carbon_price: "",
      carbon_per_million: "",
      per_unit_price: "",
      location: `${
        data.province.charAt(0).toUpperCase() + data.province.slice(1)
      }`,
      roi: "",
      fund_required: "",
      fund_raised: "0",
      duration: "",
      province: data.province.toLowerCase(),
      starting_date: new Date().getFullYear(),
    };

    // Save to localStorage (this will replace any existing draft)
    localStorage.setItem("createGreenBondDraft", JSON.stringify(locationData));

    // Navigate to create green bond page
    navigate("/create-greenbond", {
      state: {
        location: locationData.location,
        province: locationData.province,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="w-full h-16"></div>
      <div className="max-w-7xl mx-auto px-3 py-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate("/potential-regions")}
            className="text-tertiary hover:underline mr-3"
          >
            &larr; Back to Potential Region
          </button>
          <button
            onClick={handleCreateBond}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            Create Bond
          </button>
        </div>
        <h1 className="text-2xl font-bold text-tertiary pb-4">
          {data.province.charAt(0).toUpperCase() + data.province.slice(1)}{" "}
          Investment Profile
          <span
            className={`ml-3 px-3 py-1 text-sm ${
              investmentScore > 35
                ? "bg-green-100 text-green-800"
                : investmentScore >= 30 && investmentScore <= 35
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            } rounded-full`}
          >
            Score: {investmentScore} ({getScoreRating(investmentScore)})
          </span>
        </h1>

        <div className="grid grid-cols-1  gap-4">
          <div className="lg:col-span-2">
            <div className="bg-white p-4 border border-gray-300/80 rounded-lg mb-4">
              <h2 className="text-lg font-medium text-tertiary mb-3">
                Map Overview
              </h2>
              <div className="h-96 w-full rounded-lg overflow-hidden">
                {geoJsonData && (
                  <MapContainer
                    center={center}
                    zoom={9}
                    style={{ width: "100%", height: "100%" }}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <GeoJSON
                      data={geoJsonData}
                      style={style}
                      onEachFeature={onEachFeature}
                    />
                  </MapContainer>
                )}
              </div>
            </div>

            {/* Here, change this */}
            <RegionTabs data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionDetail;
