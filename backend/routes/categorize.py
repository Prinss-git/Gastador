from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import os

router = APIRouter()

GROQ_API_KEY = os.environ["GROQ_API_KEY"]
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
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
        "Merchants: Jollibee, McDonald's, Chowking, Mang Inasal, Greenwich, KFC, "
        "Grab, Angkas, LRT, MRT, SM, Robinsons, Mercury Drug, National Bookstore, "
        "Globe, Smart, PLDT, Meralco, Maynilad, Lazada, Shopee.\n"
        f"Expense: '{req.description}' — {req.amount:.2f}\n"
        "Reply with ONLY the category name, nothing else."
    )

    async with httpx.AsyncClient(timeout=15) as client:
        res = await client.post(
            GROQ_URL,
            headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
            json={
                "model": "llama3-8b-8192",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 10,
                "temperature": 0,
            },
        )

    if res.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Groq error: {res.text}")

    raw = res.json()["choices"][0]["message"]["content"].strip()
    category = raw if raw in VALID_CATEGORIES else "Others"
    return CategorizeResponse(category=category)
