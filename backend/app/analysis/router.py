from fastapi import APIRouter, HTTPException, Depends
from app.database import get_driver
from app.auth.dependencies import get_current_user
from app.analysis.service import run_full_analysis

router = APIRouter(prefix="/api/analysis", tags=["analysis"])


async def _get_business_id(user_id: str) -> str:
    driver = await get_driver()
    async with driver.session() as session:
        result = await session.run(
            "MATCH (u:User {id: $uid})-[:OWNS]->(b:Business) RETURN b.id AS bid",
            {"uid": user_id},
        )
        record = await result.single()
        if not record:
            raise HTTPException(status_code=404, detail="Business profile not found")
        return record["bid"]


@router.post("/run")
async def trigger_analysis(current_user=Depends(get_current_user)):
    """Trigger full AI analysis of uploaded business data."""
    business_id = await _get_business_id(current_user["id"])
    result = await run_full_analysis(business_id)
    return {"status": "complete", "analysis": result}


@router.get("/dashboard")
async def get_dashboard(current_user=Depends(get_current_user)):
    """Get the latest analysis results from Neo4j."""
    driver = await get_driver()
    business_id = await _get_business_id(current_user["id"])

    async with driver.session() as session:
        result = await session.run(
            """
            MATCH (b:Business {id: $bid})
            RETURN b.health_score AS health_score,
                   b.avg_rating AS avg_rating,
                   b.total_revenue AS total_revenue,
                   b.revenue_trend_pct AS revenue_trend_pct,
                   b.top_complaint AS top_complaint,
                   b.top_strength AS top_strength,
                   b.at_risk_customer_count AS at_risk_customer_count,
                   b.last_analysis AS last_analysis,
                   b.cafe_name AS cafe_name,
                   b.location AS location
            """,
            {"bid": business_id},
        )
        record = await result.single()
        if not record or record["health_score"] is None:
            raise HTTPException(
                status_code=404,
                detail="No analysis data found. Please run analysis first.",
            )

        data = dict(record)
        health_score = data.get("health_score", 50)
        data["risk_level"] = "High" if health_score < 40 else ("Medium" if health_score < 70 else "Low")
        return data


@router.get("/reviews")
async def get_review_intelligence(current_user=Depends(get_current_user)):
    """Get detailed review breakdown by complaint and strength categories."""
    driver = await get_driver()
    business_id = await _get_business_id(current_user["id"])

    async with driver.session() as session:
        result = await session.run(
            """
            MATCH (b:Business {id: $bid})-[:HAS_REVIEW]->(r:Review)
            RETURN r.source AS source, r.rating AS rating, r.text AS text, r.date AS date
            ORDER BY r.date DESC
            LIMIT 100
            """,
            {"bid": business_id},
        )
        reviews = [dict(r) for r in await result.data()]

    return {"reviews": reviews, "total": len(reviews)}


@router.get("/revenue")
async def get_revenue_analysis(current_user=Depends(get_current_user)):
    """Get revenue and product performance data."""
    driver = await get_driver()
    business_id = await _get_business_id(current_user["id"])

    async with driver.session() as session:
        daily = await session.run(
            """
            MATCH (b:Business {id: $bid})-[:HAS_SALE]->(s:Sale)
            RETURN s.date AS date, sum(s.revenue) AS revenue, sum(s.orders) AS orders
            ORDER BY s.date DESC LIMIT 30
            """,
            {"bid": business_id},
        )
        daily_data = [dict(r) for r in await daily.data()]

        products = await session.run(
            """
            MATCH (b:Business {id: $bid})-[:HAS_SALE]->(s:Sale)-[:FOR_PRODUCT]->(p:Product)
            RETURN p.name AS product, sum(s.revenue) AS revenue,
                   sum(s.quantity) AS units_sold
            ORDER BY revenue DESC
            """,
            {"bid": business_id},
        )
        product_data = [dict(r) for r in await products.data()]

    return {"daily_revenue": daily_data, "product_performance": product_data}


@router.get("/inventory")
async def get_inventory_intelligence(current_user=Depends(get_current_user)):
    """Get inventory status with low-stock alerts."""
    driver = await get_driver()
    business_id = await _get_business_id(current_user["id"])

    async with driver.session() as session:
        result = await session.run(
            """
            MATCH (b:Business {id: $bid})-[:HAS_INVENTORY]->(i:Inventory)
            RETURN i.ingredient AS ingredient, i.stock_level AS stock_level,
                   i.reorder_level AS reorder_level, i.unit AS unit,
                   i.purchase_cost AS purchase_cost,
                   CASE WHEN i.stock_level <= i.reorder_level THEN true ELSE false END AS is_low
            ORDER BY is_low DESC, i.ingredient
            """,
            {"bid": business_id},
        )
        items = [dict(r) for r in await result.data()]

    return {
        "inventory": items,
        "low_stock_count": sum(1 for i in items if i["is_low"]),
    }


@router.get("/customer-exit")
async def get_customer_exit_prediction(current_user=Depends(get_current_user)):
    """Identify at-risk customers using Neo4j relationship analysis."""
    driver = await get_driver()
    business_id = await _get_business_id(current_user["id"])

    async with driver.session() as session:
        result = await session.run(
            """
            MATCH (c:Customer {business_id: $bid})-[:WROTE]->(r:Review)
            WHERE r.rating <= 2
            WITH c, count(r) AS low_ratings, collect(r.text)[..3] AS recent_complaints
            WHERE low_ratings >= 2
            RETURN c.name AS customer, low_ratings, recent_complaints
            ORDER BY low_ratings DESC
            """,
            {"bid": business_id},
        )
        at_risk = [dict(r) for r in await result.data()]

    return {
        "at_risk_customers": at_risk,
        "total_at_risk": len(at_risk),
        "suggested_actions": [
            "Send a personalized coupon (20% discount)",
            "Offer a free coffee on next visit",
            "Send loyalty reward points",
            "Personal apology message via WhatsApp",
        ],
    }


@router.post("/what-if")
async def what_if_simulator(payload: dict, current_user=Depends(get_current_user)):
    """
    Simulate business decisions before spending money.
    Accepted scenarios: hire_employee, reduce_price, run_promotion, add_combo
    """
    scenario = payload.get("scenario")
    params = payload.get("params", {})

    simulations = {
        "hire_employee": {
            "description": "Hire one additional employee during peak hours",
            "cost_increase": f"₹{params.get('salary', 15000)}/month",
            "waiting_time_reduction": "30-40%",
            "rating_improvement": "+0.3 to +0.5 stars",
            "revenue_impact": "+8-12% (reduced churn + more tables served)",
            "profit_impact": "Net positive after 3-4 weeks",
            "recommendation": "Recommended — high ROI",
        },
        "reduce_price": {
            "description": f"Reduce price of {params.get('item', 'item')} by {params.get('discount', 10)}%",
            "cost_increase": f"-{params.get('discount', 10)}% margin per unit",
            "waiting_time_reduction": "Neutral",
            "rating_improvement": "+0.1 stars",
            "revenue_impact": f"+{params.get('volume_increase', 15)}% volume expected",
            "profit_impact": "Depends on elasticity — monitor for 2 weeks",
            "recommendation": "Test for 2 weeks before committing",
        },
        "run_promotion": {
            "description": f"Run {params.get('type', 'BOGO')} promotion",
            "cost_increase": "20-30% discount cost",
            "waiting_time_reduction": "May increase slightly",
            "rating_improvement": "+0.2 stars",
            "revenue_impact": "+15-25% footfall expected",
            "profit_impact": "Break-even or slight positive in week 1",
            "recommendation": "Good for slow weekdays",
        },
        "add_combo": {
            "description": f"Add combo: {params.get('item1', 'Coffee')} + {params.get('item2', 'Brownie')}",
            "cost_increase": "Minimal — uses existing inventory",
            "waiting_time_reduction": "Neutral",
            "rating_improvement": "+0.1 stars",
            "revenue_impact": "+10-15% average order value",
            "profit_impact": "Positive — higher basket size",
            "recommendation": "Highly recommended — zero risk",
        },
    }

    if scenario not in simulations:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown scenario. Choose from: {list(simulations.keys())}",
        )

    return {"scenario": scenario, "simulation": simulations[scenario]}
