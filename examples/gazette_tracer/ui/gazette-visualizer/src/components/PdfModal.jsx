import React from 'react';

const PdfModal = ({ gazette, onClose }) => {
    console.log("Gazette data:", gazette);
    return (
        <div className="modal-overlay" 
             style={{
                 position: 'fixed',
                 top: 0,
                 left: 0,
                 right: 0,
                 bottom: 0,
                 backgroundColor: 'rgba(0, 0, 0, 0.7)',
                 display: 'flex',
                 justifyContent: 'center',
                 alignItems: 'center',
                 zIndex: 1000
             }}>
            <div className="modal-content" 
                 style={{
                     backgroundColor: 'white',
                     padding: '20px',
                     borderRadius: '8px',
                     width: '400px',
                     position: 'relative',
                     boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                 }}>
                <button 
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '10px',
                        padding: '5px 10px',
                        border: 'none',
                        borderRadius: '4px',
                        backgroundColor: '#ff4444',
                        color: 'white',
                        cursor: 'pointer'
                    }}>
                    Close
                </button>
                <div style={{ marginTop: '20px' }}>
                    <div style={{
                        padding: '10px',
                        backgroundColor: '#fff',
                        borderRadius: '4px',
                        marginBottom: '15px'
                    }}>
                        <h2 style={{ 
                            marginBottom: '15px',
                            color: '#333',
                            fontSize: '1.2em'
                        }}>
                            {gazette.name}
                        </h2>
                        <p style={{ 
                            marginBottom: '15px',
                            color: '#666'
                        }}>
                            Date: {new Date(gazette.date).toLocaleDateString()}
                        </p>
                        <a 
                            href={gazette.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-block',
                                padding: '10px 15px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '4px',
                                marginTop: '10px'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                        >
                            Open Gazette PDF
                        </a>
                    </div>

                    {gazette.parentGazette && (
                        <div style={{
                            marginTop: '20px',
                            padding: '10px',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '4px',
                            borderLeft: '4px solid #2196f3'
                        }}>
                            <h3 style={{
                                color: '#333',
                                fontSize: '1.1em',
                                marginBottom: '10px'
                            }}>
                                Parent Gazette
                            </h3>
                            <p style={{ marginBottom: '10px', color: '#666' }}>
                                {gazette.parentGazette.name}
                            </p>
                            <p style={{ marginBottom: '10px', color: '#666' }}>
                                Date: {new Date(gazette.parentGazette.date).toLocaleDateString()}
                            </p>
                            <a 
                                href={gazette.parentGazette.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-block',
                                    padding: '8px 12px',
                                    backgroundColor: '#2196f3',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderRadius: '4px',
                                    fontSize: '0.9em'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#1976d2'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#2196f3'}
                            >
                                Open Parent PDF
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PdfModal; 