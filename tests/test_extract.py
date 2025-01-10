from doctracer.extract import extract_text_from_pdfplumber

def test_extract_text_from_pdfplumber():
    pdf_path = "tests/test.pdf"
    text = extract_text_from_pdfplumber(pdf_path)
    print(text)
