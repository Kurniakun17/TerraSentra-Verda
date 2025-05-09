import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import useGreenBondStore from "../../store/greenBondStore";

export default function FiscalIndexMap() {
  const { bondDetail } = useGreenBondStore();
  const [selectedYear, setSelectedYear] = useState(2018);
  const geoJsonLayerRef = useRef(null);

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

  const sidoarjoGeoJSON = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        id: "35-15",
        properties: {
          fiscalIndex: currentIndex,
          provinsi: "Jawa Timur",
          kabkot: "Sidoarjo",
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [112.83747045783952, -7.566362749464094],
              [112.83218626892925, -7.552628320229346],
              [112.81378271444866, -7.558943000337276],
              [112.8074052450742, -7.554838458267121],
              [112.7908238247006, -7.564468345431715],
              [112.78590406261172, -7.562573941399336],
              [112.76822936177393, -7.573782498590913],
              [112.75310564868592, -7.575361168617896],
              [112.74672817931146, -7.571572360553137],
              [112.73816414900861, -7.57315103058012],
              [112.7235870761527, -7.569677956520758],
              [112.71392976538566, -7.559258734342673],
              [112.706459015547, -7.54505070409983],
              [112.68277127215615, -7.548523778159192],
              [112.67038076022861, -7.560837404369655],
              [112.65270605939082, -7.548050177151096],
              [112.64669301683776, -7.537946688978408],
              [112.63175151716044, -7.533526412902857],
              [112.62045428569711, -7.519791983668108],
              [112.61407681632265, -7.515213840589858],
              [112.6044195055556, -7.502584480373998],
              [112.58018512193264, -7.489955120158137],
              [112.57799856100426, -7.483956174055603],
              [112.56305706132694, -7.475273488907199],
              [112.5382760374719, -7.470537478826251],
              [112.51240173315266, -7.467064404766889],
              [112.50547762354608, -7.462328394685942],
              [112.4872562824762, -7.4593289216346745],
              [112.46958158163841, -7.4459102264053225],
              [112.45664442947879, -7.446225960410719],
              [112.46302189885324, -7.43170219616248],
              [112.48342980085152, -7.417178431914239],
              [112.48288316061942, -7.410705884803611],
              [112.49363375185067, -7.409285081779327],
              [112.52369896461599, -7.4036018696821895],
              [112.53080528763324, -7.4062856087280595],
              [112.54793334823894, -7.404075470690284],
              [112.55230647009571, -7.4002866626255255],
              [112.56779461000512, -7.396971455568862],
              [112.5705278111656, -7.39176184447982],
              [112.59257563386018, -7.372344203147934],
              [112.61717444430452, -7.3663452570454],
              [112.63120487692835, -7.367450326064288],
              [112.64250210839168, -7.360819911950961],
              [112.6563503276048, -7.356715369880806],
              [112.66236337015786, -7.351347891789065],
              [112.67475388208538, -7.351347891789065],
              [112.69516178408367, -7.343612408656851],
              [112.70427245461862, -7.336824127540826],
              [112.71611632631404, -7.3398236005920925],
              [112.72577363708109, -7.348506285740497],
              [112.75365228891802, -7.342033738629868],
              [112.75474556938221, -7.336824127540826],
              [112.7897305442364, -7.343928142662247],
              [112.81323607421656, -7.346138280700023],
              [112.8256265861441, -7.3431388076487565],
              [112.8391103785358, -7.330193713427499],
              [112.84293686016049, -7.338402797567808],
              [112.8391103785358, -7.36366151799953],
              [112.83473725667903, -7.382447691320623],
              [112.83637717737533, -7.390656775460932],
              [112.83309733598274, -7.404864805703776],
              [112.83309733598274, -7.425387516054549],
              [112.83747045783952, -7.4727476168640266],
              [112.83473725667903, -7.476378557926087],
              [112.81870247653754, -7.473063350869423],
              [112.81268943398447, -7.478272961958465],
              [112.8228933849836, -7.4932703272148],
              [112.83163962869716, -7.50147941135511],
              [112.83747045783952, -7.511898633533195],
              [112.8578783598378, -7.519002648654617],
              [112.86425582921225, -7.518213313641126],
              [112.87245543269371, -7.535105082929839],
              [112.86644239014065, -7.548050177151096],
              [112.87245543269371, -7.552154719221251],
              [112.86808231083694, -7.569046488509965],
              [112.85951828053409, -7.576466237636783],
              [112.84658112837447, -7.575676902623291],
              [112.83747045783952, -7.566362749464094],
            ],
          ],
        },
      },
    ],
  };

  const geoJSONStyle = () => {
    return {
      fillColor: getColor(currentIndex),
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  };

  useEffect(() => {
    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.setStyle(geoJSONStyle);

      geoJsonLayerRef.current.eachLayer((layer) => {
        const tooltipContent = `
          <div class="p-2">
            <h3 class="font-bold">Sidoarjo</h3>
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
          <h3 class="font-bold">${feature.properties.name}</h3>
          <p>Fiscal Index: ${feature.properties.fiscalIndex.toFixed(2)}</p>
          <p>Year: ${feature.properties.year}</p>
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
        <MapContainer
          center={[-7.47, 112.75]}
          zoom={11}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <GeoJSON
            data={sidoarjoGeoJSON}
            style={geoJSONStyle}
            onEachFeature={onEachFeature}
            ref={geoJsonLayerRef}
          />
        </MapContainer>

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
