import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any
import google.generativeai as genai
import os

router = APIRouter()

genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel("gemini-1.5-flash")


class ExpenseItem(BaseModel):
    description: str
    amount: float
    category: str


class PreviousMonth(BaseModel):
    total: float


class InsightsRequest(BaseModel):
    month: str
    expenses: list[ExpenseItem]
    total: float
    budget: float
    previousMonth: PreviousMonth


class InsightItem(BaseModel):
    title: str
    body: str
    emoji: str


@router.post("/insights", response_model=list[InsightItem])
async def insights(req: InsightsRequest):
    breakdown: dict[str, float] = {}
    for e in req.expenses:
        breakdown[e.category] = breakdown.get(e.category, 0) + e.amount

    breakdown_str = ", ".join(
        f"{cat}: ₱{amt:.2f}" for cat, amt in sorted(breakdown.items(), key=lambda x: -x[1])
    )

    top5 = sorted(req.expenses, key=lambda x: -x.amount)[:5]
    top5_str = "\n".join(f"- {e.description} ({e.category}): ₱{e.amount:.2f}" for e in top5)

    prompt = (
        f"The user spent ₱{req.total:.2f} in {req.month} "
        f"against a ₱{req.budget:.2f} budget.\n"
        f"Breakdown: {breakdown_str}.\n"
        f"Top 5 expenses:\n{top5_str}\n"
        f"Previous month total: ₱{req.previousMonth.total:.2f}.\n\n"
        "Give exactly 3 short, practical, friendly money-saving insights based on "
        "their actual data. Be conversational — like a financial friend, not a robot. "
        "Each insight: max 2 sentences. Reference specific amounts or merchants when possible.\n"
        'Return ONLY a JSON array: [{"title": string, "body": string, "emoji": string}]'
    )

    response = model.generate_content(prompt)
    raw = response.text.strip()

    # Strip markdown code fences if present
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    try:
        data: list[dict[str, Any]] = json.loads(raw)
        return [InsightItem(**item) for item in data]
    except (json.JSONDecodeError, KeyError) as exc:
        raise HTTPException(status_code=502, detail=f"AI returned invalid JSON: {exc}") from exc
