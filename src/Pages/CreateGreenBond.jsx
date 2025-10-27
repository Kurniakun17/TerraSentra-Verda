import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Plus, X, CheckCircle } from "lucide-react";
import Navbar from "../components/LandingPage/Navbar";
import useGreenBondStore from "../store/greenBondStore";

const LOCALSTORAGE_KEY = "createGreenBondDraft";

const CreateGreenBond = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createBond, loading } = useGreenBondStore();

  // Get pre-filled location from navigation state
  const prefilledLocation = location.state?.location || "";
  const prefilledProvince = location.state?.province || "";

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    photos: [],
    carbon_absorbed: "",
    current_carbon_price: "",
    carbon_per_million: "",
    per_unit_price: "",
    location: prefilledLocation,
    roi: "",
    fund_required: "",
    fund_raised: "0",
    duration: "",
    province: prefilledProvince,
    starting_date: new Date().getFullYear(),
  });

  const [photoInput, setPhotoInput] = useState("");
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(LOCALSTORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        // Merge saved data with prefilled location if exists
        setFormData((prev) => ({
          ...parsed,
          location: prefilledLocation || parsed.location,
          province: prefilledProvince || parsed.province,
        }));
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    } else if (prefilledLocation) {
      setFormData((prev) => ({
        ...prev,
        location: prefilledLocation,
        province: prefilledProvince,
      }));
    }
  }, [prefilledLocation, prefilledProvince]);

  // Save to localStorage whenever formData changes
  useEffect(() => {
    // Only save if there's actual content
    if (
      formData.name ||
      formData.description ||
      formData.photos.length > 0 ||
      formData.carbon_absorbed
    ) {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(formData));
      setDraftSaved(true);

      // Hide the "Draft saved" indicator after 2 seconds
      const timer = setTimeout(() => {
        setDraftSaved(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddPhoto = () => {
    if (photoInput.trim() && formData.photos.length < 5) {
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, photoInput.trim()],
      }));
      setPhotoInput("");
    }
  };

  const handleRemovePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Project name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.photos.length === 0)
      newErrors.photos = "At least one photo URL is required";
    if (!formData.carbon_absorbed || formData.carbon_absorbed <= 0)
      newErrors.carbon_absorbed = "Carbon absorbed must be greater than 0";
    if (!formData.current_carbon_price || formData.current_carbon_price <= 0)
      newErrors.current_carbon_price = "Carbon price must be greater than 0";
    if (!formData.carbon_per_million || formData.carbon_per_million <= 0)
      newErrors.carbon_per_million =
        "Carbon per million must be greater than 0";
    if (!formData.per_unit_price || formData.per_unit_price <= 0)
      newErrors.per_unit_price = "Per unit price must be greater than 0";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.roi.trim()) newErrors.roi = "ROI is required";
    if (!formData.fund_required || formData.fund_required <= 0)
      newErrors.fund_required = "Fund required must be greater than 0";
    if (!formData.duration || formData.duration <= 0)
      newErrors.duration = "Duration must be greater than 0";
    if (!formData.province.trim()) newErrors.province = "Province is required";
    if (!formData.starting_date || formData.starting_date < 2020)
      newErrors.starting_date = "Valid starting date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus({
        type: "error",
        message: "Please fix the errors in the form",
      });
      return;
    }

    try {
      setSubmitStatus({ type: "", message: "" });
      setIsSubmitting(true);

      // Convert string numbers to appropriate types
      const payload = {
        ...formData,
        carbon_absorbed: Number(formData.carbon_absorbed),
        current_carbon_price: Number(formData.current_carbon_price),
        carbon_per_million: Number(formData.carbon_per_million),
        per_unit_price: Number(formData.per_unit_price),
        fund_required: Number(formData.fund_required),
        fund_raised: Number(formData.fund_raised),
        duration: Number(formData.duration),
        starting_date: Number(formData.starting_date),
      };

      await createBond(payload);

      // Clear localStorage after successful submission
      localStorage.removeItem(LOCALSTORAGE_KEY);

      setSubmitStatus({
        type: "success",
        message: "Green Bond submitted successfully!",
      });

      // Show verification modal
      setShowVerificationModal(true);
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      setSubmitStatus({
        type: "error",
        message: error.message || "Failed to create green bond",
      });
    }
  };

  const handleModalClose = () => {
    setShowVerificationModal(false);
    navigate("/greenbond-investment");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="w-full h-16"></div>

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Submission Successful!
              </h2>
              <p className="text-gray-600 mb-6">
                Your green bond has been submitted and is now pending
                verification by our admin team. You will be notified once it's
                approved and published on the marketplace.
              </p>
              <button
                onClick={handleModalClose}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
              >
                Go to Marketplace
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Create Green Bond
              </h1>
              <p className="mt-2 text-gray-600">
                Fill in the details to create a new green bond investment
                opportunity
              </p>
            </div>
            {draftSaved && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <CheckCircle className="w-4 h-4" />
                Draft saved
              </div>
            )}
          </div>
        </div>

        {/* Status Message */}
        {submitStatus.message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              submitStatus.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6"
        >
          {/* Project Basic Info */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Project Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., Agroforestry Project Subang"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Describe the green bond project..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Project Photos
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo URLs * (Max 5)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={photoInput}
                    onChange={(e) => setPhotoInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="https://example.com/photo.jpg"
                    disabled={formData.photos.length >= 5}
                  />
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    disabled={formData.photos.length >= 5}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {errors.photos && (
                  <p className="mt-1 text-sm text-red-600">{errors.photos}</p>
                )}
              </div>

              {/* Photo List */}
              {formData.photos.length > 0 && (
                <div className="space-y-2">
                  {formData.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                    >
                      <span className="text-sm text-gray-600 truncate flex-1">
                        {photo}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="ml-2 p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Carbon & Environmental Data */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Environmental Impact
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Carbon Absorbed (tons/year) *
                </label>
                <input
                  type="number"
                  name="carbon_absorbed"
                  value={formData.carbon_absorbed}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.carbon_absorbed
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="60000"
                />
                {errors.carbon_absorbed && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.carbon_absorbed}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Carbon Price (IDR) *
                </label>
                <input
                  type="number"
                  name="current_carbon_price"
                  value={formData.current_carbon_price}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.current_carbon_price
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="150000"
                />
                {errors.current_carbon_price && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.current_carbon_price}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Carbon per Million *
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="carbon_per_million"
                  value={formData.carbon_per_million}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.carbon_per_million
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="3.0"
                />
                {errors.carbon_per_million && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.carbon_per_million}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Per Unit Price (IDR) *
                </label>
                <input
                  type="number"
                  name="per_unit_price"
                  value={formData.per_unit_price}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.per_unit_price ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="95000"
                />
                {errors.per_unit_price && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.per_unit_price}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Location Data */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Location Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.location ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., Subang, Jawa Barat"
                  readOnly={!!prefilledLocation}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Province/City *
                </label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.province ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., subang"
                  readOnly={!!prefilledProvince}
                />
                {errors.province && (
                  <p className="mt-1 text-sm text-red-600">{errors.province}</p>
                )}
              </div>
            </div>
          </div>

          {/* Financial Data */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Financial Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ROI (%) *
                </label>
                <input
                  type="text"
                  name="roi"
                  value={formData.roi}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.roi ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., 11-14%"
                />
                {errors.roi && (
                  <p className="mt-1 text-sm text-red-600">{errors.roi}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fund Required (IDR) *
                </label>
                <input
                  type="number"
                  name="fund_required"
                  value={formData.fund_required}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.fund_required ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="4500000000"
                />
                {errors.fund_required && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.fund_required}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fund Raised (IDR)
                </label>
                <input
                  type="number"
                  name="fund_raised"
                  value={formData.fund_raised}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (months) *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.duration ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="30"
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Starting Year *
                </label>
                <input
                  type="number"
                  name="starting_date"
                  value={formData.starting_date}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.starting_date ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="2025"
                />
                {errors.starting_date && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.starting_date}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Create Green Bond"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGreenBond;
