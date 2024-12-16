import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css'; // Import the CSS file for styling

const Sidebar = () => {
    const [isMinimized, setIsMinimized] = useState(false);

    const toggleSidebar = () => {
        setIsMinimized(!isMinimized);
    };

    return (
        <div className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
            <button onClick={toggleSidebar}>
                {isMinimized ? 'Expand' : 'Minimize'}
            </button>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/dev/pdfviewer/summary">PDF Viewer Summary</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar; 