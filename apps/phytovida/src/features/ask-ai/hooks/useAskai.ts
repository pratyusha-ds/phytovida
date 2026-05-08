import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { analyzePlant } from "../services/analyzePlant.service";

export function useAskAi() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const { mutate, data, isPending, isError, error, reset } = useMutation({
    mutationFn: analyzePlant,
  });

  const handleUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setPreview(URL.createObjectURL(uploadedFile));
    mutate(uploadedFile);
  };

  const handleReset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFile(null);
    reset(); // clears React Query state (data, error, status)
  };

  return {
    preview,
    file,
    diagnosis: data ?? null,
    loading: isPending,
    isError,
    error: isError
      ? error instanceof Error
        ? error.message
        : "Something went wrong"
      : null,
    handleUpload,
    handleReset,
  };
}
