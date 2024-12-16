export const summarizeText = (text) => {
    // Simple summarization logic (e.g., extract first few sentences)
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    return sentences.slice(0, 2).join(' ');
};
