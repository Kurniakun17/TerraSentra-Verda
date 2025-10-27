import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import Navbar from "../components/LandingPage/Navbar";
import "leaflet/dist/leaflet.css";
import { formatTopoJSON, getScoreColor, toTitleCase } from "../utils/functions";
import usePotentialRegion from "../store/potentialRegionStore";
import { ChevronRight, Loader, Plus } from "lucide-react";

const PotentialRegion = ({ geoJsonData }) => {
  const navigate = useNavigate();
  const {
    regions,
    fetchProvinceCity,
    fetchAllProvince,
    provinces,
    fetchTopFive,
  } = usePotentialRegion();
  const mapRef = useRef(null);
  const [cityGeoJsonData, setCityGeoJsonData] = useState(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isClickedDetail, setIsClickedDetail] = useState({
    province: "",
    state: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchTopFive();
        await fetchAllProvince();
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isClickedDetail.state) {
          setMapLoading(true);
          await fetchProvinceCity(isClickedDetail.province);
          setMapLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMapLoading(false);
      }
    };

    fetchData();
  }, [isClickedDetail]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <Loader />
        </div>
      </div>
    );
  }

  const onEachFeature = (feature, layer) => {
    const provinceName = feature.properties.provinsi;

    const formattedProvinceName = provinceName.toLowerCase().replace(" ", "-");
    const fileName = formattedProvinceName + "-simplified-topo.json";

    let regionData = provinces.find(
      (region) => region.province.toLowerCase() === provinceName.toLowerCase()
    );

    const score = regionData?.ai_investment_score || 50;
    console.log(score);
    layer.on({
      mouseover: () => {
        layer.setStyle({
          fillOpacity: 1,
          fillColor: getScoreColor(score),
        });
      },
      mouseout: () => {
        layer.setStyle({
          fillOpacity: 0.9,
          fillColor: getScoreColor(score),
        });
      },
      click: () => {
        const map = mapRef.current;
        if (map) {
          map.setView(layer.getBounds().getCenter(), 7);
          setIsClickedDetail((prev) => ({
            province: provinceName,
            state: !prev.state,
          }));

          setTimeout(() => {
            fetch("/provinceTopo/" + fileName)
              .then((response) => response.json())
              .then((data) => {
                setCityGeoJsonData(formatTopoJSON(data, formattedProvinceName));
              });
          }, 250);
        }
      },
    });

    layer.bindTooltip(`${provinceName}`, { permanent: false });
  };

  const onEachCityFeature = (feature, layer) => {
    const cityName = feature.properties.kabkot;

    const regionData = regions.find(
      (region) => region.province.toLowerCase() === cityName.toLowerCase()
    );

    const score = regionData?.ai_investment_score || 50;

    layer.on({
      mouseover: () => {
        layer.setStyle({
          fillOpacity: 1,
          fillColor: getScoreColor(score),
        });
      },
      mouseout: () => {
        layer.setStyle({
          fillOpacity: 0.9,
          fillColor: getScoreColor(score),
        });
      },
      click: () => {
        if (cityName === "Jakarta Raya") {
          navigate(`/potential-region/${"Dki Jakarta"}`);
        } else {
          navigate(`/potential-region/${cityName}`);
        }
      },
    });

    layer.bindTooltip(`${cityName}: ${score}`, { permanent: false });
  };

  const style = (feature) => {
    const provinceName = feature.properties.provinsi;

    let regionData = provinces.find(
      (region) => region.province.toLowerCase() === provinceName.toLowerCase()
    );

    const score = regionData?.ai_investment_score || 50;

    return {
      fillColor: getScoreColor(score),
      weight: 2,
      opacity: 1,
      color: "#407487",
      dashArray: "1",
      fillOpacity: 0.9,
    };
  };

  const cityStyle = (feature) => {
    const provinceName = feature.properties.kabkot;

    const regionData = regions.find(
      (region) => region.province.toLowerCase() === provinceName.toLowerCase()
    );

    const score = regionData?.ai_investment_score || 50;

    return {
      fillColor: getScoreColor(score),
      weight: 2,
      opacity: 1,
      color: "#407487",
      dashArray: "1",
      fillOpacity: 0.9,
    };
  };

  const getTopRegions = () => {
    return regions
      .map((region) => ({
        name: region.province,
        score: region.ai_investment_score || 50,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  };

  const onTapMapBack = () => {
    setCityGeoJsonData(null);
    setIsClickedDetail((prev) => ({
      ...prev,
      state: false,
    }));
    const map = mapRef.current;
    if (map) {
      map.setView([-2.5, 118], 5);
    }
  };

  const topRegions = getTopRegions();

  const handleCreateBond = () => {
    if (isClickedDetail.state && isClickedDetail.province) {
      // Navigate with pre-filled location
      navigate("/create-greenbond", {
        state: {
          location: `${isClickedDetail.province}`,
          province: isClickedDetail.province.toLowerCase(),
        },
      });
    } else {
      // Navigate without pre-filled location
      navigate("/create-greenbond");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="w-full h-16"></div>
      <div className="max-w-8xl mx-auto px-3 py-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-tertiary">Potential Region</h1>
          <button
            onClick={handleCreateBond}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            Create Bond
          </button>
        </div>
        <div className="flex gap-2">
          <div className="bg-white w-full p-4 border border-gray-300/80 rounded-lg mb-4">
            <h2 className="text-lg font-medium text-tertiary mb-3">
              AI Potential Score Ranking
            </h2>

            <div className="flex flex-col gap-2">
              {topRegions.map((region, index) => (
                <div
                  key={region.name}
                  className="bg-tertiary-light text-sm flex p-2 border border-green-200 rounded-lg justify-between cursor-pointer hover:bg-green-200 transition-colors"
                  onClick={() => navigate(`/potential-region/${region.name}`)}
                  style={{
                    borderLeftWidth: "4px",
                    borderLeftColor: getScoreColor(region.score),
                  }}
                >
                  <p>
                    {index + 1}. {toTitleCase(region.name)}
                  </p>
                  <div className="flex items-center">
                    <span
                      className="inline-block w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: getScoreColor(region.score) }}
                    ></span>
                    <p>{region.score}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 border border-gray-300/80 rounded-lg">
          <h2 className="text-lg font-medium text-tertiary mb-3">
            Green Project Potential Map
          </h2>
          <div className="mb-4 flex items-center text-sm text-gray-500">
            <button
              onClick={onTapMapBack}
              className="flex items-center px-3 py-1 bg-green-400 text-white rounded-full font-bold"
            >
              <span>Indonesia</span>
            </button>

            <ChevronRight className="w-4 h-4 mx-1" />

            <span
              className={`${
                isClickedDetail.state ? "text-green-500" : "text-gray-500"
              } font-bold`}
            >
              {isClickedDetail.state
                ? isClickedDetail.province
                : "Pilih Provinsi"}
            </span>

            <span className="text-teal-700"></span>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            {isClickedDetail.state
              ? `This map shows AI investment potential in ${isClickedDetail.province} based on available data. Click on a city to see more details.`
              : `This map shows AI investment potential in Indonesia based on
            available data. Click on a province to see more details.`}
          </p>

          <div className={`h-96 relative w-full `}>
            {geoJsonData ? (
              <MapContainer
                center={[-2.5, 118]}
                zoom={isClickedDetail.state ? 7 : 5}
                style={{ width: "100%", height: "100%" }}
                scrollWheelZoom={true}
                className={`rounded-lg relative ${mapLoading ? "hidden" : ""}`}
                ref={mapRef}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {!isClickedDetail.state && (
                  <GeoJSON
                    data={geoJsonData}
                    style={style}
                    onEachFeature={onEachFeature}
                  />
                )}
                {mapLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader className="animate-spin" />
                  </div>
                )}
                {isClickedDetail.state && cityGeoJsonData && !mapLoading && (
                  <GeoJSON
                    data={cityGeoJsonData}
                    style={cityStyle}
                    onEachFeature={onEachCityFeature}
                  />
                )}
              </MapContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <p className="text-gray-500">Memuat peta...</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 mr-2"></div>
              <span className="text-sm">Low ({"<68"})</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-400 mr-2"></div>
              <span className="text-sm">Medium ({"68-75"})</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-emerald-400 mr-2"></div>
              <span className="text-sm">High ({">75"})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PotentialRegion;
