import io
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Optional
from app.database import get_driver
from app.auth.dependencies import get_current_user
from app.ai.sarvam import (
    answer_business_question,
    text_to_speech,
    speech_to_text,
    analyze_sentiment,
)

router = APIRouter(prefix="/api/ai", tags=["ai"])


class VoiceQueryRequest(BaseModel):
    question: str
    language: str = "english"  # english | hindi | telugu


class WeeklyReportRequest(BaseModel):
    language: str = "english"


async def _get_business_context(user_id: str) -> dict:
    driver = await get_driver()
    async with driver.session() as session:
        result = await session.run(
            """
            MATCH (u:User {id: $uid})-[:OWNS]->(b:Business)
            RETURN b.health_score AS health_score,
                   b.avg_rating AS avg_rating,
                   b.total_revenue AS total_revenue,
                   b.revenue_trend_pct AS revenue_trend_pct,
                   b.top_complaint AS top_complaint,
                   b.top_strength AS top_strength,
                   b.at_risk_customer_count AS at_risk_customer_count,
                   b.cafe_name AS cafe_name
            """,
            {"uid": user_id},
        )
        record = await result.single()
        if not record:
            raise HTTPException(status_code=404, detail="Business not found or analysis not run yet")
        return dict(record)


@router.post("/ask")
async def ask_voice_assistant(req: VoiceQueryRequest, current_user=Depends(get_current_user)):
    """Ask the AI assistant a natural language question about your business."""
    context = await _get_business_context(current_user["id"])
    answer = await answer_business_question(req.question, context, req.language)
    return {"question": req.question, "answer": answer, "language": req.language}


@router.post("/ask-voice")
async def ask_via_voice(
    language: str = "english",
    audio: UploadFile = File(...),
    current_user=Depends(get_current_user),
):
    """Upload audio, transcribe it, answer in text + audio."""
    audio_bytes = await audio.read()
    question = await speech_to_text(audio_bytes, language)
    if not question:
        raise HTTPException(status_code=400, detail="Could not transcribe audio")

    context = await _get_business_context(current_user["id"])
    answer_text = await answer_business_question(question, context, language)
    audio_response = await text_to_speech(answer_text, language)

    return {
        "transcribed_question": question,
        "answer_text": answer_text,
        "audio_base64": __import__("base64").b64encode(audio_response).decode(),
    }


@router.post("/weekly-report")
async def get_weekly_voice_report(req: WeeklyReportRequest, current_user=Depends(get_current_user)):
    """Generate a 30-second weekly voice summary report."""
    context = await _get_business_context(current_user["id"])
    health = context.get("health_score", 50)
    trend = context.get("revenue_trend_pct", 0)
    strength = (context.get("top_strength") or "coffee quality").replace("_", " ")
    complaint = (context.get("top_complaint") or "waiting time").replace("_", " ")
    at_risk = context.get("at_risk_customer_count", 0)
    cafe = context.get("cafe_name", "your café")

    report_text = (
        f"Hello! Here is your weekly report for {cafe}. "
        f"Your business health score is {health} out of 100. "
        f"Revenue is {trend:+.1f} percent compared to last week. "
        f"Your biggest strength this week is {strength}. "
        f"Your top complaint is {complaint} — please address this urgently. "
        f"You have {at_risk} customers at risk of leaving — consider sending them a loyalty reward. "
        f"Keep up the good work and have a great week!"
    )

    audio_bytes = await text_to_speech(report_text, req.language)

    return {
        "report_text": report_text,
        "audio_base64": __import__("base64").b64encode(audio_bytes).decode(),
        "language": req.language,
    }


@router.post("/sentiment")
async def analyze_review_sentiment(payload: dict, current_user=Depends(get_current_user)):
    """Analyze sentiment of a given text."""
    text = payload.get("text", "")
    if not text:
        raise HTTPException(status_code=400, detail="text field is required")
    result = await analyze_sentiment(text)
    return result
