import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HowItWorks from "@/components/HowItWorks";
import TechnicalDetails from "@/components/TechnicalDetails";
import FAQ from "@/components/FAQ";
import { useEffect } from "react";
import DropConvertAutoDetect from "@/components/DropConvertAutoDetect";

export default function AutoDetectConverter() {
  // Dynamic SEO setup
  useEffect(() => {
    // Set document title 
    document.title = "FlipMyFile - Convert Any Format";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        "Convert between 48+ file formats with automatic format detection. Free, fast, secure conversion with complete privacy - no uploads required.");
    }
  }, []);

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      <div className="flex-grow">
        <Header />
        
        <main className="py-6 flex-grow">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                FlipMyFile - Multi-Format Converter
              </h1>
              <p className="mt-3 text-xl text-gray-500 sm:mt-4">
                Fast, free, and completely private - no files are uploaded to any server
              </p>
              <div className="mt-2 flex justify-center space-x-4">
                <a href="/" className="text-sm text-blue-500 hover:text-blue-700 underline">
                  HEIC to JPG
                </a>
                <a href="/experimental" className="text-sm text-blue-500 hover:text-blue-700 underline">
                  Multi-format converter
                </a>
                <a href="/ffmpeg-demo" className="text-sm text-blue-500 hover:text-blue-700 underline">
                  View format demo
                </a>
              </div>
            </div>

            <DropConvertAutoDetect />
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