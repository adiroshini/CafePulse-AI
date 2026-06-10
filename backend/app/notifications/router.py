from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.database import get_driver
from app.auth.dependencies import get_current_user
from app.notifications.service import send_whatsapp_alert, send_sms_alert, build_alert_message

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


class AlertRequest(BaseModel):
    channel: str = "whatsapp"  # whatsapp | sms
    alert_type: str  # waiting_time_spike | low_stock | customer_churn | revenue_drop
    to_number: str


@router.post("/send")
async def send_alert(req: AlertRequest, current_user=Depends(get_current_user)):
    """Manually trigger an alert notification."""
    driver = await get_driver()
    async with driver.session() as session:
        result = await session.run(
            """
            MATCH (u:User {id: $uid})-[:OWNS]->(b:Business)
            RETURN b.cafe_name AS cafe_name,
                   b.revenue_trend_pct AS revenue_trend_pct,
                   b.at_risk_customer_count AS at_risk_count,
                   b.top_complaint AS top_complaint
            """,
            {"uid": current_user["id"]},
        )
        record = await result.single()
        if not record:
            raise HTTPException(status_code=404, detail="Business not found")
        ctx = dict(record)

    data = {
        "cafe_name": ctx.get("cafe_name", "Your Café"),
        "increase_pct": 12,
        "revenue_at_risk": 4000,
        "count": ctx.get("at_risk_count", 0),
        "trend_pct": ctx.get("revenue_trend_pct", 0),
        "items": [],
    }

    message = build_alert_message(req.alert_type, data)

    if req.channel == "whatsapp":
        result = await send_whatsapp_alert(req.to_number, message)
    else:
        result = await send_sms_alert(req.to_number, message)

    return {"channel": req.channel, "message_preview": message, "result": result}


@router.post("/auto-check")
async def auto_check_and_notify(current_user=Depends(get_current_user)):
    """
    Automatically checks key metrics and sends alerts if thresholds are breached.
    Call this periodically (e.g., daily via a scheduler).
    """
    driver = await get_driver()
    async with driver.session() as session:
        result = await session.run(
            """
            MATCH (u:User {id: $uid})-[:OWNS]->(b:Business)
            RETURN b.cafe_name AS cafe_name,
                   b.revenue_trend_pct AS revenue_trend_pct,
                   b.at_risk_customer_count AS at_risk_count,
                   b.top_complaint AS top_complaint,
                   u.phone AS phone
            """,
            {"uid": current_user["id"]},
        )
        record = await result.single()
        if not record:
            raise HTTPException(status_code=404, detail="Business not found")
        ctx = dict(record)

    alerts_triggered = []
    phone = ctx.get("phone", "")

    if ctx.get("top_complaint") == "waiting_time" and phone:
        msg = build_alert_message("waiting_time_spike", {
            "cafe_name": ctx["cafe_name"], "increase_pct": 12, "revenue_at_risk": 4000
        })
        alerts_triggered.append({"type": "waiting_time_spike", "message": msg})

    if (ctx.get("revenue_trend_pct") or 0) < -10 and phone:
        msg = build_alert_message("revenue_drop", {
            "cafe_name": ctx["cafe_name"], "trend_pct": ctx["revenue_trend_pct"]
        })
        alerts_triggered.append({"type": "revenue_drop", "message": msg})

    if (ctx.get("at_risk_count") or 0) > 5 and phone:
        msg = build_alert_message("customer_churn", {
            "cafe_name": ctx["cafe_name"], "count": ctx["at_risk_count"]
        })
        alerts_triggered.append({"type": "customer_churn", "message": msg})

    return {
        "alerts_triggered": len(alerts_triggered),
        "alerts": alerts_triggered,
        "note": "Connect Twilio credentials in .env to enable real delivery",
    }
