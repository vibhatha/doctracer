from .pdf_extractor import extract_text_from_pdfplumber
from .gazette.gazette import BaseGazetteProcessor
from .gazette.extragazette import ExtraGazetteProcessor

# Explicitly specify what is exported when importing from `doctracer.extract`
__all__ = ["extract_text_from_pdf", 
           "extract_text_from_pdfplumber",
             "BaseGazetteProcessor",
              "ExtraGazetteProcessor"
        ]
