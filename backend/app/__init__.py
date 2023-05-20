import os
import sys
from pyngrok import ngrok
from fastapi import FastAPI
from fastapi.logger import logger
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseSettings
from app.modules import router

class Settings(BaseSettings):
    BASE_URL = "http://localhost:8000"
    USE_NGROK = True

def init_webhooks(base_url):
    # Update inbound traffic via APIs to use the public-facing ngrok URL
    pass

def create_app():
    settings = Settings()
    app = FastAPI()

    origins = [
        "http://localhost",
        "http://localhost:3001",
        "http://localhost:3000",
        "http://localhost:5000",
        "http://react:3000",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Get the dev server port (defaults to 8000 for Uvicorn, can be overridden with `--port`
    # when starting the server
    # port = sys.argv[sys.argv.index("--port") + 1] if "--port" in sys.argv else 8000

    # Open a ngrok tunnel to the dev server
    # public_url = ngrok.connect(port).public_url
    # logger.warn("FORWARDING: ngrok tunnel:\n {}\n ->\n http://127.0.0.1:{}".format(public_url, port))
    #
    # # Update any base URLs or webhooks to use the public ngrok URL
    # settings.BASE_URL = public_url
    # init_webhooks(public_url)

    app.include_router(router, prefix="/api")

    return app
