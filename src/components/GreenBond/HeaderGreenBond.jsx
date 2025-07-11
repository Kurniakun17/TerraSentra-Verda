import { ChevronLeft, ChevronRight, Clock, MapPin, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import useGreenBondStore from "../../store/greenBondStore";
import { formatCurrency } from "../../utils/functions";
import toast, { Toaster } from "react-hot-toast";

const detailImages = {
  1: [
    "https://cdn.prod.website-files.com/66b08e9ac816df76ceba1aab/66b08e9ac816df76ceba1dfe_article-facts-reforestation-prestataire.webp",
    "https://www.green.earth/hubfs/080824_Reforestation-projects-around-the-world-success-stories-and-lessons-learnedVisual_Featured.png",
    "https://www.volunteerforever.com/wp-content/uploads/2024/05/iStock-1156208490-e1716213324241.jpg",
  ],
  2: [
    "https://www.montereyboats.com/zupload/library/255/-601-960x4000-0.jpg?ztv=20141215115108",
    "https://www.birdlife.org/wp-content/uploads/2024/07/shutterstock_2239716803.jpg",
    "https://floridabirdingtrail.com/wp-content/uploads/2015/12/mangrove-swamp.jpg",
  ],
  3: [
    "https://joca-cable.com/wp-content/uploads/2024/07/%E6%9C%AA%E5%91%BD%E5%90%8D%E7%9A%84%E8%AE%BE%E8%AE%A1-72-1.png",
    "https://www.sepco-solarlighting.com/hs-fs/hubfs/Blog_Pics/Solar_on_Roof.jpeg?width=600&name=Solar_on_Roof.jpeg",
    "https://qmerit.com/wp-content/uploads/2024/03/Making-Solar-Work-for-You-Understanding-How-Solar-Panels-Work-on-a-House-thumbnail.jpg",
  ],
};

export default function HeaderGreenBond() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [showPurchaseOverlay, setShowPurchaseOverlay] = useState(false);
  const [purchaseUnits, setPurchaseUnits] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const { bondDetail } = useGreenBondStore();

  const handleSlideChange = (index) => {
    setActiveSlide(index);
  };

  const percentage =
    Math.floor((bondDetail.fundraised / bondDetail.fundrequired) * 100) + "%";

  const handlePrevSlide = () => {
    setActiveSlide(
      activeSlide === 0 ? bondDetail.photos.length - 1 : activeSlide - 1
    );
  };

  const handleNextSlide = () => {
    setActiveSlide(
      activeSlide === bondDetail.photos.length - 1 ? 0 : activeSlide + 1
    );
  };

  const remainingFund = bondDetail.fundrequired - bondDetail.fundraised;
  const maxPurchaseUnits = Math.floor(
    remainingFund / bondDetail.per_unit_price
  );

  const handlePurchaseChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setPurchaseUnits(value);

    if (value <= 0) {
      setErrorMessage("Jumlah unit harus lebih dari 0");
    } else if (value > maxPurchaseUnits) {
      setErrorMessage(`Maksimum pembelian adalah ${maxPurchaseUnits} unit`);
    } else {
      setErrorMessage("");
    }
  };

  const handlePurchaseSubmit = () => {
    if (purchaseUnits <= 0 || purchaseUnits > maxPurchaseUnits) {
      return;
    }

    toast.success(
      `Berhasil membeli ${purchaseUnits} unit Green Bond ${bondDetail.name}`
    );

    setShowPurchaseOverlay(false);
    setPurchaseUnits(1);
    setErrorMessage("");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 relative">
      <h1 className="text-3xl font-bold text-gray-800">{bondDetail?.name}</h1>
      <div className="flex items-center gap-3">
        <div className="flex items-center mt-2 text-gray-600">
          <MapPin className="w-5 h-5 mr-1" />
          <span>{bondDetail.location}</span>
        </div>

        <div className="h-5 mt-2 w-0.5 bg-gray-300"></div>

        <div className="flex items-center mt-2 text-gray-600">
          <Clock className="w-5 h-5 mr-1" />
          <span>{(bondDetail.duration / 12).toFixed(1)} years</span>
        </div>
      </div>

      <div className="mt-6 relative">
        <div className="rounded-lg overflow-hidden">
          <img
            src={detailImages[bondDetail.id][activeSlide]}
            alt={`Project image ${activeSlide + 1}`}
            className="w-full h-96 object-cover"
          />
        </div>

        <button
          onClick={handlePrevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full shadow-md"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        <button
          onClick={handleNextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full shadow-md"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>

        <div className="flex justify-center mt-4">
          {bondDetail.photos.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={`mx-1 w-3 h-3 rounded-full ${
                activeSlide === index ? "bg-primary" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="w-full md:w-2/4 pr-4">
          <p className="text-lg font-medium text-gray-700 mb-2">
            Funding Status
          </p>
          <div className="w-full bg-gray-200 rounded-full h-5">
            <div
              className="bg-primary h-5 rounded-full"
              style={{
                width: percentage,
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-gray-600">
              {formatCurrency(bondDetail.fundraised)}
            </span>
            <span className="text-primary font-bold">
              {percentage} of {formatCurrency(bondDetail.fundrequired)}
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setShowPurchaseOverlay(true)}
            className="w-full md:w-auto mt-4 md:mt-0 bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-md transition duration-300"
          >
            Fund Now
          </button>
        </div>
      </div>

      {showPurchaseOverlay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Beli Green Bond
              </h2>
              <button
                onClick={() => setShowPurchaseOverlay(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{bondDetail.name}</h3>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Harga per Unit:</span>
                <span className="font-medium">
                  {formatCurrency(bondDetail.per_unit_price)}
                </span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Sisa yang tersedia:</span>
                <span className="font-medium">
                  {formatCurrency(remainingFund)} ({maxPurchaseUnits} unit)
                </span>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Jumlah Unit
                </label>
                <input
                  type="number"
                  min="1"
                  max={maxPurchaseUnits}
                  value={purchaseUnits}
                  onChange={handlePurchaseChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errorMessage && (
                  <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Jumlah Unit:</span>
                  <span className="font-medium">{purchaseUnits}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-700 font-semibold">
                    Total Pembayaran:
                  </span>
                  <span className="text-primary font-bold text-xl">
                    {formatCurrency(purchaseUnits * bondDetail.per_unit_price)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPurchaseOverlay(false)}
                className="w-1/2 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handlePurchaseSubmit}
                disabled={
                  purchaseUnits <= 0 || purchaseUnits > maxPurchaseUnits
                }
                className={`w-1/2 py-3 px-4 rounded-lg font-medium text-white ${
                  purchaseUnits <= 0 || purchaseUnits > maxPurchaseUnits
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                Konfirmasi Pembelian
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
}
