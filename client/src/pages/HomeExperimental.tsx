import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HowItWorks from "@/components/HowItWorks";
import DropConvertExperimental from "@/components/DropConvertExperimental";
import TechnicalDetails from "@/components/TechnicalDetails";
import FAQ from "@/components/FAQ";
import { siteConfig } from "@/config";
import { useEffect } from "react";

export default function HomeExperimental() {
  // Dynamic SEO setup based on the current conversion mode
  useEffect(() => {
    // Set document title for multi-format conversion
    document.title = "FormatFlip - Convert Between Multiple Image Formats";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        "Convert between multiple image formats including HEIC, JPG, PNG and more. Fast, free, secure conversion with privacy protection.");
    }
  }, []);

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      <div className="flex-grow">
        <Header />
        
        <main className="py-6 flex-grow">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                FormatFlip - Fast & Private Conversion
              </h1>
              <p className="mt-3 text-xl text-gray-500 sm:mt-4">
                Fast, free, and completely private - all processing happens in your browser
              </p>
              <div className="mt-2 py-2 px-4 bg-yellow-100 border border-yellow-300 rounded-md inline-block">
                <p className="text-sm text-yellow-800 font-medium">INTERNAL TESTING PAGE - NOT FOR PUBLIC USE</p>
              </div>
              <div className="mt-2 flex justify-center space-x-4">
                <a href="/" className="text-sm text-blue-500 hover:text-blue-700 underline">
                  Return to standard converter
                </a>
                <a href="/ffmpeg-demo" className="text-sm text-blue-500 hover:text-blue-700 underline">
                  View format demo
                </a>
              </div>
            </div>

            <DropConvertExperimental />
            <HowItWorks />
            <TechnicalDetails />
            <FAQ />
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
