import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any
import httpx
import os

router = APIRouter()

GROQ_API_KEY = os.environ["GROQ_API_KEY"]
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"


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
        f"{cat}: {amt:.2f}" for cat, amt in sorted(breakdown.items(), key=lambda x: -x[1])
    )
    top5 = sorted(req.expenses, key=lambda x: -x.amount)[:5]
    top5_str = "\n".join(f"- {e.description} ({e.category}): {e.amount:.2f}" for e in top5)

    prompt = (
        f"The user spent {req.total:.2f} in {req.month} against a {req.budget:.2f} budget.\n"
        f"Breakdown: {breakdown_str}.\n"
        f"Top 5 expenses:\n{top5_str}\n"
        f"Previous month total: {req.previousMonth.total:.2f}.\n\n"
        "Give exactly 3 short, practical, friendly money-saving insights. "
        "Be conversational. Each insight: max 2 sentences.\n"
        'Return ONLY a JSON array: [{"title": string, "body": string, "emoji": string}]'
    )

    async with httpx.AsyncClient(timeout=30) as client:
        res = await client.post(
            GROQ_URL,
            headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
            json={
                "model": "llama3-8b-8192",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 512,
                "temperature": 0.7,
            },
        )

    if res.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Groq error: {res.text}")

    raw = res.json()["choices"][0]["message"]["content"].strip()

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
