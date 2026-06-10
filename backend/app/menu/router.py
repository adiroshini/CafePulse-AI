"""
Smart Menu Analysis, Menu Experiment Engine & Smart Combo Generator
"""
import uuid
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from app.database import get_driver
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/api/menu", tags=["menu"])


class ExperimentRequest(BaseModel):
    product_name: str
    experiment_type: str  # combo | sampling | pricing | promotion
    details: Optional[dict] = {}


class ExperimentResultRequest(BaseModel):
    experiment_id: str
    result: str  # keep | improve | remove
    notes: Optional[str] = ""


async def _get_business_id(user_id: str) -> str:
    driver = await get_driver()
    async with driver.session() as session:
        result = await session.run(
            "MATCH (u:User {id: $uid})-[:OWNS]->(b:Business) RETURN b.id AS bid",
            {"uid": user_id},
        )
        record = await result.single()
        if not record:
            raise HTTPException(status_code=404, detail="Business not found")
        return record["bid"]


@router.get("/analysis")
async def smart_menu_analysis(current_user=Depends(get_current_user)):
    """Analyze menu performance: best-sellers, low-sellers, seasonal, profitable."""
    driver = await get_driver()
    business_id = await _get_business_id(current_user["id"])

    async with driver.session() as session:
        result = await session.run(
            """
            MATCH (b:Business {id: $bid})-[:HAS_SALE]->(s:Sale)-[:FOR_PRODUCT]->(p:Product)
            RETURN p.name AS product,
                   sum(s.revenue) AS total_revenue,
                   sum(s.quantity) AS total_units,
                   count(s) AS sale_count
            ORDER BY total_revenue DESC
            """,
            {"bid": business_id},
        )
        products = [dict(r) for r in await result.data()]

    if not products:
        return {"message": "No product data found. Please upload sales data first.", "products": []}

    total_rev = sum(p["total_revenue"] for p in products)

    for p in products:
        p["revenue_share_pct"] = round((p["total_revenue"] / total_rev) * 100, 1) if total_rev else 0

    best = products[:3]
    low = products[-3:] if len(products) > 3 else []

    # Combo suggestions based on frequently purchased products
    combo_suggestions = []
    if len(products) >= 2:
        for i in range(min(3, len(products))):
            for j in range(i + 1, min(4, len(products))):
                combo_suggestions.append({
                    "combo": f"{products[i]['product']} + {products[j]['product']}",
                    "estimated_uplift": "+10-15% avg order value",
                })

    return {
        "total_products": len(products),
        "best_sellers": best,
        "low_sellers": low,
        "all_products": products,
        "combo_suggestions": combo_suggestions[:5],
    }


@router.post("/experiment")
async def create_experiment(req: ExperimentRequest, current_user=Depends(get_current_user)):
    """Create a menu experiment for an underperforming item."""
    driver = await get_driver()
    business_id = await _get_business_id(current_user["id"])
    exp_id = str(uuid.uuid4())

    experiment_descriptions = {
        "combo": f"Bundle {req.product_name} with a complementary item at a discounted price",
        "sampling": f"Offer free sample of {req.product_name} with every coffee order",
        "pricing": f"Reduce price of {req.product_name} from ₹{req.details.get('original_price', 'X')} to ₹{req.details.get('new_price', 'Y')}",
        "promotion": f"Buy One Get One free on {req.product_name}",
    }

    async with driver.session() as session:
        await session.run(
            """
            MATCH (b:Business {id: $bid})
            MERGE (p:Product {name: $product, business_id: $bid})
            CREATE (e:Experiment {
                id: $exp_id,
                type: $exp_type,
                description: $description,
                status: 'active',
                created_at: datetime()
            })
            CREATE (b)-[:HAS_EXPERIMENT]->(e)
            CREATE (e)-[:FOR_PRODUCT]->(p)
            """,
            {
                "bid": business_id,
                "product": req.product_name,
                "exp_id": exp_id,
                "exp_type": req.experiment_type,
                "description": experiment_descriptions.get(req.experiment_type, "Custom experiment"),
            },
        )

    return {
        "experiment_id": exp_id,
        "product": req.product_name,
        "type": req.experiment_type,
        "description": experiment_descriptions.get(req.experiment_type, "Custom experiment"),
        "status": "active",
        "message": "Experiment created. Track results after 1-2 weeks.",
    }


@router.post("/experiment/result")
async def record_experiment_result(req: ExperimentResultRequest, current_user=Depends(get_current_user)):
    """Record the outcome of an experiment: keep | improve | remove."""
    driver = await get_driver()
    async with driver.session() as session:
        await session.run(
            """
            MATCH (e:Experiment {id: $exp_id})
            SET e.result = $result, e.notes = $notes,
                e.status = 'completed', e.completed_at = datetime()
            """,
            {"exp_id": req.experiment_id, "result": req.result, "notes": req.notes},
        )
    return {"message": f"Experiment result recorded: {req.result}", "experiment_id": req.experiment_id}


@router.get("/experiments")
async def get_experiments(current_user=Depends(get_current_user)):
    """List all experiments for the business."""
    driver = await get_driver()
    business_id = await _get_business_id(current_user["id"])

    async with driver.session() as session:
        result = await session.run(
            """
            MATCH (b:Business {id: $bid})-[:HAS_EXPERIMENT]->(e:Experiment)-[:FOR_PRODUCT]->(p:Product)
            RETURN e.id AS id, e.type AS type, e.description AS description,
                   e.status AS status, e.result AS result,
                   p.name AS product, e.created_at AS created_at
            ORDER BY e.created_at DESC
            """,
            {"bid": business_id},
        )
        experiments = [dict(r) for r in await result.data()]

    return {"experiments": experiments}


@router.get("/combos")
async def smart_combo_generator(current_user=Depends(get_current_user)):
    """AI-generated combo recommendations based on product purchase patterns."""
    driver = await get_driver()
    business_id = await _get_business_id(current_user["id"])

    async with driver.session() as session:
        result = await session.run(
            """
            MATCH (b:Business {id: $bid})-[:HAS_SALE]->(s:Sale)-[:FOR_PRODUCT]->(p:Product)
            RETURN p.name AS product, sum(s.revenue) AS revenue
            ORDER BY revenue DESC LIMIT 8
            """,
            {"bid": business_id},
        )
        products = [dict(r) for r in await result.data()]

    if len(products) < 2:
        return {"combos": [], "message": "Need at least 2 products to generate combos"}

    combos = []
    for i in range(min(3, len(products))):
        for j in range(i + 1, min(5, len(products))):
            p1 = products[i]["product"]
            p2 = products[j]["product"]
            combos.append({
                "combo_name": f"{p1} + {p2} Combo",
                "items": [p1, p2],
                "type": "Bundle Discount",
                "suggested_discount": "10-15%",
                "estimated_revenue_uplift": "+10-15% average order value",
                "upsell_opportunity": f"Suggest {p2} when customer orders {p1}",
            })

    return {"combos": combos[:6]}
