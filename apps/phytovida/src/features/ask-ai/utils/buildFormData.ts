function buildFormData(file: File): FormData {
  if (!file) {
    throw new Error("File parameter is required");
  }
  const formData = new FormData();
  formData.append("images", file);
  formData.append("organs", "auto"); // let PlantNet detect the organ type
  return formData;
}

export default buildFormData;
