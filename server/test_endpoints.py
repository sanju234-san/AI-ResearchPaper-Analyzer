import requests
import json

BASE_URL = "http://localhost:8000"

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
    except Exception as e:
        print_test_result("Root Endpoint", False)
        print(f"   Exception: {e}")

    # Test 2: Health check
    try:
        response = requests.get(f"{BASE_URL}/health")
        print_test_result("Health Check", response.status_code == 200, response)
    except Exception as e:
        print_test_result("Health Check", False)
        print(f"   Exception: {e}")

    # Test 3: Ask question endpoint
    try:
        response = requests.post(f"{BASE_URL}/ask-question", data={"question": "What can this API do?"})
        print_test_result("Ask Question", response.status_code == 200, response)
    except Exception as e:
        print_test_result("Ask Question", False)
        print(f"   Exception: {e}")

    # Test 4: List documents (should be empty initially)
    try:
        response = requests.get(f"{BASE_URL}/documents")
        print_test_result("List Documents", response.status_code == 200, response)
    except Exception as e:
        print_test_result("List Documents", False)
        print(f"   Exception: {e}")

    print("🎯 API Testing Complete!")

if __name__ == "__main__":
    test_all_endpoints()