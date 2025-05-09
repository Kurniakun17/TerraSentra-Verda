import React, { useEffect, useState } from "react";
import { ChevronRight, Users, TrendingUp, Loader } from "lucide-react";
import Navbar from "../components/LandingPage/Navbar";
import { Link, useParams } from "react-router-dom";
import useGreenCreditStore from "../store/greenCreditStore";
import { formatCurrency } from "../utils/functions";
import Footer from "../components/LandingPage/Footer";
import OrderBook from "../components/GreenBond/OrderBook";
import ROIDivident from "../components/GreenCredit/ROIDivident";

import MarketingPlan from "../components/GreenCredit/MarketingPlan";
import AboutGreenCredit from "../components/GreenCredit/AboutGreenCredit";
import HeaderGreenCredit from "../components/GreenCredit/HeaderGreenCredit";
import ProductsGreenCredit from "../components/GreenCredit/ProductsGreenCredit";

const profile = [
  "https://imgcdn.stablediffusionweb.com/2024/11/19/75070baf-bd60-4397-9ccb-45e92f2d140e.jpg",
  "https://i.pinimg.com/736x/2d/b8/2b/2db82bb5de02aa843196cfed8f5d8ef8.jpg",
  "https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://media.easy-peasy.ai/5cc1cd32-7264-46f2-9c9b-29c43a27ca7f/5ca41072-586d-4856-8a85-4df027278c06.png",
];

const GreenCreditDetail = () => {
  const { fetchCredits, creditDetail } = useGreenCreditStore();
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchCredits(id);
      } catch (error) {
        console.error("Error fetching credit details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <Loader />
        </div>
      </div>
    );
  }

  const calculateROI = (amount) => {
    const investmentAmount = amount || 1000000;
    const monthlyReturn = (investmentAmount * (creditDetail.roi / 100)) / 12;
    const annualReturn = investmentAmount * (creditDetail.roi / 100);
    const totalReturn = annualReturn * 3;

    return {
      monthly: formatCurrency(monthlyReturn),
      annual: formatCurrency(annualReturn),
      total: formatCurrency(totalReturn),
      bep: Math.ceil(investmentAmount / monthlyReturn),
    };
  };

  const roiMetrics = calculateROI(1000000);

  const handleProductSelect = (product) => {
    setSelectedProduct(product === selectedProduct ? null : product);
  };

  console.log(creditDetail);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto p-4 pt-20 ">
        <div className="mb-4 flex items-center text-sm text-gray-500">
          <span>Home</span>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link to="/greencredit-marketplace">
            <span>Green Credit</span>
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-teal-700">{creditDetail.name}</span>
        </div>
        <HeaderGreenCredit />
        <AboutGreenCredit />
        <ProductsGreenCredit />

        <div className="bg-gradient-to-r from-teal-700 to-teal-500 rounded-lg shadow-md p-6 mb-8 text-white">
          <div className="flex items-center mb-3">
            <TrendingUp className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-medium">Investation Insights</h2>
          </div>
          <p className="text-lg mb-4">{creditDetail.insights}</p>
          <div className="bg-white/20 p-4 rounded-lg">
            <p className="text-lg">
              Dividen projection that you will get{" "}
              <span className="font-bold text-xl">{roiMetrics.total}</span> in 3
              Years.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
          <ROIDivident />

          <MarketingPlan />
        </div>
        <OrderBook data={creditDetail.order_book} />
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center mb-4">
            <Users className="w-5 h-5 text-teal-700 mr-2" />
            <h2 className="text-lg font-medium">Owner</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <img
                src={profile[creditDetail.id-1]}
                
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium">{creditDetail.owner}</h3>
                <p className="text-sm text-gray-500">Owner</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GreenCreditDetail;
