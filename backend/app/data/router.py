import uuid
import json
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from pydantic import BaseModel
from app.database import get_driver
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/api/data", tags=["data"])


class SalesRecord(BaseModel):
    date: str
    revenue: float
    orders: int
    product_name: str
    quantity: int


class ReviewRecord(BaseModel):
    source: str  # google, zomato, swiggy, manual
    rating: float
    text: str
    customer_name: Optional[str] = None
    date: str


class InventoryRecord(BaseModel):
    ingredient: str
    stock_level: float
    unit: str
    purchase_cost: float
    reorder_level: float


class FeedbackRecord(BaseModel):
    customer_name: Optional[str] = None
    rating: float
    comment: str
    date: str


class DataUploadRequest(BaseModel):
    sales: Optional[List[SalesRecord]] = []
    reviews: Optional[List[ReviewRecord]] = []
    inventory: Optional[List[InventoryRecord]] = []
    feedback: Optional[List[FeedbackRecord]] = []


def _get_business_id_query():
    return "MATCH (u:User {id: $user_id})-[:OWNS]->(b:Business) RETURN b.id AS business_id"


@router.post("/upload")
async def upload_data(req: DataUploadRequest, current_user=Depends(get_current_user)):
    driver = await get_driver()
    async with driver.session() as session:
        result = await session.run(
            _get_business_id_query(), {"user_id": current_user["id"]}
        )
        record = await result.single()
        if not record:
            raise HTTPException(status_code=404, detail="Business not found. Complete setup first.")
        business_id = record["business_id"]

        # Upload sales data
        for sale in req.sales or []:
            sale_id = str(uuid.uuid4())
            await session.run(
                """
                MATCH (b:Business {id: $business_id})
                MERGE (p:Product {name: $product_name, business_id: $business_id})
                CREATE (s:Sale {
                    id: $sale_id, date: $date, revenue: $revenue,
                    orders: $orders, quantity: $quantity, created_at: datetime()
                })
                CREATE (b)-[:HAS_SALE]->(s)
                CREATE (s)-[:FOR_PRODUCT]->(p)
                """,
                {
                    "business_id": business_id,
                    "sale_id": sale_id,
                    "product_name": sale.product_name,
                    "date": sale.date,
                    "revenue": sale.revenue,
                    "orders": sale.orders,
                    "quantity": sale.quantity,
                },
            )

        # Upload reviews
        for review in req.reviews or []:
            review_id = str(uuid.uuid4())
            customer_id = str(uuid.uuid4())
            await session.run(
                """
                MATCH (b:Business {id: $business_id})
                MERGE (c:Customer {name: $customer_name, business_id: $business_id})
                ON CREATE SET c.id = $customer_id
                CREATE (r:Review {
                    id: $review_id, source: $source, rating: $rating,
                    text: $text, date: $date, created_at: datetime()
                })
                CREATE (b)-[:HAS_REVIEW]->(r)
                CREATE (c)-[:WROTE]->(r)
                """,
                {
                    "business_id": business_id,
                    "customer_name": review.customer_name or "Anonymous",
                    "customer_id": customer_id,
                    "review_id": review_id,
                    "source": review.source,
                    "rating": review.rating,
                    "text": review.text,
                    "date": review.date,
                },
            )

        # Upload inventory
        for item in req.inventory or []:
            inv_id = str(uuid.uuid4())
            await session.run(
                """
                MATCH (b:Business {id: $business_id})
                MERGE (i:Inventory {ingredient: $ingredient, business_id: $business_id})
                ON CREATE SET i.id = $inv_id
                SET i.stock_level = $stock_level, i.unit = $unit,
                    i.purchase_cost = $purchase_cost, i.reorder_level = $reorder_level,
                    i.updated_at = datetime()
                CREATE (b)-[:HAS_INVENTORY]->(i)
                """,
                {
                    "business_id": business_id,
                    "inv_id": inv_id,
                    "ingredient": item.ingredient,
                    "stock_level": item.stock_level,
                    "unit": item.unit,
                    "purchase_cost": item.purchase_cost,
                    "reorder_level": item.reorder_level,
                },
            )

        # Upload feedback
        for fb in req.feedback or []:
            fb_id = str(uuid.uuid4())
            await session.run(
                """
                MATCH (b:Business {id: $business_id})
                MERGE (c:Customer {name: $customer_name, business_id: $business_id})
                ON CREATE SET c.id = $cust_id
                CREATE (f:Feedback {
                    id: $fb_id, rating: $rating, comment: $comment,
                    date: $date, created_at: datetime()
                })
                CREATE (b)-[:HAS_FEEDBACK]->(f)
                CREATE (c)-[:GAVE]->(f)
                """,
                {
                    "business_id": business_id,
                    "customer_name": fb.customer_name or "Anonymous",
                    "cust_id": str(uuid.uuid4()),
                    "fb_id": fb_id,
                    "rating": fb.rating,
                    "comment": fb.comment,
                    "date": fb.date,
                },
            )

    return {
        "message": "Data uploaded successfully",
        "uploaded": {
            "sales": len(req.sales or []),
            "reviews": len(req.reviews or []),
            "inventory": len(req.inventory or []),
            "feedback": len(req.feedback or []),
        },
    }


@router.get("/summary")
async def get_data_summary(current_user=Depends(get_current_user)):
    driver = await get_driver()
    async with driver.session() as session:
        result = await session.run(
            _get_business_id_query(), {"user_id": current_user["id"]}
        )
        record = await result.single()
        if not record:
            raise HTTPException(status_code=404, detail="Business not found")
        business_id = record["business_id"]

        counts_result = await session.run(
            """
            MATCH (b:Business {id: $business_id})
            OPTIONAL MATCH (b)-[:HAS_SALE]->(s:Sale)
            OPTIONAL MATCH (b)-[:HAS_REVIEW]->(r:Review)
            OPTIONAL MATCH (b)-[:HAS_INVENTORY]->(i:Inventory)
            OPTIONAL MATCH (b)-[:HAS_FEEDBACK]->(f:Feedback)
            RETURN count(DISTINCT s) AS sales_count,
                   count(DISTINCT r) AS reviews_count,
                   count(DISTINCT i) AS inventory_count,
                   count(DISTINCT f) AS feedback_count
            """,
            {"business_id": business_id},
        )
        counts = await counts_result.single()
        return {
            "business_id": business_id,
            "data_counts": {
                "sales": counts["sales_count"],
                "reviews": counts["reviews_count"],
                "inventory": counts["inventory_count"],
                "feedback": counts["feedback_count"],
            },
        }
