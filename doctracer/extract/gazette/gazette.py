from abc import ABC, abstractmethod
from typing import Dict, Any
from doctracer.prompt.executor import PromptExecutor
from doctracer.extract.pdf_extractor import extract_text_from_pdfplumber


class BaseGazetteProcessor(ABC):
    def __init__(self, pdf_path: str):
        self.pdf_path = pdf_path
        self.executor = self._initialize_executor()

    @abstractmethod
    def _initialize_executor(self) -> PromptExecutor:
        """Initialize the specific executor for the processor."""
        pass

    @abstractmethod
    def _extract_metadata(self, gazette_text: str) -> str:
        """Extract metadata from gazette text."""
        pass

    @abstractmethod
    def _extract_changes(self, gazette_text: str) -> str:
        """Extract changes from gazette text."""
        pass

    def process_gazettes(self) -> str:
        """Process all gazette PDFs and return results."""
        
        gazette_text = extract_text_from_pdfplumber(self.pdf_path)
        metadata = self._extract_metadata(gazette_text)
        changes = self._extract_changes(gazette_text)
        
        # Combine metadata and changes into a single JSON object
        combined_data = f'{{"metadata": {metadata}, "changes": {changes}}}'
        return combined_data
