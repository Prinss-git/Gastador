from fastapi import APIRouter
from pydantic import BaseModel
from google import genai
import os

router = APIRouter()

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

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
        f"Expense: '{req.description}' — ₱{req.amount:.2f}\n"
        "Reply with ONLY the category name, nothing else."
    )

    response = client.models.generate_content(
        model="gemini-1.5-flash",
        contents=prompt,
    )
    raw = response.text.strip()
    category = raw if raw in VALID_CATEGORIES else "Others"
    return CategorizeResponse(category=category)
