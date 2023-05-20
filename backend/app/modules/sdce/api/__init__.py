from fastapi import APIRouter
from .v1.sdce import router as sdce_router

router = APIRouter()
router.include_router(sdce_router, prefix="/sdce")
