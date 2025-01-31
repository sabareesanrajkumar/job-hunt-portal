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
            { headers: { Authorization: token } }
          );

          downloadResponse.data.files.forEach((file) => {
            const byteCharacters = atob(file.body);
            const byteArrays = [];
            for (
              let offset = 0;
              offset < byteCharacters.length;
              offset += 512
            ) {
              const slice = byteCharacters.slice(offset, offset + 512);
              const byteNumbers = new Array(slice.length);

              for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
              }

              const byteArray = new Uint8Array(byteNumbers);
              byteArrays.push(byteArray);
            }
            const fileBlob = new Blob(byteArrays, { type: file.contentType });
            const fileUrl = URL.createObjectURL(fileBlob);

            const a = document.createElement("a");
            a.href = fileUrl;
            a.download = file.fileKey;
            a.click();

            URL.revokeObjectURL(fileUrl);
          });
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
