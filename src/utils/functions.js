import * as topoJson from "topojson-client";
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const getScoreRating = (score) => {
  if (score > 75) return "High";
  if (score >= 68 && score <= 75) return "Moderate";
  return "Low";
};

const getScoreColor = (score) => {
  if (score > 75) return "#34d399";     // Green
  if (score >= 68 && score <= 75) return "#fbbf24";  // Yellow
  return "#ef4444";                     // Red
};



const formatTopoJSON = (topoData, attribute) => {
  const convertedData = topoJson.feature(
    topoData,
    topoData.objects[attribute]
  );
  return convertedData;
};

function toTitleCase(str) {
  return str
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());
}


export {
  formatCurrency,
  getScoreRating,
  
  getScoreColor,
  
  formatTopoJSON,
  toTitleCase
};
