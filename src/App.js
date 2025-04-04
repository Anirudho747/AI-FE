import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import SwaggerToRestAssuredPage from './components/SwaggerToRestAssuredPage';
import SeleniumToPlaywrightPage from './components/SeleniumToPlaywrightPage';
import JiraStoryToTestCase from "./components/JiraStoryToTestCase";
import ConfigPage from './components/ConfigPage';
import MobileDomToAppiumCode from "./components/MobileDomToAppiumCode";
import DomToCode7 from "./components/DomToCode7";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/generate" element={<SwaggerToRestAssuredPage />} />
            <Route path="/selenium-to-playwright" element={<SeleniumToPlaywrightPage />} />
            <Route path="/jiraStory-to-testcase" element={<JiraStoryToTestCase />} />
            <Route path="/dom-to-appiumcode" element={<DomToCode7 />} />
            <Route path="/config" element={<ConfigPage />} />
            {/* Default route */}
            <Route path="/" element={<SwaggerToRestAssuredPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
