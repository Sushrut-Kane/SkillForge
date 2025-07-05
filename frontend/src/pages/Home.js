import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import "./Home.css";

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [userName, setUserName] = useState("User");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadMessage("");
    setAnalysisResult(null); // Clear previous result when a new file is selected
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please choose a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setIsUploading(true);
      setUploadMessage("");

      const res = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAnalysisResult(res.data);
      setUploadMessage("✅ Upload and analysis successful");
    } catch (error) {
      console.error("Upload error:", error);
      setUploadMessage("❌ Upload failed");
      alert("Upload failed: " + (error.response?.data?.message || error.message));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="home-container">
      <h2 className="greeting">Hello, {userName}</h2>

      <p className="typewriter">
        SkillForge helps you analyze your resume, detect skill gaps, and suggest
        personalized learning paths.
      </p>

      <form className="upload-form" onSubmit={handleUpload}>
        <label htmlFor="file-upload" className="custom-file-upload">
          Choose File
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".pdf"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {selectedFile && <p className="file-name">{selectedFile.name}</p>}

        <button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload"}
        </button>

        {uploadMessage && <p className="upload-status">{uploadMessage}</p>}
      </form>

      {analysisResult && (
        <div className="result-section">
          <h3>Analysis Results</h3>
          <div
            className="feedback-box"
            dangerouslySetInnerHTML={{ __html: analysisResult.feedbackHTML }}
          />
        </div>
      )}
    </div>
  );
}

export default Home;
