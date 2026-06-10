"""
WhatsApp & SMS Alert Service using Twilio.
Sends proactive notifications when key metrics change.
"""
from app.config import get_settings

settings = get_settings()


def _get_twilio_client():
    try:
        from twilio.rest import Client
        return Client(settings.twilio_account_sid, settings.twilio_auth_token)
    except Exception:
        return None


async def send_sms_alert(to_number: str, message: str) -> dict:
    """Send SMS alert via Twilio."""
    client = _get_twilio_client()
    if not client or not settings.twilio_account_sid:
        return {"status": "skipped", "reason": "Twilio not configured"}

    try:
        msg = client.messages.create(
            body=message,
            from_=settings.twilio_phone_number,
            to=to_number,
        )
        return {"status": "sent", "sid": msg.sid}
    except Exception as e:
        return {"status": "error", "error": str(e)}


async def send_whatsapp_alert(to_number: str, message: str) -> dict:
    """Send WhatsApp alert via Twilio."""
    client = _get_twilio_client()
    if not client or not settings.twilio_account_sid:
        return {"status": "skipped", "reason": "Twilio not configured"}

    try:
        msg = client.messages.create(
            body=message,
            from_=settings.twilio_whatsapp_number,
            to=f"whatsapp:{to_number}",
        )
        return {"status": "sent", "sid": msg.sid}
    except Exception as e:
        return {"status": "error", "error": str(e)}


def build_alert_message(alert_type: str, data: dict) -> str:
    """Build a human-readable alert message."""
    if alert_type == "waiting_time_spike":
        return (
            f"⚠️ CafePulse Alert — {data.get('cafe_name', 'Your Café')}\n"
            f"Waiting Time Complaints Increased {data.get('increase_pct', 0):.0f}%\n"
            f"Revenue At Risk: ₹{data.get('revenue_at_risk', 0):,.0f}\n"
            f"Suggested Action: Add Lunch-Hour Staff\n"
            f"— CafePulse AI"
        )
    elif alert_type == "low_stock":
        items = ", ".join(data.get("items", []))
        return (
            f"⚠️ CafePulse Stock Alert — {data.get('cafe_name', 'Your Café')}\n"
            f"Low Stock Items: {items}\n"
            f"Please reorder to avoid service disruption.\n"
            f"— CafePulse AI"
        )
    elif alert_type == "customer_churn":
        return (
            f"⚠️ CafePulse Customer Alert — {data.get('cafe_name', 'Your Café')}\n"
            f"{data.get('count', 0)} customers are at risk of leaving.\n"
            f"Suggested Action: Send loyalty reward or discount coupon.\n"
            f"— CafePulse AI"
        )
    elif alert_type == "revenue_drop":
        return (
            f"📉 CafePulse Revenue Alert — {data.get('cafe_name', 'Your Café')}\n"
            f"Revenue dropped {abs(data.get('trend_pct', 0)):.1f}% vs last period.\n"
            f"Suggested Action: Run a promotional campaign this week.\n"
            f"— CafePulse AI"
        )
    return f"CafePulse AI Alert for {data.get('cafe_name', 'Your Café')}: {alert_type}"
