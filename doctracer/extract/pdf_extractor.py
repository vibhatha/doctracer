import pytesseract
from pdf2image import convert_from_path
import pdfplumber
import requests
from io import BytesIO


def extract_text_from_pdf(pdf_url):
    # Download the PDF file
    response = requests.get(pdf_url)
    pdf_file = BytesIO(response.content)

    # Convert PDF to images
    images = convert_from_path(pdf_file)

    # Extract text from each image
    text_content = ''
    for image in images:
        text_content += pytesseract.image_to_string(image)

    return text_content


# Function to extract text from the PDF
def extract_text_from_pdfplumber(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        return "\n".join(page.extract_text() for page in pdf.pages)