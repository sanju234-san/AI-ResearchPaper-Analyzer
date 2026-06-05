import requests
import json

import os

import urllib.parse

BASE_URL = os.environ.get('API_BASE_URL', 'http://localhost:8000')

# Validate and sanitize BASE_URL to prevent SSRF attacks
try:
    parsed_url = urllib.parse.urlparse(BASE_URL)
    if not all([parsed_url.scheme, parsed_url.netloc]):
        raise ValueError('Invalid BASE_URL')
except ValueError as e:
    print(f'Invalid BASE_URL: {e}')
    # Handle invalid BASE_URL, e.g., exit the program or use a default value
    exit(1)

def print_test_result(test_name, success, response=None):
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} {test_name}")
    if response:
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print(f"   Response: {json.dumps(response.json(), indent=2)}")
        else:
            print(f"   Error: {response.text}")
    print()

def test_all_endpoints():
    print("🧪 Testing AI Research Paper Analyzer API")
    print("=" * 60)
    
    # Test 1: Root endpoint
    try:
        response = requests.get(f"{BASE_URL}/")
        print_test_result("Root Endpoint", response.status_code == 200, response)
    except requests.exceptions.Timeout:
        print_test_result("Root Endpoint", False)
        print("   Exception: Request timed out")
    except requests.exceptions.ConnectionError:
        print_test_result("Root Endpoint", False)
        print("   Exception: Connection error")
    except requests.exceptions.HTTPError as e:
        print_test_result("Root Endpoint", False)
        print(f"   Exception: HTTP error {e}")
    except Exception as e:
        print_test_result("Root Endpoint", False)
        print(f"   Exception: {e}")

    # Test 2: Health check
    try:
        response = requests.get(f"{BASE_URL}/health")
        print_test_result("Health Check", response.status_code == 200, response)
    except requests.exceptions.Timeout:
        print_test_result("Health Check", False)
        print("   Exception: Request timed out")
    except requests.exceptions.ConnectionError:
        print_test_result("Health Check", False)
        print("   Exception: Connection error")
    except requests.exceptions.HTTPError as e:
        print_test_result("Health Check", False)
        print(f"   Exception: HTTP error {e}")
    except Exception as e:
        print_test_result("Health Check", False)
        print(f"   Exception: {e}")

    # Test 3: Ask question endpoint
    try:
        response = requests.post(f"{BASE_URL}/ask-question", data={"question": "What can this API do?"})
        print_test_result("Ask Question", response.status_code == 200, response)
    except requests.exceptions.Timeout:
        print_test_result("Ask Question", False)
        print("   Exception: Request timed out")
    except requests.exceptions.ConnectionError:
        print_test_result("Ask Question", False)
        print("   Exception: Connection error")
    except requests.exceptions.HTTPError as e:
        print_test_result("Ask Question", False)
        print(f"   Exception: HTTP error {e}")
    except Exception as e:
        print_test_result("Ask Question", False)
        print(f"   Exception: {e}")

    # Test 4: List documents (should be empty initially)
    try:
        response = requests.get(f"{BASE_URL}/documents")
        print_test_result("List Documents", response.status_code == 200, response)
    except requests.exceptions.Timeout:
        print_test_result("List Documents", False)
        print("   Exception: Request timed out")
    except requests.exceptions.ConnectionError:
        print_test_result("List Documents", False)
        print("   Exception: Connection error")
    except requests.exceptions.HTTPError as e:
        print_test_result("List Documents", False)
        print(f"   Exception: HTTP error {e}")
    except Exception as e:
        print_test_result("List Documents", False)
        print(f"   Exception: {e}")

    print("🎯 API Testing Complete!")

if __name__ == "__main__":
    test_all_endpoints()