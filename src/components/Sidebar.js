import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="toggle-button" onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? <FaBars /> : <FaTimes />}
      </button>
      {!isCollapsed && (
        <>
          <h2>GenAI Automation</h2>
            <ul>
                <li className="sidebar-item">
                    <Link to="/generate" className="sidebar-link">
                        Swagger to RestAssured
                    </Link>
                </li>
                <li className="sidebar-item">
                    <Link to="/selenium-to-playwright" className="sidebar-link">
                        Selenium to Playwright
                    </Link>
                </li>
                <li className="sidebar-item">
                    <Link to="/dom-to-appiumcode" className="sidebar-link">
                        Generate Mobile Automation Code
                    </Link>
                </li>
                <li className="sidebar-item">
                    <Link to="/jiraStory-to-testcase" className="sidebar-link">
                        Jira Story to TestCase
                    </Link>
                </li>
            </ul>
        </>
      )}
    </div>
  );
}

export default Sidebar;
