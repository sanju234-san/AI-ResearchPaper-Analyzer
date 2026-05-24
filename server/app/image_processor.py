"""
Image processing module for AI Research Paper Analyzer.

Memory-optimized: PIL and pytesseract are imported lazily inside methods,
not at module level, so they don't contribute to startup RAM.
"""

import base64
import io
import os
import subprocess
from typing import Dict, List


class ImageProcessor:
    def __init__(self):
        self.supported_formats = ['.png', '.jpg', '.jpeg', '.bmp', '.tiff']
        self.tesseract_available, self.tesseract_path = self._setup_tesseract()

    def _setup_tesseract(self):
        """Setup Tesseract OCR using direct path"""
        print("🔍 Setting up Tesseract OCR...")

        # Check common paths (works on both Windows dev and Linux deploy)
        candidates = [
            r"C:\Program Files\Tesseract-OCR\tesseract.exe",  # Windows
            "/usr/bin/tesseract",                               # Linux (Render)
        ]

        for tesseract_path in candidates:
            if os.path.exists(tesseract_path):
                try:
                    result = subprocess.run(
                        [tesseract_path, '--version'],
                        capture_output=True, text=True, timeout=10
                    )
                    if result.returncode == 0:
                        version = result.stdout.split('\n')[0]
                        print(f" ✅ Tesseract verified: {version} at {tesseract_path}")
                        return True, tesseract_path
                except Exception as e:
                    print(f" ⚠️ Tesseract verification failed at {tesseract_path}: {e}")

        # Try PATH fallback
        try:
            result = subprocess.run(
                ["tesseract", '--version'],
                capture_output=True, text=True, timeout=10
            )
            if result.returncode == 0:
                version = result.stdout.split('\n')[0]
                print(f" ✅ Tesseract found in PATH: {version}")
                return True, "tesseract"
        except Exception:
            pass

        print(" ⚠️ Tesseract OCR not found — image OCR will be unavailable")
        return False, None

    def base64_to_image(self, image_data: str):
        """Convert base64 image data to PIL Image"""
        from PIL import Image  # Lazy import

        try:
            if ',' in image_data:
                image_data = image_data.split(',')[1]

            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes))
            return image.convert('RGB')
        except Exception as e:
            raise ValueError(f"Image decoding error: {str(e)}")

    def extract_text_from_image(self, image_data: str) -> Dict:
        """Extract text from image using OCR"""
        import pytesseract  # Lazy import

        try:
            if not self.tesseract_available:
                return {
                    "success": False,
                    "extracted_text": "",
                    "error": "Tesseract OCR is not available.",
                    "tesseract_path": self.tesseract_path
                }

            # Set tesseract command path
            if self.tesseract_path and self.tesseract_path != "tesseract":
                pytesseract.pytesseract.tesseract_cmd = self.tesseract_path

            print(" 🖼️ Processing image with Tesseract...")
            image = self.base64_to_image(image_data)

            # Get image info
            image_info = {
                "format": image.format,
                "size": image.size,
                "mode": image.mode,
                "dimensions": f"{image.size[0]}x{image.size[1]}"
            }

            # Try OCR with different configurations
            configs = [
                '',          # Default
                '--psm 6',  # Uniform block of text
                '--psm 4',  # Single column of text
                '--psm 3',  # Fully automatic page segmentation
            ]

            best_text = ""
            used_config = "default"

            for config in configs:
                try:
                    if config:
                        text = pytesseract.image_to_string(image, config=config)
                    else:
                        text = pytesseract.image_to_string(image)

                    if text.strip() and len(text.strip()) > len(best_text.strip()):
                        best_text = text
                        used_config = config if config else "default"
                        print(f" ✅ OCR successful with config: {used_config}")
                except Exception as config_error:
                    print(f" ⚠️ OCR config failed {config}: {config_error}")
                    continue

            if best_text.strip():
                return {
                    "success": True,
                    "extracted_text": best_text.strip(),
                    "image_info": image_info,
                    "word_count": len(best_text.split()),
                    "character_count": len(best_text),
                    "line_count": len(best_text.split('\n')),
                    "ocr_engine": "Tesseract",
                    "ocr_config": used_config,
                    "tesseract_path": self.tesseract_path
                }
            else:
                return {
                    "success": False,
                    "extracted_text": "",
                    "error": "No text could be extracted from the image",
                    "image_info": image_info,
                    "suggestion": "Try an image with clearer text or different formatting",
                    "tesseract_path": self.tesseract_path
                }

        except Exception as e:
            return {
                "success": False,
                "extracted_text": "",
                "error": f"OCR processing error: {str(e)}",
                "tesseract_path": self.tesseract_path
            }

    def analyze_research_image(self, image_data: str) -> Dict:
        """Comprehensive analysis of research images"""
        print(" 🔍 Analyzing research image...")
        ocr_result = self.extract_text_from_image(image_data)

        content_type = "unknown"
        if ocr_result["success"] and ocr_result["extracted_text"]:
            content_type = self.classify_image_content(ocr_result["extracted_text"])
            print(f" 📊 Content classified as: {content_type}")

        analysis = {
            "analysis_type": "research_image",
            "content_classification": content_type,
            "ocr_results": ocr_result,
            "tesseract_available": self.tesseract_available,
            "tesseract_path": self.tesseract_path,
            "suggested_actions": self.get_suggested_actions(ocr_result)
        }

        return analysis

    def classify_image_content(self, text: str) -> str:
        """Classify the type of research image based on text content"""
        if not text.strip():
            return "unknown"

        text_lower = text.lower()

        research_categories = {
            "algorithm": ["algorithm", "pseudocode", "procedure", "function", "input", "output"],
            "graph_chart": ["graph", "plot", "chart", "curve", "figure", "axis", "x-axis", "y-axis"],
            "data_table": ["table", "data", "results", "statistics", "mean", "std", "p-value"],
            "architecture": ["architecture", "framework", "model", "flowchart", "diagram", "system"],
            "mathematical": ["equation", "formula", "math", "calculate", "derivative", "integral"],
            "abstract": ["abstract", "summary", "introduction", "conclusion"],
            "methodology": ["method", "methodology", "experiment", "procedure", "setup"]
        }

        for category, keywords in research_categories.items():
            if any(keyword in text_lower for keyword in keywords):
                return category

        return "text_content"

    def get_suggested_actions(self, ocr_result: Dict) -> List[str]:
        """Get suggested actions based on image content"""
        actions = []

        if not self.tesseract_available:
            actions.append("❌ Tesseract OCR not available")
            return actions

        if ocr_result["success"]:
            text = ocr_result["extracted_text"]
            if text:
                actions.append("✅ Text successfully extracted")
                word_count = ocr_result.get("word_count", 0)
                if word_count > 50:
                    actions.append("✅ Substantial text content available")
                elif word_count > 10:
                    actions.append("⚠️ Moderate text content")
                else:
                    actions.append("⚠️ Limited text content")
            else:
                actions.append("⚠️ No text detected in image")
                actions.append("💡 Try images with clearer text")
        else:
            actions.append("❌ OCR processing failed")
            actions.append(f"💡 {ocr_result.get('error', 'Unknown error')}")

        return actions