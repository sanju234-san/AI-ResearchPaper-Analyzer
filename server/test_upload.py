import requests
import json
import base64

# Get a token first
auth_data = {
    "email": "testuser123@example.com",
    "password": "TestPass123"
}
res = requests.post("http://localhost:8000/api/auth/login", json=auth_data)
token = res.json()["token"]

# Create a dummy PDF file (just needs %PDF header and size > 100 bytes)
pdf_content = b"%PDF-1.4\n" + b"x" * 200 + b"\n%%EOF"
with open("dummy.pdf", "wb") as f:
    f.write(pdf_content)

# Upload the file
headers = {
    "authorization": f"Bearer {token}"
}
files = {"file": ("dummy.pdf", open("dummy.pdf", "rb"), "application/pdf")}
print("Uploading...")
res = requests.post("http://localhost:8000/analyze-pdf", headers=headers, files=files)
print(res.status_code)
try:
    print(json.dumps(res.json(), indent=2))
except:
    print(res.text)

# Check if papers exist
print("Checking papers...")
res = requests.get("http://localhost:8000/api/auth/papers", headers=headers)
print(res.status_code)
try:
    print(json.dumps(res.json(), indent=2))
except:
    print(res.text)
