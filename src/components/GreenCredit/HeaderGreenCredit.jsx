import React, { useState } from "react";
import { formatCurrency } from "../../utils/functions";
import useGreenCreditStore from "../../store/greenCreditStore";
import { ArrowLeft, ArrowRight, Clock, MapPin, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function HeaderGreenCredit() {
  const { creditDetail } = useGreenCreditStore();
  const [showPurchaseOverlay, setShowPurchaseOverlay] = useState(false);
  const [purchaseUnits, setPurchaseUnits] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");

  const remainingFund = creditDetail.fund_required - creditDetail.fund_raised;
  const maxPurchaseUnits = Math.floor(
    remainingFund / creditDetail.per_unit_price
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  const percentage =
    Math.floor((creditDetail.fund_raised / creditDetail.fund_required) * 100) +
    "%";

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === creditDetail.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? creditDetail.images.length - 1 : prev - 1
    );
  };

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
      `Berhasil membeli ${purchaseUnits} unit Green Credit ${creditDetail.name}`
    );

    setShowPurchaseOverlay(false);
    setPurchaseUnits(1);
    setErrorMessage("");
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
      <div className="md:col-span-7 bg-white rounded-lg overflow-hidden shadow-sm relative">
        <div className="relative h-64 md:h-96">
          <img
            // src={creditDetailData.images[currentSlide]}
            src={creditDetail.images[currentSlide]}
            alt={`${creditDetail.name} - Image ${currentSlide + 1}`}
            className="w-full h-full object-cover"
          />
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white"
          >
            <ArrowRight className="w-5 h-5 text-gray-700" />
          </button>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
            {creditDetail.images.map((_, index) => (
              <span
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentSlide ? "bg-teal-700" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="md:col-span-5">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {creditDetail.name}
          </h1>

          <div className="flex items-center gap-3">
            <div className="flex items-center mt-2 text-gray-600">
              <MapPin className="w-5 h-5 mr-1" />
              <span>{creditDetail.location}</span>
            </div>

            <div className="h-5 mt-2 w-0.5 bg-gray-300"></div>

            <div className="flex items-center mt-2 text-gray-600">
              <Clock className="w-5 h-5 mr-1" />
              <span>{(creditDetail.duration / 12).toFixed(1)} years</span>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500">Funding Progress</p>
            <div className="mt-1 w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-teal-700 h-4 rounded-full"
                style={{ width: `${creditDetail.fund_percent}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-sm font-medium text-teal-700">
                {percentage} funded
              </span>
              <span className="text-sm text-gray-500">
                {formatCurrency(creditDetail.fund_raised)} /{" "}
                {formatCurrency(creditDetail.fund_required)}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowPurchaseOverlay(true);
              }}
              type="button"
              className="w-full py-3 bg-teal-700 text-white font-medium rounded-md hover:bg-teal-800 transition"
            >
              Fund Now!
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button className="py-2 border border-teal-700 text-teal-700 rounded-md hover:bg-teal-50 transition">
              Share
            </button>
            <button className="py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition">
              Save
            </button>
          </div>
        </div>
      </div>

      {showPurchaseOverlay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Beli Green Credit
              </h2>
              <button
                onClick={() => setShowPurchaseOverlay(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">
                {creditDetail.name}
              </h3>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Harga per Unit:</span>
                <span className="font-medium">
                  {formatCurrency(creditDetail.per_unit_price)}
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
                    {formatCurrency(
                      purchaseUnits * creditDetail.per_unit_price
                    )}
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
