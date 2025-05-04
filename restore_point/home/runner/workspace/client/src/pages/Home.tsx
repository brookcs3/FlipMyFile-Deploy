import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HowItWorks from "@/components/HowItWorks";
import DropConvert from "@/components/DropConvert";
import TechnicalDetails from "@/components/TechnicalDetails";
import FAQ from "@/components/FAQ";
import { siteConfig } from "@/config";
import { useEffect } from "react";

export default function Home() {
  // Dynamic SEO setup based on the current conversion mode
  useEffect(() => {
    // Determine title and meta description based on conversion mode
    let title, description;
    
    if (siteConfig.defaultConversionMode === 'heicToJpg') {
      title = "Free HEIC to JPG Converter - Instant Online Conversion";
      description = "Convert HEIC images to JPG format instantly online with HEICFlip. Fast, free, secure HEIC to JPG converter. No signup required.";
    } else {
      title = "Free JPG to HEIC Converter - Instant Online Conversion";
      description = "Convert JPG images to HEIC format instantly online with HEICFlip. Fast, free, secure JPG to HEIC converter. No signup required.";
    }
    
    // Set the document title
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
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
                {siteConfig.defaultConversionMode === 'heicToJpg' 
                  ? 'Convert HEIC to JPG'
                  : 'Convert JPG to HEIC'
                }
              </h1>
              <p className="mt-3 text-xl text-gray-500 sm:mt-4">
                Fast, free, and completely private - no files are uploaded to any server
              </p>
            </div>

            <DropConvert />
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
