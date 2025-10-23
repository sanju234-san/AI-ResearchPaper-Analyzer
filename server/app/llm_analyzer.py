import requests
import json
import re
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class LLMAnalyzer:
    def __init__(self):
        # Get Ollama settings from .env
        self.ollama_base_url = os.getenv('OLLAMA_BASE_URL', 'http://localhost:11434')
        self.model = os.getenv('OLLAMA_MODEL', 'llama3')
        self.ollama_enabled = os.getenv('OLLAMA_ENABLED', 'true').lower() == 'true'
        
        # Construct the full API URL
        self.ollama_url = f"{self.ollama_base_url}/api/generate"
        
        print(f"🔧 Ollama Configuration:")
        print(f"   URL: {self.ollama_url}")
        print(f"   Model: {self.model}")
        print(f"   Enabled: {self.ollama_enabled}")
        
        if self.ollama_enabled:
            self._test_ollama()
        else:
            print(" Ollama is disabled in configuration")
    
    def _test_ollama(self):
        """Test Ollama connection"""
        try:
            test_url = f"{self.ollama_base_url}/api/tags"
            print(f" Testing connection to: {test_url}")
            
            response = requests.get(test_url, timeout=5)
            if response.status_code == 200:
                print(" Ollama is connected and ready!")
                return True
            else:
                print(f" Ollama responded with status: {response.status_code}")
                return False
        except requests.exceptions.ConnectionError:
            print(f" Cannot connect to Ollama at {self.ollama_base_url}")
            print(" Make sure 'ollama serve' is running")
            return False
        except Exception as e:
            print(f" Ollama connection error: {e}")
            return False
    
    def analyze_paper(self, text_content: str) -> dict:
        """Comprehensive research paper analysis using Ollama"""
        if not self.ollama_enabled:
            return self._fallback_analysis(text_content)
            
        try:
            truncated_text = text_content[:3000] + "..." if len(text_content) > 3000 else text_content
            
            prompt = f"""
            Analyze this research paper and provide key insights:

            {truncated_text}

            Focus on the main topic, methodology, and findings.
            Provide a concise summary.
            """
            
            response = self._call_ollama(prompt, max_tokens=800)
            
            return {
                "summary": response[:400] + "..." if len(response) > 400 else response,
                "key_findings": ["AI analysis completed successfully", "Key insights extracted"],
                "methodology": f"{self.model} AI-powered analysis",
                "contributions": ["Research paper analysis", "Knowledge extraction"],
                "limitations": ["Analysis based on paper content"],
                "future_work": "Ask specific questions for detailed insights"
            }
            
        except Exception as e:
            print(f"Analysis error: {e}")
            return self._fallback_analysis(text_content)
    
    def answer_question(self, context: str, question: str) -> str:
        """Answer specific questions using Ollama"""
        if not self.ollama_enabled:
            return self._fallback_answer(context, question)
            
        try:
            clean_context = self._clean_context(context)
            
            prompt = f"""
            Based on this research paper content: {clean_context[:1800]}
            
            Question: {question}
            
            Provide a direct, evidence-based answer:
            """
            
            response = self._call_ollama(prompt, max_tokens=600)
            return response.strip()
            
        except Exception as e:
            print(f"Q&A error: {e}")
            return self._fallback_answer(context, question)
    
    def _call_ollama(self, prompt: str, max_tokens: int = 500) -> str:
        """Make API call to Ollama"""
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.3,
                "num_predict": max_tokens
            }
        }
        
        response = requests.post(self.ollama_url, json=payload, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        return result['response']
    
    def _clean_context(self, context: str) -> str:
        """Clean the context by removing boilerplate text"""
        if "Relevant excerpts from the research paper:" in context:
            content_start = context.find("Relevant excerpts from the research paper:") + len("Relevant excerpts from the research paper:")
            actual_content = context[content_start:].strip()
            clean_content = re.sub(r'\[Excerpt \d+\].*?:\s*', '', actual_content)
            return clean_content
        return context
    
    def _fallback_answer(self, context: str, question: str) -> str:
        """Fallback answer if Ollama fails"""
        clean_context = self._clean_context(context)
        if clean_context and len(clean_context) > 50:
            return f"Based on the research paper: {clean_context[:250]}..."
        else:
            return "I've processed the research paper. Please ask specific questions about its content, methodology, or findings."
    
    def _fallback_analysis(self, text_content: str) -> dict:
        """Fallback analysis if Ollama fails"""
        return {
            "summary": f"Research paper processed ({len(text_content)} chars). Ollama integration issue detected.",
            "key_findings": ["Content extracted successfully"],
            "methodology": "Text processing",
            "contributions": ["Paper content available"],
            "limitations": ["AI analysis temporarily unavailable"],
            "future_work": "Check Ollama service and try again"
        }
