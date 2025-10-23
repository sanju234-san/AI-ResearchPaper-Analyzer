import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import AnalysisPage from "./pages/AnalysisPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedPaper, setSelectedPaper] = useState(null);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={setCurrentPage} />;
      case "upload":
        return <UploadPage onNavigate={setCurrentPage} onUploadComplete={(paper) => {
          setSelectedPaper(paper);
          setCurrentPage("dashboard");
        }} />;
      case "analysis":
        return <AnalysisPage paper={selectedPaper} onNavigate={setCurrentPage} />;
      case "dashboard":
        return <DashboardPage onNavigate={setCurrentPage} onViewAnalysis={(paper) => {
          setSelectedPaper(paper);
          setCurrentPage("analysis");
        }} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return <div className="App">{renderPage()}</div>;
}

export default App;
