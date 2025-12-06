import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import useGreenBondStore from "../../store/greenBondStore";
import { formatTopoJSON } from "../../utils/functions";
import { citiesList } from "../../constant/type";

export default function FiscalIndexMap() {
  const { bondDetail } = useGreenBondStore();
  const [selectedYear, setSelectedYear] = useState(2018);
  const geoJsonLayerRef = useRef(null);
  const [geoJsonData, setGeoJsonData] = useState(null);

  const fiscalIndexData = {
    2018: 0.52,
    2019: 0.58,
    2020: 0.63,
    2021: 0.69,
    2022: 0.74,
    2023: 0.79,
    2024: 0.85,
    2025: 0.89,
  };

  const getColor = (index) => {
    if (index < 0.6) return "#f03b20";
    if (index < 0.7) return "#feb24c";
    if (index < 0.8) return "#ffeda0";
    return "#31a354";
  };

  const currentIndex = fiscalIndexData[selectedYear];

  const cityName = (bondDetail?.city || bondDetail?.location || "").toLowerCase();
  

  const findProvinceFile = () => {
    let fileName = null;
    citiesList.forEach((item) => {
      const keyName = Object.keys(item)[0];
      const res = item[keyName].some((city) => city.toLowerCase() === cityName);
      if (res) fileName = keyName;
    });
    return fileName;
  };

  useEffect(() => {
    if (!cityName) return;
    const fileName = findProvinceFile();
    if (!fileName) return;

    fetch(`/provinceTopo/${fileName}-simplified-topo.json`)
      .then((response) => response.json())
      .then((data) => {
        let features = formatTopoJSON(data, fileName);
        const filtered = features.features.filter(
          (feature) =>
            feature.properties.kabkot.toLowerCase() === cityName
        );
        if (filtered.length === 0) {
          setGeoJsonData(features);
        } else {
          features["features"] = filtered.map((feature) => ({
            ...feature,
            properties: {
              ...feature.properties,
              fiscalIndex: currentIndex,
              year: selectedYear,
              name: bondDetail?.name || feature.properties.kabkot,
            },
          }));
          setGeoJsonData(features);
        }
      })
      .catch((err) => {
        console.error("Failed to load topo:", err);
        setGeoJsonData(null);
      });
  }, [cityName, selectedYear, currentIndex, bondDetail]);

  const geoJSONStyle = () => {
    return {
      fillColor: getColor(currentIndex),
      weight: 2,
      opacity: 1,
      color: "#559795",
      dashArray: "1",
      fillOpacity: 0.7,
    };
  };

  useEffect(() => {
    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.setStyle(geoJSONStyle);

      geoJsonLayerRef.current.eachLayer((layer) => {
        const tooltipContent = `
          <div class="p-2">
            <h3 class="font-bold">${bondDetail?.location || "Green Bond Region"}</h3>
            <p>Fiscal Index: ${currentIndex.toFixed(2)}</p>
            <p>Year: ${selectedYear}</p>
          </div>
        `;
        if (layer.getTooltip()) {
          layer.setTooltipContent(tooltipContent);
        } else {
          layer.bindTooltip(tooltipContent, {
            permanent: true,
            direction: "center",
          });
        }
      });
    }
  }, [selectedYear, currentIndex]);

  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      layer.bindTooltip(
        `
        <div class="p-2">
          <h3 class="font-bold">${feature.properties.name || feature.properties.kabkot}</h3>
          <p>${bondDetail?.location || feature.properties.kabkot || ""}</p>
          <p>Fiscal Index: ${currentIndex.toFixed(2)}</p>
          <p>Year: ${selectedYear}</p>
        </div>
      `,
        { permanent: true, direction: "center" }
      );
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-white border border-gray-200 mx-auto mb-4">
      <h1 className="text-2xl font-bold text-gray-800">
        Fiscal Index Map - {bondDetail.location}
      </h1>

      <div className="relative w-full h-96 rounded-lg overflow-hidden border border-gray-200">
        {geoJsonData && (
          <MapContainer
            center={findCentroid()}
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
              style={geoJSONStyle}
              onEachFeature={onEachFeature}
              ref={geoJsonLayerRef}
            />
          </MapContainer>
        )}

        <div className="absolute top-3 right-3 bg-white p-3 rounded-md z-overlay">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">Fiscal Index</div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <div className="text-xs ml-1">Low</div>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
              <div className="text-xs ml-1">Medium</div>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <div className="text-xs ml-1">High</div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-lg">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>2018</span>
          <span>2025</span>
        </div>
        <input
          type="range"
          min={2018}
          max={2025}
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="mt-2 text-center">
          <span className="font-medium text-lg">Year: {selectedYear}</span>
          <div className="text-sm text-gray-600">
            Fiscal Index:{" "}
            <span className="font-medium">{currentIndex.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
