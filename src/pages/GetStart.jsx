import Footer from "@/components/Footer";
import Destinations from "@/components/get-start/Destinations";
import Questionnaire from "@/components/get-start/Questionnaire";
import Summery from "@/components/get-start/Summery";
import Header from "@/components/Header";
import { useState } from "react";

const GetStart = () => {
  const [currentStep, setCurrentStep] = useState(1);
  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      {/* header */}
      <Header />

      {/* get start */}
      <section className="mt-20 w-full px-4 py-8 xl:container">
        {/* steps indicator */}
        <div className="mb-8 flex justify-center space-x-16">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`relative flex h-10 w-10 items-center justify-center rounded-full text-xl font-semibold ${i !== 3 && "after:absolute after:start-full after:h-1 after:w-16"} ${currentStep >= i ? "bg-sky-700 text-white" : "bg-gray-300"} ${currentStep >= i + 1 ? "after:bg-sky-700" : "after:bg-gray-300"}`}
            >
              {i}
            </div>
          ))}
        </div>

        <h1 className="mb-8 text-center text-2xl font-medium md:text-3xl">
          {currentStep === 1 && <span>Get Started</span>}
          {currentStep === 2 && <span>Destinations</span>}
          {currentStep === 3 && <span>Summery</span>}
        </h1>

        {/* questionnaire */}
        {currentStep === 1 && <Questionnaire setCurrentStep={setCurrentStep} />}
        {/* destinations */}
        {currentStep === 2 && <Destinations setCurrentStep={setCurrentStep} />}
        {/* summery */}
        {currentStep === 3 && <Summery setCurrentStep={setCurrentStep} />}
      </section>

      {/* flex grow for fill space */}
      <div className="flex-grow" />

      {/* footer */}
      <Footer />
    </div>
  );
};

export default GetStart;
