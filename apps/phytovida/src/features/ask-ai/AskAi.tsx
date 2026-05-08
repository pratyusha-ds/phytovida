import PlantUploadCard from "@/components/PlantUploadCard";
import { PageHeader } from "./components/PageHeader";
import { ResultSection } from "./components/ResultSection";
import { useAskAi } from "./hooks/useAskai";

export default function AskAi() {
  const {
    preview,
    file,
    diagnosis,
    loading,
    error,
    handleUpload,
    handleReset,
  } = useAskAi();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <PageHeader />

      {!preview ? (
        <PlantUploadCard
          onUpload={handleUpload}
          title="Upload a photo"
          subtitle="Take a photo of your plant and upload it to identify pests and diseases"
          accept="image/*"
          className="max-w-5xl"
        />
      ) : (
        <ResultSection
          preview={preview}
          fileName={file?.name}
          loading={loading}
          error={error}
          diagnosis={diagnosis}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
