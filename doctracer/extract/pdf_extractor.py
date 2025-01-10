from pdf2image import convert_from_path
import pdfplumber
from io import BytesIO


# Function to extract text from the PDF
def extract_text_from_pdfplumber(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        return "\n".join(page.extract_text() for page in pdf.pages)