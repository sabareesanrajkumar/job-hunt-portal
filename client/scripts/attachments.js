{
  const applicationList = document.getElementById("applications-list");
  const token = localStorage.getItem("token");
  document
    .getElementById("applicationsList")
    .addEventListener("click", async (event) => {
      if (event.target.classList.contains("download-btn")) {
        console.log("Clicked:", event.target.dataset.id);

        try {
          const downloadResponse = await axios.get(
            `${backendApi}/attachment/download/${event.target.dataset.id}`,
            { headers: { Authorization: token }, responseType: "arraybuffer" }
          );

          const fileBlob = new Blob([downloadResponse.data], {
            type: downloadResponse.headers["content-type"],
          });
          const fileUrl = URL.createObjectURL(fileBlob);

          const a = document.createElement("a");
          a.href = fileUrl;
          a.download = event.target.dataset.id;
          a.click();

          URL.revokeObjectURL(fileUrl);
        } catch (error) {
          console.error("Error downloading the file:", error);
        }
      }
      if (event.target.classList.contains("upload-btn")) {
        console.log("Clicked upload:", event.target.dataset.id);
        const applicationId = event.target.dataset.id;
        const fileInput = document.querySelector(
          `.attachments-input[data-id="${applicationId}"]`
        );

        if (!fileInput || fileInput.files.length === 0) {
          alert("Please select files to upload.");
          return;
        }

        const file = fileInput.files[0];

        const formData = new FormData();
        formData.append("file", file);
        formData.append("applicationId", applicationId);

        try {
          const response = await axios.post(
            `${backendApi}/attachment/upload`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: token,
              },
            }
          );

          alert("File uploaded successfully!");
          console.log("File URL:", response.data.fileUrl);
          console.log("File key:", response.data.fileKey);
        } catch (error) {
          console.error("Error uploading file:", error);
          alert("Upload failed.");
        }
      }
    });
}
