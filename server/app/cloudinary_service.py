"""
Cloudinary cloud storage service for Paperlytics.
Provides async upload, download, and delete utilities.
Uses a singleton configuration pattern consistent with rag_system.py.

Memory-optimized: cloudinary and httpx are lazy-imported on first use.
"""

import asyncio
import mimetypes
from typing import Optional

from fastapi import HTTPException, UploadFile

from app.config import (
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    CLOUDINARY_FOLDER,
)


# --- Singleton configuration (matches existing pattern in rag_system.py) ---
_cloudinary_configured = False


def _ensure_configured() -> None:
    """Configure the Cloudinary SDK exactly once."""
    global _cloudinary_configured
    if _cloudinary_configured:
        return

    if not all([CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET]):
        raise RuntimeError(
            "Cloudinary credentials are missing. "
            "Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and "
            "CLOUDINARY_API_SECRET in your .env file."
        )
    try:
        import cloudinary  # Lazy import
        cloudinary.config(
            cloud_name=CLOUDINARY_CLOUD_NAME,
            api_key=CLOUDINARY_API_KEY,
            api_secret=CLOUDINARY_API_SECRET,
            secure=True,
        )
    except Exception as e:
        raise RuntimeError("Invalid Cloudinary credentials.") from e
        raise RuntimeError(
            "Cloudinary credentials are missing. "
            "Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and "
            "CLOUDINARY_API_SECRET in your .env file."
        )

    import cloudinary  # Lazy import
    cloudinary.config(
        cloud_name=CLOUDINARY_CLOUD_NAME,
        api_key=CLOUDINARY_API_KEY,
        api_secret=CLOUDINARY_API_SECRET,
        secure=True,
    )
    _cloudinary_configured = True
    print("☁️  Cloudinary configured successfully")


def _detect_resource_type(filename: str) -> str:
    """Return the Cloudinary resource_type based on file extension.

    - PDFs and other non-media files → 'raw'
    - Images (png, jpg, etc.)       → 'image'
    """
    mime, _ = mimetypes.guess_type(filename or "")
    if mime and mime.startswith("image/"):
        return "image"
    return "raw"


# ---------------------------------------------------------------------------
# Public async utilities
# ---------------------------------------------------------------------------


async def upload_to_cloudinary(
    file: UploadFile,
    folder: Optional[str] = None,
) -> dict:
    """Upload a FastAPI UploadFile to Cloudinary.

    Args:
        file:   The incoming upload.
        folder: Cloudinary folder path (defaults to CLOUDINARY_FOLDER).

    Returns:
        dict with ``secure_url`` and ``public_id``.

    Raises:
        HTTPException 500 on upload failure.
    """
    _ensure_configured()

    import cloudinary.uploader  # Lazy import

    target_folder = folder or CLOUDINARY_FOLDER
    resource_type = _detect_resource_type(file.filename)

    # Read file bytes (handle the case where the file has already been read)
    file_bytes = await file.read()
    if file_bytes:
        await file.seek(0)

    try:
        # cloudinary.uploader.upload is synchronous — run in thread-pool
        result = await asyncio.to_thread(
            cloudinary.uploader.upload,
            file_bytes,
            folder=target_folder,
            resource_type=resource_type,
            public_id=file.filename.rsplit(".", 1)[0] if file.filename else None,
            overwrite=True,
            unique_filename=True,
        )

        print(f"☁️  Uploaded {file.filename} → {result['secure_url']}")
        return {
            "secure_url": result["secure_url"],
            "public_id": result["public_id"],
        }

    except Exception as exc:
        print(f"❌ Cloudinary upload failed: {exc}")
        raise HTTPException(
            status_code=500,
            detail=f"Cloud storage upload failed: {str(exc)}",
        )


async def delete_from_cloudinary(
    public_id: str,
    resource_type: str = "raw",
) -> bool:
    """Delete a file from Cloudinary by its public_id.

    Args:
        public_id:      The Cloudinary public ID.
        resource_type:  'raw' for PDFs, 'image' for images.

    Returns:
        True if the deletion succeeded, False otherwise.
    """
    _ensure_configured()

    import cloudinary.uploader  # Lazy import

    try:
        result = await asyncio.to_thread(
            cloudinary.uploader.destroy,
            public_id,
            resource_type=resource_type,
        )
        ok = result.get("result") == "ok"
        if ok:
            print(f"☁️  Deleted {public_id} from Cloudinary")
        else:
            print(f"⚠️  Cloudinary deletion returned: {result}")
        return ok

    except Exception as exc:
        print(f"⚠️  Cloudinary deletion failed for {public_id}: {exc}")
        return False


async def download_from_cloudinary(url: str) -> bytes:
    """Download file bytes from a Cloudinary secure URL.

    Used when re-processing a previously uploaded paper via the RAG pipeline.

    Args:
        url: The secure_url stored in MongoDB.

    Returns:
        Raw file bytes.

    Raises:
        HTTPException 502 on download failure.
    """
    import httpx  # Lazy import

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            return response.content

    except Exception as exc:
        print(f"❌ Cloudinary download error: {exc}")
        raise HTTPException(
            status_code=502,
            detail=f"Failed to download file from cloud storage: {str(exc)}",
        )
