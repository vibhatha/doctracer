import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist/build/pdf.worker.min.js';

export const extractTextFromPDF = async (url) => {
    console.log("url");
    console.log(url);
    const loadingTask = pdfjsLib.getDocument(url);
    const pdf = await loadingTask.promise;
    let textContent = '';

    console.log("pdf");
    console.log(pdf);

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const text = await page.getTextContent();
        textContent += text.items.map(item => item.str).join(' ');
    }

    return textContent;
};
