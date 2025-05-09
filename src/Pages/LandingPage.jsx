import React from "react";
import Navbar from "../components/LandingPage/Navbar";
import Hero from "../components/LandingPage/Hero";
import ProblemStatement from "../components/LandingPage/ProblemStatement";
import KeyFeatures from "../components/LandingPage/KeyFeatures";
import Goals from "../components/LandingPage/Goals";
import Impacts from "../components/LandingPage/Impacts";
import CTA from "../components/LandingPage/CTA";
import Tech from "../components/LandingPage/Tech";
import Footer from "../components/LandingPage/Footer";
import AvailableGreenbonds from "../components/LandingPage/AvailableGreenbonds";
import AvailableGreenCredit from "../components/LandingPage/AvailableGreenCredit";
import HowWorks from "../components/LandingPage/HowWorks";
import { useEffect } from "react";
import useGreenCreditStore from "../store/greenCreditStore";
import useGreenBondStore from "../store/greenBondStore";
import { Loader } from "lucide-react";

const LandingPage = () => {
  const { fetchFeaturedCredits, loading: loadingGreenCredit } =
    useGreenCreditStore();
  const { fetchFeaturedBonds, loading: loadingGreenBond } = useGreenBondStore();

  useEffect(() => {
    fetchFeaturedCredits();
    fetchFeaturedBonds({amount: 0});
  }, []);

  if (loadingGreenBond || loadingGreenCredit) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navbar />

      <Hero />
      <Impacts />
      <ProblemStatement />

      <KeyFeatures />
      <AvailableGreenbonds />
      <AvailableGreenCredit />
      <Goals />
      <HowWorks />

      <CTA />
      <Tech />

      <Footer />
    </div>
  );
};

export default LandingPage;
