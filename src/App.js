import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import SwaggerToRestAssuredPage from './components/SwaggerToRestAssuredPage';
import SeleniumToPlaywrightPage from './components/SeleniumToPlaywrightPage';
import ConfigPage from './components/ConfigPage';
import DomToCode7 from "./components/MobileDomToAppiumCode7";
import GenerateTestFromDesign from "./components/GenerateTestFromDesign";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/generate" element={<SwaggerToRestAssuredPage />} />
            <Route path="/selenium-to-playwright" element={<SeleniumToPlaywrightPage />} />
            <Route path="/dom-to-appiumcode" element={<DomToCode7 />} />
            <Route path="/description-to-testcase" element={<GenerateTestFromDesign />} />
            {/* Default route */}
            <Route path="/" element={<SwaggerToRestAssuredPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
