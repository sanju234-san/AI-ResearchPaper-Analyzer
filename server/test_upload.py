import requests
import json
import base64

# Get a token first
auth_data = {
    "email": os.environ.get("TEST_EMAIL"),
    "password": os.environ.get("TEST_PASSWORD")
}
res = requests.post("http://localhost:8000/api/auth/login", json=auth_data)
token = res.json()["token"]

# Create a dummy PDF file (just needs %PDF header and size > 100 bytes)
pdf_content = b"%PDF-1.4\n" + b"x" * 200 + b"\n%%EOF"
import tempfile
with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as f:
    f.write(pdf_content)
    file_path = f.name

# Upload the file
headers = {
    "authorization": f"Bearer {token}"
}
import os
filename = "dummy.pdf"
filepath = os.path.join(os.getcwd(), filename)
files = {"file": (filename, open(filepath, "rb"), "application/pdf")}
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
