from fastapi import APIRouter
from .sdce.api import router as sdce_router

router = APIRouter()
router.include_router(sdce_router, prefix="/v1")
