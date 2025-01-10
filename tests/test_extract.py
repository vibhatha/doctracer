from doctracer.extract import extract_text_from_pdfplumber

def test_extract_text_from_pdfplumber():
    pdf_path = "data/testdata/simple.pdf"
    text = extract_text_from_pdfplumber(pdf_path)
    assert text == "Hello Lanka Data Foundation"
