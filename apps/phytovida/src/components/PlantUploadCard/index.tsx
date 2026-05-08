import React, { useRef } from "react";
import type { PlantUploadCardProps } from "./PlantUploadCard.types";
import LeafWatermark from "./icons/LeafWatermark";
import CameraIcon from "./icons/CameraIcon";

function UploadText({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center z-10">
      <h2
        className="text-3xl text-[#1a1a1a] mb-2"
        style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontWeight: 400,
        }}
      >
        {title}
      </h2>
      <p
        className="text-sm text-[#9aa09a] max-w-[260px] leading-relaxed"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        {subtitle}
      </p>
    </div>
  );
}

export default function PlantUploadCard({
  onUpload,
  title,
  subtitle,
  accept,
  className,
}: PlantUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    inputRef.current?.click();
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      e.target.value = "";
    }
  };
  return (
    <div
      className={`relative w-full  rounded-3xl overflow-hidden flex flex-col items-center justify-center py-16 px-8  ${className ?? ""}`}
      style={{ backgroundColor: "#eef0ed", minHeight: "380px" }}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      role="button"
      aria-label="Upload a plant photo"
      tabIndex={0}
    >
      {/* Leaf watermark background */}
      <LeafWatermark />
      {/*hidden file input*/}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
      {/* Camera button */}
      <CameraIcon />
      {/* Title and subtitle */}
      <UploadText
        title={title || "Upload a plant photo"}
        subtitle={
          subtitle ||
          "Take a photo of your plant and upload it to identify pests and diseases"
        }
      />
    </div>
  );
}
