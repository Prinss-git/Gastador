from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import os

router = APIRouter()

GEMINI_API_KEY = os.environ["GEMINI_API_KEY"]
GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-1.5-flash:generateContent"
)

VALID_CATEGORIES = {"Food", "Transport", "Shopping", "Bills", "Health", "Entertainment", "Others"}


class CategorizeRequest(BaseModel):
    description: str
    amount: float


class CategorizeResponse(BaseModel):
    category: str


@router.post("/categorize", response_model=CategorizeResponse)
async def categorize(req: CategorizeRequest):
    prompt = (
        "Categorize this expense into exactly one of these categories: "
        "Food, Transport, Shopping, Bills, Health, Entertainment, Others.\n"
        "Consider Philippine merchants and context.\n"
        "Merchants to recognize: Jollibee, McDonald's, Chowking, Mang Inasal, "
        "Greenwich, KFC, Grab, Angkas, LRT, MRT, SM, Robinsons, Mercury Drug, "
        "National Bookstore, Globe, Smart, PLDT, Meralco, Maynilad, Lazada, Shopee.\n"
        f"Expense: '{req.description}' — {req.amount:.2f}\n"
        "Reply with ONLY the category name, nothing else."
    )

    async with httpx.AsyncClient(timeout=15) as client:
        res = await client.post(
            GEMINI_URL,
            params={"key": GEMINI_API_KEY},
            json={"contents": [{"parts": [{"text": prompt}]}]},
        )

    if res.status_code != 200:
        raise HTTPException(status_code=502, detail="Gemini API error")

    raw = res.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
    category = raw if raw in VALID_CATEGORIES else "Others"
    return CategorizeResponse(category=category)
