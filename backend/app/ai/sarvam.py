"""
Sarvam AI integration layer.
Handles:
  - Text-to-Speech (voice reports)
  - Speech-to-Text (voice queries)
  - Multilingual chat (English, Hindi, Telugu)
  - Sentiment analysis on reviews
"""
import httpx
from app.config import get_settings

settings = get_settings()

SARVAM_HEADERS = {
    "api-subscription-key": settings.sarvam_api_key,
    "Content-Type": "application/json",
}

LANGUAGE_CODES = {
    "english": "en-IN",
    "hindi": "hi-IN",
    "telugu": "te-IN",
}


async def translate_text(text: str, target_language: str) -> str:
    """Translate text to the target language using Sarvam AI."""
    lang_code = LANGUAGE_CODES.get(target_language.lower(), "en-IN")
    if lang_code == "en-IN":
        return text  # No translation needed

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.sarvam_base_url}/translate",
            headers=SARVAM_HEADERS,
            json={
                "input": text,
                "source_language_code": "en-IN",
                "target_language_code": lang_code,
                "speaker_gender": "Male",
                "mode": "formal",
                "model": "mayura:v1",
                "enable_preprocessing": True,
            },
            timeout=30.0,
        )
        response.raise_for_status()
        data = response.json()
        return data.get("translated_text", text)


async def text_to_speech(text: str, language: str = "english") -> bytes:
    """Convert text to speech using Sarvam AI TTS."""
    lang_code = LANGUAGE_CODES.get(language.lower(), "en-IN")

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.sarvam_base_url}/text-to-speech",
            headers=SARVAM_HEADERS,
            json={
                "inputs": [text],
                "target_language_code": lang_code,
                "speaker": "meera",
                "pitch": 0,
                "pace": 1.0,
                "loudness": 1.5,
                "speech_sample_rate": 8000,
                "enable_preprocessing": True,
                "model": "bulbul:v1",
            },
            timeout=30.0,
        )
        response.raise_for_status()
        data = response.json()
        # Sarvam returns base64 encoded audio
        import base64
        audio_b64 = data.get("audios", [""])[0]
        return base64.b64decode(audio_b64)


async def speech_to_text(audio_bytes: bytes, language: str = "english") -> str:
    """Transcribe audio to text using Sarvam AI STT."""
    import base64
    lang_code = LANGUAGE_CODES.get(language.lower(), "en-IN")

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.sarvam_base_url}/speech-to-text",
            headers={**SARVAM_HEADERS, "Content-Type": "application/json"},
            json={
                "audio": base64.b64encode(audio_bytes).decode(),
                "language_code": lang_code,
                "model": "saarika:v1",
                "with_timestamps": False,
            },
            timeout=30.0,
        )
        response.raise_for_status()
        data = response.json()
        return data.get("transcript", "")


async def analyze_sentiment(text: str) -> dict:
    """
    Fallback rule-based sentiment (replace with Sarvam NLP when available).
    Returns: {"sentiment": "positive"|"negative"|"neutral", "score": float}
    """
    negative_words = ["bad", "worst", "horrible", "rude", "slow", "cold", "dirty", "stale"]
    positive_words = ["great", "amazing", "excellent", "love", "perfect", "fresh", "clean", "friendly"]

    text_lower = text.lower()
    neg_count = sum(1 for w in negative_words if w in text_lower)
    pos_count = sum(1 for w in positive_words if w in text_lower)

    if pos_count > neg_count:
        return {"sentiment": "positive", "score": min(1.0, pos_count * 0.2)}
    elif neg_count > pos_count:
        return {"sentiment": "negative", "score": min(1.0, neg_count * 0.2)}
    return {"sentiment": "neutral", "score": 0.5}


async def answer_business_question(question: str, business_context: dict, language: str = "english") -> str:
    """
    Generate a natural language answer to a business question.
    Uses business context from Neo4j analysis results.
    """
    q_lower = question.lower()

    answer = ""

    if any(kw in q_lower for kw in ["rating", "drop", "low", "why"]):
        complaint = business_context.get("top_complaint", "waiting time")
        rating = business_context.get("avg_rating", "N/A")
        answer = (
            f"Your average rating is {rating} stars. "
            f"The primary reason for rating drops is '{complaint.replace('_', ' ')}'. "
            f"Customers mention this frequently in their reviews. "
            f"I recommend addressing this issue immediately to improve your score."
        )

    elif any(kw in q_lower for kw in ["problem", "issue", "biggest"]):
        complaint = business_context.get("top_complaint", "waiting time")
        answer = (
            f"Your biggest problem right now is '{complaint.replace('_', ' ')}'. "
            f"This is appearing in {business_context.get('complaint_count', 'multiple')} customer reviews. "
            f"Resolving this should be your top priority."
        )

    elif any(kw in q_lower for kw in ["revenue", "improve", "money", "sales"]):
        trend = business_context.get("revenue_trend_pct", 0)
        answer = (
            f"Your revenue trend is {trend:+.1f}% compared to the previous period. "
            "To improve revenue: (1) Run a BOGO promotion on slow days, "
            "(2) Create combo bundles with your best-selling products, "
            "(3) Address waiting time complaints to retain customers."
        )

    elif any(kw in q_lower for kw in ["report", "week", "summary"]):
        health = business_context.get("health_score", 50)
        strength = business_context.get("top_strength", "coffee quality")
        complaint = business_context.get("top_complaint", "waiting time")
        trend = business_context.get("revenue_trend_pct", 0)
        answer = (
            f"Weekly Summary: Your business health score is {health}/100. "
            f"Revenue is {trend:+.1f}% vs last week. "
            f"Top strength: {strength.replace('_', ' ')}. "
            f"Top complaint: {complaint.replace('_', ' ')}. "
            f"Most important action: Address {complaint.replace('_', ' ')} immediately."
        )

    else:
        health = business_context.get("health_score", 50)
        answer = (
            f"Your café health score is {health}/100. "
            f"You can ask me about: ratings, biggest problems, revenue improvement, or weekly reports."
        )

    # Translate if needed
    if language.lower() != "english":
        answer = await translate_text(answer, language)

    return answer
