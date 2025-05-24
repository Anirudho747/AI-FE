import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import SwaggerToRestAssuredPage from './components/SwaggerToRestAssuredPage';
import SeleniumToPlaywrightPage from './components/SeleniumToPlaywrightPage';
import ConfigurationTab from './components/ConfigurationTab';
import DomToCode7 from "./components/MobileDomToAppiumCode7";
import GenerateTestFromDesign from "./components/GenerateTestFromDesign";
import MobileDomToAppiumCode7 from "./components/MobileDomToAppiumCode7";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/generate" element={<SwaggerToRestAssuredPage />} />
            <Route path="/dom-to-appiumcode" element={<MobileDomToAppiumCode7 />} />
            <Route path="/description-to-testcase" element={<GenerateTestFromDesign />} />
            <Route path="/selenium-to-playwright" element={<SeleniumToPlaywrightPage />} />
            <Route path="/ConfigurationTab" element={<ConfigurationTab />} />
            {/* Default route */}
            <Route path="/" element={<SwaggerToRestAssuredPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
