from abc import ABC, abstractmethod
from typing import List, Dict, Any
from doctracer.prompt.executor import PromptExecutor
from doctracer.extract.pdf_extractor import extract_text_from_pdfplumber

class BaseGazetteProcessor(ABC):
    def __init__(self, pdf_paths: List[str]):
        self.pdf_paths = pdf_paths
        self.executor = self._initialize_executor()

    @abstractmethod
    def _initialize_executor(self) -> PromptExecutor:
        """Initialize the specific executor for the processor."""
        pass

    @abstractmethod
    def _extract_metadata(self, gazette_text: str) -> Dict[str, Any]:
        """Extract metadata from gazette text."""
        pass

    @abstractmethod
    def _extract_changes(self, gazette_text: str) -> Dict[str, Any]:
        """Extract changes from gazette text."""
        pass

    def process_gazettes(self) -> List[Dict[str, Any]]:
        """Process all gazette PDFs and return results."""
        results = []
        for pdf_path in self.pdf_paths:
            gazette_text = extract_text_from_pdfplumber(pdf_path)
            metadata = self._extract_metadata(gazette_text)
            changes = self._extract_changes(gazette_text)
            results.append({
                "pdf_path": pdf_path,
                "metadata": metadata,
                "changes": changes
            })
        return results
