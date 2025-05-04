import { siteConfig } from "@/config";

const FAQ = () => {
  // Determine if we're in HEIC to JPG or JPG to HEIC mode
  const isHeicToJpg = siteConfig.defaultConversionMode === 'heicToJpg';

  return (
    <section className="my-12 bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
      
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {isHeicToJpg 
              ? "What is a HEIC file and why would I need to convert it?" 
              : "Why would I want to convert my JPG images to HEIC format?"}
          </h3>
          <p className="text-gray-600">
            {isHeicToJpg 
              ? "HEIC (High Efficiency Image Container) is Apple's newer image format that offers better compression while maintaining high quality. However, many websites, applications, and non-Apple devices don't support HEIC files, making conversion to JPG necessary for wider compatibility." 
              : "HEIC (High Efficiency Image Container) uses advanced compression to store high-quality images at about half the file size of JPG. Converting to HEIC saves storage space on compatible devices while preserving image quality. HEIC is natively supported on newer Apple devices."}
          </p>
        </div>
        
        <div className="border-b pb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {isHeicToJpg 
              ? "Is my privacy protected when using HEICFlip to convert images?" 
              : "Will my image quality be affected when converting between formats?"}
          </h3>
          <p className="text-gray-600">
            {isHeicToJpg 
              ? "Absolutely. HEICFlip processes all conversions directly in your browser using WebAssembly technology. Your images never leave your device or get uploaded to any server, ensuring complete privacy and security." 
              : "When converting from JPG to HEIC, there's usually minimal to no visible quality loss, and the file size is typically reduced by 40-50%. HEIC is designed to maintain high visual quality while using less storage space."}
          </p>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {isHeicToJpg 
              ? "Can I convert multiple HEIC files at once?" 
              : "Which devices and applications support HEIC files?"}
          </h3>
          <p className="text-gray-600">
            {isHeicToJpg 
              ? "Yes! HEICFlip supports batch conversion. Simply drag and drop multiple HEIC files into the converter, and they will all be processed at once, saving you time and effort." 
              : "HEIC files are natively supported on iOS 11+ devices, macOS High Sierra and later, and newer versions of Windows 10 (with HEIF Image Extensions installed). Some Android devices also support HEIC. For compatibility with older devices or software, converting HEIC to JPG may be necessary."}
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;