"""
Core analysis service — processes uploaded data and derives:
- Business Health Score
- Review Intelligence (complaints / strengths)
- Revenue Performance
- Root Cause Detection via Neo4j relationships
- Inventory Intelligence
- Customer Exit Prediction
"""
from app.database import get_driver

COMPLAINT_KEYWORDS = {
    "waiting_time": ["wait", "slow", "long queue", "late", "delayed", "took forever"],
    "staff_behavior": ["rude", "staff", "service", "attitude", "impolite", "unfriendly"],
    "food_temperature": ["cold", "warm", "temperature", "not hot", "lukewarm"],
    "food_quality": ["bad", "stale", "tasteless", "horrible", "worst", "disgusting"],
    "cleanliness": ["dirty", "unclean", "hygiene", "filth", "messy"],
}

STRENGTH_KEYWORDS = {
    "coffee_quality": ["coffee", "espresso", "latte", "cappuccino", "amazing coffee"],
    "cleanliness": ["clean", "tidy", "hygienic", "neat", "spotless"],
    "ambience": ["ambience", "atmosphere", "cozy", "nice place", "vibe", "decor"],
    "food_quality": ["delicious", "tasty", "fresh", "great food", "yummy"],
    "staff_behavior": ["friendly", "helpful", "great staff", "polite", "courteous"],
}


def _classify_text(text: str, keyword_map: dict) -> list[str]:
    text_lower = text.lower()
    matches = []
    for category, keywords in keyword_map.items():
        if any(kw in text_lower for kw in keywords):
            matches.append(category)
    return matches


async def run_full_analysis(business_id: str) -> dict:
    driver = await get_driver()
    async with driver.session() as session:
        # --- Revenue Analysis ---
        rev_result = await session.run(
            """
            MATCH (b:Business {id: $bid})-[:HAS_SALE]->(s:Sale)
            RETURN s.date AS date, s.revenue AS revenue, s.orders AS orders
            ORDER BY s.date DESC
            """,
            {"bid": business_id},
        )
        sales_records = [dict(r) for r in await rev_result.data()]

        total_revenue = sum(r["revenue"] for r in sales_records)
        total_orders = sum(r["orders"] for r in sales_records)

        # Calculate revenue trend (compare first half vs second half)
        revenue_trend_pct = 0.0
        if len(sales_records) >= 2:
            mid = len(sales_records) // 2
            recent = sum(r["revenue"] for r in sales_records[:mid]) if mid > 0 else 0
            older = sum(r["revenue"] for r in sales_records[mid:]) if mid < len(sales_records) else 1
            if older > 0:
                revenue_trend_pct = ((recent - older) / older) * 100

        # --- Product Performance ---
        prod_result = await session.run(
            """
            MATCH (b:Business {id: $bid})-[:HAS_SALE]->(s:Sale)-[:FOR_PRODUCT]->(p:Product)
            RETURN p.name AS product, sum(s.revenue) AS revenue, sum(s.quantity) AS units_sold
            ORDER BY revenue DESC
            """,
            {"bid": business_id},
        )
        products = [dict(r) for r in await prod_result.data()]

        # --- Review Analysis ---
        review_result = await session.run(
            """
            MATCH (b:Business {id: $bid})-[:HAS_REVIEW]->(r:Review)
            RETURN r.text AS text, r.rating AS rating, r.source AS source
            """,
            {"bid": business_id},
        )
        reviews = [dict(r) for r in await review_result.data()]

        complaint_counts: dict = {}
        strength_counts: dict = {}
        ratings = []

        for review in reviews:
            ratings.append(review["rating"])
            for c in _classify_text(review["text"], COMPLAINT_KEYWORDS):
                complaint_counts[c] = complaint_counts.get(c, 0) + 1
            for s in _classify_text(review["text"], STRENGTH_KEYWORDS):
                strength_counts[s] = strength_counts.get(s, 0) + 1

        avg_rating = sum(ratings) / len(ratings) if ratings else 0.0

        # --- Feedback Analysis ---
        fb_result = await session.run(
            """
            MATCH (b:Business {id: $bid})-[:HAS_FEEDBACK]->(f:Feedback)
            RETURN f.comment AS comment, f.rating AS rating
            """,
            {"bid": business_id},
        )
        feedbacks = [dict(r) for r in await fb_result.data()]
        for fb in feedbacks:
            ratings.append(fb["rating"])
            for c in _classify_text(fb["comment"], COMPLAINT_KEYWORDS):
                complaint_counts[c] = complaint_counts.get(c, 0) + 1

        # --- Inventory Intelligence ---
        inv_result = await session.run(
            """
            MATCH (b:Business {id: $bid})-[:HAS_INVENTORY]->(i:Inventory)
            RETURN i.ingredient AS ingredient, i.stock_level AS stock_level,
                   i.reorder_level AS reorder_level, i.unit AS unit
            """,
            {"bid": business_id},
        )
        inventory = [dict(r) for r in await inv_result.data()]
        low_stock_items = [
            i for i in inventory if i["stock_level"] <= i["reorder_level"]
        ]

        # --- Customer Exit Prediction via Neo4j ---
        churn_result = await session.run(
            """
            MATCH (b:Business {id: $bid})<-[:OWNS]-(:User)
            MATCH (c:Customer {business_id: $bid})-[:WROTE]->(r:Review)
            WHERE r.rating <= 2
            WITH c, count(r) AS low_rating_count
            WHERE low_rating_count >= 2
            RETURN c.name AS customer, low_rating_count
            ORDER BY low_rating_count DESC
            LIMIT 20
            """,
            {"bid": business_id},
        )
        at_risk_customers = [dict(r) for r in await churn_result.data()]

        # --- Root Cause Relationships ---
        # Tag the business graph with complaint counts for root cause
        top_complaint = max(complaint_counts, key=complaint_counts.get) if complaint_counts else None
        top_strength = max(strength_counts, key=strength_counts.get) if strength_counts else None

        # Store analysis results back into Neo4j for future queries
        await session.run(
            """
            MATCH (b:Business {id: $bid})
            SET b.last_analysis = datetime(),
                b.health_score = $health_score,
                b.avg_rating = $avg_rating,
                b.total_revenue = $total_revenue,
                b.revenue_trend_pct = $revenue_trend_pct,
                b.top_complaint = $top_complaint,
                b.top_strength = $top_strength,
                b.at_risk_customer_count = $at_risk_count
            """,
            {
                "bid": business_id,
                "health_score": _compute_health_score(avg_rating, revenue_trend_pct, len(at_risk_customers)),
                "avg_rating": avg_rating,
                "total_revenue": total_revenue,
                "revenue_trend_pct": revenue_trend_pct,
                "top_complaint": top_complaint or "none",
                "top_strength": top_strength or "none",
                "at_risk_count": len(at_risk_customers),
            },
        )

    health_score = _compute_health_score(avg_rating, revenue_trend_pct, len(at_risk_customers))
    risk_level = "High" if health_score < 40 else ("Medium" if health_score < 70 else "Low")

    return {
        "health_score": health_score,
        "risk_level": risk_level,
        "avg_rating": round(avg_rating, 2),
        "total_revenue": total_revenue,
        "total_orders": total_orders,
        "revenue_trend_pct": round(revenue_trend_pct, 2),
        "top_complaint": top_complaint,
        "top_strength": top_strength,
        "complaints": sorted(complaint_counts.items(), key=lambda x: -x[1]),
        "strengths": sorted(strength_counts.items(), key=lambda x: -x[1]),
        "products": products[:10],
        "low_stock_items": low_stock_items,
        "at_risk_customers": at_risk_customers,
        "at_risk_customer_count": len(at_risk_customers),
        "root_cause_chain": _build_root_cause_chain(top_complaint),
        "recommendations": _generate_recommendations(
            top_complaint, products, low_stock_items, revenue_trend_pct, at_risk_customers
        ),
    }


def _compute_health_score(avg_rating: float, revenue_trend: float, at_risk_count: int) -> int:
    score = 50
    # Rating component (max 30 pts): scale 0-5 → 0-30
    score += (avg_rating / 5.0) * 30
    # Revenue trend component (max 15 pts)
    if revenue_trend > 10:
        score += 15
    elif revenue_trend > 0:
        score += 10
    elif revenue_trend > -10:
        score += 5
    else:
        score -= 10
    # Churn penalty
    score -= min(at_risk_count * 2, 20)
    return max(0, min(100, int(score)))


def _build_root_cause_chain(top_complaint: str | None) -> list[str]:
    chains = {
        "waiting_time": [
            "Long Waiting Time",
            "→ Negative Reviews",
            "→ Lower Ratings",
            "→ Reduced Repeat Customers",
            "→ Revenue Loss",
        ],
        "staff_behavior": [
            "Poor Staff Behavior",
            "→ Customer Dissatisfaction",
            "→ Negative Word of Mouth",
            "→ Lower New Customer Acquisition",
            "→ Revenue Stagnation",
        ],
        "food_temperature": [
            "Cold / Incorrect Food Temperature",
            "→ Food Quality Complaints",
            "→ Lower Ratings",
            "→ Customer Churn",
        ],
        "food_quality": [
            "Poor Food Quality",
            "→ Negative Reviews",
            "→ Brand Damage",
            "→ Customer Loss",
        ],
        "cleanliness": [
            "Cleanliness Issues",
            "→ Hygiene Complaints",
            "→ Trust Erosion",
            "→ Customer Churn",
        ],
    }
    return chains.get(top_complaint or "", ["No dominant complaint identified"])


def _generate_recommendations(
    top_complaint: str | None,
    products: list,
    low_stock: list,
    revenue_trend: float,
    at_risk: list,
) -> list[dict]:
    recs = []

    if top_complaint == "waiting_time":
        recs.append({
            "action": "Add one employee during lunch rush hours",
            "expected_revenue_impact": "+8-12%",
            "expected_rating_improvement": "+0.4 stars",
            "expected_complaint_reduction": "-35%",
            "priority": "High",
        })
        recs.append({
            "action": "Pre-prepare ingredients for peak hours",
            "expected_revenue_impact": "+5%",
            "expected_rating_improvement": "+0.2 stars",
            "expected_complaint_reduction": "-20%",
            "priority": "High",
        })

    if top_complaint == "staff_behavior":
        recs.append({
            "action": "Conduct staff customer-service training session",
            "expected_revenue_impact": "+5%",
            "expected_rating_improvement": "+0.5 stars",
            "expected_complaint_reduction": "-40%",
            "priority": "High",
        })

    if revenue_trend < -10:
        recs.append({
            "action": "Launch promotional campaign: Buy One Get One on weekdays",
            "expected_revenue_impact": "+15-20%",
            "expected_rating_improvement": "Neutral",
            "expected_complaint_reduction": "Neutral",
            "priority": "Medium",
        })

    if len(products) >= 2:
        low_prod = products[-1]["product"] if products else "item"
        top_prod = products[0]["product"] if products else "item"
        recs.append({
            "action": f"Create combo bundle: {top_prod} + {low_prod} at discounted price",
            "expected_revenue_impact": "+10%",
            "expected_rating_improvement": "+0.1 stars",
            "expected_complaint_reduction": "Neutral",
            "priority": "Medium",
        })

    if low_stock:
        names = ", ".join(i["ingredient"] for i in low_stock[:3])
        recs.append({
            "action": f"Restock low inventory items: {names}",
            "expected_revenue_impact": "Prevent revenue loss",
            "expected_rating_improvement": "+0.2 stars",
            "expected_complaint_reduction": "-15%",
            "priority": "High",
        })

    if len(at_risk) > 0:
        recs.append({
            "action": f"Send loyalty reward / free coffee coupon to {len(at_risk)} at-risk customers",
            "expected_revenue_impact": "+3-5% retention",
            "expected_rating_improvement": "+0.3 stars",
            "expected_complaint_reduction": "-10%",
            "priority": "Medium",
        })

    return recs
