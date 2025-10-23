import os
import PyPDF2
import pdfplumber

class PDFProcessor:
    def __init__(self):
        pass
    
    def extract_text(self, pdf_path: str) -> str:
        """Extract text from PDF file using multiple methods"""
        try:
            # Check if file exists
            if not os.path.exists(pdf_path):
                raise FileNotFoundError(f"PDF file not found: {pdf_path}")
            
            # Try pdfplumber first (more robust)
            text = self._extract_with_pdfplumber(pdf_path)
            
            # If pdfplumber fails or returns little text, try PyPDF2
            if not text or len(text.strip()) < 10:
                print("pdfplumber returned little text, trying PyPDF2...")
                text = self._extract_with_pypdf2(pdf_path)
            
            # Check for citation file patterns
            text_lower = text.lower()
            file_ext = os.path.splitext(pdf_path)[1].lower()
            citation_indicators = ["au -", "py -", "t1 -", "do -", "jo -", "author:", "title:", "journal:"]
            citation_extensions = ['.ris', '.bib', '.enw', '.ciw']
            
            is_citation_file = (any(indicator in text_lower for indicator in citation_indicators) or 
                               file_ext in citation_extensions)
            
            if is_citation_file:
                return f"This appears to be a citation file containing bibliographic metadata.\n\nExtracted content:\n{text.strip()}"
            
            if not text.strip():
                raise Exception("No text content could be extracted from the PDF")
            
            return text.strip()
            
        except Exception as e:
            raise Exception(f"PDF processing failed: {str(e)}")
    
    def _extract_with_pdfplumber(self, pdf_path: str) -> str:
        """Extract text using pdfplumber"""
        try:
            text = ""
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            print(f"pdfplumber extracted {len(text)} characters")
            return text
        except Exception as e:
            print(f"pdfplumber extraction failed: {e}")
            return ""
    
    def _extract_with_pypdf2(self, pdf_path: str) -> str:
        """Extract text using PyPDF2 (fallback)"""
        try:
            text = ""
            with open(pdf_path, "rb") as file:
                pdf_reader = PyPDF2.PdfReader(file)
                
                if pdf_reader.is_encrypted:
                    try:
                        pdf_reader.decrypt("")
                    except:
                        raise Exception("PDF is encrypted and cannot be decrypted")
                
                for page_num in range(len(pdf_reader.pages)):
                    page = pdf_reader.pages[page_num]
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            print(f"PyPDF2 extracted {len(text)} characters")
            return text
        except Exception as e:
            print(f"PyPDF2 extraction failed: {e}")
            return ""
    
    def extract_metadata(self, pdf_path: str) -> dict:
        """Extract PDF metadata"""
        try:
            with open(pdf_path, "rb") as file:
                pdf_reader = PyPDF2.PdfReader(file)
                metadata = pdf_reader.metadata
                return {
                    'title': getattr(metadata, 'title', 'Unknown'),
                    'author': getattr(metadata, 'author', 'Unknown'),
                    'subject': getattr(metadata, 'subject', 'Unknown'),
                    'pages': len(pdf_reader.pages)
                }
        except Exception as e:
            return {"error": str(e)}