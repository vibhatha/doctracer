import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PdfViewerSummary from './components/PdfViewSummary';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
    return (
        <ErrorBoundary>
            <Router>
                <div style={{ display: 'flex' }}>
                    <Sidebar />
                    <div style={{ marginLeft: '200px', padding: '20px', flex: 1 }}>
                        <Routes>
                            <Route path="/dev/pdfviewer/summary" element={<PdfViewerSummary />} />
                            <Route path="/" element={<Dashboard />} />
                        </Routes>
                    </div>
                </div>
            </Router>
            
        </ErrorBoundary>
    );
}

export default App;
