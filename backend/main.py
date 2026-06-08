import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from routes.categorize import router as categorize_router
from routes.insights import router as insights_router

app = FastAPI(title="Gastador API", version="1.0.0")

allowed_origin = os.getenv("ALLOWED_ORIGIN", "*")
origins = ["*"] if allowed_origin == "*" else [allowed_origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(categorize_router)
app.include_router(insights_router)


@app.get("/")
def root():
    return {"status": "ok", "service": "Gastador API"}
