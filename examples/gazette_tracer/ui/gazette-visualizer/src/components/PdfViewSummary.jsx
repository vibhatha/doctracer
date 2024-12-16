import React, { useState } from 'react';

const PdfViewerSummary = () => {
    const [pdfUrl, setPdfUrl] = useState('');
    const [result, setResult] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/extract-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ pdf_url: pdfUrl })
            });

            if (response.ok) {
                const data = await response.json();
                setResult(data.text);
            } else {
                const errorData = await response.json();
                setResult(`Error: ${errorData.error}`);
            }
        } catch (error) {
            setResult(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <h1>PDF Text Extractor</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="pdfUrl">PDF URL:</label>
                <input
                    type="text"
                    id="pdfUrl"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    required
                />
                <button type="submit">Extract Text</button>
            </form>
            <div>
                <h2>Result:</h2>
                <pre>{result}</pre>
            </div>
        </div>
    );
};

export default PdfViewerSummary;
