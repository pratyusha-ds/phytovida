import { useState } from "react";
import PlantUploadCard from "@/components/PlantUploadCard";

export default function AskAi() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleUpload = async (uploadedFile: File) => {
    // 1. Show preview instantly
    setFile(uploadedFile);
    setPreview(URL.createObjectURL(uploadedFile));

    // 2. TODO : send image to the plants API and get diagnosis result
  };

  const handleReset = () => {
    setPreview(null);
    setFile(null);
    setResult(null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white-50 px-4">
      <h1 className="text-8xl font-normal text-gray-800 mb-2">Ask AI</h1>
      <p className="text-2xl text-gray-500 mb-8">Get help with your plants</p>

      
      {!preview && (
        <PlantUploadCard
          onUpload={handleUpload}
          title="Upload a photo"
          subtitle="Take a photo of your plant and upload it to identify pests and diseases"
          accept="image/*"
          className="max-w-5xl"
        />
      )}

      
      {preview && (
        <div className="flex flex-col items-center gap-6 w-full max-w-sm">
          {/* Image preview */}
          <div className="w-full rounded-3xl overflow-hidden">
            <img
              src={preview}
              alt={file?.name ?? "Uploaded plant"}
              className="w-full object-cover"
            />
          </div>

          
          {loading && (
            <p className="text-sm text-gray-500 animate-pulse">
              Analyzing your plant...
            </p>
          )}

          
          {result && !loading && (
            <div className="w-full bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Diagnosis
              </p>
              <p className="text-sm text-gray-600">{result}</p>
            </div>
          )}

          
          <button
            onClick={handleReset}
            className="text-sm text-gray-500 underline underline-offset-2"
          >
            Upload another photo
          </button>
        </div>
      )}
    </div>
  );
}
